import React, { useState } from 'react';

interface SyncAsaasModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SyncAsaasModal: React.FC<SyncAsaasModalProps> = ({ isOpen, onClose }) => {
    const [logs, setLogs] = useState<string[]>([]);
    const [showLogs, setShowLogs] = useState(false);
    const [isConnected, setIsConnected] = useState(true); // Mock connection status

    if (!isOpen) return null;

    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs((prev) => [`[${timestamp}] ${message}`, ...prev]);
    };

    const handleSyncAction = (actionName: string) => {
        addLog(`Iniciando: ${actionName}...`);
        // Simulate API call
        setTimeout(() => {
            addLog(`Sucesso: ${actionName} concluído.`);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-surface-light dark:bg-background-dark rounded-3xl shadow-2xl overflow-hidden border border-border-light dark:border-white/10 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-5 border-b border-border-light dark:border-white/10 flex items-center justify-between bg-surface-light dark:bg-surface-dark">
                    <div>
                        <h2 className="text-xl font-bold text-text-main dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">sync_alt</span>
                            Central de Sincronização Asaas
                        </h2>
                        <p className="text-xs text-text-secondary dark:text-text-dark-secondary mt-1 flex items-center gap-1">
                            Status da API:
                            <span className={`font-bold ${isConnected ? 'text-primary' : 'text-red-500'}`}>
                                {isConnected ? 'Conectado' : 'Desconectado'}
                            </span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-text-secondary dark:text-text-dark-secondary"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    <div className="grid gap-6">

                        {/* Clientes Section */}
                        <section>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary dark:text-text-dark-secondary mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">group</span> Clientes
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleSyncAction('Sincronizar Dados de Clientes')}
                                    className="flex items-center gap-3 p-4 rounded-xl border border-border-light dark:border-white/10 bg-white dark:bg-surface-dark hover:border-primary/50 transition-all group text-left"
                                >
                                    <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">download</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-main dark:text-white text-sm">Sincronizar Dados</p>
                                        <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Atualizar base local com Asaas</p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleSyncAction('Enviar Novos Clientes')}
                                    className="flex items-center gap-3 p-4 rounded-xl border border-border-light dark:border-white/10 bg-white dark:bg-surface-dark hover:border-primary/50 transition-all group text-left"
                                >
                                    <div className="size-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">upload</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-main dark:text-white text-sm">Enviar Novos</p>
                                        <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Disparar novos cadastros</p>
                                    </div>
                                </button>
                            </div>
                        </section>

                        {/* Cobranças Section */}
                        <section>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary dark:text-text-dark-secondary mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">payments</span> Cobranças & Assinaturas
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleSyncAction('Gerar Cobranças do Ciclo')}
                                    className="flex items-center gap-3 p-4 rounded-xl border border-border-light dark:border-white/10 bg-white dark:bg-surface-dark hover:border-primary/50 transition-all group text-left"
                                >
                                    <div className="size-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">add_card</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-main dark:text-white text-sm">Gerar Cobranças</p>
                                        <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Processar ciclo atual</p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleSyncAction('Atualizar Vencidas')}
                                    className="flex items-center gap-3 p-4 rounded-xl border border-border-light dark:border-white/10 bg-white dark:bg-surface-dark hover:border-primary/50 transition-all group text-left"
                                >
                                    <div className="size-10 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">event_busy</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-main dark:text-white text-sm">Atualizar Vencidas</p>
                                        <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Verificar status pendentes</p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleSyncAction('Sincronizar Assinaturas')}
                                    className="flex items-center gap-3 p-4 rounded-xl border border-border-light dark:border-white/10 bg-white dark:bg-surface-dark hover:border-primary/50 transition-all group text-left"
                                >
                                    <div className="size-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">autorenew</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-main dark:text-white text-sm">Sincronizar Assinaturas</p>
                                        <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Status de recorrência</p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleSyncAction('Cancelar Cobrança')}
                                    className="flex items-center gap-3 p-4 rounded-xl border border-border-light dark:border-white/10 bg-white dark:bg-surface-dark hover:border-red-500/50 transition-all group text-left"
                                >
                                    <div className="size-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">cancel</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-main dark:text-white text-sm">Cancelar Cobrança</p>
                                        <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Remover pendência</p>
                                    </div>
                                </button>
                            </div>
                        </section>

                        {/* Sistema Section */}
                        <section>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary dark:text-text-dark-secondary mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">settings_suggest</span> Sistema
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleSyncAction('Importar Pagamentos (Conciliação)')}
                                    className="flex items-center gap-3 p-4 rounded-xl border border-border-light dark:border-white/10 bg-white dark:bg-surface-dark hover:border-primary/50 transition-all group text-left"
                                >
                                    <div className="size-10 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">fact_check</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-main dark:text-white text-sm">Importar Pagamentos</p>
                                        <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Conciliação manual</p>
                                    </div>
                                </button>
                            </div>
                        </section>

                    </div>

                    {/* Logs Section Toggle */}
                    <div className="mt-6 pt-4 border-t border-border-light dark:border-white/10">
                        <button
                            onClick={() => setShowLogs(!showLogs)}
                            className="flex items-center gap-2 text-xs font-bold text-text-secondary dark:text-text-dark-secondary hover:text-primary transition-colors mb-2"
                        >
                            <span className="material-symbols-outlined text-base">terminal</span>
                            {showLogs ? 'Ocultar Logs' : 'Ver Logs de Execução'}
                        </button>

                        {showLogs && (
                            <div className="bg-black/90 rounded-xl p-4 font-mono text-xs text-green-400 h-48 overflow-y-auto border border-white/10 shadow-inner">
                                {logs.length === 0 ? (
                                    <span className="text-gray-500 italic">Nenhuma atividade recente...</span>
                                ) : (
                                    logs.map((log, index) => (
                                        <div key={index} className="mb-1 border-b border-white/5 last:border-0 pb-1">{log}</div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SyncAsaasModal;
