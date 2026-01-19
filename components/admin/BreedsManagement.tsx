import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';

interface Breed {
    id: string;
    name: string;
    pet_type: 'dog' | 'cat';
}

interface BreedsManagementProps {
    isOpen: boolean;
    onClose: () => void;
}

const BreedsManagement: React.FC<BreedsManagementProps> = ({ isOpen, onClose }) => {
    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [loading, setLoading] = useState(true);
    const [newBreedName, setNewBreedName] = useState('');
    const [newBreedType, setNewBreedType] = useState<'dog' | 'cat'>('dog');
    const [filter, setFilter] = useState<'all' | 'dog' | 'cat'>('all');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchBreeds();
        }
    }, [isOpen]);

    const fetchBreeds = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('breeds')
            .select('*')
            .order('pet_type', { ascending: true })
            .order('name', { ascending: true });

        if (!error && data) {
            setBreeds(data);
        }
        setLoading(false);
    };

    const handleAddBreed = async () => {
        if (!newBreedName.trim()) return;
        setSaving(true);

        const { error } = await supabase
            .from('breeds')
            .insert([{ name: newBreedName.trim(), pet_type: newBreedType }] as any);

        if (!error) {
            setNewBreedName('');
            fetchBreeds();
        }
        setSaving(false);
    };

    const handleDeleteBreed = async (id: string) => {
        const { error } = await supabase.from('breeds').delete().eq('id', id);
        if (!error) {
            fetchBreeds();
        }
    };

    const filteredBreeds = filter === 'all' ? breeds : breeds.filter(b => b.pet_type === filter);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-surface-light dark:bg-background-dark rounded-3xl shadow-2xl overflow-hidden border border-border-light dark:border-white/10 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-border-light dark:border-white/10 flex justify-between items-center bg-surface-light dark:bg-surface-dark">
                    <h2 className="text-lg font-bold text-text-main dark:text-white">Gerenciar Raças</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Add New Breed */}
                <div className="p-4 border-b border-border-light dark:border-white/10 bg-primary/5 dark:bg-primary/10">
                    <p className="text-xs font-bold text-primary mb-3 uppercase tracking-wide">Adicionar Nova Raça</p>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={newBreedName}
                                onChange={(e) => setNewBreedName(e.target.value)}
                                placeholder="Nome da raça..."
                                className="w-full h-10 px-3 rounded-lg bg-white dark:bg-black/30 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white text-sm"
                            />
                        </div>
                        <select
                            value={newBreedType}
                            onChange={(e) => setNewBreedType(e.target.value as 'dog' | 'cat')}
                            className="h-10 px-3 rounded-lg bg-white dark:bg-black/30 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white text-sm"
                        >
                            <option value="dog">🐶 Cão</option>
                            <option value="cat">🐱 Gato</option>
                        </select>
                        <button
                            onClick={handleAddBreed}
                            disabled={saving || !newBreedName.trim()}
                            className="h-10 px-4 bg-primary text-white font-bold rounded-lg disabled:opacity-50 flex items-center gap-1"
                        >
                            {saving ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> : <span className="material-symbols-outlined text-sm">add</span>}
                        </button>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 p-4 border-b border-border-light dark:border-white/10">
                    {(['all', 'dog', 'cat'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === type ? 'bg-primary text-white' : 'bg-black/5 dark:bg-white/5 text-text-secondary hover:bg-black/10 dark:hover:bg-white/10'}`}
                        >
                            {type === 'all' ? '🐾 Todos' : type === 'dog' ? '🐶 Cães' : '🐱 Gatos'}
                        </button>
                    ))}
                </div>

                {/* Breeds List */}
                <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
                        </div>
                    ) : filteredBreeds.length === 0 ? (
                        <div className="text-center py-8 text-text-secondary">
                            Nenhuma raça encontrada.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredBreeds.map((breed) => (
                                <div
                                    key={breed.id}
                                    className="flex items-center justify-between p-3 bg-white dark:bg-black/20 rounded-xl border border-border-light dark:border-white/5"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{breed.pet_type === 'dog' ? '🐶' : '🐱'}</span>
                                        <span className="font-medium text-text-main dark:text-white">{breed.name}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteBreed(breed.id)}
                                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border-light dark:border-white/10 bg-surface-light dark:bg-surface-dark">
                    <p className="text-xs text-text-secondary text-center">
                        {breeds.length} raças cadastradas ({breeds.filter(b => b.pet_type === 'dog').length} cães, {breeds.filter(b => b.pet_type === 'cat').length} gatos)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BreedsManagement;
