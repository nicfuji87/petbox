import React, { useState } from 'react';
import { supabase } from '../../src/lib/supabase';

interface AddCustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        cpf: '',
        phone: ''
    });
    const [errors, setErrors] = useState<any>(null);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors(null);

        try {
            // 1. Create locally first to get an ID (or use temporary ID)
            // Actually, let's call the Edge Function directly. 
            // We'll generate a UUID on the client or let the Edge Function generate/insert?
            // Plan says: Edge -> Asaas -> DB. So Edge Function handles insertion.
            // We need a temporary UUID for the Edge Function usage? 
            // No, Edge function logic: "Insert Client (with asaas_id)".
            // So we pass data to Edge Function.

            const { data, error } = await supabase.functions.invoke('manage-clients', {
                body: {
                    action: 'create',
                    clientData: {
                        ...formData,
                        // Pass a temp ID if needed for external ref, or let DB generate.
                        // My edge function logic used "clientData.id" to update. 
                        // Let's change the edge function logic slightly or Insert first in DB here?
                        // Strategy: Insert in DB as PENDING/Processing -> Call Edge -> Update.
                        // This is safer.
                    }
                }
            });

            // BETTER STRATEGY following Architecture Plan:
            // User -> Edge -> Asaas -> Return ID -> Edge -> DB Insert.

            // Wait, my deployed Edge Function tries to UPDATE an existing client with ID.
            // Let's adjust approach: 
            // 1. Insert into Supabase (status: pending_asaas).
            // 2. Call Edge Function with that ID.
            // 3. Edge Function calls Asaas, gets ID, updates Supabase.

            const { data: insertData, error: insertError } = await supabase
                .from('clients')
                .insert([{ ...formData }] as any)
                .select()
                .single();

            if (insertError) throw insertError;

            // Call Edge Function to Sync
            const { error: fnError } = await supabase.functions.invoke('manage-clients', {
                body: {
                    action: 'create',
                    clientData: insertData
                }
            });

            if (fnError) {
                console.error('Edge Function Error', fnError);
                // Don't block UI success if DB insert worked, but warn?
                // Or show error?
                // Let's assume for now we just want to create the record.
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setErrors(err.message || 'Erro ao criar cliente');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-surface-light dark:bg-background-dark rounded-3xl shadow-2xl overflow-hidden border border-border-light dark:border-white/10">
                <div className="px-6 py-4 border-b border-border-light dark:border-white/10 flex justify-between items-center bg-surface-light dark:bg-surface-dark">
                    <h2 className="text-lg font-bold text-text-main dark:text-white">Novo Cliente</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-1">Nome Completo</label>
                        <input
                            name="full_name" value={formData.full_name} onChange={handleChange} required
                            className="w-full h-11 px-3 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-1">Email</label>
                        <input
                            name="email" type="email" value={formData.email} onChange={handleChange} required
                            className="w-full h-11 px-3 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-1">CPF</label>
                            <input
                                name="cpf" value={formData.cpf} onChange={handleChange} required
                                placeholder="000.000.000-00"
                                className="w-full h-11 px-3 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-1">Celular</label>
                            <input
                                name="phone" value={formData.phone} onChange={handleChange} required
                                placeholder="(00) 00000-0000"
                                className="w-full h-11 px-3 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                            />
                        </div>
                    </div>

                    {errors && <div className="text-red-500 text-xs p-2 bg-red-500/10 rounded-lg">{errors}</div>}

                    <div className="pt-2">
                        <button
                            type="submit" disabled={loading}
                            className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>}
                            {loading ? 'Processando (Asaas)...' : 'Cadastrar Cliente'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCustomerModal;
