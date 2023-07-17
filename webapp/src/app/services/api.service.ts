import {Injectable} from '@angular/core';

import {IApiService, IngredientFilter, RecipeFilter} from './i-api-service';
import {IFilter, Ingredient} from 'dat-cocktails-types';
import {MeasuringUnit, Recipe, RecipeIngredient} from '../shared/i-recipe';
import {HttpClient} from "@angular/common/http";
import {
  catchError,
  delay,
  interval,
  map,
  Observable,
  of,
  retry,
  switchMap, take,
  takeWhile,
  tap,
  throwError
} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService implements IApiService {

  private readonly _baseUrl = 'http://localhost:8000';

  constructor(
    private _http: HttpClient
  ) {
  }

  private _cachedRecipesRequests = new Map<number, Recipe[]>();
  private _pendingRecipesRequests: number[] = [];

  private _cachedIngredientsRequests = new Map<number, Ingredient[]>();
  private _pendingIngredientsRequests = new Set<number>;


  private getCachedRecipesRequest(filter: RecipeFilter): Observable<Recipe[] | undefined> {
    const filterString = JSON.stringify(filter);
    const filterHash = this._hashCode(filterString);
    return interval(100).pipe(
      map(() => {
        return this._pendingRecipesRequests[filterHash];
      }),
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
    const filterHash = this._hashCode(filterString);
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
        const filterHash = this._hashCode(filterString);
        this._pendingRecipesRequests.push(filterHash);
        return this._http.post<Recipe[]>(this._baseUrl + '/recipes', filter).pipe(
          tap(res => {
            this.cacheRecipesRequest(filter, res);
            this._pendingRecipesRequests.splice(filterHash);
          })
        );
      }),
    );
  }

  getAllRecipes$(): Observable<Recipe[]> {
    return this.getRecipes$({});
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
      foundIngredients.push(...hashResult);
    } else {
      // Search in all cached results
      Array.from(this._cachedIngredientsRequests.values()).filter(ingredients => {
        ingredients.forEach(ingredient => {
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
        })
      });
    }
    return of(foundIngredients.length === 0 ? undefined : foundIngredients);
  }

  private _cacheIngredientsRequest(filter: IngredientFilter, result: Ingredient[]): void {
    const filterHash = this._hashCode(filter);
    this._cachedIngredientsRequests.set(filterHash, result);
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


  public getIngredients$(filter: IngredientFilter): Observable<Ingredient[]> {

    if(Object.keys(filter).length === 0) {
      return of([]);
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
    return this.getIngredients$({});
  }
}
