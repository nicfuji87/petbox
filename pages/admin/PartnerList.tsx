import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../src/lib/supabase';
import AdminBottomNav from '../../components/admin/AdminBottomNav';

interface Partner {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    commission_percent: number;
    active: boolean;
    notes: string | null;
    created_at: string;
    coupons_count?: number;
    total_sales?: number;
}

const PartnerList: React.FC = () => {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        commission_percent: 10,
        notes: '',
        active: true,
    });

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        setLoading(true);

        // Fetch partners with coupon usage stats
        const { data: partnersData } = await supabase
            .from('partners')
            .select('*')
            .order('created_at', { ascending: false });

        if (partnersData) {
            // Get coupon stats for each partner
            const partnersWithStats = await Promise.all(
                partnersData.map(async (partner: any) => {
                    const { count: couponsCount } = await supabase
                        .from('coupons')
                        .select('*', { count: 'exact', head: true })
                        .eq('partner_id', partner.id);

                    const { data: coupons } = await supabase
                        .from('coupons')
                        .select('uses_count')
                        .eq('partner_id', partner.id);

                    const totalSales = coupons?.reduce((sum: number, c: any) => sum + (c.uses_count || 0), 0) || 0;

                    return {
                        ...partner,
                        coupons_count: couponsCount || 0,
                        total_sales: totalSales,
                    };
                })
            );
            setPartners(partnersWithStats);
        }
        setLoading(false);
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) return;

        setSaving(true);

        if (editingPartner) {
            await supabase
                .from('partners')
                .update({
                    name: formData.name,
                    email: formData.email || null,
                    phone: formData.phone || null,
                    commission_percent: formData.commission_percent,
                    notes: formData.notes || null,
                    active: formData.active,
                } as any)
                .eq('id', editingPartner.id);
        } else {
            await supabase.from('partners').insert({
                name: formData.name,
                email: formData.email || null,
                phone: formData.phone || null,
                commission_percent: formData.commission_percent,
                notes: formData.notes || null,
                active: formData.active,
            } as any);
        }

        setSaving(false);
        setShowModal(false);
        resetForm();
        fetchPartners();
    };

    const handleEdit = (partner: Partner) => {
        setEditingPartner(partner);
        setFormData({
            name: partner.name,
            email: partner.email || '',
            phone: partner.phone || '',
            commission_percent: partner.commission_percent,
            notes: partner.notes || '',
            active: partner.active,
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir este parceiro?')) return;
        await supabase.from('partners').delete().eq('id', id);
        fetchPartners();
    };

    const resetForm = () => {
        setEditingPartner(null);
        setFormData({
            name: '',
            email: '',
            phone: '',
            commission_percent: 10,
            notes: '',
            active: true,
        });
    };

    const openNewModal = () => {
        resetForm();
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-32">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-white/10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/admin/settings" className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
                            <span className="material-symbols-outlined text-text-main dark:text-white">arrow_back</span>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-text-main dark:text-white">Parcerias</h1>
                            <p className="text-sm text-text-secondary">{partners.length} parceiro(s)</p>
                        </div>
                    </div>
                    <button
                        onClick={openNewModal}
                        className="px-4 py-2 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Novo
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
                {partners.length === 0 ? (
                    <div className="text-center py-12 text-text-secondary">
                        <span className="material-symbols-outlined text-5xl mb-4">handshake</span>
                        <p>Nenhum parceiro cadastrado</p>
                    </div>
                ) : (
                    partners.map((partner) => (
                        <div
                            key={partner.id}
                            className="bg-surface-light dark:bg-surface-dark rounded-2xl p-4 border border-border-light dark:border-white/10"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-text-main dark:text-white">{partner.name}</h3>
                                        {!partner.active && (
                                            <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                                Inativo
                                            </span>
                                        )}
                                    </div>
                                    {partner.email && (
                                        <p className="text-sm text-text-secondary">{partner.email}</p>
                                    )}
                                    {partner.phone && (
                                        <p className="text-sm text-text-secondary">{partner.phone}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(partner)}
                                        className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                                    >
                                        <span className="material-symbols-outlined">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(partner.id)}
                                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-border-light dark:border-white/10 grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-2xl font-bold text-primary">{partner.commission_percent}%</p>
                                    <p className="text-xs text-text-secondary">Comissão</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-text-main dark:text-white">{partner.coupons_count}</p>
                                    <p className="text-xs text-text-secondary">Cupons</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{partner.total_sales}</p>
                                    <p className="text-xs text-text-secondary">Vendas</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </main>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-border-light dark:border-white/10">
                            <h2 className="text-xl font-bold text-text-main dark:text-white">
                                {editingPartner ? 'Editar Parceiro' : 'Novo Parceiro'}
                            </h2>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">
                                    Nome *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                    placeholder="Nome do parceiro"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                    placeholder="email@exemplo.com"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">
                                    Telefone
                                </label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                    placeholder="(00) 00000-0000"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">
                                    Comissão (%)
                                </label>
                                <input
                                    type="number"
                                    value={formData.commission_percent}
                                    onChange={(e) => setFormData({ ...formData, commission_percent: parseFloat(e.target.value) || 0 })}
                                    className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                    min="0"
                                    max="100"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">
                                    Observações
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full h-20 px-4 py-2 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white resize-none"
                                    placeholder="Notas sobre o parceiro..."
                                />
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    className="w-5 h-5 rounded border-border-light dark:border-white/10 text-primary focus:ring-primary"
                                />
                                <span className="text-text-main dark:text-white">Parceiro ativo</span>
                            </label>
                        </div>

                        <div className="p-6 border-t border-border-light dark:border-white/10 flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-3 border border-border-light dark:border-white/10 text-text-main dark:text-white rounded-xl font-bold"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={saving || !formData.name.trim()}
                                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving && <span className="material-symbols-outlined animate-spin">progress_activity</span>}
                                {editingPartner ? 'Salvar' : 'Cadastrar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AdminBottomNav />
        </div>
    );
};

export default PartnerList;
