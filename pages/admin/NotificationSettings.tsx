import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../src/lib/supabase';
import AdminBottomNav from '../../components/admin/AdminBottomNav';

interface SMTPSettings {
    smtp_host: string;
    smtp_port: number;
    smtp_user: string;
    smtp_password: string;
    smtp_from_email: string;
    smtp_from_name: string;
}

interface AdminNotifications {
    admin_email: string;
    notify_on_purchase: boolean;
    notify_on_registration: boolean;
}

const NotificationSettings: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const [smtpSettings, setSMTPSettings] = useState<SMTPSettings>({
        smtp_host: 'smtp.umbler.com',
        smtp_port: 587,
        smtp_user: '',
        smtp_password: '',
        smtp_from_email: '',
        smtp_from_name: 'PetBox',
    });

    const [adminNotifications, setAdminNotifications] = useState<AdminNotifications>({
        admin_email: '',
        notify_on_purchase: true,
        notify_on_registration: true,
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        setLoading(true);
        const { data } = await supabase.from('email_config').select('*');

        if (data) {
            data.forEach((row: any) => {
                if (row.id === 'smtp_settings') {
                    setSMTPSettings({ ...smtpSettings, ...row.value });
                } else if (row.id === 'admin_notifications') {
                    setAdminNotifications({ ...adminNotifications, ...row.value });
                }
            });
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            await supabase.from('email_config').upsert([
                { id: 'smtp_settings', value: smtpSettings, updated_at: new Date().toISOString() },
                { id: 'admin_notifications', value: adminNotifications, updated_at: new Date().toISOString() },
            ] as any);

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar');
        } finally {
            setSaving(false);
        }
    };

    const handleTestEmail = async () => {
        if (!adminNotifications.admin_email) {
            setError('Configure o email do administrador primeiro');
            return;
        }

        // Save first to ensure latest config is used
        await handleSave();

        setTesting(true);
        setError(null);

        try {
            const { data, error: fnError } = await supabase.functions.invoke('send-email', {
                body: { type: 'test' }
            });

            if (fnError) throw fnError;
            if (data?.error) throw new Error(data.error);

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Erro ao enviar email de teste');
        } finally {
            setTesting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-32">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-white/10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/admin/settings" className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
                            <span className="material-symbols-outlined text-text-main dark:text-white">arrow_back</span>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-text-main dark:text-white">Notificações</h1>
                            <p className="text-sm text-text-secondary">Configurações de email</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving && <span className="material-symbols-outlined animate-spin">progress_activity</span>}
                        Salvar
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                {/* Success/Error Messages */}
                {success && (
                    <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-xl flex items-center gap-2">
                        <span className="material-symbols-outlined">check_circle</span>
                        Configurações salvas com sucesso!
                    </div>
                )}
                {error && (
                    <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl flex items-center gap-2">
                        <span className="material-symbols-outlined">error</span>
                        {error}
                    </div>
                )}

                {/* Asaas Webhook */}
                <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-border-light dark:border-white/10">
                    <h2 className="text-lg font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-600">webhook</span>
                        Webhook Asaas
                    </h2>

                    <div className="p-4 mb-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
                        <p className="text-sm text-green-700 dark:text-green-300">
                            <span className="material-symbols-outlined text-lg align-middle mr-1">info</span>
                            Configure esta URL no painel do Asaas para receber confirmações de pagamento automáticas.
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">
                            URL do Webhook
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value="https://gsybshuufwmgbjvhakrp.supabase.co/functions/v1/asaas-webhook"
                                readOnly
                                className="flex-1 h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 text-text-main dark:text-white text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    navigator.clipboard.writeText('https://gsybshuufwmgbjvhakrp.supabase.co/functions/v1/asaas-webhook');
                                    setSuccess(true);
                                    setTimeout(() => setSuccess(false), 2000);
                                }}
                                className="px-4 h-11 bg-green-600 text-white rounded-xl font-bold flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">content_copy</span>
                                Copiar
                            </button>
                        </div>
                        <p className="mt-2 text-xs text-text-secondary">
                            No Asaas, vá em <strong>Configurações → Integrações → Webhooks</strong> e adicione esta URL.
                        </p>
                    </div>

                    <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
                        <p className="text-sm text-amber-700 dark:text-amber-300 font-bold mb-2">
                            Eventos recomendados:
                        </p>
                        <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                            <li>• PAYMENT_CONFIRMED - Pagamento confirmado</li>
                            <li>• PAYMENT_RECEIVED - Pagamento recebido</li>
                            <li>• PAYMENT_OVERDUE - Pagamento atrasado</li>
                            <li>• SUBSCRIPTION_DELETED - Assinatura cancelada</li>
                        </ul>
                    </div>
                </section>

                {/* SMTP Configuration */}
                <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-border-light dark:border-white/10">
                    <h2 className="text-lg font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-600">mail</span>
                        Configuração SMTP (Umbler Mail)
                    </h2>

                    <div className="p-4 mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            <span className="material-symbols-outlined text-lg align-middle mr-1">info</span>
                            Use as credenciais da sua conta Umbler Mail para envio de emails.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">
                                Servidor SMTP
                            </label>
                            <input
                                type="text"
                                value={smtpSettings.smtp_host}
                                onChange={(e) => setSMTPSettings({ ...smtpSettings, smtp_host: e.target.value })}
                                className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                placeholder="smtp.umbler.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">
                                Porta
                            </label>
                            <input
                                type="number"
                                value={smtpSettings.smtp_port}
                                onChange={(e) => setSMTPSettings({ ...smtpSettings, smtp_port: parseInt(e.target.value) || 587 })}
                                className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                placeholder="587"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">
                                Usuário (Email)
                            </label>
                            <input
                                type="email"
                                value={smtpSettings.smtp_user}
                                onChange={(e) => setSMTPSettings({ ...smtpSettings, smtp_user: e.target.value })}
                                className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                placeholder="contato@seudominio.com.br"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">
                                Senha
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={smtpSettings.smtp_password}
                                    onChange={(e) => setSMTPSettings({ ...smtpSettings, smtp_password: e.target.value })}
                                    className="w-full h-11 px-4 pr-12 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary"
                                >
                                    <span className="material-symbols-outlined">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">
                                Email Remetente
                            </label>
                            <input
                                type="email"
                                value={smtpSettings.smtp_from_email}
                                onChange={(e) => setSMTPSettings({ ...smtpSettings, smtp_from_email: e.target.value })}
                                className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                placeholder="noreply@seudominio.com.br"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">
                                Nome do Remetente
                            </label>
                            <input
                                type="text"
                                value={smtpSettings.smtp_from_name}
                                onChange={(e) => setSMTPSettings({ ...smtpSettings, smtp_from_name: e.target.value })}
                                className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                placeholder="PetBox"
                            />
                        </div>
                    </div>
                </section>

                {/* Admin Notifications */}
                <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-border-light dark:border-white/10">
                    <h2 className="text-lg font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-600">admin_panel_settings</span>
                        Notificações do Administrador
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-1">
                                Email para Avisos
                            </label>
                            <input
                                type="email"
                                value={adminNotifications.admin_email}
                                onChange={(e) => setAdminNotifications({ ...adminNotifications, admin_email: e.target.value })}
                                className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                                placeholder="admin@seudominio.com.br"
                            />
                            <p className="mt-1 text-xs text-text-secondary">
                                Receba notificações de compras e cadastros neste email
                            </p>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-border-light dark:border-white/10">
                            <label className="flex items-center justify-between p-4 bg-background-light dark:bg-black/20 rounded-xl cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-green-600">shopping_cart</span>
                                    <div>
                                        <span className="font-bold text-text-main dark:text-white">Nova Compra</span>
                                        <p className="text-xs text-text-secondary">Receber email quando uma compra for realizada</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setAdminNotifications({ ...adminNotifications, notify_on_purchase: !adminNotifications.notify_on_purchase })}
                                    className={`w-12 h-7 rounded-full transition-colors ${adminNotifications.notify_on_purchase ? 'bg-primary' : 'bg-gray-300 dark:bg-white/20'}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${adminNotifications.notify_on_purchase ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </label>

                            <label className="flex items-center justify-between p-4 bg-background-light dark:bg-black/20 rounded-xl cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-blue-600">person_add</span>
                                    <div>
                                        <span className="font-bold text-text-main dark:text-white">Novo Cadastro</span>
                                        <p className="text-xs text-text-secondary">Receber email quando um cliente se cadastrar</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setAdminNotifications({ ...adminNotifications, notify_on_registration: !adminNotifications.notify_on_registration })}
                                    className={`w-12 h-7 rounded-full transition-colors ${adminNotifications.notify_on_registration ? 'bg-primary' : 'bg-gray-300 dark:bg-white/20'}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${adminNotifications.notify_on_registration ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Test Email */}
                <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-border-light dark:border-white/10">
                    <h2 className="text-lg font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-purple-600">send</span>
                        Testar Configurações
                    </h2>
                    <p className="text-sm text-text-secondary mb-4">
                        Envie um email de teste para verificar se as configurações estão corretas.
                    </p>
                    <button
                        onClick={handleTestEmail}
                        disabled={testing || !smtpSettings.smtp_user || !smtpSettings.smtp_password}
                        className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl disabled:opacity-50 flex items-center gap-2"
                    >
                        {testing ? (
                            <>
                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                Enviando...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">send</span>
                                Enviar Email de Teste
                            </>
                        )}
                    </button>
                </section>
            </main>

            <AdminBottomNav />
        </div>
    );
};

export default NotificationSettings;
