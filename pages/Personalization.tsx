import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Personalization: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    species: 'dog',
    name: '',
    size: 'M',
    gender: 'boy',
    allergies: [] as string[]
  });

  const toggleAllergy = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }));
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-text-dark-main min-h-screen">
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center p-4 pb-2 justify-between">
          <button onClick={() => navigate(-1)} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Pet Box</h1>
          <div className="flex w-10 items-center justify-end">
            <button className="relative flex cursor-pointer items-center justify-center transition-transform active:scale-95">
              <span className="material-symbols-outlined">shopping_bag</span>
            </button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-md mx-auto pb-24">
        {/* Hero Section */}
        <div className="px-4 py-4">
          <div className="relative bg-cover bg-center flex flex-col justify-end overflow-hidden rounded-xl h-72 shadow-lg group" style={{ backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 60%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuD1kH453inxBts3jrVc1CMARpDNpUF7oDwSuPAePpyUfYqBo-PBK6BAiWFjrynSfYRbi_-4UJuB5TPmU0vEVJ1OhOsXytX3rlx9ro9LrIl9ZujSO_3XU_TSw5aX6kjfI_Qpdq_NfHKzNYEBUcwniuFeNKVkwSrOe2QRdIzVjWr8rle8AmMfDyqjzjdgAfLNewunI6MIgNV3A3pKY400SqyMHF1OVOyC7bQRunFNNDOcdgpwJ9TuyKsk6pBFKfHWA1Cf898nFmDfevLr")' }}>
            <div className="flex flex-col p-5 relative z-10 transition-transform duration-300 group-hover:translate-y-[-4px]">
              <span className="inline-block px-3 py-1 mb-2 text-xs font-bold text-white bg-primary rounded-full w-fit shadow-md">Tema do Mês: Aventura Espacial 🚀</span>
              <p className="text-white tracking-tight text-[28px] font-bold leading-none drop-shadow-sm">Mimos perfeitos para o seu melhor amigo</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="mt-2">
          <div className="px-4 py-2">
            <h3 className="text-xl font-bold leading-tight tracking-tight">Vamos personalizar seu Pet?</h3>
            <p className="text-sm text-text-secondary dark:text-text-dark-secondary mt-1">Conte um pouco sobre quem vai receber a box.</p>
          </div>

          {/* Species Toggle */}
          <div className="px-4 py-3">
            <div className="flex gap-4">
              <label className={`group relative flex flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-4 shadow-sm transition-all ${formData.species === 'dog' ? 'border-primary bg-primary/5' : 'border-transparent bg-surface-light dark:bg-surface-dark'}`}>
                <input className="sr-only" type="radio" name="species" value="dog" checked={formData.species === 'dog'} onChange={() => setFormData({...formData, species: 'dog'})} />
                <div className={`mb-2 rounded-full p-3 transition-colors ${formData.species === 'dog' ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                  <span className="material-symbols-outlined text-3xl">pets</span>
                </div>
                <span className={`font-bold ${formData.species === 'dog' ? 'text-primary' : ''}`}>Cachorro</span>
                {formData.species === 'dog' && <div className="absolute right-2 top-2"><span className="material-symbols-outlined text-primary text-xl">check_circle</span></div>}
              </label>

              <label className={`group relative flex flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-4 shadow-sm transition-all ${formData.species === 'cat' ? 'border-primary bg-primary/5' : 'border-transparent bg-surface-light dark:bg-surface-dark'}`}>
                <input className="sr-only" type="radio" name="species" value="cat" checked={formData.species === 'cat'} onChange={() => setFormData({...formData, species: 'cat'})} />
                <div className={`mb-2 rounded-full p-3 transition-colors ${formData.species === 'cat' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <span className="material-symbols-outlined text-3xl">cruelty_free</span>
                </div>
                <span className={`font-bold ${formData.species === 'cat' ? 'text-primary' : ''}`}>Gato</span>
                {formData.species === 'cat' && <div className="absolute right-2 top-2"><span className="material-symbols-outlined text-primary text-xl">check_circle</span></div>}
              </label>
            </div>
          </div>

          <div className="px-4 py-2 space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Nome do Pet</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark px-4 py-3 pl-11 text-base shadow-sm focus:border-primary focus:ring-primary transition-shadow" 
                  placeholder="Ex: Rex, Luna..." 
                />
                <span className="material-symbols-outlined absolute left-3 top-3.5 text-gray-400">edit</span>
              </div>
            </div>

            {/* Size */}
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Porte</label>
              <div className="flex w-full rounded-xl bg-surface-light dark:bg-surface-dark p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                {['P', 'M', 'G'].map(size => (
                  <label key={size} className="flex-1 cursor-pointer">
                    <input className="sr-only" type="radio" name="size" value={size} checked={formData.size === size} onChange={() => setFormData({...formData, size})} />
                    <div className={`flex h-10 items-center justify-center rounded-lg text-sm font-medium transition-all ${formData.size === size ? 'bg-primary text-white shadow-md' : 'text-text-secondary dark:text-text-dark-secondary'}`}>
                      {size === 'P' ? 'Pequeno' : size === 'M' ? 'Médio' : 'Grande'}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Sexo</label>
              <div className="flex gap-3">
                <label className="cursor-pointer flex-1">
                  <input className="sr-only" type="radio" name="gender" value="boy" checked={formData.gender === 'boy'} onChange={() => setFormData({...formData, gender: 'boy'})} />
                  <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all ${formData.gender === 'boy' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark'}`}>
                    <span className="material-symbols-outlined text-xl">male</span>
                    <span className="text-sm font-medium">Macho</span>
                  </div>
                </label>
                <label className="cursor-pointer flex-1">
                  <input className="sr-only" type="radio" name="gender" value="girl" checked={formData.gender === 'girl'} onChange={() => setFormData({...formData, gender: 'girl'})} />
                  <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all ${formData.gender === 'girl' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark'}`}>
                    <span className="material-symbols-outlined text-xl">female</span>
                    <span className="text-sm font-medium">Fêmea</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Allergies */}
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Alergias ou Restrições</label>
              <div className="flex flex-wrap gap-2">
                {['Nenhuma', 'Frango', 'Carne Bovina', 'Glúten', 'Corantes'].map(allergy => (
                  <button
                    key={allergy}
                    onClick={() => allergy === 'Nenhuma' ? setFormData({...formData, allergies: []}) : toggleAllergy(allergy)}
                    className={`inline-flex items-center rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      (allergy === 'Nenhuma' && formData.allergies.length === 0) || formData.allergies.includes(allergy)
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark text-text-secondary dark:text-text-dark-secondary'
                    }`}
                  >
                    {allergy}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="mt-8 mb-4 px-4 space-y-4">
          <h3 className="text-xl font-bold leading-tight tracking-tight">Escolha seu plano</h3>
          
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[#ff9e4a] p-1 shadow-lg ring-1 ring-primary/20">
            <div className="absolute right-0 top-0 rounded-bl-xl bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">Mais Popular</div>
            <div className="rounded-xl bg-surface-light dark:bg-surface-dark p-5 h-full flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-lg font-bold">Assinatura Box</h4>
                  <p className="text-sm text-text-secondary dark:text-text-dark-secondary">Todo mês uma surpresa nova!</p>
                </div>
                <div className="bg-primary/10 rounded-lg p-2"><span className="material-symbols-outlined text-primary">redeem</span></div>
              </div>
              <div className="my-4 space-y-2">
                {['5 a 7 produtos premium', 'Personalizado para seu pet', 'Frete Grátis'].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm"><span className="material-symbols-outlined text-green-500 text-lg">check</span><span>{feat}</span></div>
                ))}
              </div>
              <div className="mt-auto pt-4 border-t border-dashed border-gray-200 dark:border-gray-700 flex items-end justify-between">
                <div>
                  <p className="text-xs text-gray-400 line-through">R$ 119,90</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-primary">R$ 89,90</span>
                    <span className="text-sm font-medium text-gray-500">/mês</span>
                  </div>
                </div>
                <button className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors text-sm">Assinar</button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-700 p-4 pb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="max-w-md mx-auto flex gap-3">
          <div className="flex-1">
            <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Total estimado</p>
            <p className="text-xl font-bold">R$ 89,90<span className="text-sm font-normal text-text-secondary dark:text-text-dark-secondary">/mês</span></p>
          </div>
          <button className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 h-12">
            <span>Montar Box</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Personalization;