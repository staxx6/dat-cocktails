import { Ingredient } from "./i-ingredient";

// export enum MeasuringUnit {
//     cl = "cl",
//     ml = "ml",
//     oz = "oz",
//     g = "g",
//     kg = "kg",
//     BL = "BL",
//     tl = "tl", // Teelöffel
//     gtl = "gtl", // gestrichener Teelöffel
//     drop = "drop", // Für Bitters
//     piece = "Stück",
//     none = ""
// }

export interface RecipeStep {
    orderNumber: number
    text: string,
    picture?: string,
    pictureB64?: string,
    pictureUrl?: string,
}

export interface Recipe {
    id: number,
    name: string,
    active: boolean,
    pictureB64?: string,
    pictureFileIdWithExt?: string,
    recipeIngredients: RecipeIngredient[],
    garnishes?: Ingredient[],
    steps: RecipeStep[],
    history?: string,
    comment?: string,
    origin?: string;
    description?: string;
    tags?: string[]
}

export interface RecipeIngredient {
    // recipe: Recipe,
    ingredientId: number,
    measuringUnitId: number,
    amount: number
}
