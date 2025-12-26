import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[80px] items-center justify-around border-t border-gray-200 dark:border-gray-800 bg-surface-light dark:bg-surface-dark pb-safe">
      <Link to="/admin/pets" className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isActive('/admin/pets') ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}>
        <span className={`material-symbols-outlined mb-1 ${isActive('/admin/pets') ? 'filled' : ''}`}>pets</span>
        <span className="text-[10px] font-bold">Pets</span>
      </Link>
      <Link to="/admin/orders" className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isActive('/admin/orders') ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}>
        <span className={`material-symbols-outlined mb-1 ${isActive('/admin/orders') ? 'filled' : ''}`}>inventory_2</span>
        <span className="text-[10px] font-bold">Pedidos</span>
      </Link>
      <Link to="/admin/settings" className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isActive('/admin/settings') ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'}`}>
        <span className={`material-symbols-outlined mb-1 ${isActive('/admin/settings') ? 'filled' : ''}`}>settings</span>
        <span className="text-[10px] font-bold">Ajustes</span>
      </Link>
    </nav>
  );
};