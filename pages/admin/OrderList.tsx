import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_ORDERS } from '../../constants';

const OrderList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full min-h-screen pb-24">
      <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
        <div className="flex items-center px-4 py-3 justify-between">
          <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h2 className="text-lg font-bold leading-tight">Gestão de Pedidos</h2>
          <button className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-2xl">notifications</span>
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="flex gap-3 overflow-x-auto px-4 py-4 no-scrollbar snap-x snap-mandatory">
        <div className="snap-center min-w-[140px] flex-1 flex flex-col gap-1 rounded-xl p-4 bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"><span className="material-symbols-outlined text-lg">new_releases</span></div>
            <p className="text-text-secondary dark:text-gray-400 text-sm font-medium">Novos</p>
          </div>
          <div className="mt-2 flex items-baseline gap-2"><p className="text-2xl font-bold">12</p><span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded-full">+2%</span></div>
        </div>
        <div className="snap-center min-w-[140px] flex-1 flex flex-col gap-1 rounded-xl p-4 bg-surface-light dark:bg-surface-dark border border-primary/20 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1 bg-primary"></div>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary"><span className="material-symbols-outlined text-lg">local_shipping</span></div>
            <p className="text-text-secondary dark:text-gray-400 text-sm font-medium">Enviar</p>
          </div>
          <div className="mt-2 flex items-baseline gap-2"><p className="text-2xl font-bold">5</p><span className="text-xs font-bold text-primary bg-orange-100 px-1.5 py-0.5 rounded-full">Alert</span></div>
        </div>
        <div className="snap-center min-w-[140px] flex-1 flex flex-col gap-1 rounded-xl p-4 bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600"><span className="material-symbols-outlined text-lg">warning</span></div>
            <p className="text-text-secondary dark:text-gray-400 text-sm font-medium">Atraso</p>
          </div>
          <div className="mt-2 flex items-baseline gap-2"><p className="text-2xl font-bold">2</p><span className="text-xs font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full">-1%</span></div>
        </div>
      </div>

      <div className="flex flex-col px-4 gap-4 mt-2">
        {MOCK_ORDERS.map((order) => (
          <div key={order.id} onClick={() => navigate(`/admin/orders/${order.id}`)} className={`group relative flex flex-col gap-3 rounded-2xl bg-surface-light dark:bg-surface-dark p-4 shadow-sm border transition-all cursor-pointer ${order.status === 'late' ? 'border-red-100 dark:border-red-900/30' : 'border-transparent hover:border-primary/20'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="size-14 shrink-0 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${order.petImage})` }}></div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${order.plan === 'Assinatura' ? 'text-primary bg-primary/10' : 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'}`}>{order.plan}</span>
                    <span className="text-xs text-gray-500">#{order.id}</span>
                  </div>
                  <h3 className="text-base font-bold mt-1">{order.customerName}</h3>
                  <p className="text-sm text-gray-500">Pet: <span className="font-medium text-text-main dark:text-gray-200">{order.petName}</span></p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                  order.status === 'late' ? 'bg-red-100 text-red-700' : 
                  order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                  order.status === 'shipped' ? 'bg-gray-100 text-gray-600' :
                  'bg-green-100 text-green-700'
                }`}>
                  {order.status === 'late' && <span className="material-symbols-outlined text-[14px]">error</span>}
                  {order.status === 'late' ? 'Atrasado' : order.status === 'processing' ? 'Separado' : order.status === 'shipped' ? 'Enviado' : 'Pago'}
                </span>
                <span className="text-xs text-gray-400">{order.date}</span>
              </div>
            </div>
            <div className="h-px w-full bg-gray-100 dark:bg-gray-800"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="material-symbols-outlined text-lg">calendar_month</span>
                <span>Caixa: <b className="text-text-main dark:text-gray-200">{order.boxMonth}</b></span>
              </div>
              <span className={`flex items-center gap-1 text-sm font-bold transition-colors ${order.status === 'late' ? 'text-red-500' : 'text-primary'}`}>
                {order.status === 'late' ? 'Resolver' : 'Detalhes'}
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;