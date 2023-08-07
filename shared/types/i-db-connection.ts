import {Recipe} from "./i-recipe";
import {IFilter, IngredientFilter, RecipeFilter} from "./i-filter";
import {Ingredient} from "./i-ingredient";
import {MeasuringUnit, MeasuringUnitFilter} from "./i-measuring-unit";

/**
 * No need to be in shared
 */
export interface IDbConnection {
  connect(): Promise<boolean>;

  getAll(): Promise<any[]>;

  get(filter: IFilter): Promise<any[]>;

  getRecipes(filter: RecipeFilter): Promise<Recipe[]>;

  updateRecipe(recipe: Recipe): Promise<boolean>;

  createRecipe(recipe: Recipe): Promise<number>;

  deleteRecipe(id: number): Promise<boolean>;

  updateIngredient(ingredient: Ingredient): Promise<boolean>;

  createIngredient(ingredient: Ingredient): Promise<number>;

  deleteIngredient(id: number): Promise<boolean>;

  getAllRecipes(): Promise<Recipe[]>;

  getIngredients(filter: IngredientFilter): Promise<Ingredient[]>;

  getAllIngredients(): Promise<Ingredient[]>;

  getMeasuringUnits(filter: MeasuringUnitFilter): Promise<MeasuringUnit[]>;
}
