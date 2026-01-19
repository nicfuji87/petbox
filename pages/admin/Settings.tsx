import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminBottomNav from '../../components/admin/AdminBottomNav';
import BreedsManagement from '../../components/admin/BreedsManagement';

const Settings: React.FC = () => {
    const [showBreedsModal, setShowBreedsModal] = useState(false);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-32">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-text-main dark:text-white mb-6">Ajustes</h1>

                <div className="space-y-4">
                    {/* Produtos */}
                    <Link to="/admin/products" className="block p-4 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-white/5 hover:border-primary/50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">shopping_bag</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-main dark:text-white">Produtos</h3>
                                    <p className="text-text-secondary dark:text-text-dark-secondary text-sm">Gerencie planos e produtos avulsos</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-text-secondary">chevron_right</span>
                        </div>
                    </Link>

                    {/* Raças */}
                    <button
                        onClick={() => setShowBreedsModal(true)}
                        className="w-full text-left p-4 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-white/5 hover:border-primary/50 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">pet_supplies</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-main dark:text-white">Raças</h3>
                                    <p className="text-text-secondary dark:text-text-dark-secondary text-sm">Gerencie raças de cães e gatos</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-text-secondary">chevron_right</span>
                        </div>
                    </button>

                    {/* Atualizar Site */}
                    <Link to="/admin/site-settings" className="block p-4 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-white/5 hover:border-primary/50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-green-600 dark:text-green-400">web</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-main dark:text-white">Atualizar Site</h3>
                                    <p className="text-text-secondary dark:text-text-dark-secondary text-sm">Personalize produtos da landing page</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-text-secondary">chevron_right</span>
                        </div>
                    </Link>

                    {/* Cupons */}
                    <Link to="/admin/coupons" className="block p-4 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-white/5 hover:border-primary/50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-pink-600 dark:text-pink-400">confirmation_number</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-main dark:text-white">Cupons</h3>
                                    <p className="text-text-secondary dark:text-text-dark-secondary text-sm">Gerencie cupons de desconto</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-text-secondary">chevron_right</span>
                        </div>
                    </Link>

                    {/* Parcerias */}
                    <Link to="/admin/partners" className="block p-4 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-white/5 hover:border-primary/50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">handshake</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-main dark:text-white">Parcerias</h3>
                                    <p className="text-text-secondary dark:text-text-dark-secondary text-sm">Gerencie parceiros e afiliados</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-text-secondary">chevron_right</span>
                        </div>
                    </Link>

                    {/* Notificações */}
                    <Link to="/admin/notifications" className="block p-4 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-white/5 hover:border-primary/50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">notifications</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-main dark:text-white">Notificações</h3>
                                    <p className="text-text-secondary dark:text-text-dark-secondary text-sm">Configure alertas por email</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-text-secondary">chevron_right</span>
                        </div>
                    </Link>
                </div>
            </div>

            <BreedsManagement isOpen={showBreedsModal} onClose={() => setShowBreedsModal(false)} />
            <AdminBottomNav />
        </div>
    );
};

export default Settings;

