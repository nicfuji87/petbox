import React, { useState } from 'react';
import { supabase } from '../../src/lib/supabase';
import { formatCPF, formatPhone, unformat } from '../../src/utils/formatters';

interface AddCustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        cpf: '',
        phone: ''
    });
    const [addressData, setAddressData] = useState({
        zip_code: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: ''
    });
    const [errors, setErrors] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddressData({ ...addressData, [e.target.name]: e.target.value });
    };

    const handleZipCodeBlur = async () => {
        const cep = addressData.zip_code.replace(/\D/g, '');
        if (cep.length !== 8) return;

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                setErrors('CEP não encontrado.');
                return;
            }

            setAddressData(prev => ({
                ...prev,
                street: data.logradouro,
                neighborhood: data.bairro,
                city: data.localidade,
                state: data.uf
            }));
            setErrors(null);
        } catch (error) {
            console.error('Error fetching CEP:', error);
            setErrors('Erro ao buscar CEP.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors(null);

        try {
            // 1. Insert client into Supabase
            const cleanData = {
                ...formData,
                cpf: unformat(formData.cpf),
                phone: unformat(formData.phone)
            };

            const { data: insertData, error: insertError } = await supabase
                .from('clients')
                .insert([cleanData] as any)
                .select()
                .single();

            if (insertError) throw insertError;

            // 2. Insert address if CEP was provided
            if (addressData.zip_code) {
                const { error: addrError } = await supabase
                    .from('addresses')
                    .insert([{
                        ...addressData,
                        client_id: insertData.id
                    }] as any);

                if (addrError) console.error('Address insert error:', addrError);
            }

            // 3. Call Edge Function to Sync with Asaas (includes notificationDisabled: true)
            const { error: fnError } = await supabase.functions.invoke('manage-clients', {
                body: {
                    action: 'create',
                    clientData: {
                        ...insertData,
                        address: addressData.street,
                        addressNumber: addressData.number,
                        complement: addressData.complement,
                        province: addressData.neighborhood,
                        postalCode: addressData.zip_code
                    }
                }
            });

            if (fnError) {
                console.error('Edge Function Error', fnError);
            }

            onSuccess();
            onClose();
            // Reset form
            setFormData({ full_name: '', email: '', cpf: '', phone: '' });
            setAddressData({ zip_code: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' });
        } catch (err: any) {
            setErrors(err.message || 'Erro ao criar cliente');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-surface-light dark:bg-background-dark rounded-3xl shadow-2xl overflow-hidden border border-border-light dark:border-white/10 max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-border-light dark:border-white/10 flex justify-between items-center bg-surface-light dark:bg-surface-dark sticky top-0 z-10">
                    <h2 className="text-lg font-bold text-text-main dark:text-white">Novo Cliente</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Personal Info Section */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Dados Pessoais</h3>
                        <div>
                            <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-1">Nome Completo</label>
                            <input
                                name="full_name" value={formData.full_name} onChange={handleChange} required
                                className="w-full h-11 px-3 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-1">Email</label>
                            <input
                                name="email" type="email" value={formData.email} onChange={handleChange} required
                                className="w-full h-11 px-3 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-1">CPF</label>
                                <input
                                    name="cpf"
                                    value={formData.cpf}
                                    onChange={(e) => {
                                        const formatted = formatCPF(e.target.value);
                                        setFormData({ ...formData, cpf: formatted });
                                    }}
                                    required
                                    placeholder="000.000.000-00"
                                    maxLength={14}
                                    className="w-full h-11 px-3 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-1">Celular</label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        const formatted = formatPhone(e.target.value);
                                        setFormData({ ...formData, phone: formatted });
                                    }}
                                    required
                                    placeholder="(00) 00000-0000"
                                    maxLength={15}
                                    className="w-full h-11 px-3 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="space-y-4 pt-2">
                        <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Endereço (Opcional)</h3>

                        {/* CEP First */}
                        <div className="bg-primary/5 dark:bg-primary/10 p-3 rounded-xl border border-primary/20">
                            <label className="block text-xs font-bold text-primary mb-1">CEP (preenche automaticamente)</label>
                            <input
                                name="zip_code"
                                value={addressData.zip_code}
                                onChange={handleAddressChange}
                                onBlur={handleZipCodeBlur}
                                placeholder="00000-000"
                                className="w-full h-11 px-3 rounded-xl bg-white dark:bg-black/20 border border-primary/30 focus:border-primary focus:outline-none text-text-main dark:text-white"
                            />
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                            <div className="col-span-3">
                                <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-1">Rua</label>
                                <input
                                    name="street" value={addressData.street} onChange={handleAddressChange}
                                    className="w-full h-11 px-3 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-1">Nº</label>
                                <input
                                    name="number" value={addressData.number} onChange={handleAddressChange}
                                    className="w-full h-11 px-3 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-1">Complemento</label>
                                <input
                                    name="complement" value={addressData.complement} onChange={handleAddressChange}
                                    placeholder="Apto, Bloco..."
                                    className="w-full h-11 px-3 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-1">Bairro</label>
                                <input
                                    name="neighborhood" value={addressData.neighborhood} onChange={handleAddressChange}
                                    className="w-full h-11 px-3 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                            <div className="col-span-3">
                                <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-1">Cidade</label>
                                <input
                                    name="city" value={addressData.city} onChange={handleAddressChange}
                                    className="w-full h-11 px-3 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-1">UF</label>
                                <input
                                    name="state" value={addressData.state} onChange={handleAddressChange}
                                    maxLength={2}
                                    className="w-full h-11 px-3 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white uppercase"
                                />
                            </div>
                        </div>
                    </div>

                    {errors && <div className="text-red-500 text-xs p-2 bg-red-500/10 rounded-lg">{errors}</div>}

                    <div className="pt-2">
                        <button
                            type="submit" disabled={loading}
                            className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>}
                            {loading ? 'Processando (Asaas)...' : 'Cadastrar Cliente'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCustomerModal;
