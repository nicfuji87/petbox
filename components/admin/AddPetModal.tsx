import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';

interface Pet {
    id?: string;
    client_id: string;
    name: string;
    type: string;
    breed: string;
    size: string;
    birth_date?: string;
    gender?: string;
    allergies?: string[];
    restrictions?: string;
}

interface Breed {
    id: string;
    name: string;
    pet_type: 'dog' | 'cat';
}

interface AddPetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    clientId: string;
    editPet?: Pet | null;
}

const PET_TYPES = [
    { value: 'dog', label: '🐶 Cachorro', icon: '🐶' },
    { value: 'cat', label: '🐱 Gato', icon: '🐱' },
];

const PET_SIZES = [
    { value: 'small', label: 'Pequeno', description: 'Até 10kg' },
    { value: 'medium', label: 'Médio', description: '10-25kg' },
    { value: 'large', label: 'Grande', description: 'Acima de 25kg' },
];

const ALLERGY_OPTIONS = ['Nenhuma', 'Frango', 'Carne Bovina', 'Glúten', 'Corantes', 'Laticínios'];

const AddPetModal: React.FC<AddPetModalProps> = ({ isOpen, onClose, onSuccess, clientId, editPet }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [formData, setFormData] = useState<Pet>({
        client_id: clientId,
        name: '',
        type: 'dog',
        breed: '',
        size: 'medium',
        birth_date: '',
        gender: 'male',
        allergies: [],
        restrictions: '',
    });

    useEffect(() => {
        if (isOpen) {
            fetchBreeds();
        }
    }, [isOpen]);

    useEffect(() => {
        if (editPet) {
            setFormData({
                ...editPet,
                birth_date: editPet.birth_date || '',
                gender: editPet.gender || 'male',
                allergies: editPet.allergies || [],
                restrictions: editPet.restrictions || '',
            });
        } else {
            setFormData({
                client_id: clientId,
                name: '',
                type: 'dog',
                breed: '',
                size: 'medium',
                birth_date: '',
                gender: 'male',
                allergies: [],
                restrictions: '',
            });
        }
    }, [editPet, clientId, isOpen]);

    const fetchBreeds = async () => {
        const { data, error: fetchError } = await supabase
            .from('breeds')
            .select('*')
            .order('name', { ascending: true });

        if (!fetchError && data) {
            setBreeds(data);
        }
    };

    const filteredBreeds = breeds.filter(b => b.pet_type === formData.type);

    const handleAllergyToggle = (allergy: string) => {
        setFormData(prev => {
            const currentAllergies = prev.allergies || [];
            const hasAllergy = currentAllergies.includes(allergy);
            if (allergy === 'Nenhuma') {
                return { ...prev, allergies: hasAllergy ? [] : ['Nenhuma'] };
            }
            let newAllergies = currentAllergies.filter(a => a !== 'Nenhuma');
            if (hasAllergy) {
                newAllergies = newAllergies.filter(a => a !== allergy);
            } else {
                newAllergies = [...newAllergies, allergy];
            }
            return { ...prev, allergies: newAllergies };
        });
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = {
                ...formData,
                client_id: clientId,
                birth_date: formData.birth_date || null,
                allergies: formData.allergies?.length ? formData.allergies : null,
                restrictions: formData.restrictions || null,
            };

            if (editPet?.id) {
                const { error: updateError } = await supabase
                    .from('pets')
                    .update(payload)
                    .eq('id', editPet.id);

                if (updateError) throw updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('pets')
                    .insert([payload] as any);

                if (insertError) throw insertError;
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar pet');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-surface-light dark:bg-background-dark rounded-3xl shadow-2xl overflow-hidden border border-border-light dark:border-white/10 max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-border-light dark:border-white/10 flex justify-between items-center bg-surface-light dark:bg-surface-dark sticky top-0 z-10">
                    <h2 className="text-lg font-bold text-text-main dark:text-white">
                        {editPet ? 'Editar Pet' : 'Novo Pet'}
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Pet Name */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-1 uppercase tracking-wide">
                            Nome do Pet
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            placeholder="Ex: Rex, Luna..."
                            className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white"
                        />
                    </div>

                    {/* Pet Type */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-2 uppercase tracking-wide">
                            Tipo
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {PET_TYPES.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: type.value, breed: '' })}
                                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.type === type.value
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border-light dark:border-white/10 text-text-secondary hover:border-primary/50'
                                        }`}
                                >
                                    <span className="text-3xl">{type.icon}</span>
                                    <span className="text-sm font-bold">{type.label.split(' ')[1]}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Breed Dropdown */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-1 uppercase tracking-wide">
                            Raça
                        </label>
                        <select
                            value={formData.breed}
                            onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                            className="w-full h-11 px-4 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white appearance-none"
                        >
                            <option value="">Selecione a raça...</option>
                            {filteredBreeds.map((breed) => (
                                <option key={breed.id} value={breed.name}>
                                    {breed.name}
                                </option>
                            ))}
                        </select>
                        {filteredBreeds.length === 0 && (
                            <p className="text-xs text-text-secondary mt-1">Nenhuma raça cadastrada para este tipo.</p>
                        )}
                    </div>

                    {/* Size */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-2 uppercase tracking-wide">
                            Porte
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {PET_SIZES.map((size) => (
                                <button
                                    key={size.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, size: size.value })}
                                    className={`p-3 rounded-xl border-2 transition-all text-center ${formData.size === size.value
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border-light dark:border-white/10 text-text-secondary hover:border-primary/50'
                                        }`}
                                >
                                    <span className="text-sm font-bold block">{size.label}</span>
                                    <span className="text-[10px] opacity-70">{size.description}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-2 uppercase tracking-wide">
                            Sexo
                        </label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, gender: 'male' })}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all ${formData.gender === 'male'
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border-light dark:border-white/10 text-text-secondary hover:border-primary/50'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-xl">male</span>
                                <span className="text-sm font-bold">Macho</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, gender: 'female' })}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all ${formData.gender === 'female'
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border-light dark:border-white/10 text-text-secondary hover:border-primary/50'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-xl">female</span>
                                <span className="text-sm font-bold">Fêmea</span>
                            </button>
                        </div>
                    </div>

                    {/* Allergies */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-2 uppercase tracking-wide">
                            Alergias
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {ALLERGY_OPTIONS.map((allergy) => {
                                const isSelected = formData.allergies?.includes(allergy) || false;
                                return (
                                    <button
                                        key={allergy}
                                        type="button"
                                        onClick={() => handleAllergyToggle(allergy)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${isSelected
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-border-light dark:border-white/10 text-text-secondary hover:border-primary/50'
                                            }`}
                                    >
                                        {allergy}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Restrictions */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary dark:text-text-dark-secondary mb-1 uppercase tracking-wide">
                            Restrições (opcional)
                        </label>
                        <textarea
                            value={formData.restrictions || ''}
                            onChange={(e) => setFormData({ ...formData, restrictions: e.target.value })}
                            placeholder="Ex: Não pode comer ossos, problema de pele..."
                            rows={2}
                            className="w-full px-4 py-3 rounded-xl bg-background-light dark:bg-black/20 border border-border-light dark:border-white/10 focus:border-primary focus:outline-none text-text-main dark:text-white resize-none"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-xs p-2 bg-red-500/10 rounded-lg">{error}</div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>}
                        {editPet ? 'Salvar Alterações' : 'Cadastrar Pet'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddPetModal;

