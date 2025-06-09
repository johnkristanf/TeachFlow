export type Rubric = {
    id: number
    name: string
    grade: string
    intensity: string
    language: string
    created_by: string
    createdAt: string
}

export interface Level {
    id: number
    criterionId: number
    label: string
    score: number
    description: string
}

export interface Criterion {
    id: number
    rubricId: number
    title: string
    levels: Level[]
}

export interface RubricWithDetails {
    id: number
    name: string
    created_by: string
    criteria: Criterion[]
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

export type BuildWithAIRubric = {
    name?: string
    grade: string
    category: string
    intensity: string
    language: string
    criteria?: BuildWithAICriterion[]
}

export type BuildWithAICriterion = {
    title?: string
    levels?: BuildWithAILevel[]
}

export type BuildWithAILevel = {
    label?: string
    score?: number
    description?: string
}
