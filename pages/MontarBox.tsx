import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
    const [cartCount] = useState(1);

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

    const getPrice = () => billingPeriod === 'monthly' ? '89,90' : '69,90';

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark font-display antialiased overflow-x-hidden transition-colors duration-200 min-h-screen">
            {/* Top App Bar */}
            <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-border-light dark:border-border-dark">
                <div className="flex items-center p-4 pb-2 justify-between">
                    <Link to="/" className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-text-main-light dark:text-text-main-dark">arrow_back</span>
                    </Link>
                    <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Pet Box</h1>
                    <div className="flex w-10 items-center justify-end">
                        <button className="relative flex cursor-pointer items-center justify-center text-text-main-light dark:text-text-main-dark transition-transform active:scale-95">
                            <span className="material-symbols-outlined">shopping_bag</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
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

                    <div className="px-4 space-y-4">
                        {/* Subscription Plan Card (Highlighted) */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[#ff9e4a] p-1 shadow-lg ring-1 ring-primary/20">
                            <div className="absolute right-0 top-0 rounded-bl-xl bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                                Mais Popular
                            </div>
                            <div className="rounded-xl bg-white dark:bg-surface-dark p-5 h-full flex flex-col">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h4 className="text-lg font-bold text-text-main-light dark:text-text-main-dark">Assinatura Box</h4>
                                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Todo mês uma surpresa nova!</p>
                                    </div>
                                    <div className="bg-primary/10 rounded-lg p-2">
                                        <span className="material-symbols-outlined text-primary">redeem</span>
                                    </div>
                                </div>
                                <div className="my-4 space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-text-main-light dark:text-text-main-dark">
                                        <span className="material-symbols-outlined text-green-500 text-lg">check</span>
                                        <span>5 a 7 produtos premium</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-text-main-light dark:text-text-main-dark">
                                        <span className="material-symbols-outlined text-green-500 text-lg">check</span>
                                        <span>Personalizado para seu pet</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-text-main-light dark:text-text-main-dark">
                                        <span className="material-symbols-outlined text-green-500 text-lg">check</span>
                                        <span>Frete Grátis</span>
                                    </div>
                                </div>
                                <div className="mt-auto pt-4 border-t border-dashed border-border-light dark:border-border-dark flex items-end justify-between">
                                    <div>
                                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark line-through">R$ 119,90</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-bold text-primary">R$ {getPrice()}</span>
                                            <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">/mês</span>
                                        </div>
                                    </div>
                                    <button className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors text-sm">
                                        Assinar
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Single Box Plan Card */}
                        <div className="relative overflow-hidden rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-5 shadow-sm">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h4 className="text-lg font-bold text-text-main-light dark:text-text-main-dark">Caixa Avulsa</h4>
                                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Para experimentar sem compromisso.</p>
                                </div>
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                                    <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">inventory_2</span>
                                </div>
                            </div>
                            <div className="my-4 space-y-2 opacity-80">
                                <div className="flex items-center gap-2 text-sm text-text-main-light dark:text-text-main-dark">
                                    <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark text-lg">check</span>
                                    <span>Mesmos produtos da assinatura</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-text-main-light dark:text-text-main-dark">
                                    <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark text-lg">check</span>
                                    <span>Sem renovação automática</span>
                                </div>
                            </div>
                            <div className="mt-auto pt-4 border-t border-border-light dark:border-border-dark flex items-end justify-between">
                                <div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-bold text-text-main-light dark:text-text-main-dark">R$ 109,90</span>
                                        <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">/uma vez</span>
                                    </div>
                                </div>
                                <button className="bg-surface-light dark:bg-surface-dark border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
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

            {/* Sticky Bottom CTA */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark p-4 pb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="max-w-md mx-auto flex gap-3">
                    <div className="flex-1">
                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Total estimado</p>
                        <p className="text-xl font-bold text-text-main-light dark:text-text-main-dark">
                            R$ {getPrice()}
                            <span className="text-sm font-normal text-text-secondary-light dark:text-text-secondary-dark">/mês</span>
                        </p>
                    </div>
                    <button className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 h-12">
                        <span>Finalizar</span>
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MontarBox;
