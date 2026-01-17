import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../src/lib/supabase';
import AddCustomerModal from '../../components/admin/AddCustomerModal';

// Filter options
const FILTERS = ['Todos', 'Ativos', 'Cancelados', 'Novos', 'VIP'];

interface Customer {
    id: string;
    name: string;
    image: string;
    pet: string;
    status: string;
    statusLabel: string;
    info: string;
    isVip: boolean;
}

const getStatusStyles = (status: string) => {
    switch (status) {
        case 'active':
            return 'bg-primary/20 text-primary';
        case 'cancelled':
            return 'bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400';
        case 'new':
            return 'bg-blue-500/20 text-blue-500 dark:text-blue-400';
        default:
            return 'bg-gray-500/10 text-gray-500';
    }
};

const CustomerList: React.FC = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [customers, setCustomers] = React.useState<Customer[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            // Fetch clients and their pets
            const { data: clients, error } = await supabase
                .from('clients')
                .select(`
                    *,
                    pets (
                        name
                    )
                `);

            if (error) throw error;

            const formattedCustomers: Customer[] = (clients || []).map((client: any) => ({
                id: client.id,
                name: client.full_name,
                image: `https://ui-avatars.com/api/?name=${client.full_name}&background=random`, // Placeholder image
                pet: client.pets && client.pets[0] ? client.pets[0].name : 'Sem Pet',
                status: client.status || 'new', // Default status if null
                statusLabel: client.status === 'active' ? 'Ativo' : client.status === 'inactive' ? 'Inativo' : 'Novo',
                info: client.email, // Using email as info for now
                isVip: false, // Defaulting to false until we have VIP logic
            }));

            setCustomers(formattedCustomers);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter((customer) => {
        const matchesFilter =
            activeFilter === 'Todos' ||
            (activeFilter === 'Ativos' && customer.status === 'active') ||
            (activeFilter === 'Cancelados' && customer.status === 'inactive') || // Mapping cancelled to inactive for now
            (activeFilter === 'Novos' && customer.status === 'new') ||
            (activeFilter === 'VIP' && customer.isVip);

        const matchesSearch =
            searchQuery === '' ||
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.pet.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-hidden mx-auto bg-background-light dark:bg-background-dark">
            {/* Top App Bar */}
            <header className="sticky top-0 z-30 flex items-center justify-between p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-border-light dark:border-white/5">
                <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-text-dark-secondary">Pet Box Admin</span>
                    <h2 className="text-2xl font-bold leading-tight tracking-tight text-text-main dark:text-white">Clientes</h2>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="group flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-transform active:scale-95 shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-2xl font-medium">add</span>
                </button>
            </header>

            <AddCustomerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    fetchCustomers(); // Refresh list after adding
                }}
            />

            {/* Search Bar */}
            <div className="px-4 py-2">
                <div className="relative flex w-full items-center rounded-2xl bg-surface-light dark:bg-surface-dark shadow-sm border border-border-light dark:border-white/10 transition-colors focus-within:border-primary dark:focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                    <div className="flex h-12 w-12 items-center justify-center text-text-secondary dark:text-text-dark-secondary">
                        <span className="material-symbols-outlined">search</span>
                    </div>
                    <input
                        className="h-12 w-full bg-transparent pr-4 text-base font-medium text-text-main dark:text-white placeholder:text-text-secondary dark:placeholder:text-text-dark-secondary focus:outline-none"
                        placeholder="Buscar por nome ou pet..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Filter Chips */}
            <div className="w-full">
                <div className="flex gap-3 overflow-x-auto px-4 py-3 no-scrollbar pb-4">
                    {FILTERS.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`shrink-0 rounded-full px-5 py-2 text-sm transition-colors ${activeFilter === filter
                                ? 'bg-primary font-bold text-white shadow-sm'
                                : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-white/10 font-medium text-text-secondary dark:text-white hover:border-primary/30'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Client List */}
            <div className="flex flex-1 flex-col gap-1 px-2 pb-24">
                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
                    </div>
                ) : filteredCustomers.map((customer) => {
                    const statusStyles = getStatusStyles(customer.status);
                    return (
                        <div
                            key={customer.id}
                            onClick={() => navigate(`/admin/customers/${customer.id}`)}
                            className={`group flex cursor-pointer items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${customer.status === 'cancelled' ? 'opacity-75' : ''
                                }`}
                        >
                            <div className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 ${customer.isVip ? 'border-primary' : 'border-surface-light dark:border-white/10'} shadow-sm ${customer.status === 'cancelled' ? 'grayscale' : ''}`}>
                                <img
                                    alt={`Foto de ${customer.name}`}
                                    className="h-full w-full object-cover"
                                    src={customer.image}
                                />
                                {customer.status !== 'cancelled' && (
                                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-primary ring-2 ring-surface-light dark:ring-background-dark"></div>
                                )}
                            </div>
                            <div className="flex flex-1 flex-col justify-center">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <h3 className={`text-base font-bold ${customer.status === 'cancelled' ? 'text-text-secondary dark:text-gray-300' : 'text-text-main dark:text-white'}`}>
                                            {customer.name}
                                        </h3>
                                        {customer.isVip && (
                                            <span className="material-symbols-outlined text-yellow-500 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                star
                                            </span>
                                        )}
                                    </div>
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${statusStyles}`}>
                                        {customer.statusLabel}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-text-secondary dark:text-text-dark-secondary mt-0.5">
                                    <span className="material-symbols-outlined text-[16px]">pets</span>
                                    <span>Dono do {customer.pet}</span>
                                    <span className="text-border-light dark:text-white/20">•</span>
                                    <span>{customer.info}</span>
                                </div>
                            </div>
                            <div className="text-text-secondary/50 dark:text-text-dark-secondary/50">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 z-40 w-full border-t border-border-light dark:border-white/5 bg-surface-light/90 dark:bg-background-dark/95 backdrop-blur-lg">
                <div className="flex h-16 items-center justify-around px-2">
                    <Link to="/admin" className="flex flex-1 flex-col items-center justify-center gap-1 text-text-secondary dark:text-text-dark-secondary/50 hover:text-primary dark:hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-2xl">grid_view</span>
                        <span className="text-[10px] font-medium">Início</span>
                    </Link>
                    <Link to="/admin/orders" className="flex flex-1 flex-col items-center justify-center gap-1 text-text-secondary dark:text-text-dark-secondary/50 hover:text-primary dark:hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-2xl">package_2</span>
                        <span className="text-[10px] font-medium">Pedidos</span>
                    </Link>
                    <Link to="/admin/customers" className="flex flex-1 flex-col items-center justify-center gap-1 text-primary">
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
                        <span className="text-[10px] font-bold">Clientes</span>
                    </Link>
                    <Link to="/admin/settings" className="flex flex-1 flex-col items-center justify-center gap-1 text-text-secondary dark:text-text-dark-secondary/50 hover:text-primary dark:hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-2xl">settings</span>
                        <span className="text-[10px] font-medium">Ajustes</span>
                    </Link>
                </div>
                {/* iOS Home Indicator Safe Area */}
                <div className="h-5 w-full bg-surface-light dark:bg-background-dark"></div>
            </nav>
        </div>
    );
};

export default CustomerList;
