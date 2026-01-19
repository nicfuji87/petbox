import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Mock transactions data
const TRANSACTIONS = [
    {
        id: '1',
        title: 'Assinatura Anual',
        subtitle: 'Renovação • Maria S.',
        amount: '+ R$ 899,00',
        time: '12:30',
        type: 'income',
        icon: 'add_card',
    },
    {
        id: '2',
        title: 'Box Temático Natal',
        subtitle: 'Venda Avulsa • João P.',
        amount: '+ R$ 149,90',
        time: '10:45',
        type: 'income',
        icon: 'shopping_bag',
    },
    {
        id: '3',
        title: 'Taxa Gateway',
        subtitle: 'Asaas',
        amount: '- R$ 32,50',
        time: '09:15',
        type: 'expense',
        icon: 'receipt_long',
    },
];

const Financial: React.FC = () => {
    const navigate = useNavigate();
    const currentMonth = new Date().toLocaleString('pt-BR', { month: 'long' });
    const capitalizedMonth = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);

    return (
        <div className="relative min-h-screen flex flex-col w-full overflow-x-hidden bg-background-light dark:bg-background-dark pb-32">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-5 pt-12 pb-4 flex items-center justify-between border-b border-black/5 dark:border-white/5">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin')}
                        className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-text-secondary dark:text-white"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold leading-none tracking-tight text-text-main dark:text-white">Financeiro</h1>
                        <p className="text-xs font-medium text-text-secondary dark:text-text-dark-secondary mt-1">Visão Geral</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-white/10 px-3 py-2 rounded-xl shadow-sm hover:border-primary/50 transition-colors">
                    <span className="material-symbols-outlined text-primary text-xl">calendar_month</span>
                    <span className="text-xs font-bold text-text-secondary dark:text-text-dark-secondary">{capitalizedMonth}</span>
                </button>
            </header>

            {/* Main Content */}
            <main className="flex flex-col gap-6 p-5">
                {/* Featured KPI: MRR */}
                <section>
                    <div className="relative overflow-hidden rounded-2xl bg-surface-dark border border-white/5 shadow-lg p-6 group">
                        {/* Background Pattern */}
                        <div className="absolute -right-6 -top-6 opacity-[0.05] group-hover:opacity-10 transition-opacity duration-500">
                            <span className="material-symbols-outlined text-[140px] text-primary">currency_exchange</span>
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm font-semibold text-text-dark-secondary">Receita Recorrente (MRR)</p>
                                <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg">
                                    <span className="material-symbols-outlined text-primary text-base">trending_up</span>
                                    <span className="text-xs font-bold text-primary">+12%</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h2 className="text-4xl font-extrabold tracking-tight text-white">R$ 45.200</h2>
                                <p className="text-xs text-text-dark-secondary/60 font-medium">vs R$ 40.350 mês passado</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Secondary KPIs Grid */}
                <section className="grid grid-cols-2 gap-4">
                    {/* KPI: Active Subs */}
                    <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl border border-border-light dark:border-white/5 shadow-sm flex flex-col justify-between h-36 relative overflow-hidden">
                        <div className="absolute right-0 top-0 p-4 opacity-5">
                            <span className="material-symbols-outlined text-5xl text-white">pets</span>
                        </div>
                        <div className="flex items-start justify-between">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <span className="material-symbols-outlined">subscriptions</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-text-main dark:text-white">1.205</h3>
                            <p className="text-xs font-medium text-text-secondary dark:text-text-dark-secondary">Assinaturas Ativas</p>
                        </div>
                        <div className="absolute bottom-5 right-5">
                            <span className="text-xs font-bold text-primary flex items-center bg-primary/10 px-1.5 py-0.5 rounded">
                                +50 <span className="material-symbols-outlined text-xs ml-0.5">arrow_upward</span>
                            </span>
                        </div>
                    </div>

                    {/* KPI: Churn Rate */}
                    <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl border border-border-light dark:border-white/5 shadow-sm flex flex-col justify-between h-36 relative overflow-hidden">
                        <div className="absolute right-0 top-0 p-4 opacity-5">
                            <span className="material-symbols-outlined text-5xl text-white">person_remove</span>
                        </div>
                        <div className="flex items-start justify-between">
                            <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                                <span className="material-symbols-outlined">trending_down</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-text-main dark:text-white">2.1%</h3>
                            <p className="text-xs font-medium text-text-secondary dark:text-text-dark-secondary">Churn Rate</p>
                        </div>
                        <div className="absolute bottom-5 right-5">
                            <span className="text-xs font-bold text-primary flex items-center bg-primary/10 px-1.5 py-0.5 rounded">
                                -0.5% <span className="material-symbols-outlined text-xs ml-0.5">arrow_downward</span>
                            </span>
                        </div>
                    </div>
                </section>

                {/* Revenue Chart */}
                <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-border-light dark:border-white/5 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold text-text-main dark:text-white">Evolução de Receita</h3>
                            <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Últimos 6 meses</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-text-main dark:text-white">R$ 124k</p>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Total YTD</p>
                        </div>
                    </div>

                    {/* Chart Visualization */}
                    <div className="relative w-full h-48 select-none touch-pan-x">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 478 150">
                            <defs>
                                <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#ee862b" stopOpacity="0.2"></stop>
                                    <stop offset="100%" stopColor="#ee862b" stopOpacity="0"></stop>
                                </linearGradient>
                            </defs>
                            {/* Reference Lines */}
                            <line className="text-border-light dark:text-white/5" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="478" y1="0" y2="0"></line>
                            <line className="text-border-light dark:text-white/5" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="478" y1="50" y2="50"></line>
                            <line className="text-border-light dark:text-white/5" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="478" y1="100" y2="100"></line>
                            <line className="text-border-light dark:text-white/5" stroke="currentColor" strokeWidth="1" x1="0" x2="478" y1="150" y2="150"></line>
                            {/* Data Line */}
                            <path
                                d="M0 109C18.15 109 18.15 21 36.3 21C54.46 21 54.46 41 72.6 41C90.7 41 90.7 93 108.9 93C127 93 127 33 145.2 33C163.4 33 163.4 101 181.5 101C199.7 101 199.7 61 217.8 61C236 61 236 45 254.1 45C272.3 45 272.3 121 290.4 121C308.6 121 308.6 149 326.7 149C344.9 149 344.9 1 363 1C381.2 1 381.2 81 399.4 81C417.5 81 417.5 129 435.7 129C453.8 129 453.8 25 472 25"
                                fill="none"
                                stroke="#ee862b"
                                strokeLinecap="round"
                                strokeWidth="3"
                                vectorEffect="non-scaling-stroke"
                            ></path>
                            {/* Gradient Fill */}
                            <path
                                d="M0 109C18.15 109 18.15 21 36.3 21C54.46 21 54.46 41 72.6 41C90.7 41 90.7 93 108.9 93C127 93 127 33 145.2 33C163.4 33 163.4 101 181.5 101C199.7 101 199.7 61 217.8 61C236 61 236 45 254.1 45C272.3 45 272.3 121 290.4 121C308.6 121 308.6 149 326.7 149C344.9 149 344.9 1 363 1C381.2 1 381.2 81 399.4 81C417.5 81 417.5 129 435.7 129C453.8 129 453.8 25 472 25 V 150 H 0 Z"
                                fill="url(#chartFill)"
                            ></path>
                            {/* Interactive Dot */}
                            <circle cx="254.1" cy="45" fill="#221810" r="5" stroke="#ee862b" strokeWidth="3"></circle>
                            <rect fill="#ee862b" height="24" rx="4" width="50" x="230" y="5"></rect>
                            <text fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle" x="255" y="21">R$ 22k</text>
                        </svg>
                    </div>
                    <div className="flex justify-between mt-4 px-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary dark:text-text-dark-secondary">Jan</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary dark:text-text-dark-secondary">Fev</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary dark:text-text-dark-secondary">Mar</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-primary px-1.5 py-0.5 rounded">Abr</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary dark:text-text-dark-secondary">Mai</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary dark:text-text-dark-secondary">Jun</span>
                    </div>
                </section>

                {/* Distribution Breakdown */}
                <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-border-light dark:border-white/5 shadow-sm">
                    <div className="flex justify-between items-end mb-5">
                        <h3 className="text-base font-bold text-text-main dark:text-white">Distribuição (Assinatura)</h3>
                        <div className="flex gap-3">
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                                <span className="text-[10px] font-bold text-text-secondary dark:text-text-dark-secondary">Cães</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-text-secondary"></span>
                                <span className="text-[10px] font-bold text-text-secondary dark:text-text-dark-secondary">Gatos</span>
                            </div>
                        </div>
                    </div>

                    {/* Custom Bar Chart for Distribution */}
                    <div className="flex flex-col gap-4">
                        {/* Row 1: Dogs */}
                        <div className="group">
                            <div className="flex justify-between mb-2">
                                <span className="text-xs font-bold text-text-secondary dark:text-text-dark-secondary flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">sound_detection_dog_barking</span> Box Cães
                                </span>
                                <span className="text-xs font-bold text-primary">80%</span>
                            </div>
                            <div className="w-full bg-black/5 dark:bg-black/20 rounded-full h-2.5 overflow-hidden">
                                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '80%' }}></div>
                            </div>
                            <p className="text-[10px] text-text-secondary/60 dark:text-text-dark-secondary/60 mt-1">964 assinantes ativos</p>
                        </div>

                        {/* Row 2: Cats */}
                        <div className="group">
                            <div className="flex justify-between mb-2">
                                <span className="text-xs font-bold text-text-secondary dark:text-text-dark-secondary flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">cruelty_free</span> Box Gatos
                                </span>
                                <span className="text-xs font-bold text-text-secondary dark:text-text-dark-secondary">20%</span>
                            </div>
                            <div className="w-full bg-black/5 dark:bg-black/20 rounded-full h-2.5 overflow-hidden">
                                <div className="h-full bg-text-secondary rounded-full transition-all duration-1000" style={{ width: '20%' }}></div>
                            </div>
                            <p className="text-[10px] text-text-secondary/60 dark:text-text-dark-secondary/60 mt-1">241 assinantes ativos</p>
                        </div>
                    </div>
                </section>

                {/* Recent Transactions List */}
                <section className="pb-16">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-base font-bold text-text-main dark:text-white">Últimas Transações</h3>
                        <button className="text-xs font-bold text-primary hover:text-primary-hover transition-colors">Ver todas</button>
                    </div>
                    <div className="flex flex-col gap-3">
                        {TRANSACTIONS.map((transaction) => (
                            <div
                                key={transaction.id}
                                className={`flex items-center justify-between p-3.5 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-white/5 ${transaction.type === 'expense' ? 'opacity-80' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-3.5">
                                    <div
                                        className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${transaction.type === 'income'
                                            ? 'bg-primary/10 text-primary'
                                            : 'bg-black/5 dark:bg-white/5 text-text-secondary dark:text-text-dark-secondary'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-xl">{transaction.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-text-main dark:text-white leading-tight">{transaction.title}</p>
                                        <p className="text-[11px] text-text-secondary dark:text-text-dark-secondary font-medium">{transaction.subtitle}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-bold ${transaction.type === 'income' ? 'text-primary' : 'text-text-secondary dark:text-text-dark-secondary'}`}>
                                        {transaction.amount}
                                    </p>
                                    <p className="text-[10px] text-text-secondary/60 dark:text-text-dark-secondary/60">{transaction.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Floating Action Button */}
            <button className="fixed bottom-6 right-6 h-14 w-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 flex items-center justify-center hover:scale-105 transition-all z-30 group">
                <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform duration-300">add</span>
            </button>
        </div>
    );
};

export default Financial;
