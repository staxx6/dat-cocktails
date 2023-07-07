import { Recipe } from "./i-recipe";
import { IFilter, IngredientFilter } from "./i-filter";
import { Ingredient } from "./i-ingredient";

export interface IDbConnection {
    connect(): Promise<boolean>;

    getAll(): Promise<any[]>;

    get(filter: IFilter): Promise<any[]>;

    getAllRecipes(): Recipe[];

    getIngredients(filter: IngredientFilter): Ingredient[];

    getAllIngredients(): Promise<Ingredient[]>;
}
