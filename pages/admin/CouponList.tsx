import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../src/lib/supabase';
import AdminBottomNav from '../../components/admin/AdminBottomNav';

interface Partner {
    id: string;
    name: string;
}

interface Coupon {
    id: string;
    code: string;
    partner_id: string | null;
    partner?: Partner;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    max_uses: number | null;
    uses_count: number;
    valid_until: string | null;
    active: boolean;
    created_at: string;
}

const CouponList: React.FC = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        code: '',
        partner_id: '',
        discount_type: 'percentage' as 'percentage' | 'fixed',
        discount_value: 10,
        max_uses: '',
        valid_until: '',
        active: true,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);

        const [{ data: couponsData }, { data: partnersData }] = await Promise.all([
            supabase.from('coupons').select('*, partner:partners(id, name)').order('created_at', { ascending: false }),
            supabase.from('partners').select('id, name').eq('active', true).order('name'),
        ]);

        if (couponsData) setCoupons(couponsData as any);
        if (partnersData) setPartners(partnersData as Partner[]);

        setLoading(false);
    };

    const handleSubmit = async () => {
        if (!formData.code.trim()) return;

        setSaving(true);

        const couponData = {
            code: formData.code.toUpperCase().trim(),
            partner_id: formData.partner_id || null,
            discount_type: formData.discount_type,
            discount_value: formData.discount_value,
            max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
            valid_until: formData.valid_until || null,
            active: formData.active,
        };

        if (editingCoupon) {
            await supabase.from('coupons').update(couponData as any).eq('id', editingCoupon.id);
        } else {
            await supabase.from('coupons').insert(couponData as any);
        }

        setSaving(false);
        setShowModal(false);
        resetForm();
        fetchData();
    };

    const handleEdit = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            partner_id: coupon.partner_id || '',
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value,
            max_uses: coupon.max_uses?.toString() || '',
            valid_until: coupon.valid_until || '',
            active: coupon.active,
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir este cupom?')) return;
        await supabase.from('coupons').delete().eq('id', id);
        fetchData();
    };

    const resetForm = () => {
        setEditingCoupon(null);
        setFormData({
            code: '',
            partner_id: '',
            discount_type: 'percentage',
            discount_value: 10,
            max_uses: '',
            valid_until: '',
            active: true,
        });
    };

    const openNewModal = () => {
        resetForm();
        setShowModal(true);
    };

    const formatDiscount = (coupon: Coupon) => {
        if (coupon.discount_type === 'percentage') {
            return `${coupon.discount_value}%`;
        }
        return `R$ ${coupon.discount_value.toFixed(2).replace('.', ',')}`;
    };

    const isExpired = (coupon: Coupon) => {
        if (!coupon.valid_until) return false;
        return new Date(coupon.valid_until) < new Date();
    };

    const isMaxedOut = (coupon: Coupon) => {
        if (!coupon.max_uses) return false;
        return coupon.uses_count >= coupon.max_uses;
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
                            <h1 className="text-xl font-bold text-text-main dark:text-white">Cupons</h1>
                            <p className="text-sm text-text-secondary">{coupons.length} cupom(ns)</p>
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
                {coupons.length === 0 ? (
                    <div className="text-center py-12 text-text-secondary">
                        <span className="material-symbols-outlined text-5xl mb-4">confirmation_number</span>
                        <p>Nenhum cupom cadastrado</p>
                    </div>
                ) : (
                    coupons.map((coupon) => (
                        <div
                            key={coupon.id}
                            className={`bg-surface-light dark:bg-surface-dark rounded-2xl p-4 border ${!coupon.active || isExpired(coupon) || isMaxedOut(coupon)
                                ? 'border-gray-300 dark:border-gray-700 opacity-60'
                                : 'border-border-light dark:border-white/10'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="px-3 py-1 bg-primary/10 text-primary font-mono font-bold rounded-lg text-lg">
                                            {coupon.code}
                                        </span>
                                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-bold rounded-full">
                                            {formatDiscount(coupon)}
                                        </span>
                                        {!coupon.active && (
                                            <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                                Inativo
                                            </span>
                                        )}
                                        {isExpired(coupon) && (
                                            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full">
                                                Expirado
                                            </span>
                                        )}
                                        {isMaxedOut(coupon) && (
                                            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs rounded-full">
                                                Esgotado
                                            </span>
                                        )}
                                    </div>
                                    {(coupon as any).partner && (
                                        <p className="text-sm text-text-secondary mt-1">
                                            <span className="material-symbols-outlined text-sm align-middle mr-1">handshake</span>
                                            {(coupon as any).partner.name}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(coupon)}
                                        className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                                    >
                                        <span className="material-symbols-outlined">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(coupon.id)}
                                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-border-light dark:border-white/10 flex items-center gap-6 text-sm text-text-secondary">
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">shopping_cart</span>
                                    <span>
                                        {coupon.uses_count}
                                        {coupon.max_uses ? ` / ${coupon.max_uses}` : ''} uso(s)
                                    </span>
                                </div>
                                {coupon.valid_until && (
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-lg">calendar_today</span>
                                        <span>
                                            Até {new Date(coupon.valid_until).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                )}
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
                                {editingCoupon ? 'Editar Cupom' : 'Novo Cupom'}
                            </h2>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">
                                    Código *
                                </label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white font-mono uppercase"
                                    placeholder="DESCONTO10"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">
                                    Parceiro (opcional)
                                </label>
                                <select
                                    value={formData.partner_id}
                                    onChange={(e) => setFormData({ ...formData, partner_id: e.target.value })}
                                    className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                >
                                    <option value="">Nenhum parceiro</option>
                                    {partners.map((partner) => (
                                        <option key={partner.id} value={partner.id}>
                                            {partner.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">
                                        Tipo de Desconto
                                    </label>
                                    <select
                                        value={formData.discount_type}
                                        onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as any })}
                                        className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                    >
                                        <option value="percentage">Porcentagem (%)</option>
                                        <option value="fixed">Valor Fixo (R$)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">
                                        Valor
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.discount_value}
                                        onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })}
                                        className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">
                                        Máx. de Usos
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.max_uses}
                                        onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                                        className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                        placeholder="Ilimitado"
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">
                                        Válido Até
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.valid_until}
                                        onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                                        className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                    />
                                </div>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    className="w-5 h-5 rounded border-border-light dark:border-white/10 text-primary focus:ring-primary"
                                />
                                <span className="text-text-main dark:text-white">Cupom ativo</span>
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
                                disabled={saving || !formData.code.trim()}
                                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving && <span className="material-symbols-outlined animate-spin">progress_activity</span>}
                                {editingCoupon ? 'Salvar' : 'Cadastrar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AdminBottomNav />
        </div>
    );
};

export default CouponList;
