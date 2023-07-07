export interface IFilter {
    id?: number,
    name?: string,
    tags?: string[]
}

export interface RecipeFilter extends IFilter {
}

export interface IngredientFilter extends IFilter {
}
