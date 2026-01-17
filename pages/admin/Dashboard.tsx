import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../../components/Logo';

// Stats data
const STATS = [
    {
        icon: 'attach_money',
        iconBg: 'bg-primary/10',
        iconColor: 'text-primary',
        label: 'Receita Total',
        value: 'R$ 45.200',
        trend: '+12%',
        trendUp: true,
    },
    {
        icon: 'stars',
        iconBg: 'bg-blue-500/10',
        iconColor: 'text-blue-500',
        label: 'Novas Assinaturas',
        value: '+120',
        trend: '+5%',
        trendUp: true,
    },
    {
        icon: 'pending_actions',
        iconBg: 'bg-orange-500/10',
        iconColor: 'text-orange-500',
        label: 'Pedidos a Enviar',
        value: '15',
        trend: 'Pendente',
        trendUp: false,
    },
];

// Quick access items
const QUICK_ACCESS = [
    { icon: 'inventory_2', label: 'Pedidos', iconBg: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600 dark:text-emerald-400', link: '/admin/orders' },
    { icon: 'pets', label: 'Pets', iconBg: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400', link: '/admin/pets' },
    { icon: 'group', label: 'Clientes', iconBg: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400', link: '/admin/customers' },
    { icon: 'handshake', label: 'Parcerias', iconBg: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400', link: '/admin/settings' },
    { icon: 'payments', label: 'Financeiro', iconBg: 'bg-cyan-100 dark:bg-cyan-900/30', iconColor: 'text-cyan-600 dark:text-cyan-400', link: '/admin/financial' },
];

// Recent activity data
const RECENT_ACTIVITY = [
    {
        type: 'image',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKXRdaf8TsEWQH1kIdYvNsZJFzOrVOi0ZvYAfRa7VAUxylfM6JUcDzqMqnYzJBWsUCzpZT9mMY7Jb_H-23LDYqqGuq1nhZBzDUGLCiYCsZSuO3zkEt6q7lKAE7nPxC-wL1jtjXNhUkqVnOqXq_padYdlUaafZwWdwUGht_YFR6oa8AO_S7lL2BziCZ9mNfKbzMTrVwzGQ2cDMn-tZCmQkHINvxUEm1TS9rfyoAv6c4rfURm5MoIF5ZRhov7vJviz_ixUk1O_nFVsw',
        title: 'Box de Aniversário Enviada',
        subtitle: 'Para Max (Golden Retriever)',
        time: '2 min',
    },
    {
        type: 'icon',
        icon: 'person_add',
        iconBg: 'bg-primary/20',
        iconColor: 'text-primary',
        title: 'Novo Assinante',
        subtitle: 'Julia S. assinou o Plano Mensal',
        time: '1h',
    },
    {
        type: 'icon',
        icon: 'inventory',
        iconBg: 'bg-red-500/20',
        iconColor: 'text-red-500',
        title: 'Alerta de Estoque',
        subtitle: 'Brinquedo Corda está acabando',
        time: '3h',
    },
];

const Dashboard: React.FC = () => {
    const currentMonth = new Date().toLocaleString('pt-BR', { month: 'long' });
    const capitalizedMonth = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);

    return (
        <div className="relative flex min-h-screen w-full flex-col pb-24 overflow-x-hidden">
            {/* Top App Bar */}
            <header className="sticky top-0 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-border-light dark:border-white/5 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative group cursor-pointer">
                            <div
                                className="size-10 rounded-full bg-cover bg-center border-2 border-primary/20"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCmGm1rhlo3G-eNWa1GQtzmzE8pJ1eQA2FSX4IsNCnNjIqKOQlh3HBsFToaTAcGTcotqTbgZgbWqlqOHk_rjqXzNqrcYx6AneItXVmXpwct29MHEZAEhD_otZ1R--AzI0bNCuxkB5IaITa-GJfN_349R8kD3_0PfWiUfS-p3RC2bF-DxDRvyYnzj3aOc2Hbqjiv_vhFJcRx5asaY044UAIum2mJsc7gbdl4QWhD2ckFfkhyShougT8tvJ-mAWtoeZK92s6CAKpY-qw")' }}
                            />
                            <div className="absolute bottom-0 right-0 size-3 rounded-full bg-primary border-2 border-background-light dark:border-background-dark"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-text-secondary dark:text-text-dark-secondary">Bem-vindo de volta,</span>
                            <h2 className="text-lg font-bold leading-tight text-text-main dark:text-text-dark-main">Admin</h2>
                        </div>
                    </div>
                    <button className="relative flex size-10 items-center justify-center rounded-full bg-surface-light dark:bg-surface-dark shadow-sm border border-border-light dark:border-white/5 active:scale-95 transition-transform">
                        <span className="material-symbols-outlined text-text-secondary dark:text-text-dark-secondary">notifications</span>
                        <span className="absolute top-2 right-2.5 size-2 rounded-full bg-red-500 animate-pulse"></span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-col gap-6 p-4">
                {/* Stats Overview */}
                <section>
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="text-xl font-bold tracking-tight text-text-main dark:text-text-dark-main">Resumo de {capitalizedMonth}</h3>
                        <button className="text-xs font-bold text-primary hover:text-primary-hover">Ver Relatório</button>
                    </div>
                    {/* Horizontal Scroll Container for Stats on Mobile */}
                    <div className="flex overflow-x-auto gap-4 pb-2 -mx-4 px-4 no-scrollbar snap-x snap-mandatory">
                        {STATS.map((stat, idx) => (
                            <div key={idx} className="flex min-w-[260px] flex-col justify-between gap-4 rounded-2xl bg-surface-light dark:bg-surface-dark p-5 shadow-sm border border-border-light dark:border-white/5 snap-center">
                                <div className="flex items-start justify-between">
                                    <div className={`flex size-10 items-center justify-center rounded-full ${stat.iconBg} ${stat.iconColor}`}>
                                        <span className="material-symbols-outlined">{stat.icon}</span>
                                    </div>
                                    <span className={`flex items-center gap-1 text-sm font-bold ${stat.trendUp ? 'text-emerald-500 bg-emerald-500/10' : 'text-orange-500 bg-orange-500/10'} px-2 py-1 rounded-full`}>
                                        <span className="material-symbols-outlined text-base">{stat.trendUp ? 'trending_up' : 'warning'}</span>
                                        {stat.trend}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary">{stat.label}</p>
                                    <p className="text-2xl font-bold text-text-main dark:text-text-dark-main tracking-tight">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quick Access Grid */}
                <section>
                    <h3 className="text-xl font-bold tracking-tight text-text-main dark:text-text-dark-main mb-3 px-1">Acesso Rápido</h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {QUICK_ACCESS.map((item, idx) => (
                            <Link
                                key={idx}
                                to={item.link}
                                className="flex flex-col gap-3 rounded-xl bg-surface-light dark:bg-surface-dark p-4 shadow-sm border border-border-light dark:border-white/5 active:bg-background-light dark:active:bg-white/5 transition-colors text-left group"
                            >
                                <div className={`flex size-10 items-center justify-center rounded-lg ${item.iconBg} ${item.iconColor} group-hover:scale-110 transition-transform`}>
                                    <span className="material-symbols-outlined">{item.icon}</span>
                                </div>
                                <span className="text-base font-bold text-text-main dark:text-text-dark-main">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Recent Activity List */}
                <section className="pb-4">
                    <h3 className="text-xl font-bold tracking-tight text-text-main dark:text-text-dark-main mb-3 px-1">Atividade Recente</h3>
                    <div className="flex flex-col gap-2">
                        {RECENT_ACTIVITY.map((activity, idx) => (
                            <div key={idx} className="flex items-center gap-4 rounded-xl bg-surface-light dark:bg-surface-dark p-4 shadow-sm border border-border-light dark:border-white/5">
                                {activity.type === 'image' ? (
                                    <div
                                        className="size-10 shrink-0 rounded-full bg-cover bg-center"
                                        style={{ backgroundImage: `url("${activity.image}")` }}
                                    />
                                ) : (
                                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${activity.iconBg} ${activity.iconColor}`}>
                                        <span className="material-symbols-outlined text-xl">{activity.icon}</span>
                                    </div>
                                )}
                                <div className="flex flex-1 flex-col">
                                    <p className="text-sm font-bold text-text-main dark:text-text-dark-main">{activity.title}</p>
                                    <p className="text-xs text-text-secondary dark:text-text-dark-secondary">{activity.subtitle}</p>
                                </div>
                                <span className="text-xs font-medium text-text-secondary/60 dark:text-text-dark-secondary/60">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-30 bg-surface-light/90 dark:bg-background-dark/95 backdrop-blur-lg border-t border-border-light dark:border-white/5">
                <div className="flex h-16 items-center justify-around px-2">
                    <Link to="/admin" className="flex flex-col items-center justify-center gap-1 p-2 text-primary">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
                        <span className="text-[10px] font-bold">Início</span>
                    </Link>
                    <Link to="/admin/pets" className="flex flex-col items-center justify-center gap-1 p-2 text-text-secondary hover:text-text-main dark:text-text-dark-secondary dark:hover:text-text-dark-main transition-colors">
                        <span className="material-symbols-outlined">search</span>
                        <span className="text-[10px] font-medium">Buscar</span>
                    </Link>
                    <Link to="/admin/orders" className="flex flex-col items-center justify-center gap-1 p-2 text-text-secondary hover:text-text-main dark:text-text-dark-secondary dark:hover:text-text-dark-main transition-colors">
                        <span className="material-symbols-outlined">bar_chart</span>
                        <span className="text-[10px] font-medium">Dados</span>
                    </Link>
                    <Link to="/admin/settings" className="flex flex-col items-center justify-center gap-1 p-2 text-text-secondary hover:text-text-main dark:text-text-dark-secondary dark:hover:text-text-dark-main transition-colors">
                        <span className="material-symbols-outlined">settings</span>
                        <span className="text-[10px] font-medium">Ajustes</span>
                    </Link>
                </div>
                {/* Safe Area Spacer for iOS Home Indicator */}
                <div className="h-[env(safe-area-inset-bottom)] w-full"></div>
            </nav>
        </div>
    );
};

export default Dashboard;
