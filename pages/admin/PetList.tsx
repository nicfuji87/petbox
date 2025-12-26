import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PETS } from '../../constants';
import { Pet } from '../../types';

const PetList: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'dog' | 'cat' | 'allergy'>('all');
  const [search, setSearch] = useState('');

  const filteredPets = MOCK_PETS.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(search.toLowerCase()) || pet.ownerName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' 
      ? true 
      : filter === 'allergy' 
        ? pet.allergies.length > 0 
        : pet.species === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="pb-24">
      <header className="sticky top-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500 font-medium">Olá, Admin</p>
            <h1 className="text-2xl font-bold leading-tight">Gerenciar Pets</h1>
          </div>
          <button className="relative p-2 rounded-full bg-surface-light dark:bg-surface-dark shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">notifications</span>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
          </button>
        </div>
        
        {/* Search */}
        <div className="relative w-full mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"><span className="material-symbols-outlined text-primary">search</span></div>
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full p-4 pl-12 text-sm border-none rounded-xl bg-surface-light dark:bg-surface-dark shadow-sm focus:ring-2 focus:ring-primary" 
            placeholder="Buscar por pet ou tutor..." 
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: 'all', label: 'Todos', icon: '' },
            { id: 'dog', label: 'Cães', icon: 'pets' },
            { id: 'cat', label: 'Gatos', icon: 'cruelty_free' },
            { id: 'allergy', label: 'Com Alergia', icon: 'warning' }
          ].map((f) => (
            <button 
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`flex items-center justify-center px-5 py-2 rounded-full text-sm font-medium shrink-0 transition-all ${
                filter === f.id 
                  ? 'bg-primary text-white shadow-md shadow-primary/30' 
                  : 'bg-surface-light dark:bg-surface-dark text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {f.icon && <span className={`material-symbols-outlined text-base mr-1.5 ${f.id === 'allergy' ? 'filled text-red-400' : ''}`}>{f.icon}</span>}
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 py-2 space-y-4">
        {filteredPets.map((pet) => (
          <div 
            key={pet.id} 
            onClick={() => navigate(`/admin/pets/${pet.id}`)}
            className="group relative flex items-center gap-4 bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
          >
            <div className="relative shrink-0">
              <div className="h-16 w-16 rounded-full bg-cover bg-center border-2 border-white dark:border-gray-600 shadow-sm" style={{ backgroundImage: `url(${pet.imageUrl})` }}></div>
              <div className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-surface-light dark:border-surface-dark ${pet.species === 'dog' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                <span className="material-symbols-outlined text-[14px] block">{pet.species === 'dog' ? 'pets' : 'cruelty_free'}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-lg font-bold truncate">{pet.name}</h3>
                {pet.allergies.length > 0 && (
                  <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-[10px] font-bold uppercase tracking-wide">
                    <span className="material-symbols-outlined text-[12px] filled">warning</span> Alergia
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate">Tutor: {pet.ownerName}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{pet.size}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{pet.gender}</span>
              </div>
            </div>
            <div className="shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </div>
          </div>
        ))}
        {filteredPets.length === 0 && <div className="text-center py-10 text-gray-400">Nenhum pet encontrado</div>}
      </main>

      {/* FAB */}
      <button className="fixed right-4 bottom-24 z-40 flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-orange-500/40 hover:bg-orange-600 transition-colors active:scale-90">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
};

export default PetList;