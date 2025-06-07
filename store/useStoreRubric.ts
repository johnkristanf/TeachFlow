import { Criterion } from '@/types/rubrics'
import { create } from 'zustand'

interface RubricStore {
    rubric: {
        name: string;
        created_by: string;
    };
    criteria: Criterion[];
    setCriteria: (criteria: Criterion[]) => void;
    setRubric: (rubric: { name: string; created_by: string }) => void;
    resetCriteria: () => void;
}

export const useRubricStore = create<RubricStore>((set) => ({
    rubric: {
        name: '',
        created_by: '',
    },
    criteria: [],

    setCriteria: (newCriteria) => set({ criteria: newCriteria }),
    setRubric: (newRubric) => set({ rubric: newRubric }),
    resetCriteria: () =>
        set({
            criteria: [],
            rubric: {
                name: '',
                created_by: '',
            },
        }),
}))
