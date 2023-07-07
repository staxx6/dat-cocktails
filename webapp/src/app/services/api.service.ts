import { Injectable } from '@angular/core';

import { IApiService, IngredientFilter, RecipeFilter } from './i-api-service';
import { MeasuringUnit, Recipe, RecipeIngredient } from '../shared/i-recipe';
import { Ingredient } from '../shared/i-ingredient';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService implements IApiService {

  private readonly _baseUrl = 'http://localhost:8000';

  // private _recipes: Recipe[];
  // private _ingredients: Ingredient[];

  constructor(
    private _http: HttpClient
  ) {
    // this._recipes = this.loadRecipes();
    // this._ingredients = this.loadIngredients();
  }

  public getRecipes(filter: RecipeFilter): Recipe[] {
    // const foundRecipes: Recipe[] = [];
    // if (filter.id) {
    //   const foundRecipe = this._recipes.find(recipe => recipe.id === filter.id);
    //   foundRecipes.push(foundRecipe ?? {} as Recipe);
    // } else {
    //   throw new Error("Geht nur Filter mit id!");
    // }
    // return foundRecipes;
    const a: Recipe[] = [];
    return a;
  }

  getAllRecipes(): Recipe[] {
    // return this._recipes;
    const a: Recipe[] = [];
    return a;
  }

  private loadRecipes(): Recipe[] {
    //
    // if (!recipesJson) {
    //   throw new Error("No Reciepts found");
    // }
    //
    // if (!Array.isArray(recipesJson)) {
    //   throw new Error("Recieps json is not an array");
    // }
    //
    // const loadedRecipes: Recipe[] = [];
    //
    // recipesJson.forEach(recipe => {
    //   const newRecipe = {} as Recipe;
    //   newRecipe.id = recipe.id;
    //   newRecipe.name = recipe.name;
    //   newRecipe.active = recipe.active;
    //   newRecipe.recipeIngredients = [];
    //   recipe.recipeIngredients.forEach(recipeIngredient => {
    //     const newRecipeIngredient = {} as RecipeIngredient;
    //     newRecipeIngredient.ingredientId = recipeIngredient.ingredientId;
    //     newRecipeIngredient.amount = recipeIngredient.amount;
    //     newRecipeIngredient.measuringUnit = MeasuringUnit[recipeIngredient.measuringUnit as keyof typeof MeasuringUnit];
    //     newRecipe.recipeIngredients.push(newRecipeIngredient);
    //   });
    //   newRecipe.steps = recipe.steps;
    //
    //   loadedRecipes.push(newRecipe);
    // })
    //
    // return loadedRecipes;
    const a: Recipe[] = [];
    return a;
  }

  public getIngredients(filter: IngredientFilter): Ingredient[] {

    // return this._ingredients.filter(ingredient => {
    //
    //   let matchTags = true;
    //   if (ingredient.tags && Array.isArray(ingredient.tags) && filter.tags && Array.isArray(filter.tags)) {
    //     if (ingredient.tags.length !== filter.tags.length) {
    //       matchTags = false;
    //     }
    //     ingredient.tags.forEach(tag => {
    //       if (!filter.tags?.every(filterTag => ingredient.tags?.includes(filterTag))) {
    //         matchTags = false;
    //       }
    //     })
    //   }
    //
    //   return filter.id ? ingredient.id === filter.id : true
    //     && filter.name ? ingredient.name === filter.name : true
    //   && matchTags
    // })
    const a: Ingredient[] = [];
    return a;
  }


  private loadIngredients(): Ingredient[] {
    // if (!ingredientsJson) {
    //   throw new Error("No Reciepts found");
    // }
    //
    // if (!Array.isArray(ingredientsJson)) {
    //   throw new Error("Recieps json is not an array");
    // }
    //
    // const newIngredientArr: Ingredient[] = [];
    //
    // ingredientsJson.forEach(ingredient => {
    //   const newIngredient = {} as Ingredient;
    //   newIngredient.id = ingredient.id;
    //   newIngredient.name = ingredient.name;
    //   newIngredientArr.push(newIngredient);
    // })
    //
    // return newIngredientArr;
    const a: Ingredient[] = [];
    return a;
  }

  getAllIngredients$(): Observable<Ingredient[]> {
    return this._http.get<Ingredient[]>(this._baseUrl + '/allIngredients');
  }
}
