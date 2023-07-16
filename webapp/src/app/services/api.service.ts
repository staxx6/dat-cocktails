import {Injectable} from '@angular/core';

import {IApiService, IngredientFilter, RecipeFilter} from './i-api-service';
import {MeasuringUnit, Recipe, RecipeIngredient} from '../shared/i-recipe';
import {Ingredient} from '../shared/i-ingredient';
import {HttpClient} from "@angular/common/http";
import {debounce, delay, interval, map, Observable, of, retryWhen, switchMap, takeWhile, tap} from "rxjs";

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

  private _cachedRecipesRequests = new Map<number, Recipe[]>();
  private _pendingRecipesRequests: number[] = [];

  private getCachedRecipesRequest(filter: RecipeFilter): Observable<Recipe[] | undefined> {
    const filterString = JSON.stringify(filter);
    const filterHash = this.hashCode(filterString);
    return interval(100).pipe(
      map(() => this._pendingRecipesRequests[filterHash]),
      takeWhile(res => res === undefined),
      tap(res => {
        if (res !== undefined) {
          console.log("DAS SOLLTE NICHT SEIN!!!!")
        }
      }),
      map(() => this._cachedRecipesRequests.get(filterHash))
    )
  }

  private cacheRecipesRequest(filter: IngredientFilter, result: Recipe[]): void {
    const filterString = JSON.stringify(filter);
    const filterHash = this.hashCode(filterString);
    this._cachedRecipesRequests.set(filterHash, result);
    if (this._pendingRecipesRequests[filterHash]) {
      this._pendingRecipesRequests.slice(filterHash);
    }
  }

  public getRecipes$(filter: RecipeFilter): Observable<Recipe[]> {
    return this.getCachedRecipesRequest(filter).pipe(
      switchMap(res => {
        if (res) {
          return of(res)
        }
        const filterString = JSON.stringify(filter);
        const filterHash = this.hashCode(filterString);
        this._pendingRecipesRequests.push(filterHash);
        return this._http.post<Recipe[]>(this._baseUrl + '/recipes', filter).pipe(
          tap(res => {
            this.cacheRecipesRequest(filter, res);
            this._pendingRecipesRequests.splice(filterHash);
          })
        );
      }),
    );
    // return this._http.post<Recipe[]>(this._baseUrl + '/recipes', filter).pipe(
    //   tap(res => this.cacheRecipesRequest(filter, res))
    // );
    // const foundRecipes: Recipe[] = [];
    // if (filter.id) {
    //   const foundRecipe = this._recipes.find(recipe => recipe.id === filter.id);
    //   foundRecipes.push(foundRecipe ?? {} as Recipe);
    // } else {
    //   throw new Error("Geht nur Filter mit id!");
    // }
    // return foundRecipes;
  }

  getAllRecipes$(): Observable<Recipe[]> {
    return this.getRecipes$({});
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

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
      let chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  private _cachedIngredientsRequests = new Map<number, Ingredient[]>();
  private _pendingIngredientsRequests = new Set<number>;

  private getCachedIngredientsRequest(filter: IngredientFilter): Observable<Ingredient[] | undefined> {
    const filterString = JSON.stringify(filter);
    const filterHash = this.hashCode(filterString);
    return of(this._cachedIngredientsRequests.get(filterHash));
    // return interval(100).pipe(
    //   delay(50),
    //   map(() => this._pendingIngredientsRequests[filterHash]),
    //   takeWhile(res => res === undefined),
    //   tap(res => {
    //     if (res !== undefined) {
    //       console.log("DAS SOLLTE NICHT SEIN!!!!")
    //     }
    //   }),
    //   map(() => this._cachedIngredientsRequests.get(filterHash))
    // )
  }

  private cacheIngredientsRequest(filter: IngredientFilter, result: Ingredient[]): void {
    const filterString = JSON.stringify(filter);
    const filterHash = this.hashCode(filterString);
    this._cachedIngredientsRequests.set(filterHash, result);
  }

  public getIngredients$(filter: IngredientFilter): Observable<Ingredient[]> {
    const filterString = JSON.stringify(filter);
    const filterHash = this.hashCode(filterString);
    return this.getCachedIngredientsRequest(filter).pipe(
      switchMap(res => {
        if (res) {
          return of(res);
        }
        if (this._pendingIngredientsRequests.has(filterHash)) {
          return of([])
        }
        this._pendingIngredientsRequests.add(filterHash);
        return this._http.post<Ingredient[]>(this._baseUrl + '/ingredients', filter).pipe(
          tap(res => {
            this.cacheIngredientsRequest(filter, res);
            this._pendingIngredientsRequests.delete(filterHash);
          })
        );
      }),
    );

    // return this._ingredients.filter(ingredient => {
    //   return this._http.get<Ingredient[]>(this._baseUrl + '/allIngredients');
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
    return this.getIngredients$({});
  }
}
