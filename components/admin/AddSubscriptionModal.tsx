import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';

interface Pet {
    id: string;
    name: string;
    type: string;
}

interface Product {
    id: string;
    name: string;
    type: string;
    description: string;
    price: number;
    billing_cycle: string;
    pet_size: string;
    active: boolean;
}

interface AddSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    clientId: string;
    pets: Pet[];
}

const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({ isOpen, onClose, onSuccess, clientId, pets }) => {
    const [loading, setLoading] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedPetId, setSelectedPetId] = useState<string>('');
    const [selectedProductId, setSelectedProductId] = useState<string>('');
    const [customValue, setCustomValue] = useState<number>(0);

    useEffect(() => {
        if (isOpen) {
            fetchProducts();
        }
    }, [isOpen]);

    useEffect(() => {
        if (pets.length > 0 && !selectedPetId) {
            setSelectedPetId(pets[0].id);
        }
    }, [pets, selectedPetId]);

    useEffect(() => {
        const product = products.find(p => p.id === selectedProductId);
        if (product) {
            setCustomValue(product.price);
        }
    }, [selectedProductId, products]);

    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            const { data, error: fetchError } = await supabase
                .from('products')
                .select('*')
                .eq('active', true)
                .eq('type', 'subscription')
                .order('price', { ascending: true });

            if (fetchError) throw fetchError;
            setProducts(data || []);
            if (data && data.length > 0) {
                setSelectedProductId(data[0].id);
                setCustomValue(data[0].price);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoadingProducts(false);
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!selectedPetId) {
                throw new Error('Selecione um pet para a assinatura');
            }
            if (!selectedProductId) {
                throw new Error('Selecione um produto');
            }

            const selectedProduct = products.find(p => p.id === selectedProductId);
            const nextDueDate = new Date();
            nextDueDate.setMonth(nextDueDate.getMonth() + 1);

            const payload = {
                client_id: clientId,
                pet_id: selectedPetId,
                plan_type: selectedProduct?.name || 'Assinatura',
                value: customValue,
                status: 'active',
                next_due_date: nextDueDate.toISOString().split('T')[0],
                cycle_count: 0,
            };

            const { error: insertError } = await supabase
                .from('subscriptions')
                .insert([payload] as any);

            if (insertError) throw insertError;

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Erro ao criar assinatura');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-surface-light dark:bg-background-dark rounded-3xl shadow-2xl overflow-hidden border border-border-light dark:border-white/10 max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-border-light dark:border-white/10 flex justify-between items-center bg-surface-light dark:bg-surface-dark sticky top-0 z-10">
                    <h2 className="text-lg font-bold text-text-main dark:text-white">Nova Assinatura</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Pet Selector */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-2 uppercase tracking-wide">
                            Pet
                        </label>
                        {pets.length === 0 ? (
                            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-yellow-700 dark:text-yellow-400 text-sm">
                                <span className="material-symbols-outlined text-lg align-middle mr-2">warning</span>
                                Cadastre um pet primeiro para criar uma assinatura.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                {pets.map((pet) => (
                                    <button
                                        key={pet.id}
                                        type="button"
                                        onClick={() => setSelectedPetId(pet.id)}
                                        className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${selectedPetId === pet.id
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-border-light dark:border-white/10 text-text-secondary hover:border-primary/50'
                                            }`}
                                    >
                                        <span className="text-xl">{pet.type === 'dog' ? '🐶' : '🐱'}</span>
                                        <span className="text-sm font-bold truncate">{pet.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Selector */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-2 uppercase tracking-wide">
                            Produto
                        </label>
                        {loadingProducts ? (
                            <div className="flex items-center justify-center py-4">
                                <span className="material-symbols-outlined animate-spin text-2xl text-primary">progress_activity</span>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-yellow-700 dark:text-yellow-400 text-sm">
                                <span className="material-symbols-outlined text-lg align-middle mr-2">warning</span>
                                Nenhum produto cadastrado. <a href="#/admin/products" className="underline font-bold">Criar produto</a>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {products.map((product) => (
                                    <button
                                        key={product.id}
                                        type="button"
                                        onClick={() => setSelectedProductId(product.id)}
                                        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${selectedProductId === product.id
                                                ? 'border-primary bg-primary/10'
                                                : 'border-border-light dark:border-white/10 hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="text-left">
                                            <span className={`font-bold block ${selectedProductId === product.id ? 'text-primary' : 'text-text-main dark:text-white'}`}>
                                                {product.name}
                                            </span>
                                            <span className="text-xs text-text-secondary dark:text-white/60">
                                                {product.description || `${product.billing_cycle === 'monthly' ? 'Mensal' : 'Anual'}`}
                                            </span>
                                        </div>
                                        <span className={`text-lg font-bold ${selectedProductId === product.id ? 'text-primary' : 'text-text-main dark:text-white'}`}>
                                            R$ {product.price.toFixed(2).replace('.', ',')}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Custom Value */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-1 uppercase tracking-wide">
                            Valor (R$)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={customValue}
                            onChange={(e) => setCustomValue(parseFloat(e.target.value) || 0)}
                            className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-xs p-2 bg-red-500/10 rounded-lg">{error}</div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || pets.length === 0 || products.length === 0}
                        className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>}
                        Criar Assinatura
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddSubscriptionModal;

