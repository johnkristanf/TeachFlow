export type Rubric = {
    id: number
    name: string
    grade: string
    intensity: string
    language: string
    category: string
    criteria: Criteria[]
    created_by: string
    createdAt: string
}

export interface Criteria {
    id?: number
    rubricId?: number
    title: string
    levels: Levels[]
}

export interface Levels {
    id?: number
    criterionId?: number
    label: string
    score: number
    description: string
}

export type SelectedRubric = {
    id: number
    name: string
    category: string
    grade: string
    intensity: string
    language: string
    created_by: string
}

export interface BuildWithAIRubricCreate {
    name: string
    grade: 'Elementary' | 'Middle School' | 'High School' | 'College'
    category:
        | 'Argumentative'
        | 'Descriptive'
        | 'Expository'
        | 'Narrative'
        | 'Analytical'
        | 'Reflective'
        | 'Compare & Contrast'
    intensity: 'Easy' | 'Normal' | 'Strict'
    language: 'US English' | 'UK English' | 'AUS English'
    criteria: { title: string }[]
}
