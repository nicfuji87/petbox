import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../src/lib/supabase';
import AdminBottomNav from '../../components/admin/AdminBottomNav';
import { formatCPF, formatPhone, unformat } from '../../src/utils/formatters';
import AddPetModal from '../../components/admin/AddPetModal';
import AddSubscriptionModal from '../../components/admin/AddSubscriptionModal';

interface Customer {
    id: string;
    full_name: string;
    email: string;
    cpf: string;
    phone: string;
    status: string;
    is_vip: boolean;
    asaas_id?: string;
}

interface Address {
    id?: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
}

interface Pet {
    id: string;
    name: string;
    type: string;
    breed: string;
    size: string;
}

interface Subscription {
    id: string;
    status: string;
    name?: string;
    plan_type?: string;
    value?: number;
    next_due_date?: string;
    pet_id?: string;
}

const TABS = [
    { key: 'dados', label: 'Dados' },
    { key: 'endereco', label: 'Endereço' },
    { key: 'pets', label: 'Pets' },
    { key: 'assinatura', label: 'Assinatura' },
];

const CustomerDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [address, setAddress] = useState<Address | null>(null);
    const [pets, setPets] = useState<Pet[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [activeTab, setActiveTab] = useState('dados');
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showPetModal, setShowPetModal] = useState(false);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [editingPet, setEditingPet] = useState<Pet | null>(null);
    const [cancellingSubscriptionId, setCancellingSubscriptionId] = useState<string | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        cpf: '',
        phone: ''
    });

    const [addressData, setAddressData] = useState<Address>({
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zip_code: ''
    });

    const handleZipCodeBlur = async () => {
        const cep = addressData.zip_code.replace(/\D/g, '');
        if (cep.length !== 8) return;

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                setMessage({ text: 'CEP não encontrado.', type: 'error' });
                return;
            }

            setAddressData(prev => ({
                ...prev,
                street: data.logradouro,
                neighborhood: data.bairro,
                city: data.localidade,
                state: data.uf
            }));
        } catch (error) {
            console.error('Error fetching CEP:', error);
            setMessage({ text: 'Erro ao buscar CEP.', type: 'error' });
        }
    };

    useEffect(() => {
        fetchCustomerDetails();
    }, [id]);

    const fetchCustomerDetails = async () => {
        try {
            setLoading(true);

            // Fetch client basic info
            const { data: clientData, error: clientError } = await supabase
                .from('clients')
                .select('*')
                .eq('id', id)
                .single();

            if (clientError) throw clientError;
            setCustomer(clientData);
            setFormData({
                full_name: clientData.full_name,
                email: clientData.email,
                cpf: formatCPF(clientData.cpf || ''),
                phone: formatPhone(clientData.phone || '')
            });

            // Fetch Address
            const { data: addrData } = await supabase
                .from('addresses')
                .select('*')
                .eq('client_id', id)
                .single();

            if (addrData) {
                setAddress(addrData);
                setAddressData({
                    street: addrData.street,
                    number: addrData.number,
                    complement: addrData.complement || '',
                    neighborhood: addrData.neighborhood || '',
                    city: addrData.city,
                    state: addrData.state,
                    zip_code: addrData.zip_code
                });
            }

            // Fetch Pets
            const { data: petData } = await supabase
                .from('pets')
                .select('*')
                .eq('client_id', id);
            setPets(petData || []);

            // Fetch Subscriptions (to check if customer can be deleted)
            const { data: subData } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('client_id', id);
            setSubscriptions(subData || []);

        } catch (error) {
            console.error('Error fetching details:', error);
            setMessage({ text: 'Erro ao carregar dados.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateClient = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const cleanData = {
                ...formData,
                cpf: unformat(formData.cpf),
                phone: unformat(formData.phone)
            };

            const { error } = await supabase
                .from('clients')
                .update(cleanData)
                .eq('id', id);

            if (error) throw error;

            // If customer has asaas_id, sync update to Asaas
            if (customer?.asaas_id) {
                await supabase.functions.invoke('manage-clients', {
                    body: {
                        action: 'update',
                        clientData: { ...cleanData, id, asaas_id: customer.asaas_id }
                    }
                });
            }

            setMessage({ text: 'Dados atualizados com sucesso!', type: 'success' });
            fetchCustomerDetails();
        } catch (error: any) {
            setMessage({ text: error.message || 'Erro ao atualizar.', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let error;
            if (address) {
                const { error: updError } = await supabase
                    .from('addresses')
                    .update(addressData)
                    .eq('id', address.id);
                error = updError;
            } else {
                const { error: insError } = await supabase
                    .from('addresses')
                    .insert([{ ...addressData, client_id: id }]);
                error = insError;
            }

            if (error) throw error;

            // Sync address to Asaas if customer has asaas_id
            if (customer?.asaas_id) {
                await supabase.functions.invoke('manage-clients', {
                    body: {
                        action: 'update',
                        clientData: {
                            id,
                            asaas_id: customer.asaas_id,
                            full_name: customer.full_name,
                            email: customer.email,
                            cpf: customer.cpf,
                            phone: customer.phone,
                            address: addressData.street,
                            addressNumber: addressData.number,
                            complement: addressData.complement,
                            province: addressData.neighborhood,
                            postalCode: addressData.zip_code
                        }
                    }
                });
            }

            setMessage({ text: 'Endereço salvo com sucesso!', type: 'success' });
            fetchCustomerDetails();
        } catch (error: any) {
            setMessage({ text: error.message || 'Erro ao salvar endereço.', type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const toggleVip = async () => {
        if (!customer) return;
        try {
            const newStatus = !customer.is_vip;
            const { error } = await supabase
                .from('clients')
                .update({ is_vip: newStatus })
                .eq('id', id);

            if (error) throw error;
            setCustomer({ ...customer, is_vip: newStatus });
        } catch (error) {
            console.error('Error toggling VIP:', error);
        }
    };

    const handleDeleteCustomer = async () => {
        if (!customer) return;
        setDeleting(true);
        try {
            // Call Edge Function to delete from Asaas first (if synced)
            if (customer.asaas_id) {
                const { error: fnError } = await supabase.functions.invoke('manage-clients', {
                    body: {
                        action: 'delete',
                        clientData: { id: customer.id, asaas_id: customer.asaas_id }
                    }
                });
                if (fnError) console.error('Asaas delete error:', fnError);
            }

            // Delete from Supabase (cascade should handle addresses, pets if configured)
            const { error } = await supabase
                .from('clients')
                .delete()
                .eq('id', id);

            if (error) throw error;
            navigate('/admin/customers');
        } catch (error: any) {
            setMessage({ text: error.message || 'Erro ao excluir cliente.', type: 'error' });
            setShowDeleteConfirm(false);
        } finally {
            setDeleting(false);
        }
    };

    const canDelete = subscriptions.filter(s => s.status === 'active').length === 0;

    if (loading) return <div className="flex h-screen items-center justify-center text-primary"><span className="material-symbols-outlined animate-spin text-4xl">progress_activity</span></div>;

    if (!customer) return <div className="p-8 text-center text-red-500">Cliente não encontrado.</div>;

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-28">
            {/* Header */}
            <div className="bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-white/5 sticky top-0 z-20">
                <div className="px-4 py-4 flex items-center justify-between">
                    <button onClick={() => navigate('/admin/customers')} className="p-2 -ml-2 text-text-secondary dark:text-text-dark-secondary hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-bold text-text-main dark:text-white truncate flex-1 text-center">{customer.full_name}</h1>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={!canDelete}
                        className={`p-2 -mr-2 rounded-full transition-colors ${canDelete ? 'text-red-500 hover:bg-red-500/10' : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'}`}
                        title={canDelete ? 'Excluir cliente' : 'Cliente possui assinaturas ativas'}
                    >
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                </div>

                {/* Status Bar */}
                <div className="px-6 pb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`h-16 w-16 rounded-full border-2 ${customer.is_vip ? 'border-primary' : 'border-gray-200 dark:border-white/10'} p-1`}>
                            <img src={`https://ui-avatars.com/api/?name=${customer.full_name}&background=random`} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className={`inline-block w-2.5 h-2.5 rounded-full ${customer.status === 'active' ? 'bg-primary' : 'bg-gray-400'}`}></span>
                                <span className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary capitalize">{customer.status === 'active' ? 'Ativo' : 'Inativo'}</span>
                            </div>
                            <p className="text-xs text-text-secondary/60 dark:text-white/40 mt-1">ID: ...{customer.id.slice(-6)}</p>
                        </div>
                    </div>
                    <button
                        onClick={toggleVip}
                        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${customer.is_vip ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20' : 'bg-surface-light dark:bg-white/5 text-text-secondary dark:text-white/40 border border-transparent'}`}
                    >
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: customer.is_vip ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                        <span className="text-[10px] font-bold">VIP</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-4 overflow-x-auto no-scrollbar gap-6 border-t border-border-light dark:border-white/5">
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-text-secondary dark:text-text-dark-secondary hover:text-text-main dark:hover:text-white'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 max-w-2xl mx-auto">
                {message && (
                    <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                        {message.text}
                    </div>
                )}

                {activeTab === 'dados' && (
                    <form onSubmit={handleUpdateClient} className="space-y-4">
                        <InputGroup label="Nome Completo" name="full_name" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
                        <InputGroup label="Email" name="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup
                                label="CPF"
                                name="cpf"
                                value={formData.cpf}
                                onChange={e => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                            />
                            <InputGroup
                                label="Celular"
                                name="phone"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                            />
                        </div>
                        <SubmitButton loading={submitting} label="Salvar Alterações" />
                    </form>
                )}

                {activeTab === 'endereco' && (
                    <form onSubmit={handleUpdateAddress} className="space-y-4">
                        {/* CEP First for auto-fill UX */}
                        <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-2xl border border-primary/20">
                            <p className="text-xs text-primary font-medium mb-2">Digite o CEP para preencher automaticamente</p>
                            <InputGroup
                                label="CEP"
                                name="zip_code"
                                value={addressData.zip_code}
                                onChange={(e) => setAddressData({ ...addressData, zip_code: e.target.value })}
                                onBlur={handleZipCodeBlur}
                                placeholder="00000-000"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <InputGroup label="Rua / Avenida" name="street" value={addressData.street} onChange={e => setAddressData({ ...addressData, street: e.target.value })} />
                            </div>
                            <InputGroup label="Número" name="number" value={addressData.number} onChange={e => setAddressData({ ...addressData, number: e.target.value })} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Complemento" name="complement" value={addressData.complement} onChange={e => setAddressData({ ...addressData, complement: e.target.value })} />
                            <InputGroup label="Bairro" name="neighborhood" value={addressData.neighborhood} onChange={e => setAddressData({ ...addressData, neighborhood: e.target.value })} />
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-3">
                                <InputGroup label="Cidade" name="city" value={addressData.city} onChange={e => setAddressData({ ...addressData, city: e.target.value })} />
                            </div>
                            <InputGroup label="UF" name="state" value={addressData.state} onChange={e => setAddressData({ ...addressData, state: e.target.value })} />
                        </div>
                        <SubmitButton loading={submitting} label="Salvar Endereço" />
                    </form>
                )}

                {activeTab === 'pets' && (
                    <div className="space-y-3">
                        {pets.map(pet => (
                            <div key={pet.id} className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-border-light dark:border-white/5 flex items-center gap-4">
                                <div className="h-12 w-12 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center text-xl">
                                    {pet.type === 'dog' ? '🐶' : '🐱'}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-text-main dark:text-white">{pet.name}</h3>
                                    <p className="text-xs text-text-secondary dark:text-white/60">{pet.breed || 'SRD'} • {pet.size || 'Médio'}</p>
                                </div>
                                <button
                                    onClick={() => { setEditingPet(pet); setShowPetModal(true); }}
                                    className="text-primary text-sm font-bold"
                                >
                                    Editar
                                </button>
                            </div>
                        ))}
                        {pets.length === 0 && <div className="text-center py-8 text-text-secondary">Nenhum pet cadastrado.</div>}
                        <button
                            onClick={() => { setEditingPet(null); setShowPetModal(true); }}
                            className="w-full py-3 mt-4 border-2 border-dashed border-border-light dark:border-white/10 rounded-xl text-text-secondary font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                            + Adicionar Pet
                        </button>
                    </div>
                )}

                {activeTab === 'assinatura' && (
                    <div className="space-y-3">
                        {subscriptions.length > 0 ? (
                            subscriptions.map(sub => {
                                const pet = pets.find(p => p.id === sub.pet_id);
                                const subscriptionName = sub.name || sub.plan_type || 'Assinatura';
                                return (
                                    <div key={sub.id} className="bg-gradient-to-br from-surface-light to-white dark:from-surface-dark dark:to-black/20 p-5 rounded-2xl border border-border-light dark:border-white/10 shadow-sm">
                                        {/* Header: Name + Status */}
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-text-main dark:text-white">
                                                    {subscriptionName}
                                                </h3>
                                                {pet && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-lg">{pet.type === 'dog' ? '🐶' : '🐱'}</span>
                                                        <span className="text-sm font-medium text-text-secondary dark:text-white/70">
                                                            Para {pet.name}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${sub.status === 'active' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-gray-200/50 dark:bg-white/10 text-gray-500 dark:text-gray-400'}`}>
                                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                    {sub.status === 'active' ? 'check_circle' : 'cancel'}
                                                </span>
                                                {sub.status === 'active' ? 'Ativa' : 'Inativa'}
                                            </div>
                                        </div>

                                        {/* Footer: Value + Date + Cancel */}
                                        <div className="flex items-end justify-between pt-3 border-t border-border-light dark:border-white/5">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wide text-text-secondary dark:text-white/40 mb-0.5">Valor</p>
                                                <p className="text-xl font-bold text-primary">
                                                    R$ {sub.value ? sub.value.toFixed(2).replace('.', ',') : '0,00'}
                                                    <span className="text-xs font-normal text-text-secondary">/mês</span>
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] uppercase tracking-wide text-text-secondary dark:text-white/40 mb-0.5">Próx. Cobrança</p>
                                                <p className="text-sm font-medium text-text-main dark:text-white">
                                                    {sub.next_due_date ? new Date(sub.next_due_date).toLocaleDateString('pt-BR') : '-'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Cancel Button */}
                                        {sub.status === 'active' && (
                                            <div className="mt-4 pt-3 border-t border-border-light dark:border-white/5">
                                                {cancellingSubscriptionId === sub.id ? (
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-sm text-text-secondary">Confirmar cancelamento?</span>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={async () => {
                                                                    await supabase.from('subscriptions').update({ status: 'cancelled' }).eq('id', sub.id);
                                                                    setCancellingSubscriptionId(null);
                                                                    fetchCustomerDetails();
                                                                }}
                                                                className="px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-lg"
                                                            >
                                                                Sim, Cancelar
                                                            </button>
                                                            <button
                                                                onClick={() => setCancellingSubscriptionId(null)}
                                                                className="px-3 py-1.5 bg-gray-200 dark:bg-white/10 text-text-main dark:text-white text-sm font-bold rounded-lg"
                                                            >
                                                                Não
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setCancellingSubscriptionId(sub.id)}
                                                        className="w-full py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center gap-1"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">cancel</span>
                                                        Cancelar Assinatura
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-6 bg-surface-light dark:bg-surface-dark rounded-2xl text-center border border-border-light dark:border-white/5">
                                <span className="material-symbols-outlined text-4xl text-text-secondary/40 mb-2">savings</span>
                                <h3 className="font-bold text-text-main dark:text-white">Nenhuma assinatura ativa</h3>
                                <p className="text-sm text-text-secondary dark:text-white/60 mb-4">Este cliente ainda não assinou nenhum plano.</p>
                                <button
                                    onClick={() => setShowSubscriptionModal(true)}
                                    className="bg-primary text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-primary/20"
                                >
                                    Criar Assinatura
                                </button>
                            </div>
                        )}
                        {subscriptions.length > 0 && (
                            <button
                                onClick={() => setShowSubscriptionModal(true)}
                                className="w-full py-3 mt-2 border-2 border-dashed border-border-light dark:border-white/10 rounded-xl text-text-secondary font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                + Nova Assinatura
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-surface-light dark:bg-background-dark rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-border-light dark:border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-red-500">warning</span>
                            </div>
                            <h3 className="text-lg font-bold text-text-main dark:text-white">Excluir Cliente</h3>
                        </div>
                        <p className="text-text-secondary dark:text-text-dark-secondary mb-6">
                            Tem certeza que deseja excluir <strong>{customer.full_name}</strong>? Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 py-3 bg-gray-100 dark:bg-white/5 text-text-main dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteCustomer}
                                disabled={deleting}
                                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {deleting && <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>}
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pet Modal */}
            <AddPetModal
                isOpen={showPetModal}
                onClose={() => { setShowPetModal(false); setEditingPet(null); }}
                onSuccess={fetchCustomerDetails}
                clientId={id || ''}
                editPet={editingPet}
            />

            {/* Subscription Modal */}
            <AddSubscriptionModal
                isOpen={showSubscriptionModal}
                onClose={() => setShowSubscriptionModal(false)}
                onSuccess={fetchCustomerDetails}
                clientId={id || ''}
                pets={pets}
            />

            <AdminBottomNav />
        </div>
    );
};

// Helper Components
interface InputGroupProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: () => void;
    placeholder?: string;
}

const InputGroup = ({ label, name, type = "text", value, onChange, onBlur, placeholder }: InputGroupProps) => (
    <div>
        <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-1 uppercase tracking-wide">{label}</label>
        <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            className="w-full h-11 px-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-white/10 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none text-text-main dark:text-white font-medium transition-all"
        />
    </div>
);

interface SubmitButtonProps {
    loading: boolean;
    label: string;
}

const SubmitButton = ({ loading, label }: SubmitButtonProps) => (
    <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
    >
        {loading && <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>}
        {label}
    </button>
);

export default CustomerDetails;
