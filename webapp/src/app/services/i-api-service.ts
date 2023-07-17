import { Injectable } from '@angular/core';
import { Recipe } from '../shared/i-recipe';
import { Ingredient } from '../shared/i-ingredient';
import { IFilter } from 'dat-cocktails-types';
import { Observable } from "rxjs";


export interface RecipeFilter extends IFilter {
}

export interface IngredientFilter extends IFilter {
}

@Injectable({
    providedIn: 'root'
})
export abstract class IApiService {
    abstract getRecipes$(filter: RecipeFilter): Observable<Recipe[]>;
    abstract getAllRecipes$(): Observable<Recipe[]>;
    abstract getIngredients$(filter: IngredientFilter): Observable<Ingredient[]>;
    abstract getCachedIngredientsRequest$(filter: IngredientFilter): Observable<Ingredient[] | undefined>;
    abstract getAllIngredients$(): Observable<Ingredient[]>;
    abstract createBundledRequestFilter<K extends IFilter>(filters: K[]): object;
}
