import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
    icon: string;
    label: string;
    path: string;
}

const NAV_ITEMS: NavItem[] = [
    { icon: 'grid_view', label: 'Início', path: '/admin' },
    { icon: 'package_2', label: 'Pedidos', path: '/admin/orders' },
    { icon: 'group', label: 'Clientes', path: '/admin/customers' },
    { icon: 'pets', label: 'Pets', path: '/admin/pets' },
    { icon: 'settings', label: 'Ajustes', path: '/admin/settings' },
];

const AdminBottomNav: React.FC = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur-lg border-t border-border-light dark:border-white/5">
            <div className="flex h-16 items-center justify-around px-2">
                {NAV_ITEMS.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${active
                                    ? 'text-primary'
                                    : 'text-text-secondary dark:text-text-dark-secondary/50 hover:text-primary dark:hover:text-primary'
                                }`}
                        >
                            <span
                                className="material-symbols-outlined text-2xl"
                                style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                            >
                                {item.icon}
                            </span>
                            <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
            {/* iOS Home Indicator Safe Area */}
            <div className="h-5 w-full bg-surface-light dark:bg-background-dark"></div>
        </nav>
    );
};

export default AdminBottomNav;
