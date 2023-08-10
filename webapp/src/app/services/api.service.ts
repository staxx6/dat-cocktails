import {Injectable} from '@angular/core';

import {IApiService, IngredientFilter, RecipeFilter} from './i-api-service';
import {
  IFilter,
  Ingredient,
  RecipeIngredient,
  RecipeStep,
  Recipe,
  MeasuringUnit,
  MeasuringUnitFilter
} from 'dat-cocktails-types';
import {HttpClient, HttpParams} from "@angular/common/http";
import {catchError, delay, map, Observable, of, retry, Subject, switchMap, take, tap, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService implements IApiService {

  // private readonly _baseUrl = 'http://localhost:8000';
  private readonly _baseUrl = 'http://192.168.178.29:8000'; // LAN test


  private _cachedRecipesRequests = new Map<number, number[]>();
  private _cachedRecipes = new Map<number, Recipe>();
  private _pendingRecipesRequests = new Set<number>;
  recipesChanged$ = new Subject<null>();

  private _cachedIngredientsRequests = new Map<number, number[]>();
  private _cachedIngredients = new Map<number, Ingredient>();
  private _pendingIngredientsRequests = new Set<number>;
  ingredientsChanged$ = new Subject<null>();

  private _cachedMeasuringUnitsRequests = new Map<number, number[]>();
  private _cachedMeasuringUnits = new Map<number, MeasuringUnit>();
  private _pendingMeasuringUnitRequests = new Set<number>;

  constructor(
    private _http: HttpClient
  ) {
  }

  // private getCachedRecipesRequest(filter: RecipeFilter): Observable<Recipe[] | undefined> {
  //   const filterString = JSON.stringify(filter);
  //   const filterHash = this._hashCode(filterString);
  //   return interval(100).pipe(
  //     map(() => {
  //       return this._pendingRecipesRequests[filterHash];
  //     }),
  //     takeWhile(res => res === undefined),
  //     tap(res => {
  //       if (res !== undefined) {
  //         console.log("DAS SOLLTE NICHT SEIN!!!!")
  //       }
  //     }),
  //     map(() => this._cachedRecipesRequests.get(filterHash))
  //   )
  // }

  getCachedRecipesRequest$(filter: IngredientFilter): Observable<Recipe[] | undefined> {
    const filterHash = this._hashCode(filter);
    let foundRecipes: Recipe[] = [];
    const hashResult = this._cachedRecipesRequests.get(filterHash);
    if (hashResult) {
      hashResult.forEach(id => {
        const cachedRecipe = this._cachedRecipes.get(id);
        if (cachedRecipe) {
          foundRecipes.push(cachedRecipe);
        }
      })
    } else {
      if (Object.keys(filter).length === 0) {
        return of(undefined);
      }
      // Search in all cached results
      Array.from(this._cachedRecipes.values()).filter(recipe => {
        let matchTags = true;
        if (recipe.tags && Array.isArray(recipe.tags) && filter.tags && Array.isArray(filter.tags)) {
          if (recipe.tags.length !== filter.tags.length) {
            matchTags = false;
          }
          recipe.tags.forEach(tag => {
            if (!filter.tags?.every(filterTag => recipe.tags?.includes(filterTag))) {
              matchTags = false;
            }
          })
        }

        if (
          filter.id ? recipe.id === filter.id : true
          && filter.name ? recipe.name === filter.name : true
            && matchTags
        ) {
          if (!foundRecipes.find(toCheck => toCheck.id === recipe.id)) {
            foundRecipes.push(recipe);
          }
        }
      });
    }
    return of(foundRecipes.length === 0 ? undefined : foundRecipes);
  }

  getAllCachedRecipes$(): Observable<Recipe[]> {
    return of(Array.from(this._cachedRecipes.values()));
  }

  getAllCachedIngredients$(): Observable<Ingredient[]> {
    return of(Array.from(this._cachedIngredients.values()));
  }

  // private cacheRecipesRequest(filter: IngredientFilter, result: Recipe[]): void {
  //   const filterString = JSON.stringify(filter);
  //   const filterHash = this._hashCode(filterString);
  //   this._cachedRecipesRequests.set(filterHash, result);
  //   if (this._pendingRecipesRequests[filterHash]) {
  //     this._pendingRecipesRequests.slice(filterHash);
  //   }
  // }

  private _cacheRecipesRequest(filter: RecipeFilter, result: Recipe[]): void {
    const filterHash = this._hashCode(filter);
    const recipeIds: number[] = [];
    result.forEach(recipe => {
      if (!this._cachedRecipes.get(recipe.id)) {
        this._cachedRecipes.set(recipe.id, recipe);
        // this.recipesChanged$.next(null);
      }
      recipeIds.push(recipe.id);
    })
    this._cachedRecipesRequests.set(filterHash, recipeIds);
  }

  // getRecipes$(filter: RecipeFilter): Observable<Recipe[]> {
  //   return this.getCachedRecipesRequest(filter).pipe(
  //     switchMap(res => {
  //       if (res) {
  //         return of(res)
  //       }
  //       const filterString = JSON.stringify(filter);
  //       const filterHash = this._hashCode(filterString);
  //       this._pendingRecipesRequests.push(filterHash);
  //       return this._http.post<Recipe[]>(this._baseUrl + '/recipes', filter).pipe(
  //         tap(res => {
  //           this.cacheRecipesRequest(filter, res);
  //           this._pendingRecipesRequests.splice(filterHash);
  //         })
  //       );
  //     }),
  //   );
  // }

  getRecipes$(filter: RecipeFilter): Observable<Recipe[]> {

    if (Object.keys(filter).length === 0) {
      return of([]);
    } else if (filter.id === -1) {
      filter = {};
    }

    const filterHash = this._hashCode(filter);

    // if (this._pendingRecipesRequests.has(filterHash)) {
    //   return of([]);
    // }

    return this.getCachedRecipesRequest$(filter).pipe(
      switchMap(res => {
        if (res) {
          // FIXME: for "all" filter even one cached item the chain stops here
          return of(res);
        }
        if (this._pendingRecipesRequests.has(filterHash)) {
          return of(true).pipe(
            delay(100),
            map(() => {
              if (this._pendingRecipesRequests.has(filterHash)) {
                throw new Error("Still pending request");
              }
            }),
            retry(100),
            take(1),
            switchMap(() => this.getCachedRecipesRequest$(filter)),
            map(res => res ?? [])
          );
        }
        this._pendingRecipesRequests.add(filterHash);
        return this._http.post<Recipe[]>(this._baseUrl + '/recipes', filter).pipe(
          tap(res => {
            if (res.length !== 0) {
              this._cacheRecipesRequest(filter, res);
            }
            this._pendingRecipesRequests.delete(filterHash);
          }),
          map(() => {
            // cached hat evtl mehr, z.B. durch neu erstellte im client.
            return Array.from(this._cachedRecipes.values());
          }),
          catchError(error => {
            console.error('Error fetching recipes from server: ', error);
            this._pendingRecipesRequests.delete(filterHash);
            return throwError(error);
          })
        );
      }),
    );
  }

  // save/ send as b64
  // server saves it as file with unique id-file-name
  // place file url in recipe
  updateRecipe(recipe: Recipe): boolean {
    if (!this._cachedRecipes.get(recipe.id)) {
      this._cachedRecipes.set(recipe.id, recipe);
      // this.recipesChanged$.next(null);
    }
    this._http.put<Recipe[]>(this._baseUrl + '/recipe', recipe).subscribe();
    return false; // TODO: wait for result
  }

  createRecipe(recipe: Recipe): boolean {
    if (!this._cachedRecipes.get(recipe.id)) {
      this._cachedRecipes.set(recipe.id, recipe);
      // this.recipesChanged$.next(null);
    }
    this._http.post(this._baseUrl + '/recipe', recipe).pipe(
      tap((res: any) => {
        const newId = res['id'];
        this._cachedRecipes.delete(recipe.id);
        recipe.id = newId;
        this._cachedRecipes.set(newId, recipe);
      })
    ).subscribe();
    return true; // TODO
  }

  deleteRecipe(recipe: Recipe): Observable<boolean> {
    if (recipe.id !== -2) { // New, not DB saved recipe
      const httpParams = new HttpParams().set('id', recipe.id);
      return this._http.delete(this._baseUrl + '/recipe', {params: httpParams}).pipe(
        tap(() => this._cachedRecipes.delete(recipe.id)),
        map(() => true)
      );
    }
    this._cachedRecipes.delete(recipe.id);
    return of(true); // TODO:
  }

  newRecipeDummy(name: string): void {
    const newRecipe = <Recipe>{
      id: -2,
      name: name,
      active: false,
      recipeIngredients: [<RecipeIngredient>{
        ingredientId: -1,
        measuringUnitId: -1,
        amount: 0
      }],
      steps: [<RecipeStep>{
        orderNumber: -1,
        text: ''
      }]
    }
    if (!this._cachedRecipes.get(newRecipe.id)) {
      // this.clearCacheRecipes();
      this._cachedRecipes.set(newRecipe.id, newRecipe);
      this.recipesChanged$.next(null);
    }
    // this._http.post<boolean>(this._baseUrl + '/recipe', newRecipe).subscribe();
  }

  newIngredientDummy(name: string) {
    const newIngredient = <Ingredient>{
      id: -2,
      name: name,
      description: ''
    }
    if (!this._cachedIngredients.get(newIngredient.id)) {
      // this.clearCacheRecipes();
      this._cachedIngredients.set(newIngredient.id, newIngredient);
      this.ingredientsChanged$.next(null);
    }
    // this._http.post<boolean>(this._baseUrl + '/recipe', newRecipe).subscribe();
  }

  clearCacheRecipes(): void {
    this._cachedRecipes.clear();
    this._cachedRecipesRequests.clear();
  }

  getAllRecipes$(): Observable<Recipe[]> {
    return this.getRecipes$({id: -1});
  }

  private _hashCode(toHash: string | object): number {
    if (typeof toHash === 'object') {
      toHash = JSON.stringify(toHash);
    }
    let hash = 0;
    for (let i = 0, len = toHash.length; i < len; i++) {
      let chr = toHash.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  /**
   * TODO: When reload old data?
   * @param filter
   */
  getCachedIngredientsRequest$(filter: IngredientFilter): Observable<Ingredient[] | undefined> {
    const filterHash = this._hashCode(filter);
    let foundIngredients: Ingredient[] = [];
    const hashResult = this._cachedIngredientsRequests.get(filterHash);
    if (hashResult) {
      hashResult.forEach(id => {
        const cachedIngredient = this._cachedIngredients.get(id);
        if (cachedIngredient) {
          foundIngredients.push(cachedIngredient);
        }
      })
    } else {
      // Search in all cached results
      Array.from(this._cachedIngredients.values()).filter(ingredient => {
        let matchTags = true;
        if (ingredient.tags && Array.isArray(ingredient.tags) && filter.tags && Array.isArray(filter.tags)) {
          if (ingredient.tags.length !== filter.tags.length) {
            matchTags = false;
          }
          ingredient.tags.forEach(tag => {
            if (!filter.tags?.every(filterTag => ingredient.tags?.includes(filterTag))) {
              matchTags = false;
            }
          })
        }

        if (
          filter.id ? ingredient.id === filter.id : true
          && filter.name ? ingredient.name === filter.name : true
            && matchTags
        ) {
          if (!foundIngredients.find(toCheck => toCheck.id === ingredient.id)) {
            foundIngredients.push(ingredient);
          }
        }
      });
    }
    return of(foundIngredients.length === 0 ? undefined : foundIngredients);
  }

  private _cacheIngredientsRequest(filter: IngredientFilter, result: Ingredient[]): void {
    const filterHash = this._hashCode(filter);
    const ingredientIds: number[] = [];
    result.forEach(ingredient => {
      this._cachedIngredients.set(ingredient.id, ingredient);
      ingredientIds.push(ingredient.id);
    })
    this._cachedIngredientsRequests.set(filterHash, ingredientIds);
  }

  updateIngredient(ingredient: Ingredient): boolean {
    if (!this._cachedIngredients.get(ingredient.id)) {
      this._cachedIngredients.set(ingredient.id, ingredient);
      // this.recipesChanged$.next(null);
    }
    this._http.put<Ingredient[]>(this._baseUrl + '/ingredient', ingredient).subscribe();
    return false; // TODO: wait for result
  }

  createIngredient(ingredient: Ingredient): boolean {
    if (!this._cachedIngredients.get(ingredient.id)) {
      this._cachedIngredients.set(ingredient.id, ingredient);
      // this.ingredientsChanged$.next(null);
    }
    this._http.post(this._baseUrl + '/ingredient', ingredient).pipe(
      tap((res: any) => {
        const newId = res['id'];
        this._cachedIngredients.delete(ingredient.id);
        ingredient.id = newId;
        this._cachedIngredients.set(newId, ingredient);
      })
    ).subscribe();
    return true; // TODO
  }

  deleteIngredient(ingredient: Ingredient): Observable<boolean> {
    if (ingredient.id !== -2) { // New, not DB saved ingredient
      const httpParams = new HttpParams().set('id', ingredient.id);
      return this._http.delete(this._baseUrl + '/ingredient', {params: httpParams}).pipe(
        tap(() => this._cachedIngredients.delete(ingredient.id)),
        map(() => true)
      );
    }
    this._cachedIngredients.delete(ingredient.id);
    return of(true); // TODO:
  }

  createBundledRequestFilter<K extends IFilter>(filters: K[]): object {
    return filters.reduce((result: any, currentFilter) => {
      for (const [key, value] of Object.entries(currentFilter)) {
        if (result[key]) {
          result[key].$in.push(value);
        } else {
          result[key] = {$in: [value]};
        }
      }
      return result;
    }, {});
  }

  getIngredients$(filter: IngredientFilter): Observable<Ingredient[]> {

    if (Object.keys(filter).length === 0) {
      return of([]);
    } else if (filter.id === -1) {
      filter = {};
    }

    const filterHash = this._hashCode(filter);

    // if (this._pendingIngredientsRequests.has(filterHash)) {
    //   return of([]);
    // }

    return this.getCachedIngredientsRequest$(filter).pipe(
      switchMap(res => {
        if (res) {
          return of(res);
        }
        if (this._pendingIngredientsRequests.has(filterHash)) {
          return of(true).pipe(
            delay(100),
            map(() => {
              if (this._pendingIngredientsRequests.has(filterHash)) {
                throw new Error("Still pending request");
              }
            }),
            retry(100),
            take(1),
            switchMap(() => this.getCachedIngredientsRequest$(filter)),
            map(res => res ?? [])
          );
        }
        this._pendingIngredientsRequests.add(filterHash);
        return this._http.post<Ingredient[]>(this._baseUrl + '/ingredients', filter).pipe(
          tap(res => {
            if (res.length !== 0) {
              this._cacheIngredientsRequest(filter, res);
            }
            this._pendingIngredientsRequests.delete(filterHash);
          }),
          catchError(error => {
            console.error('Error fetching ingredients from server: ', error);
            this._pendingIngredientsRequests.delete(filterHash);
            return throwError(error);
          })
        );
      }),
    );
  }

  getAllIngredients$(): Observable<Ingredient[]> {
    return this.getIngredients$({id: -1});
  }

  getRecipeChangedSubject(): Subject<null> {
    return this.recipesChanged$;
  }

  getIngredientChangedSubject(): Subject<null> {
    return this.ingredientsChanged$;
  }

  getCachedMeasuringUnitRequest$(filter: MeasuringUnitFilter): Observable<MeasuringUnit[] | undefined> {
    const filterHash = this._hashCode(filter);
    let foundMeasuringUnits: MeasuringUnit[] = [];
    const hashResult = this._cachedMeasuringUnitsRequests.get(filterHash);
    if (hashResult) {
      hashResult.forEach(id => {
        const cachedMeasuringUnit = this._cachedMeasuringUnits.get(id);
        if (cachedMeasuringUnit) {
          foundMeasuringUnits.push(cachedMeasuringUnit);
        }
      })
    } else {
      // Search in all cached results
      Array.from(this._cachedMeasuringUnits.values()).filter(measuringUnit => {
        if (
          filter.id ? measuringUnit.id === filter.id : true
          && filter.name ? measuringUnit.name === filter.name : true
        ) {
          if (!foundMeasuringUnits.find(toCheck => toCheck.id === measuringUnit.id)) {
            foundMeasuringUnits.push(measuringUnit);
          }
        }
      });
    }
    return of(foundMeasuringUnits.length === 0 ? undefined : foundMeasuringUnits);
  }

  private _cacheMeasureUnitsRequest(filter: MeasuringUnitFilter, result: MeasuringUnit[]): void {
    const filterHash = this._hashCode(filter);
    const measuringUnitIds: number[] = [];
    result.forEach(measuringUnit => {
      this._cachedMeasuringUnits.set(measuringUnit.id, measuringUnit);
      measuringUnitIds.push(measuringUnit.id);
    })
    this._cachedMeasuringUnitsRequests.set(filterHash, measuringUnitIds);
  }

  getMeasuringUnits$(filter: MeasuringUnitFilter): Observable<MeasuringUnit[]> {
    if (Object.keys(filter).length === 0) {
      return of([]);
    } else if (filter.id === -1) {
      filter = {};
    }

    const filterHash = this._hashCode(filter);

    return this.getCachedMeasuringUnitRequest$(filter).pipe(
      switchMap(res => {
        if (res) {
          return of(res);
        }
        if (this._pendingMeasuringUnitRequests.has(filterHash)) {
          return of(true).pipe(
            delay(100),
            map(() => {
              if (this._pendingMeasuringUnitRequests.has(filterHash)) {
                throw new Error("Still pending request");
              }
            }),
            retry(100),
            take(1),
            switchMap(() => this.getCachedMeasuringUnitRequest$(filter)),
            map(res => res ?? [])
          );
        }
        this._pendingMeasuringUnitRequests.add(filterHash);
        return this._http.post<MeasuringUnit[]>(this._baseUrl + '/measuringUnits', filter).pipe(
          tap(res => {
            if (res.length !== 0) {
              this._cacheMeasureUnitsRequest(filter, res);
            }
            this._pendingMeasuringUnitRequests.delete(filterHash);
          }),
          catchError(error => {
            console.error('Error fetching measuringUnits from server: ', error);
            this._pendingMeasuringUnitRequests.delete(filterHash);
            return throwError(error);
          })
        );
      }),
    );
  }

  getAllMeasuringUnits$(): Observable<MeasuringUnit[]> {
    return this.getMeasuringUnits$({id: -1});
  }

  // private handleFirstFilterInput<T extends IFilter>(): Observable<T> {
  //   if (Object.keys(filter).length === 0) {
  //     return of([]);
  //   } else if (filter.id === -1) {
  //     filter = {};
  //   }
  // }

  getBasePictureUrl(): string {
    return `${this._baseUrl}/pictures`;
  }
}
