export interface IDbConnection<T> {
    getAll(filter: any): Promise<T[]>;

    // getAllRecipes(): Recipe[];
    //
    // getIngredients(filter: IngredientFilter): Ingredient[];
    //
    // getAllIngredients(): Ingredient[];
}
