import { Ingredient } from "./i-ingredient";

export enum MeasuringUnit {
    cl = "cl",
    ml = "ml",
    oz = "oz",
    g = "g",
    kg = "kg",
    BL = "BL",
    tl = "tl", // Teelöffel
    gtl = "gtl", // gestrichener Teelöffel
    drop = "drop", // Für Bitters
    piece = "Stück",
    none = ""
}

export interface RecipeStep {
    orderNumber: number
    text: string,
    picture?: string
}

export interface Recipe {
    id: number,
    name: string,
    active: boolean,
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
