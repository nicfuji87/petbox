import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MOCK_PETS } from '../../constants';

const PetProfile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const pet = MOCK_PETS.find(p => p.id === id) || MOCK_PETS[0];

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white dark:bg-background-dark shadow-2xl">
      {/* Top App Bar */}
      <div className="sticky top-0 z-50 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-4 border-b border-slate-100 dark:border-slate-800 justify-between">
        <button onClick={() => navigate(-1)} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight flex-1 text-center">Perfil do Pet</h2>
        <button className="flex w-12 items-center justify-end text-primary font-bold text-sm hover:opacity-80 transition-opacity">Editar</button>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Header */}
        <div className="flex flex-col items-center pt-6 pb-6 px-4">
          <div className="relative mb-4 group cursor-pointer">
            <div className="bg-center bg-no-repeat bg-cover rounded-full h-32 w-32 shadow-lg border-4 border-white dark:border-slate-800" style={{ backgroundImage: `url(${pet.imageUrl})` }}></div>
            <div className="absolute bottom-0 right-0 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full p-1.5" title="Ativo">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          <h1 className="text-2xl font-extrabold mb-1">{pet.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-3">{pet.breed} • {pet.age}</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Assinante Ativo
          </div>
        </div>

        {/* Owner Info */}
        <div className="px-4 mb-6">
          <div className="flex items-center gap-4 bg-white dark:bg-white/5 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-transparent">
            <div className="flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 shrink-0 size-12 text-slate-600 dark:text-slate-300">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-0.5">Tutor Responsável</p>
              <p className="text-base font-semibold truncate">{pet.ownerName}</p>
            </div>
            <button className="shrink-0 size-10 flex items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-100 transition-colors">
              <span className="material-symbols-outlined">call</span>
            </button>
            <button className="shrink-0 size-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined">mail</span>
            </button>
          </div>
        </div>

        {/* Vital Stats */}
        <div className="px-4 mb-6">
          <h4 className="text-lg font-bold mb-3 px-1">Dados Vitais</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Raça', val: 'Golden', icon: 'pets' },
              { label: 'Porte', val: pet.size, icon: 'straighten' },
              { label: 'Sexo', val: pet.gender, icon: 'male' },
              { label: 'Peso', val: pet.weight, icon: 'scale' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-1 rounded-xl p-4 bg-white dark:bg-white/5 shadow-sm border border-slate-100 dark:border-transparent">
                <div className="text-primary mb-1"><span className="material-symbols-outlined text-2xl">{stat.icon}</span></div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase">{stat.label}</p>
                <p className="text-lg font-bold leading-tight">{stat.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        {pet.allergies.length > 0 && (
          <div className="px-4 mb-6">
            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 p-4 flex items-start gap-4">
              <div className="bg-red-100 dark:bg-red-800 rounded-full p-2 text-red-600 dark:text-red-200 shrink-0">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <div className="flex-1">
                <h4 className="text-red-800 dark:text-red-200 font-bold text-sm uppercase tracking-wide mb-1">Restrições Alimentares</h4>
                <p className="text-red-700 dark:text-red-300 font-medium text-base">{pet.allergies.join(', ')}</p>
                <p className="text-red-600/80 dark:text-red-400/80 text-sm mt-1">Verificar rótulos de petiscos.</p>
              </div>
            </div>
          </div>
        )}

        {/* History */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <h4 className="text-lg font-bold">Histórico de Caixas</h4>
            <button className="text-primary text-sm font-bold">Ver tudo</button>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4 bg-white dark:bg-white/5 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-transparent">
              <div className="flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 shrink-0 size-12 text-blue-600 dark:text-blue-400"><span className="material-symbols-outlined">inventory_2</span></div>
              <div className="flex-1"><p className="text-base font-bold">Box Setembro/24</p><p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Em preparação</p></div>
              <div className="shrink-0 px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold">Pendente</div>
            </div>
          </div>
        </div>
        <div className="h-6"></div>
      </div>
    </div>
  );
};

export default PetProfile;