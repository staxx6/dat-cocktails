import { Ingredient } from "./i-ingredient";

export enum MeasuringUnit {
    cl,
    ml,
    oz,
    g,
    kg,
    BL,
    none
}

export interface RecipeStep {
    orderNumber: number
    text: string,
    picture?: string
}

export interface Recipe {
    id: number,
    name: string,
    picture?: string,
    recipeIngredients: RecipeIngredient[],
    garnishes?: Ingredient[],
    steps: RecipeStep[],
    history?: string,
    comment?: string,
    origin?: string;
    tags?: string[]
}

export interface RecipeIngredient {
    // recipe: Recipe,
    ingredientId: number,
    measuringUnit: MeasuringUnit,
    amount: number
}