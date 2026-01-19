import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';

interface Product {
    id?: string;
    name: string;
    type: string;
    description: string;
    price: number;
    billing_cycle: string;
    pet_size: string;
    pet_type: string;
    active: boolean;
}

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editProduct?: Product | null;
}

const PRODUCT_TYPES = [
    { value: 'subscription', label: 'Assinatura', icon: 'autorenew' },
    { value: 'one_off', label: 'Avulso', icon: 'shopping_bag' },
];

const BILLING_CYCLES = [
    { value: 'monthly', label: 'Mensal' },
    { value: 'yearly', label: 'Anual' },
];

const PET_SIZES = [
    { value: 'all', label: 'Todos os Portes' },
    { value: 'small', label: 'Pequeno' },
    { value: 'medium', label: 'Médio' },
    { value: 'large', label: 'Grande' },
];

const PET_TYPES = [
    { value: 'all', label: 'Todos', icon: '🐾' },
    { value: 'dog', label: 'Cães', icon: '🐶' },
    { value: 'cat', label: 'Gatos', icon: '🐱' },
];

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSuccess, editProduct }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<Product>({
        name: '',
        type: 'subscription',
        description: '',
        price: 0,
        billing_cycle: 'monthly',
        pet_size: 'all',
        pet_type: 'all',
        active: true,
    });

    useEffect(() => {
        if (editProduct) {
            setFormData(editProduct);
        } else {
            setFormData({
                name: '',
                type: 'subscription',
                description: '',
                price: 0,
                billing_cycle: 'monthly',
                pet_size: 'all',
                pet_type: 'all',
                active: true,
            });
        }
    }, [editProduct, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = {
                name: formData.name,
                type: formData.type,
                description: formData.description || null,
                price: formData.price,
                billing_cycle: formData.type === 'subscription' ? formData.billing_cycle : null,
                pet_size: formData.pet_size,
                pet_type: formData.pet_type,
                active: formData.active,
            };

            if (editProduct?.id) {
                const { error: updateError } = await supabase
                    .from('products')
                    .update(payload)
                    .eq('id', editProduct.id);
                if (updateError) throw updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('products')
                    .insert([payload] as any);
                if (insertError) throw insertError;
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar produto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-surface-light dark:bg-background-dark rounded-3xl shadow-2xl overflow-hidden border border-border-light dark:border-white/10 max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-border-light dark:border-white/10 flex justify-between items-center bg-surface-light dark:bg-surface-dark sticky top-0 z-10">
                    <h2 className="text-lg font-bold text-text-main dark:text-white">
                        {editProduct ? 'Editar Produto' : 'Novo Produto'}
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Product Name */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-1 uppercase tracking-wide">
                            Nome do Produto
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            placeholder="Ex: PetBox Premium, Box Avulso..."
                            className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                        />
                    </div>

                    {/* Product Type */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-2 uppercase tracking-wide">
                            Tipo
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {PRODUCT_TYPES.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: type.value })}
                                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${formData.type === type.value
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border-light dark:border-white/10 text-text-secondary hover:border-primary/50'
                                        }`}
                                >
                                    <span className="material-symbols-outlined">{type.icon}</span>
                                    <span className="font-bold">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-1 uppercase tracking-wide">
                            Descrição
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Snacks + Brinquedos + Acessórios..."
                            rows={2}
                            className="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white resize-none"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-1 uppercase tracking-wide">
                            Preço (R$)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                            required
                            className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                        />
                    </div>

                    {/* Billing Cycle (only for subscriptions) */}
                    {formData.type === 'subscription' && (
                        <div>
                            <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-2 uppercase tracking-wide">
                                Ciclo de Cobrança
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {BILLING_CYCLES.map((cycle) => (
                                    <button
                                        key={cycle.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, billing_cycle: cycle.value })}
                                        className={`p-3 rounded-xl border-2 transition-all text-center ${formData.billing_cycle === cycle.value
                                            ? 'border-primary bg-primary/10 text-primary font-bold'
                                            : 'border-border-light dark:border-white/10 text-text-secondary hover:border-primary/50'
                                            }`}
                                    >
                                        {cycle.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pet Size */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-2 uppercase tracking-wide">
                            Porte do Pet
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {PET_SIZES.map((size) => (
                                <button
                                    key={size.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, pet_size: size.value })}
                                    className={`p-3 rounded-xl border-2 transition-all text-center ${formData.pet_size === size.value
                                        ? 'border-primary bg-primary/10 text-primary font-bold'
                                        : 'border-border-light dark:border-white/10 text-text-secondary hover:border-primary/50'
                                        }`}
                                >
                                    {size.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Pet Type (Dog/Cat) */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-2 uppercase tracking-wide">
                            Tipo de Pet
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {PET_TYPES.map((petType) => (
                                <button
                                    key={petType.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, pet_type: petType.value })}
                                    className={`p-3 rounded-xl border-2 transition-all text-center flex flex-col items-center gap-1 ${formData.pet_type === petType.value
                                        ? 'border-primary bg-primary/10 text-primary font-bold'
                                        : 'border-border-light dark:border-white/10 text-text-secondary hover:border-primary/50'
                                        }`}
                                >
                                    <span className="text-xl">{petType.icon}</span>
                                    <span className="text-sm">{petType.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center justify-between p-4 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-white/10">
                        <div>
                            <span className="font-bold text-text-main dark:text-white">Produto Ativo</span>
                            <p className="text-xs text-text-secondary">Produtos inativos não aparecem para seleção</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, active: !formData.active })}
                            className={`w-12 h-7 rounded-full transition-colors ${formData.active ? 'bg-primary' : 'bg-gray-300 dark:bg-white/20'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${formData.active ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    {error && (
                        <div className="text-red-500 text-xs p-2 bg-red-500/10 rounded-lg">{error}</div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>}
                        {editProduct ? 'Salvar Alterações' : 'Criar Produto'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;
