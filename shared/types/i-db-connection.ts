import { Recipe } from "./i-recipe";
import { IFilter, IngredientFilter } from "./i-filter";
import { Ingredient } from "./i-ingredient";

/**
 * No need to be in shared
 */
export interface IDbConnection {
    connect(): Promise<boolean>;

    getAll(): Promise<any[]>;

    get(filter: IFilter): Promise<any[]>;

    getAllRecipes(): Promise<Recipe[]>;

    getIngredients(filter: IngredientFilter): Promise<Ingredient[]>;

    getAllIngredients(): Promise<Ingredient[]>;
}
