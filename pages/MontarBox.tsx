import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ClientRegistrationModal from '../components/ClientRegistrationModal';
import { supabase } from '../src/lib/supabase';

// Types for type safety
type PetSpecies = 'dog' | 'cat';
type PetSize = 'P' | 'M' | 'G';
type PetGender = 'boy' | 'girl';

interface PetFormState {
    species: PetSpecies;
    name: string;
    size: PetSize;
    gender: PetGender;
    allergies: string[];
}

// Constants for allergies options
const ALLERGY_OPTIONS = ['Nenhuma', 'Frango', 'Carne Bovina', 'Glúten', 'Corantes'];

// Image URLs for social proof section
const HAPPY_PETS = [
    {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG-YLW_5VMp6vjloMhIiHc2gbX2uVDPuLoIbPkC0kdI5e3XhKM-T4jnJtonsdY3QIRVBT2QEhkobqTFT6xfs0IR1zcBwNnnPutywRQawc9_vtV-kkaYmGNNwufz18iPDrR52pt5G8H752_cmMwGaVK5-WFcDa4dTkKAxx6iOfkUoKlfS7nasZXH77-cftAzJ6iLEWK2htzQqZm6DnPvbuOOUZXWo2KIpDZyqv57Ofyhy2ZDfk4evqm_DBUEsDRK-a067JRU8kkkxLV',
        alt: 'Golden Retriever smiling with a toy',
        caption: 'Thor amou!'
    },
    {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxmy4ioY0MjO32y7iJL4MmkQgT-kMSH9KIgnFQyaGHFQFk6nV-yhkrVOI_bQBC1VQH9ZUqW_SOUqq8DnIoQNBu9kXbuZdBdlai7AfBhC0WappC_dT93z7ds2V26qvAVzbHz5gJIgq5NqpQNX2nejCIxP_453lFWES7QArITzll_1P4pr4PfqWbEGNgN3m-TtVcHelEgHD03UDArzRfHwzQqAadysGPk1Fj56-9grg85NhkkZYSFXQCkXPh8f-gddmfEwDsDEkOyfYJ',
        alt: 'Cat peeking out of a cardboard box',
        caption: 'Mia na caixa'
    },
    {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1pZvnjm_J-5GbAhkaB1bbd2Zv61uImQDJoxE1UgY-56IRSBYMC05P1gZnRPuFxBYp9_fOCw9Y2QRLnQ1S4L1ro_UxXQjUf7gWsf4SyoEeaosjOyGwf7ts3iiKm6MAA469dC4tTfOVTfCl4xYDhaDEe5NL7LjPlq-iH3w2JLEzLVMO2KgfPyDpA0j1Xdt3wusRokpB0lUfRg3kASGyzyqcnD0GB9S4gCv2xrAPpS921zsdSFpbRw-24duAUUuYprKQ9VHB1bowqTYo',
        alt: 'Small fluffy dog playing with a rope toy',
        caption: 'Pipoca feliz'
    }
];

const MontarBox: React.FC = () => {
    // Form state management
    const [formState, setFormState] = useState<PetFormState>({
        species: 'dog',
        name: '',
        size: 'M',
        gender: 'boy',
        allergies: ['Nenhuma']
    });

    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<{ name: string; value: number; isSubscription: boolean; productId: string | null } | null>(null);
    const navigate = useNavigate();

    // Site config with product references
    const [subscriptionConfig, setSubscriptionConfig] = useState({
        product_id: null as string | null,
        monthly_product_id: null as string | null,
        annual_product_id: null as string | null,
        display_name: 'Assinatura Box',
        description: 'Todo mês uma surpresa nova!',
        benefits: ['5 a 7 produtos premium', 'Personalizado para seu pet', 'Frete Grátis'],
        original_price: 119.90,
    });
    const [onetimeConfig, setOnetimeConfig] = useState({
        product_id: null as string | null,
        display_name: 'Caixa Avulsa',
        description: 'Para experimentar sem compromisso.',
        benefits: ['Mesmos produtos da assinatura', 'Sem renovação automática'],
    });
    const [boxOfMonth, setBoxOfMonth] = useState<{ title: string; image_url: string | null }>({ title: 'Box do Mês', image_url: null });

    // Products fetched from database (monthly and annual subscriptions)
    const [monthlyProduct, setMonthlyProduct] = useState<{ id: string; price: number } | null>(null);
    const [annualProduct, setAnnualProduct] = useState<{ id: string; price: number } | null>(null);
    const [onetimeProduct, setOnetimeProduct] = useState<{ id: string; price: number } | null>(null);

    // Coupon state
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount_type: string; discount_value: number } | null>(null);
    const [couponError, setCouponError] = useState<string | null>(null);
    const [validatingCoupon, setValidatingCoupon] = useState(false);

    // Fetch site config and products
    useEffect(() => {
        const fetchConfig = async () => {
            // Get site config
            const { data: configData } = await supabase.from('site_config').select('*');

            let monthlyProductId: string | null = null;
            let annualProductId: string | null = null;
            let oneProductId: string | null = null;

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
                    monthlyProductId = row.value.monthly_product_id || row.value.product_id || null;
                    annualProductId = row.value.annual_product_id || null;
                } else if (row.id === 'onetime_product') {
                    setOnetimeConfig({
                        product_id: row.value.product_id || null,
                        display_name: row.value.display_name || row.value.name || 'Caixa Avulsa',
                        description: row.value.description || '',
                        benefits: row.value.benefits || [],
                    });
                    oneProductId = row.value.product_id;
                } else if (row.id === 'box_of_month') {
                    setBoxOfMonth(row.value);
                }
            });

            // Fetch actual product prices
            if (monthlyProductId) {
                const { data: prod } = await supabase.from('products').select('id, price').eq('id', monthlyProductId).single();
                if (prod) setMonthlyProduct({ id: (prod as any).id, price: Number((prod as any).price) });
            }
            if (annualProductId) {
                const { data: prod } = await supabase.from('products').select('id, price').eq('id', annualProductId).single();
                if (prod) setAnnualProduct({ id: (prod as any).id, price: Number((prod as any).price) });
            }
            if (oneProductId) {
                const { data: oneProd } = await supabase.from('products').select('id, price').eq('id', oneProductId).single();
                if (oneProd) setOnetimeProduct({ id: (oneProd as any).id, price: Number((oneProd as any).price) });
            }
        };
        fetchConfig();
    }, []);

    // Handler for species selection
    const handleSpeciesChange = (species: PetSpecies) => {
        setFormState(prev => ({ ...prev, species }));
    };

    // Handler for size selection
    const handleSizeChange = (size: PetSize) => {
        setFormState(prev => ({ ...prev, size }));
    };

    // Handler for gender selection
    const handleGenderChange = (gender: PetGender) => {
        setFormState(prev => ({ ...prev, gender }));
    };

    // Handler for allergy toggle
    const handleAllergyToggle = (allergy: string) => {
        setFormState(prev => {
            const hasAllergy = prev.allergies.includes(allergy);

            // Special case: if selecting "Nenhuma", clear all others
            if (allergy === 'Nenhuma') {
                return { ...prev, allergies: hasAllergy ? [] : ['Nenhuma'] };
            }

            // If selecting any other allergy, remove "Nenhuma"
            let newAllergies = prev.allergies.filter(a => a !== 'Nenhuma');

            if (hasAllergy) {
                newAllergies = newAllergies.filter(a => a !== allergy);
            } else {
                newAllergies = [...newAllergies, allergy];
            }

            // If no allergies selected, default to empty array
            return { ...prev, allergies: newAllergies };
        });
    };

    // Get subscription price based on billing period toggle
    const getSubscriptionProduct = () => {
        return billingPeriod === 'annual' ? annualProduct : monthlyProduct;
    };

    const getPrice = () => {
        const product = getSubscriptionProduct();
        const price = product?.price || 89.90;
        return price.toFixed(2).replace('.', ',');
    };
    const getPriceValue = () => getSubscriptionProduct()?.price || 89.90;
    const getOnetimePrice = () => onetimeProduct?.price || 109.90;

    // Calculate discount
    const calculateDiscount = (originalPrice: number) => {
        if (!appliedCoupon) return 0;
        if (appliedCoupon.discount_type === 'percentage') {
            return (originalPrice * appliedCoupon.discount_value) / 100;
        }
        return Math.min(appliedCoupon.discount_value, originalPrice);
    };

    const getFinalPrice = (originalPrice: number) => {
        return originalPrice - calculateDiscount(originalPrice);
    };

    // Validate coupon
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;

        setValidatingCoupon(true);
        setCouponError(null);

        const { data, error } = await supabase
            .from('coupons')
            .select('code, discount_type, discount_value, max_uses, uses_count, valid_until, active')
            .eq('code', couponCode.toUpperCase().trim())
            .single();

        if (error || !data) {
            setCouponError('Cupom não encontrado');
            setAppliedCoupon(null);
        } else {
            const coupon = data as any;

            if (!coupon.active) {
                setCouponError('Cupom inativo');
            } else if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
                setCouponError('Cupom expirado');
            } else if (coupon.max_uses && coupon.uses_count >= coupon.max_uses) {
                setCouponError('Cupom esgotado');
            } else {
                setAppliedCoupon({
                    code: coupon.code,
                    discount_type: coupon.discount_type,
                    discount_value: coupon.discount_value,
                });
                setCouponError(null);
            }
        }

        setValidatingCoupon(false);
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError(null);
    };

    const handleSubscribe = () => {
        if (!formState.name.trim()) {
            alert('Por favor, informe o nome do seu pet');
            return;
        }
        setSelectedProduct({
            name: `Assinatura Pet Box ${billingPeriod === 'monthly' ? 'Mensal' : 'Anual'}`,
            value: getPriceValue(),
            isSubscription: true,
            productId: subscriptionConfig.product_id,
        });
        setShowRegistrationModal(true);
    };

    const handlePurchase = () => {
        if (!formState.name.trim()) {
            alert('Por favor, informe o nome do seu pet');
            return;
        }
        setSelectedProduct({
            name: 'Caixa Avulsa Pet Box',
            value: getOnetimePrice(),
            isSubscription: false,
            productId: onetimeConfig.product_id,
        });
        setShowRegistrationModal(true);
    };

    const handleRegistrationSuccess = (clientData: {
        clientId: string;
        clientName: string;
        clientEmail: string;
        clientCpf: string;
        clientPhone: string;
        asaasCustomerId: string;
        petId: string;
    }) => {
        setShowRegistrationModal(false);

        // Navigate to checkout with full payment data
        navigate('/checkout', {
            state: {
                clientId: clientData.clientId,
                clientName: clientData.clientName,
                clientEmail: clientData.clientEmail,
                clientCpf: clientData.clientCpf,
                clientPhone: clientData.clientPhone,
                asaasCustomerId: clientData.asaasCustomerId,
                petId: clientData.petId,
                productId: selectedProduct?.productId || null,
                productType: selectedProduct?.isSubscription ? 'subscription' : 'one_time',
                productName: selectedProduct?.name || '',
                productValue: selectedProduct?.value || 0,
                billingCycle: billingPeriod === 'annual' ? 'YEARLY' : 'MONTHLY',
                couponId: appliedCoupon?.id,
                discountAmount: appliedCoupon ? (appliedCoupon.discount_type === 'percentage'
                    ? (selectedProduct?.value || 0) * (appliedCoupon.discount_value / 100)
                    : appliedCoupon.discount_value) : 0,
            }
        });
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark font-display antialiased overflow-x-hidden transition-colors duration-200 min-h-screen">
            {/* Top App Bar */}
            <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-border-light dark:border-border-dark">
                <div className="flex items-center p-4 pb-2 justify-between">
                    <Link to="/" className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-text-main-light dark:text-text-main-dark">arrow_back</span>
                    </Link>
                    <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Pet Box</h1>
                    <div className="w-10" />
                </div>
            </header>

            <main className="w-full max-w-md mx-auto pb-24">
                {/* Hero Section */}
                <section className="px-4 py-4">
                    <div
                        className="relative bg-cover bg-center flex flex-col justify-end overflow-hidden rounded-xl h-72 shadow-lg group"
                        style={{
                            backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 60%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuD1kH453inxBts3jrVc1CMARpDNpUF7oDwSuPAePpyUfYqBo-PBK6BAiWFjrynSfYRbi_-4UJuB5TPmU0vEVJ1OhOsXytX3rlx9ro9LrIl9ZujSO_3XU_TSw5aX6kjfI_Qpdq_NfHKzNYEBUcwniuFeNKVkwSrOe2QRdIzVjWr8rle8AmMfDyqjzjdgAfLNewunI6MIgNV3A3pKY400SqyMHF1OVOyC7bQRunFNNDOcdgpwJ9TuyKsk6pBFKfHWA1Cf898nFmDfevLr")`
                        }}
                    >
                        <div className="flex flex-col p-5 relative z-10 transition-transform duration-300 group-hover:translate-y-[-4px]">
                            <span className="inline-block px-3 py-1 mb-2 text-xs font-bold text-white bg-primary rounded-full w-fit shadow-md">
                                Tema do Mês: Aventura Espacial 🚀
                            </span>
                            <p className="text-white tracking-tight text-[28px] font-bold leading-none drop-shadow-sm">
                                Mimos perfeitos para o seu melhor amigo
                            </p>
                        </div>
                    </div>
                </section>

                {/* Customization Section */}
                <section className="mt-2">
                    <div className="px-4 py-2">
                        <h3 className="text-xl font-bold leading-tight tracking-tight text-text-main-light dark:text-text-main-dark">
                            Vamos personalizar seu Pet?
                        </h3>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                            Conte um pouco sobre quem vai receber a box.
                        </p>
                    </div>

                    {/* Pet Species Toggle */}
                    <div className="px-4 py-3">
                        <div className="flex gap-4">
                            {/* Dog Option */}
                            <label className="group relative flex flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-transparent bg-surface-light dark:bg-surface-dark p-4 shadow-sm transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 dark:has-[:checked]:bg-primary/10">
                                <input
                                    type="radio"
                                    name="species"
                                    value="dog"
                                    checked={formState.species === 'dog'}
                                    onChange={() => handleSpeciesChange('dog')}
                                    className="peer sr-only"
                                />
                                <div className={`mb-2 rounded-full p-3 transition-colors ${formState.species === 'dog'
                                    ? 'bg-primary text-white'
                                    : 'bg-primary/10 text-primary'
                                    }`}>
                                    <span className="material-symbols-outlined text-3xl">pets</span>
                                </div>
                                <span className={`font-bold ${formState.species === 'dog'
                                    ? 'text-primary'
                                    : 'text-text-main-light dark:text-text-main-dark'
                                    }`}>
                                    Cachorro
                                </span>
                                <div className={`absolute right-2 top-2 transition-opacity ${formState.species === 'dog' ? 'opacity-100' : 'opacity-0'
                                    }`}>
                                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                                </div>
                            </label>

                            {/* Cat Option */}
                            <label className="group relative flex flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-transparent bg-surface-light dark:bg-surface-dark p-4 shadow-sm transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 dark:has-[:checked]:bg-primary/10">
                                <input
                                    type="radio"
                                    name="species"
                                    value="cat"
                                    checked={formState.species === 'cat'}
                                    onChange={() => handleSpeciesChange('cat')}
                                    className="peer sr-only"
                                />
                                <div className={`mb-2 rounded-full p-3 transition-colors ${formState.species === 'cat'
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                                    }`}>
                                    <span className="material-symbols-outlined text-3xl">cruelty_free</span>
                                </div>
                                <span className={`font-bold ${formState.species === 'cat'
                                    ? 'text-primary'
                                    : 'text-text-main-light dark:text-text-main-dark'
                                    }`}>
                                    Gato
                                </span>
                                <div className={`absolute right-2 top-2 transition-opacity ${formState.species === 'cat' ? 'opacity-100' : 'opacity-0'
                                    }`}>
                                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Pet Details Form */}
                    <div className="px-4 py-2 space-y-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-main-light dark:text-text-main-dark ml-1">
                                Nome do Pet
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formState.name}
                                    onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Ex: Rex, Luna..."
                                    className="w-full rounded-xl border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-3 pl-11 text-base shadow-sm focus:border-primary focus:ring-primary dark:text-white dark:focus:ring-primary/50 transition-shadow"
                                />
                                <span className="material-symbols-outlined absolute left-3 top-3.5 text-text-secondary-light dark:text-text-secondary-dark">
                                    edit
                                </span>
                            </div>
                        </div>

                        {/* Size (Porte) */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-main-light dark:text-text-main-dark ml-1">
                                Porte
                            </label>
                            <div className="flex w-full rounded-xl bg-surface-light dark:bg-surface-dark p-1 shadow-sm border border-border-light dark:border-border-dark">
                                {(['P', 'M', 'G'] as PetSize[]).map((size) => (
                                    <label key={size} className="flex-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="size"
                                            value={size}
                                            checked={formState.size === size}
                                            onChange={() => handleSizeChange(size)}
                                            className="peer sr-only"
                                        />
                                        <div className={`flex h-10 items-center justify-center rounded-lg text-sm font-medium transition-all ${formState.size === size
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-text-secondary-light dark:text-text-secondary-dark'
                                            }`}>
                                            {size === 'P' ? 'Pequeno' : size === 'M' ? 'Médio' : 'Grande'}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Sexo */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-main-light dark:text-text-main-dark ml-1">
                                Sexo
                            </label>
                            <div className="flex gap-3">
                                {/* Macho */}
                                <label className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="boy"
                                        checked={formState.gender === 'boy'}
                                        onChange={() => handleGenderChange('boy')}
                                        className="peer sr-only"
                                    />
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${formState.gender === 'boy'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark'
                                        }`}>
                                        <span className="material-symbols-outlined text-xl">male</span>
                                        <span className="text-sm font-medium">Macho</span>
                                    </div>
                                </label>

                                {/* Fêmea */}
                                <label className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="girl"
                                        checked={formState.gender === 'girl'}
                                        onChange={() => handleGenderChange('girl')}
                                        className="peer sr-only"
                                    />
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${formState.gender === 'girl'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark'
                                        }`}>
                                        <span className="material-symbols-outlined text-xl">female</span>
                                        <span className="text-sm font-medium">Fêmea</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Allergies */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-main-light dark:text-text-main-dark ml-1">
                                Alergias ou Restrições
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {ALLERGY_OPTIONS.map((allergy) => {
                                    const isSelected = formState.allergies.includes(allergy);
                                    return (
                                        <label key={allergy} className="cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleAllergyToggle(allergy)}
                                                className="peer sr-only"
                                            />
                                            <span className={`inline-flex items-center rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${isSelected
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-secondary-light dark:text-text-secondary-dark'
                                                }`}>
                                                {allergy}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Plans Section */}
                <section className="mt-8 mb-4">
                    <div className="px-4 flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold leading-tight tracking-tight text-text-main-light dark:text-text-main-dark">
                            Escolha seu plano
                        </h3>
                        <div className="flex items-center gap-2 bg-surface-light dark:bg-surface-dark rounded-lg p-1 border border-border-light dark:border-border-dark">
                            <button
                                onClick={() => setBillingPeriod('monthly')}
                                className={`text-xs font-bold px-2 py-1 rounded-md transition-all ${billingPeriod === 'monthly'
                                    ? 'bg-white dark:bg-gray-700 shadow-sm text-text-main-light dark:text-text-main-dark'
                                    : 'text-text-secondary-light dark:text-text-secondary-dark'
                                    }`}
                            >
                                Mensal
                            </button>
                            <button
                                onClick={() => setBillingPeriod('annual')}
                                className={`text-xs font-medium px-2 py-1 rounded-md transition-all ${billingPeriod === 'annual'
                                    ? 'bg-white dark:bg-gray-700 shadow-sm text-text-main-light dark:text-text-main-dark'
                                    : 'text-text-secondary-light dark:text-text-secondary-dark'
                                    }`}
                            >
                                Anual
                            </button>
                        </div>
                    </div>

                    {/* Coupon Input */}
                    <div className="px-4 mb-4">
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 border border-border-light dark:border-white/10">
                            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-2">
                                <span className="material-symbols-outlined text-sm align-middle mr-1">confirmation_number</span>
                                Cupom de Desconto
                            </label>
                            {appliedCoupon ? (
                                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
                                        <span className="font-mono font-bold text-green-700 dark:text-green-300">{appliedCoupon.code}</span>
                                        <span className="text-sm text-green-600 dark:text-green-400">
                                            ({appliedCoupon.discount_type === 'percentage' ? `${appliedCoupon.discount_value}% off` : `R$ ${appliedCoupon.discount_value.toFixed(2).replace('.', ',')} off`})
                                        </span>
                                    </div>
                                    <button onClick={removeCoupon} className="text-red-500 hover:text-red-700">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                        placeholder="Digite seu cupom"
                                        className="flex-1 h-10 px-3 rounded-lg bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white font-mono uppercase text-sm"
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={validatingCoupon || !couponCode.trim()}
                                        className="px-4 bg-primary text-white font-bold rounded-lg disabled:opacity-50 flex items-center gap-1"
                                    >
                                        {validatingCoupon ? (
                                            <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                                        ) : (
                                            'Aplicar'
                                        )}
                                    </button>
                                </div>
                            )}
                            {couponError && (
                                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">error</span>
                                    {couponError}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="px-4 space-y-4">
                        {/* Subscription Plan Card (Highlighted) */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[#ff9e4a] p-1 shadow-lg ring-1 ring-primary/20">
                            <div className="absolute right-0 top-0 rounded-bl-xl bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                                Mais Popular
                            </div>
                            <div className="rounded-xl bg-white dark:bg-surface-dark p-5 h-full flex flex-col">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h4 className="text-lg font-bold text-text-main-light dark:text-text-main-dark">{subscriptionConfig.display_name}</h4>
                                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{subscriptionConfig.description}</p>
                                    </div>
                                    <div className="bg-primary/10 rounded-lg p-2">
                                        <span className="material-symbols-outlined text-primary">redeem</span>
                                    </div>
                                </div>
                                <div className="my-4 space-y-2">
                                    {subscriptionConfig.benefits.map((benefit, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-text-main-light dark:text-text-main-dark">
                                            <span className="material-symbols-outlined text-green-500 text-lg">check</span>
                                            <span>{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-auto pt-4 border-t border-dashed border-border-light dark:border-border-dark flex items-end justify-between">
                                    <div>
                                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark line-through">R$ {subscriptionConfig.original_price.toFixed(2).replace('.', ',')}</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-bold text-primary">R$ {getPrice()}</span>
                                            <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">/mês</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleSubscribe}
                                        className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors text-sm"
                                    >
                                        Assinar
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Single Box Plan Card */}
                        <div className="relative overflow-hidden rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-5 shadow-sm">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h4 className="text-lg font-bold text-text-main-light dark:text-text-main-dark">{onetimeConfig.display_name}</h4>
                                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{onetimeConfig.description}</p>
                                </div>
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                                    <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">inventory_2</span>
                                </div>
                            </div>
                            <div className="my-4 space-y-2 opacity-80">
                                {onetimeConfig.benefits.map((benefit, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm text-text-main-light dark:text-text-main-dark">
                                        <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark text-lg">check</span>
                                        <span>{benefit}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-auto pt-4 border-t border-border-light dark:border-border-dark flex items-end justify-between">
                                <div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-bold text-text-main-light dark:text-text-main-dark">R$ {getOnetimePrice().toFixed(2).replace('.', ',')}</span>
                                        <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">/uma vez</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handlePurchase}
                                    className="bg-surface-light dark:bg-surface-dark border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                                >
                                    Comprar
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Social Proof / Testimonial Lite */}
                <section className="px-4 py-6">
                    <h4 className="text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark mb-3 uppercase tracking-wider">
                        Pets Felizes
                    </h4>
                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar snap-x">
                        {HAPPY_PETS.map((pet, index) => (
                            <div key={index} className="snap-center shrink-0 w-32 flex flex-col gap-2">
                                <div className="h-32 w-32 rounded-xl overflow-hidden bg-gray-200">
                                    <img
                                        src={pet.src}
                                        alt={pet.alt}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <p className="text-xs text-center font-medium dark:text-text-main-dark">{pet.caption}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Client Registration Modal */}
            {selectedProduct && (
                <ClientRegistrationModal
                    isOpen={showRegistrationModal}
                    onClose={() => setShowRegistrationModal(false)}
                    onSuccess={handleRegistrationSuccess}
                    petData={{
                        name: formState.name,
                        type: formState.species,
                        size: formState.size,
                        gender: formState.gender,
                        allergies: formState.allergies,
                    }}
                    productInfo={selectedProduct}
                />
            )}
        </div>
    );
};

export default MontarBox;
