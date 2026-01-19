import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../src/lib/supabase';
import AdminBottomNav from '../../components/admin/AdminBottomNav';

// Filter options
const FILTERS = ['Todos', 'Assinantes', 'Avulsos', 'Inativos', '🐕 Cães', '🐈 Gatos'];

interface Pet {
  id: string;
  name: string;
  image: string;
  tutor: string;
  type: string;
  size: string;
  status: string;
  plan: string;
  planType: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-primary';
    case 'oneoff':
      return 'bg-blue-400';
    case 'inactive':
      return 'bg-gray-400';
    case 'pending':
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
};

const getPlanStyles = (planType: string) => {
  switch (planType) {
    case 'subscription':
      return 'bg-primary/20 text-primary';
    case 'oneoff':
      return 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300';
    case 'inactive':
      return 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400';
    case 'pending':
      return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400';
    default:
      return 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400';
  }
};

const PetListNew: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchPets = async () => {
      setIsLoading(true);
      try {
        const { data: petsData, error } = await supabase
          .from('pets')
          .select(`
            *,
            clients (
              full_name
            )
          `);

        if (error) throw error;

        const formattedPets: Pet[] = (petsData || []).map((pet: any) => ({
          id: pet.id,
          name: pet.name,
          image: pet.photo_url || `https://ui-avatars.com/api/?name=${pet.name}&background=random`,
          tutor: pet.clients ? pet.clients.full_name : 'Sem Tutor',
          type: pet.type === 'dog' ? 'Cão' : 'Gato',
          size: pet.size || 'Médio',
          status: pet.active ? 'active' : 'inactive',
          plan: pet.plan_type || 'Avulso',
          planType: pet.plan_type ? 'subscription' : 'oneoff',
        }));

        setPets(formattedPets);
      } catch (error) {
        console.error('Error fetching pets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPets();
  }, []);

  const filteredPets = pets.filter((pet) => {
    const matchesFilter =
      activeFilter === 'Todos' ||
      (activeFilter === 'Assinantes' && pet.planType === 'subscription') ||
      (activeFilter === 'Avulsos' && pet.planType === 'oneoff') ||
      (activeFilter === 'Inativos' && pet.planType === 'inactive') ||
      (activeFilter === '🐕 Cães' && pet.type === 'Cão') ||
      (activeFilter === '🐈 Gatos' && pet.type === 'Gato');

    const matchesSearch =
      searchQuery === '' ||
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.tutor.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-background-light dark:bg-background-dark font-display antialiased min-h-screen flex flex-col pb-20">
      {/* Top App Bar */}
      <div className="sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-border-light dark:border-white/5 px-4 pt-12 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-text-main dark:text-white text-2xl font-bold tracking-tight">Gerenciar Pets</h1>
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary">Admin Dashboard</p>
        </div>
        <button
          aria-label="Adicionar Pet"
          className="flex items-center justify-center bg-primary hover:bg-primary-hover text-white w-10 h-10 rounded-full shadow-lg transition-colors"
        >
          <span className="material-symbols-outlined font-semibold">add</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-text-secondary dark:text-text-dark-secondary">search</span>
          </div>
          <input
            className="block w-full pl-10 pr-3 py-3 rounded-xl border-none bg-surface-light dark:bg-surface-dark text-text-main dark:text-white placeholder-text-secondary dark:placeholder-text-dark-secondary/60 focus:ring-2 focus:ring-primary focus:bg-surface-light dark:focus:bg-surface-dark transition-all shadow-sm"
            placeholder="Buscar por pet ou tutor..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filters (Chips) */}
      <div className="flex overflow-x-auto gap-3 px-4 pb-2 no-scrollbar">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`flex shrink-0 items-center justify-center px-4 h-9 rounded-full text-sm transition-colors ${activeFilter === filter
              ? 'bg-primary text-white font-semibold'
              : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-white/5 text-text-secondary dark:text-white font-medium whitespace-nowrap hover:bg-black/5 dark:hover:bg-white/5'
              }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Section Title */}
      <div className="px-4 pt-4 pb-2 flex justify-between items-end">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary dark:text-text-dark-secondary">
          Pets Cadastrados
        </h2>
        <span className="text-xs text-text-secondary/60 dark:text-text-dark-secondary/60">{filteredPets.length} total</span>
      </div>

      {/* Pet List */}
      <div className="flex flex-col px-4 gap-3">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
          </div>
        ) : filteredPets.map((pet) => (
          <div
            key={pet.id}
            onClick={() => navigate(`/admin/pets/${pet.id}`)}
            className="group flex items-center p-3 gap-4 bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-transparent dark:border-white/5 active:scale-[0.99] transition-all cursor-pointer"
          >
            <div className="relative shrink-0">
              <div
                className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 bg-cover bg-center"
                style={{ backgroundImage: `url('${pet.image}')` }}
              />
              <div
                className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${getStatusColor(pet.status)} border-2 border-surface-light dark:border-surface-dark`}
                title={pet.plan}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="text-text-main dark:text-white text-lg font-bold truncate">{pet.name}</h3>
                <span className={`${getPlanStyles(pet.planType)} text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide`}>
                  {pet.plan}
                </span>
              </div>
              <p className="text-text-secondary dark:text-text-dark-secondary text-sm truncate mb-0.5">Tutor: {pet.tutor}</p>
              <div className="flex items-center gap-2 text-xs text-text-secondary/70 dark:text-text-dark-secondary/70">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">{pet.type === 'Cão' ? 'pets' : 'cruelty_free'}</span>
                  {pet.type}
                </span>
                <span>•</span>
                <span>{pet.size}</span>
              </div>
            </div>
            <div className="shrink-0 text-text-secondary/50 dark:text-text-dark-secondary/50">
              <span className="material-symbols-outlined">chevron_right</span>
            </div>
          </div>
        ))}
      </div>

      <AdminBottomNav />

      {/* Gradient Overlay */}
      <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent pointer-events-none z-10"></div>
    </div>
  );
};

export default PetListNew;