import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../src/lib/supabase';
import AdminBottomNav from '../../components/admin/AdminBottomNav';

interface Product {
    id: string;
    name: string;
    type: 'subscription' | 'onetime';
    price: number;
    billing_cycle: string;
    pet_type: string;
    pet_size: string;
    active: boolean;
}

interface SiteProductConfig {
    product_id: string | null;
    monthly_product_id?: string | null;
    annual_product_id?: string | null;
    display_name: string;
    description: string;
    benefits: string[];
    original_price?: number;
}

interface BoxOfMonth {
    title: string;
    image_url: string | null;
}

interface LandingVideoConfig {
    video_url: string | null;
    username: string;
    description: string;
}

const SiteSettings: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Products from database
    const [products, setProducts] = useState<Product[]>([]);

    // Site config
    const [subscriptionConfig, setSubscriptionConfig] = useState<SiteProductConfig>({
        product_id: null,
        monthly_product_id: null,
        annual_product_id: null,
        display_name: 'Assinatura Box',
        description: 'Todo mês uma surpresa nova!',
        benefits: ['5 a 7 produtos premium', 'Personalizado para seu pet', 'Frete Grátis'],
        original_price: 119.90,
    });

    const [onetimeConfig, setOnetimeConfig] = useState<SiteProductConfig>({
        product_id: null,
        display_name: 'Caixa Avulsa',
        description: 'Para experimentar sem compromisso.',
        benefits: ['Mesmos produtos da assinatura', 'Sem renovação automática'],
    });

    const [boxOfMonth, setBoxOfMonth] = useState<BoxOfMonth>({
        title: 'Box do Mês',
        image_url: null,
    });

    const [landingVideo, setLandingVideo] = useState<LandingVideoConfig>({
        video_url: null,
        username: '@petbox',
        description: 'A reação do Thor recebendo a caixa desse mês é impagável! 🧡 📦 #petbox #felicidade',
    });

    const [newBenefit, setNewBenefit] = useState({ subscription: '', onetime: '' });
    const videoInputRef = useRef<HTMLInputElement>(null);
    const [uploadingVideo, setUploadingVideo] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);

        // Fetch products
        const { data: productsData } = await supabase
            .from('products')
            .select('*')
            .eq('active', true)
            .order('name');

        if (productsData) {
            setProducts(productsData as Product[]);
        }

        // Fetch config
        const { data: configData, error } = await supabase.from('site_config').select('*');

        if (error) {
            setError('Erro ao carregar configurações');
            setLoading(false);
            return;
        }

        configData?.forEach((row: any) => {
            if (row.id === 'subscription_product') {
                setSubscriptionConfig({
                    product_id: row.value.product_id || null,
                    monthly_product_id: row.value.monthly_product_id || row.value.product_id || null,
                    annual_product_id: row.value.annual_product_id || null,
                    display_name: row.value.display_name || row.value.name || 'Assinatura Box',
                    description: row.value.description || '',
                    benefits: row.value.benefits || [],
                    original_price: row.value.original_price || 119.90,
                });
            } else if (row.id === 'onetime_product') {
                setOnetimeConfig({
                    product_id: row.value.product_id || null,
                    display_name: row.value.display_name || row.value.name || 'Caixa Avulsa',
                    description: row.value.description || '',
                    benefits: row.value.benefits || [],
                });
            } else if (row.id === 'box_of_month') {
                setBoxOfMonth(row.value);
            } else if (row.id === 'landing_video') {
                setLandingVideo({
                    video_url: row.value.video_url || null,
                    username: row.value.username || '@petbox',
                    description: row.value.description || '',
                });
            }
        });

        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            await supabase.from('site_config').upsert([
                { id: 'subscription_product', value: subscriptionConfig, updated_at: new Date().toISOString() },
                { id: 'onetime_product', value: onetimeConfig, updated_at: new Date().toISOString() },
                { id: 'box_of_month', value: boxOfMonth, updated_at: new Date().toISOString() },
                { id: 'landing_video', value: landingVideo, updated_at: new Date().toISOString() },
            ] as any);

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        const fileExt = file.name.split('.').pop();
        const fileName = `box-of-month-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('site-assets')
            .upload(fileName, file, { upsert: true });

        if (uploadError) {
            setError('Erro ao fazer upload da imagem');
            setUploading(false);
            return;
        }

        const { data: urlData } = supabase.storage.from('site-assets').getPublicUrl(fileName);

        setBoxOfMonth(prev => ({ ...prev, image_url: urlData.publicUrl }));
        setUploading(false);
    };

    const addBenefit = (type: 'subscription' | 'onetime') => {
        const benefit = newBenefit[type].trim();
        if (!benefit) return;

        if (type === 'subscription') {
            setSubscriptionConfig(prev => ({
                ...prev,
                benefits: [...prev.benefits, benefit],
            }));
        } else {
            setOnetimeConfig(prev => ({
                ...prev,
                benefits: [...prev.benefits, benefit],
            }));
        }
        setNewBenefit(prev => ({ ...prev, [type]: '' }));
    };

    const removeBenefit = (type: 'subscription' | 'onetime', index: number) => {
        if (type === 'subscription') {
            setSubscriptionConfig(prev => ({
                ...prev,
                benefits: prev.benefits.filter((_, i) => i !== index),
            }));
        } else {
            setOnetimeConfig(prev => ({
                ...prev,
                benefits: prev.benefits.filter((_, i) => i !== index),
            }));
        }
    };

    const getSelectedProduct = (productId: string | null) => {
        return products.find(p => p.id === productId);
    };

    const subscriptionMonthlyProducts = products.filter(p => p.type === 'subscription' && p.billing_cycle === 'monthly');
    const subscriptionAnnualProducts = products.filter(p => p.type === 'subscription' && p.billing_cycle === 'yearly');
    const onetimeProducts = products.filter(p => p.type === 'one_off' || p.type === 'onetime');

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
                            <h1 className="text-xl font-bold text-text-main dark:text-white">Atualizar Site</h1>
                            <p className="text-sm text-text-secondary">Vincule produtos e personalize a landing page</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving && <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>}
                        Salvar Alterações
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-600 dark:text-green-400">
                        ✓ Configurações salvas com sucesso!
                    </div>
                )}

                {/* Box do Mês */}
                <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-border-light dark:border-white/10">
                    <h2 className="text-lg font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">redeem</span>
                        Box do Mês
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-2">
                                Título
                            </label>
                            <input
                                type="text"
                                value={boxOfMonth.title}
                                onChange={(e) => setBoxOfMonth({ ...boxOfMonth, title: e.target.value })}
                                className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-2">
                                Imagem
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="w-full h-11 px-4 rounded-xl border-2 border-dashed border-border-light dark:border-white/20 text-text-secondary hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">upload</span>
                                        Fazer Upload
                                    </>
                                )}
                            </button>
                        </div>

                        {boxOfMonth.image_url && (
                            <div className="md:col-span-2">
                                <p className="text-xs text-text-secondary mb-2">Preview:</p>
                                <img
                                    src={boxOfMonth.image_url}
                                    alt="Box do Mês"
                                    className="h-48 w-auto rounded-xl object-cover border border-border-light dark:border-white/10"
                                />
                            </div>
                        )}
                    </div>
                </section>

                {/* Landing Page Video */}
                <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-border-light dark:border-white/10">
                    <h2 className="text-lg font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">videocam</span>
                        Vídeo da Landing Page
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-2">
                                Upload de Vídeo (MP4)
                            </label>
                            <input
                                ref={videoInputRef}
                                type="file"
                                accept="video/mp4"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    if (file.size > 50 * 1024 * 1024) {
                                        setError('O vídeo deve ter no máximo 50MB');
                                        return;
                                    }
                                    setUploadingVideo(true);
                                    setError(null);
                                    try {
                                        const fileName = `landing-video-${Date.now()}.mp4`;
                                        const { error: uploadError } = await supabase.storage
                                            .from('site-assets')
                                            .upload(fileName, file, { contentType: 'video/mp4', upsert: true });
                                        if (uploadError) throw uploadError;
                                        const { data: urlData } = supabase.storage
                                            .from('site-assets')
                                            .getPublicUrl(fileName);
                                        setLandingVideo({ ...landingVideo, video_url: urlData.publicUrl });
                                    } catch (err: any) {
                                        setError(err.message || 'Erro ao enviar vídeo');
                                    } finally {
                                        setUploadingVideo(false);
                                    }
                                }}
                            />
                            <button
                                onClick={() => videoInputRef.current?.click()}
                                disabled={uploadingVideo}
                                className="w-full h-11 px-4 rounded-xl border-2 border-dashed border-border-light dark:border-white/20 text-text-secondary hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                            >
                                {uploadingVideo ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">upload</span>
                                        {landingVideo.video_url ? 'Trocar Vídeo' : 'Fazer Upload'}
                                    </>
                                )}
                            </button>
                            {landingVideo.video_url && (
                                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                    Vídeo configurado
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-2">
                                @Username
                            </label>
                            <input
                                type="text"
                                value={landingVideo.username}
                                onChange={(e) => setLandingVideo({ ...landingVideo, username: e.target.value })}
                                placeholder="@petbox"
                                className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-2">
                                Descrição do Vídeo
                            </label>
                            <textarea
                                value={landingVideo.description}
                                onChange={(e) => setLandingVideo({ ...landingVideo, description: e.target.value })}
                                placeholder="A reação do Thor recebendo a caixa..."
                                rows={2}
                                className="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white resize-none"
                            />
                        </div>

                        {landingVideo.video_url && (
                            <div className="md:col-span-2">
                                <p className="text-xs text-text-secondary mb-2">Preview:</p>
                                <video
                                    src={landingVideo.video_url}
                                    controls
                                    className="h-48 w-auto rounded-xl border border-border-light dark:border-white/10"
                                />
                            </div>
                        )}
                    </div>
                </section>

                {/* Subscription Product */}
                <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-border-light dark:border-white/10">
                    <h2 className="text-lg font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">autorenew</span>
                        Produto: Assinatura
                    </h2>

                    {/* Monthly Product Selector */}
                    <div className="mb-4 p-4 bg-blue-500/5 rounded-xl border border-blue-500/20">
                        <label className="block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">
                            <span className="material-symbols-outlined text-sm align-middle mr-1">calendar_today</span>
                            Produto Mensal
                        </label>
                        <select
                            value={subscriptionConfig.monthly_product_id || ''}
                            onChange={(e) => setSubscriptionConfig({ ...subscriptionConfig, monthly_product_id: e.target.value || null })}
                            className="w-full h-11 px-4 rounded-xl bg-white dark:bg-black/20 border border-blue-500/30 focus:border-blue-500 focus:outline-none text-text-main dark:text-white"
                        >
                            <option value="">Selecione produto mensal...</option>
                            {subscriptionMonthlyProducts.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name} - R$ {Number(product.price).toFixed(2).replace('.', ',')}/mês
                                </option>
                            ))}
                        </select>
                        {subscriptionConfig.monthly_product_id && (
                            <p className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                Preço mensal: R$ {Number(getSelectedProduct(subscriptionConfig.monthly_product_id)?.price || 0).toFixed(2).replace('.', ',')}/mês
                            </p>
                        )}
                    </div>

                    {/* Annual Product Selector */}
                    <div className="mb-4 p-4 bg-purple-500/5 rounded-xl border border-purple-500/20">
                        <label className="block text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-2">
                            <span className="material-symbols-outlined text-sm align-middle mr-1">event</span>
                            Produto Anual
                        </label>
                        <select
                            value={subscriptionConfig.annual_product_id || ''}
                            onChange={(e) => setSubscriptionConfig({ ...subscriptionConfig, annual_product_id: e.target.value || null })}
                            className="w-full h-11 px-4 rounded-xl bg-white dark:bg-black/20 border border-purple-500/30 focus:border-purple-500 focus:outline-none text-text-main dark:text-white"
                        >
                            <option value="">Selecione produto anual...</option>
                            {subscriptionAnnualProducts.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name} - R$ {Number(product.price).toFixed(2).replace('.', ',')}/ano
                                </option>
                            ))}
                        </select>
                        {subscriptionConfig.annual_product_id && (
                            <p className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                Preço anual: R$ {Number(getSelectedProduct(subscriptionConfig.annual_product_id)?.price || 0).toFixed(2).replace('.', ',')}/ano
                            </p>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">Nome na LP</label>
                            <input
                                type="text"
                                value={subscriptionConfig.display_name}
                                onChange={(e) => setSubscriptionConfig({ ...subscriptionConfig, display_name: e.target.value })}
                                className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">Descrição</label>
                            <input
                                type="text"
                                value={subscriptionConfig.description}
                                onChange={(e) => setSubscriptionConfig({ ...subscriptionConfig, description: e.target.value })}
                                className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">Preço Original (riscado)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={subscriptionConfig.original_price || 0}
                                onChange={(e) => setSubscriptionConfig({ ...subscriptionConfig, original_price: parseFloat(e.target.value) || 0 })}
                                className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-2">Benefícios</label>
                        <div className="space-y-2">
                            {subscriptionConfig.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-green-500 text-lg">check</span>
                                    <span className="flex-1 text-text-main dark:text-white">{benefit}</span>
                                    <button onClick={() => removeBenefit('subscription', index)} className="p-1 text-red-500 hover:bg-red-500/10 rounded">
                                        <span className="material-symbols-outlined text-lg">close</span>
                                    </button>
                                </div>
                            ))}
                            <div className="flex gap-2 mt-2">
                                <input
                                    type="text"
                                    value={newBenefit.subscription}
                                    onChange={(e) => setNewBenefit({ ...newBenefit, subscription: e.target.value })}
                                    onKeyPress={(e) => e.key === 'Enter' && addBenefit('subscription')}
                                    placeholder="Adicionar benefício..."
                                    className="flex-1 h-10 px-3 rounded-lg bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white text-sm"
                                />
                                <button onClick={() => addBenefit('subscription')} className="px-3 bg-primary text-white rounded-lg">
                                    <span className="material-symbols-outlined">add</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* One-time Product */}
                <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-border-light dark:border-white/10">
                    <h2 className="text-lg font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">inventory_2</span>
                        Produto: Caixa Avulsa
                    </h2>

                    {/* Product Selector */}
                    <div className="mb-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                        <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2">
                            Produto Vinculado
                        </label>
                        <select
                            value={onetimeConfig.product_id || ''}
                            onChange={(e) => setOnetimeConfig({ ...onetimeConfig, product_id: e.target.value || null })}
                            className="w-full h-11 px-4 rounded-xl bg-white dark:bg-black/20 border border-primary/30 focus:border-primary focus:outline-none text-text-main dark:text-white"
                        >
                            <option value="">Selecione um produto...</option>
                            {onetimeProducts.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name} - R$ {Number(product.price).toFixed(2).replace('.', ',')}
                                </option>
                            ))}
                        </select>
                        {onetimeConfig.product_id && (
                            <p className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                Preço do pagamento: R$ {Number(getSelectedProduct(onetimeConfig.product_id)?.price || 0).toFixed(2).replace('.', ',')}
                            </p>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">Nome na LP</label>
                            <input
                                type="text"
                                value={onetimeConfig.display_name}
                                onChange={(e) => setOnetimeConfig({ ...onetimeConfig, display_name: e.target.value })}
                                className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">Descrição</label>
                            <input
                                type="text"
                                value={onetimeConfig.description}
                                onChange={(e) => setOnetimeConfig({ ...onetimeConfig, description: e.target.value })}
                                className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-2">Benefícios</label>
                        <div className="space-y-2">
                            {onetimeConfig.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-text-secondary text-lg">check</span>
                                    <span className="flex-1 text-text-main dark:text-white">{benefit}</span>
                                    <button onClick={() => removeBenefit('onetime', index)} className="p-1 text-red-500 hover:bg-red-500/10 rounded">
                                        <span className="material-symbols-outlined text-lg">close</span>
                                    </button>
                                </div>
                            ))}
                            <div className="flex gap-2 mt-2">
                                <input
                                    type="text"
                                    value={newBenefit.onetime}
                                    onChange={(e) => setNewBenefit({ ...newBenefit, onetime: e.target.value })}
                                    onKeyPress={(e) => e.key === 'Enter' && addBenefit('onetime')}
                                    placeholder="Adicionar benefício..."
                                    className="flex-1 h-10 px-3 rounded-lg bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white text-sm"
                                />
                                <button onClick={() => addBenefit('onetime')} className="px-3 bg-primary text-white rounded-lg">
                                    <span className="material-symbols-outlined">add</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Warning if no products */}
                {products.length === 0 && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-600 dark:text-amber-400 flex items-start gap-3">
                        <span className="material-symbols-outlined">warning</span>
                        <div>
                            <p className="font-bold">Nenhum produto cadastrado</p>
                            <p className="text-sm">Vá em Ajustes → Produtos para cadastrar produtos antes de vincular ao site.</p>
                        </div>
                    </div>
                )}
            </main>
            <AdminBottomNav />
        </div>
    );
};

export default SiteSettings;
