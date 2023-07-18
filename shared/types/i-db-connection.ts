import { Recipe } from "./i-recipe";
import { IFilter, IngredientFilter, RecipeFilter } from "./i-filter";
import { Ingredient } from "./i-ingredient";

/**
 * No need to be in shared
 */
export interface IDbConnection {
    connect(): Promise<boolean>;

    getAll(): Promise<any[]>;

    get(filter: IFilter): Promise<any[]>;

    getRecipes(filter: RecipeFilter): Promise<Recipe[]>;

    updateRecipe(recipe: Recipe): Promise<boolean>;

    getAllRecipes(): Promise<Recipe[]>;

    getIngredients(filter: IngredientFilter): Promise<Ingredient[]>;

    getAllIngredients(): Promise<Ingredient[]>;
}
