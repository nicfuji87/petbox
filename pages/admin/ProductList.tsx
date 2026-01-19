import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';
import AdminBottomNav from '../../components/admin/AdminBottomNav';
import AddProductModal from '../../components/admin/AddProductModal';

interface Product {
    id: string;
    name: string;
    type: string;
    description: string;
    price: number;
    billing_cycle: string;
    pet_size: string;
    active: boolean;
    created_at: string;
}

const FILTERS = ['Todos', 'Assinaturas', 'Avulsos', 'Ativos', 'Inativos'];

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleProductActive = async (product: Product) => {
        try {
            const { error } = await supabase
                .from('products')
                .update({ active: !product.active })
                .eq('id', product.id);

            if (error) throw error;
            fetchProducts();
        } catch (error) {
            console.error('Error toggling product:', error);
        }
    };

    const filteredProducts = products.filter((product) => {
        if (activeFilter === 'Todos') return true;
        if (activeFilter === 'Assinaturas') return product.type === 'subscription';
        if (activeFilter === 'Avulsos') return product.type === 'one_off';
        if (activeFilter === 'Ativos') return product.active;
        if (activeFilter === 'Inativos') return !product.active;
        return true;
    });

    const formatPrice = (price: number) => `R$ ${price.toFixed(2).replace('.', ',')}`;

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-28">
            {/* Header */}
            <div className="bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-white/5 sticky top-0 z-20">
                <div className="px-4 py-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-text-main dark:text-white">Produtos</h1>
                        <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                            {products.length} produto{products.length !== 1 ? 's' : ''} cadastrado{products.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button
                        onClick={() => { setEditingProduct(null); setShowModal(true); }}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        Novo
                    </button>
                </div>

                {/* Filters */}
                <div className="px-4 pb-4 flex gap-2 overflow-x-auto no-scrollbar">
                    {FILTERS.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeFilter === filter
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-surface-light dark:bg-white/5 text-text-secondary dark:text-text-dark-secondary hover:bg-primary/10'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <span className="material-symbols-outlined text-6xl text-text-secondary/30 mb-4">inventory_2</span>
                        <h3 className="text-lg font-bold text-text-main dark:text-white">Nenhum produto encontrado</h3>
                        <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-4">
                            Crie seu primeiro produto para começar
                        </p>
                        <button
                            onClick={() => { setEditingProduct(null); setShowModal(true); }}
                            className="bg-primary text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-primary/20"
                        >
                            Criar Produto
                        </button>
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-border-light dark:border-white/5"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${product.type === 'subscription'
                                            ? 'bg-primary/10 text-primary'
                                            : 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                                        }`}>
                                        <span className="material-symbols-outlined">
                                            {product.type === 'subscription' ? 'autorenew' : 'shopping_bag'}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-text-main dark:text-white">{product.name}</h3>
                                        <p className="text-xs text-text-secondary dark:text-white/60">
                                            {product.type === 'subscription' ? 'Assinatura' : 'Avulso'}
                                            {product.billing_cycle && ` • ${product.billing_cycle === 'monthly' ? 'Mensal' : 'Anual'}`}
                                            {product.pet_size !== 'all' && ` • ${product.pet_size === 'small' ? 'P' : product.pet_size === 'medium' ? 'M' : 'G'}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-primary text-lg">{formatPrice(product.price)}</p>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${product.active
                                            ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                                            : 'bg-gray-100 dark:bg-white/10 text-gray-500'
                                        }`}>
                                        {product.active ? 'Ativo' : 'Inativo'}
                                    </span>
                                </div>
                            </div>

                            {product.description && (
                                <p className="text-sm text-text-secondary dark:text-white/60 mt-2">{product.description}</p>
                            )}

                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-light dark:border-white/5">
                                <button
                                    onClick={() => { setEditingProduct(product); setShowModal(true); }}
                                    className="flex-1 py-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => toggleProductActive(product)}
                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${product.active
                                            ? 'text-red-500 hover:bg-red-500/10'
                                            : 'text-green-600 hover:bg-green-500/10'
                                        }`}
                                >
                                    {product.active ? 'Desativar' : 'Ativar'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            <AddProductModal
                isOpen={showModal}
                onClose={() => { setShowModal(false); setEditingProduct(null); }}
                onSuccess={fetchProducts}
                editProduct={editingProduct}
            />

            <AdminBottomNav />
        </div>
    );
};

export default ProductList;
