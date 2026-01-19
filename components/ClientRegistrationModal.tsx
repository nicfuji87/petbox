import React, { useState } from 'react';
import { supabase } from '../src/lib/supabase';

interface ClientRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (clientData: {
        clientId: string;
        clientName: string;
        clientEmail: string;
        clientCpf: string;
        clientPhone: string;
        asaasCustomerId: string;
        petId: string;
    }) => void;
    petData: {
        name: string;
        type: string;
        size: string;
        gender: string;
        allergies: string[];
    };
    productInfo: {
        name: string;
        value: number;
        isSubscription: boolean;
        productId: string | null;
    };
}

const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 10) {
        return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
};

const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 8);
    return numbers.replace(/(\d{5})(\d)/, '$1-$2');
};

const ClientRegistrationModal: React.FC<ClientRegistrationModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    petData,
    productInfo,
}) => {
    const [step, setStep] = useState<'check' | 'register' | 'address'>('check');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [existingClient, setExistingClient] = useState<any>(null);

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        cpf: '',
    });

    const [addressData, setAddressData] = useState({
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zip_code: '',
    });

    const handleCheckClient = async () => {
        if (!formData.phone && !formData.cpf) {
            setError('Informe telefone ou CPF');
            return;
        }

        setLoading(true);
        setError(null);

        const phoneClean = formData.phone.replace(/\D/g, '');
        const cpfClean = formData.cpf.replace(/\D/g, '');

        let query = supabase.from('clients').select('*');

        if (phoneClean) {
            query = query.eq('phone', phoneClean);
        } else if (cpfClean) {
            query = query.eq('cpf', cpfClean);
        }

        const { data, error: fetchError } = await query.maybeSingle();

        if (fetchError) {
            setError('Erro ao verificar cliente');
            setLoading(false);
            return;
        }

        if (data) {
            const client = data as any;
            setExistingClient(client);
            setFormData({
                full_name: client.full_name || '',
                email: client.email || '',
                phone: formatPhone(client.phone || ''),
                cpf: formatCPF(client.cpf || ''),
            });
        }

        setStep('register');
        setLoading(false);
    };

    const handleFetchAddress = async (cep: string) => {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length !== 8) return;

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();

            if (!data.erro) {
                setAddressData(prev => ({
                    ...prev,
                    street: data.logradouro || '',
                    neighborhood: data.bairro || '',
                    city: data.localidade || '',
                    state: data.uf || '',
                }));
            }
        } catch {
            // Ignore fetch errors
        }
    };

    const handleSubmitClient = async () => {
        if (!formData.full_name || !formData.email || !formData.phone) {
            setError('Preencha todos os campos obrigatórios');
            return;
        }
        setStep('address');
    };

    const handleFinalSubmit = async () => {
        if (!addressData.street || !addressData.number || !addressData.city || !addressData.state || !addressData.zip_code) {
            setError('Preencha todos os campos de endereço');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let clientId = existingClient?.id;
            let asaasCustomerId = existingClient?.asaas_id;

            // Create or update client
            if (!clientId) {
                const { data: newClient, error: clientError } = await supabase
                    .from('clients')
                    .insert([{
                        full_name: formData.full_name,
                        email: formData.email,
                        phone: formData.phone.replace(/\D/g, ''),
                        cpf: formData.cpf.replace(/\D/g, '') || null,
                    }] as any)
                    .select()
                    .single();

                if (clientError || !newClient) throw clientError || new Error('Failed to create client');
                clientId = (newClient as any).id;
            }

            // Create/update customer in Asaas
            if (!asaasCustomerId) {
                const { data: asaasResult, error: asaasError } = await supabase.functions.invoke('manage-clients', {
                    body: {
                        action: 'create',
                        clientData: {
                            id: clientId,
                            full_name: formData.full_name,
                            email: formData.email,
                            phone: formData.phone,
                            cpf: formData.cpf,
                        }
                    }
                });

                if (asaasError) console.error('Asaas error:', asaasError);
                asaasCustomerId = asaasResult?.asaasId;
            }

            // Create address
            await supabase.from('addresses').insert([{
                client_id: clientId,
                street: addressData.street,
                number: addressData.number,
                complement: addressData.complement || null,
                neighborhood: addressData.neighborhood,
                city: addressData.city,
                state: addressData.state,
                zip_code: addressData.zip_code.replace(/\D/g, ''),
                is_default: true,
            }] as any);

            // Create pet
            const { data: newPet, error: petError } = await supabase
                .from('pets')
                .insert([{
                    client_id: clientId,
                    name: petData.name,
                    type: petData.type === 'dog' ? 'dog' : 'cat',
                    breed: '',
                    size: petData.size === 'P' ? 'small' : petData.size === 'G' ? 'large' : 'medium',
                    gender: petData.gender === 'boy' ? 'male' : 'female',
                    allergies: petData.allergies.filter(a => a !== 'Nenhuma'),
                }] as any)
                .select()
                .single();

            if (petError || !newPet) throw petError || new Error('Failed to create pet');

            onSuccess({
                clientId,
                clientName: formData.full_name,
                clientEmail: formData.email,
                clientCpf: formData.cpf,
                clientPhone: formData.phone,
                asaasCustomerId: asaasCustomerId || '',
                petId: (newPet as any).id,
            });
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar dados');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-surface-light dark:bg-background-dark rounded-3xl shadow-2xl overflow-hidden border border-border-light dark:border-white/10 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="px-6 py-4 border-b border-border-light dark:border-white/10 flex justify-between items-center bg-surface-light dark:bg-surface-dark sticky top-0 z-10">
                    <div>
                        <h2 className="text-lg font-bold text-text-main dark:text-white">
                            {step === 'check' ? 'Identificação' : step === 'register' ? 'Seus Dados' : 'Endereço'}
                        </h2>
                        <p className="text-xs text-text-secondary">{productInfo.name} - R$ {productInfo.value.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Step: Check */}
                    {step === 'check' && (
                        <>
                            <p className="text-sm text-text-secondary">Informe seu telefone ou CPF para verificarmos se você já tem cadastro.</p>

                            <div>
                                <label className="block text-xs font-bold text-text-secondary mb-1 uppercase tracking-wide">Telefone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                                    placeholder="(11) 99999-9999"
                                    className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-border-light dark:bg-white/10" />
                                <span className="text-xs text-text-secondary">ou</span>
                                <div className="flex-1 h-px bg-border-light dark:bg-white/10" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-secondary mb-1 uppercase tracking-wide">CPF</label>
                                <input
                                    type="text"
                                    value={formData.cpf}
                                    onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                                    placeholder="000.000.000-00"
                                    className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                />
                            </div>
                        </>
                    )}

                    {/* Step: Register */}
                    {step === 'register' && (
                        <>
                            {existingClient && (
                                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-sm text-green-700 dark:text-green-400">
                                    ✓ Encontramos seu cadastro! Confirme seus dados.
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-text-secondary mb-1 uppercase tracking-wide">Nome Completo *</label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    placeholder="Seu nome completo"
                                    className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-secondary mb-1 uppercase tracking-wide">Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="seu@email.com"
                                    className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-secondary mb-1 uppercase tracking-wide">Telefone *</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                                    placeholder="(11) 99999-9999"
                                    className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-secondary mb-1 uppercase tracking-wide">CPF</label>
                                <input
                                    type="text"
                                    value={formData.cpf}
                                    onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                                    placeholder="000.000.000-00"
                                    className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                />
                            </div>
                        </>
                    )}

                    {/* Step: Address */}
                    {step === 'address' && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary mb-1 uppercase tracking-wide">CEP *</label>
                                <input
                                    type="text"
                                    value={addressData.zip_code}
                                    onChange={(e) => {
                                        const formatted = formatCEP(e.target.value);
                                        setAddressData({ ...addressData, zip_code: formatted });
                                        handleFetchAddress(formatted);
                                    }}
                                    placeholder="00000-000"
                                    className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-secondary mb-1 uppercase tracking-wide">Rua *</label>
                                <input
                                    type="text"
                                    value={addressData.street}
                                    onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                                    placeholder="Nome da rua"
                                    className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-text-secondary mb-1 uppercase tracking-wide">Número *</label>
                                    <input
                                        type="text"
                                        value={addressData.number}
                                        onChange={(e) => setAddressData({ ...addressData, number: e.target.value })}
                                        placeholder="123"
                                        className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-text-secondary mb-1 uppercase tracking-wide">Complemento</label>
                                    <input
                                        type="text"
                                        value={addressData.complement}
                                        onChange={(e) => setAddressData({ ...addressData, complement: e.target.value })}
                                        placeholder="Apto, Bloco..."
                                        className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-secondary mb-1 uppercase tracking-wide">Bairro</label>
                                <input
                                    type="text"
                                    value={addressData.neighborhood}
                                    onChange={(e) => setAddressData({ ...addressData, neighborhood: e.target.value })}
                                    placeholder="Bairro"
                                    className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-text-secondary mb-1 uppercase tracking-wide">Cidade *</label>
                                    <input
                                        type="text"
                                        value={addressData.city}
                                        onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                                        placeholder="Cidade"
                                        className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-text-secondary mb-1 uppercase tracking-wide">UF *</label>
                                    <input
                                        type="text"
                                        value={addressData.state}
                                        onChange={(e) => setAddressData({ ...addressData, state: e.target.value.toUpperCase().slice(0, 2) })}
                                        placeholder="SP"
                                        maxLength={2}
                                        className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white text-center"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {error && (
                        <div className="text-red-500 text-xs p-2 bg-red-500/10 rounded-lg">{error}</div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-3">
                        {step !== 'check' && (
                            <button
                                type="button"
                                onClick={() => setStep(step === 'address' ? 'register' : 'check')}
                                className="flex-1 py-3 border-2 border-border-light dark:border-white/10 text-text-main dark:text-white font-bold rounded-xl"
                            >
                                Voltar
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={step === 'check' ? handleCheckClient : step === 'register' ? handleSubmitClient : handleFinalSubmit}
                            disabled={loading}
                            className="flex-1 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>}
                            {step === 'check' ? 'Continuar' : step === 'register' ? 'Próximo' : 'Finalizar Cadastro'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientRegistrationModal;
