import { Criteria, SelectedRubric } from '@/types/rubrics'
import { create } from 'zustand'

interface RubricStore {
    rubric: SelectedRubric
    criteria: Criteria[]
    setCriteria: (criteria: Criteria[]) => void
    setRubric: (rubric: SelectedRubric) => void
    resetCriteria: () => void
}

export const useRubricStore = create<RubricStore>((set) => ({
    rubric: {
        id: 0,
        name: '',
        category: '',
        grade: '',
        intensity: '',
        language: '',
        created_by: '',
    },
    criteria: [],

    setCriteria: (newCriteria) => set({ criteria: newCriteria }),
    setRubric: (newRubric) => set({ rubric: newRubric }),
    resetCriteria: () =>
        set({
            criteria: [],
            rubric: {
                id: 0,
                name: '',
                category: '',
                grade: '',
                intensity: '',
                language: '',
                created_by: '',
            },
        }),
}))
