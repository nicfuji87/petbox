import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderDetails: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-50 flex items-center bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-200 dark:border-gray-800">
        <button onClick={() => navigate(-1)} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Pedido #8492</h2>
        <button className="flex w-12 items-center justify-center text-primary text-sm font-bold shrink-0 hover:opacity-80">Ajuda</button>
      </header>
      
      <div className="flex-1 flex flex-col gap-6 p-4">
        {/* Status Dropdown */}
        <section className="flex flex-col gap-2">
          <div className="relative w-full">
            <label className="block text-sm font-semibold mb-2 px-1">Status Atual</label>
            <div className="relative">
              <select className="appearance-none w-full bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-base font-medium rounded-xl h-14 pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm">
                <option value="pending">Pendente</option>
                <option value="processing">Em preparação</option>
                <option value="shipped">Enviado para transportadora</option>
                <option value="delivered">Entregue</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-primary">
                <span className="material-symbols-outlined">local_shipping</span>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 px-1">Última atualização: Hoje, 14:30</p>
          </div>
        </section>

        {/* Box Summary */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold leading-tight">Resumo da Box</h3>
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-md">Novembro/2023</span>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch gap-4 rounded-xl bg-surface-light dark:bg-surface-dark p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="w-full sm:w-24 h-32 sm:h-auto shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <div className="w-full h-full bg-center bg-no-repeat bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCIyrYqUi_wYHt11NBxNZ7-EoF_QmIvwek-cWE5l6y9Q6tMKA6VfwzL0BzB2HARMJwidF6YpgYKZEZH_mSnbPUaa1PHEJ2TVMe4D5cxd4iH4R-yiwqj380IlMG5ptc6j0DveBVV7q-fHNdlB08i17iAursmakTZw0rbKAxoCAF436WukIHBoKZth43onikfzvGElKHTUPb_TDmvtWga-8x3N8DQC6dWHaZwCrzm7TZMk8uXlIwcmyZHo0Yt0YmpSHx0i2jP-am7qEi4")' }}></div>
            </div>
            <div className="flex flex-col justify-between flex-1 gap-2">
              <div>
                <p className="text-lg font-bold leading-tight">Box Cães - Porte Grande</p>
                <p className="text-gray-500 text-sm mt-1">Plano Mensal - Renovação Automática</p>
              </div>
              <div className="flex items-end justify-between mt-2">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-wide">Valor</span>
                  <span className="text-primary text-xl font-bold">R$ 89,90</span>
                </div>
                <button className="text-sm font-semibold underline decoration-primary/50 underline-offset-4 hover:decoration-primary transition-all">Ver itens</button>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Details */}
        <section>
          <h3 className="text-lg font-bold leading-tight mb-3">Dados do Cliente</h3>
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
             {/* Simple items */}
            <div className="flex items-center gap-4 p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><span className="material-symbols-outlined">person</span></div>
              <div className="flex-1"><p className="text-xs text-gray-500 font-medium">Nome</p><p className="font-semibold">Ana Silva</p></div>
            </div>
             <div className="flex items-start gap-4 p-4">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1"><span className="material-symbols-outlined">location_on</span></div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium">Endereço de Entrega</p>
                <p className="font-semibold leading-snug mt-1">Rua das Flores, 123, Apt 45<br/>Jardim Paulista, São Paulo - SP<br/>CEP 01400-000</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 bg-background-light dark:bg-background-dark p-4 border-t border-gray-200 dark:border-gray-800 backdrop-blur-lg bg-opacity-90">
        <button className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">save</span> Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;