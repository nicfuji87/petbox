
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../src/lib/supabase';
import AdminBottomNav from '../../components/admin/AdminBottomNav';

// Filter options
const FILTERS = ['Todos', 'Assinatura', 'Avulso', 'Pendente', 'Entregue'];

// Mock orders data
const ORDERS = [
  {
    id: '4829',
    type: 'Assinatura',
    description: 'Box Janeiro',
    status: 'paid',
    statusLabel: 'Pago',
    customerName: 'Maria Silva',
    customerInitials: 'MS',
    customerGradient: 'from-purple-500 to-indigo-500',
    price: 'R$ 89,90',
    icon: 'inventory_2',
    iconColor: 'text-primary',
  },
  {
    id: '4828',
    type: 'Avulso',
    description: 'Kit Aniversário',
    status: 'separating',
    statusLabel: 'Separando',
    customerName: 'João Souza',
    customerInitials: 'JS',
    customerGradient: 'from-yellow-500 to-orange-500',
    price: 'R$ 129,90',
    icon: 'redeem',
    iconColor: 'text-purple-400',
  },
  {
    id: '4827',
    type: 'Assinatura',
    description: 'Box Janeiro',
    status: 'shipped',
    statusLabel: 'Enviado',
    customerName: 'Ana Lima',
    customerInitials: 'AL',
    customerGradient: 'from-blue-500 to-cyan-500',
    price: 'R$ 89,90',
    icon: 'inventory_2',
    iconColor: 'text-primary',
  },
  {
    id: '4826',
    type: 'Avulso',
    description: 'Kit Boas-vindas',
    status: 'pending',
    statusLabel: 'Pendente',
    customerName: 'Roberto P.',
    customerInitials: 'RP',
    customerGradient: 'from-red-500 to-pink-500',
    price: 'R$ 59,90',
    icon: 'redeem',
    iconColor: 'text-purple-400',
  },
  {
    id: '4825',
    type: 'Assinatura',
    description: 'Box Janeiro',
    status: 'paid',
    statusLabel: 'Pago',
    customerName: 'Fernanda B.',
    customerInitials: 'FB',
    customerGradient: 'from-green-500 to-teal-500',
    price: 'R$ 89,90',
    icon: 'inventory_2',
    iconColor: 'text-primary',
  },
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'paid':
      return {
        bg: 'bg-primary/20',
        text: 'text-primary',
        icon: null,
        pulse: true,
      };
    case 'separating':
      return {
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-500',
        icon: 'category',
        pulse: false,
      };
    case 'shipped':
      return {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        icon: 'local_shipping',
        pulse: false,
      };
    case 'pending':
      return {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        icon: 'schedule',
        pulse: false,
      };
    default:
      return {
        bg: 'bg-gray-500/10',
        text: 'text-gray-400',
        icon: null,
        pulse: false,
      };
  }
};

const OrderListNew: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = ORDERS.filter((order) => {
    const matchesFilter =
      activeFilter === 'Todos' ||
      (activeFilter === 'Assinatura' && order.type === 'Assinatura') ||
      (activeFilter === 'Avulso' && order.type === 'Avulso') ||
      (activeFilter === 'Pendente' && order.status === 'pending') ||
      (activeFilter === 'Entregue' && order.status === 'shipped');

    const matchesSearch =
      searchQuery === '' ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden pb-20 bg-background-light dark:bg-background-dark">
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-border-light dark:border-white/10 shadow-sm">
        {/* Top App Bar */}
        <div className="flex items-center px-4 py-4 justify-between">
          <button
            onClick={() => navigate('/admin')}
            className="text-text-main dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight tracking-tight">Lista de Pedidos</h2>
          <button className="text-text-main dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative">
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            <span className="absolute top-2 right-2 size-2 bg-primary rounded-full"></span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-2">
          <label className="flex flex-col h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm">
              <div className="text-text-secondary dark:text-text-dark-secondary flex border-none bg-surface-light dark:bg-surface-dark items-center justify-center pl-4 rounded-l-xl border-r-0">
                <span className="material-symbols-outlined text-[24px]">search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-text-main dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-surface-light dark:bg-surface-dark focus:border-none h-full placeholder:text-text-secondary dark:placeholder:text-text-dark-secondary px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal transition-all"
                placeholder="Buscar cliente, ID ou mês..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </label>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar items-center">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex h - 9 shrink - 0 items - center justify - center gap - x - 2 rounded - full px - 5 transition - all active: scale - 95 ${activeFilter === filter
                  ? 'bg-primary shadow-md shadow-primary/10 text-white'
                  : 'bg-surface-light dark:bg-surface-dark border border-transparent hover:border-primary/30 text-text-main dark:text-white'
                } `}
            >
              <span className={`text - sm font - ${activeFilter === filter ? 'bold' : 'medium'} leading - normal`}>
                {filter}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-6 grid grid-cols-2 gap-3">
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 border border-border-light dark:border-white/10 flex flex-col justify-between h-24 relative overflow-hidden group">
          <div className="absolute right-[-10px] top-[-10px] bg-primary/10 size-16 rounded-full group-hover:scale-110 transition-transform"></div>
          <p className="text-text-secondary dark:text-text-dark-secondary text-xs font-semibold uppercase tracking-wider z-10">A enviar hoje</p>
          <div className="flex items-end gap-2 z-10">
            <span className="text-3xl font-bold text-text-main dark:text-white">24</span>
            <span className="text-xs text-primary mb-1.5 font-medium">+12%</span>
          </div>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 border border-border-light dark:border-white/10 flex flex-col justify-between h-24 relative overflow-hidden group">
          <div className="absolute right-[-10px] top-[-10px] bg-yellow-500/10 size-16 rounded-full group-hover:scale-110 transition-transform"></div>
          <p className="text-text-secondary dark:text-text-dark-secondary text-xs font-semibold uppercase tracking-wider z-10">Pendentes</p>
          <div className="flex items-end gap-2 z-10">
            <span className="text-3xl font-bold text-text-main dark:text-white">8</span>
            <span className="text-xs text-yellow-500 mb-1.5 font-medium">Atenção</span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-3 px-4 pb-24">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-text-main dark:text-white font-bold text-base">Pedidos Recentes</h3>
          <span className="text-xs text-primary font-medium cursor-pointer">Ver Relatório</span>
        </div>

        {filteredOrders.map((order) => {
          const statusStyles = getStatusStyles(order.status);
          return (
            <div
              key={order.id}
              className={`group flex flex - col bg - surface - light dark: bg - surface - dark rounded - 2xl p - 4 border border - border - light dark: border - white / 10 active: border - primary / 50 transition - colors shadow - sm cursor - pointer ${order.status === 'shipped' ? 'opacity-80' : ''
                } `}
              onClick={() => navigate(`/ admin / orders / ${order.id} `)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`bg - surface - light dark: bg - surface - dark p - 2.5 rounded - xl ${order.iconColor} border border - border - light dark: border - white / 5`}>
                    <span className="material-symbols-outlined">{order.icon}</span>
                  </div>
                  <div>
                    <p className="text-text-main dark:text-white font-bold text-base">#{order.id}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded text-[10px] text-text-secondary dark:text-text-dark-secondary font-medium uppercase tracking-wide">
                        {order.type}
                      </span>
                      <span className="text-text-secondary dark:text-text-dark-secondary text-xs">• {order.description}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`${statusStyles.bg} ${statusStyles.text} text - xs px - 2.5 py - 1 rounded - full font - bold flex items - center gap - 1`}>
                    {statusStyles.pulse && <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>}
                    {statusStyles.icon && <span className="material-symbols-outlined text-[14px]">{statusStyles.icon}</span>}
                    {order.statusLabel}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border-light dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className={`size - 6 rounded - full bg - gradient - to - br ${order.customerGradient} flex items - center justify - center text - [10px] font - bold text - white`}>
                    {order.customerInitials}
                  </div>
                  <p className="text-sm text-text-secondary dark:text-gray-300">{order.customerName}</p>
                </div>
                <p className="text-xs text-text-secondary dark:text-text-dark-secondary font-medium">{order.price}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-5 z-40 flex items-center justify-center size-14 bg-primary rounded-full shadow-lg shadow-primary/30 text-white hover:bg-primary-hover hover:scale-105 transition-all active:scale-95">
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>

      {/* Bottom Navigation */}
      {/* Bottom Navigation */}
      <AdminBottomNav />
    </div>
  );
};

export default OrderListNew;