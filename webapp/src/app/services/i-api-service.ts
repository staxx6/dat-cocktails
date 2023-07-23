import { Injectable } from '@angular/core';
import { IFilter, Recipe, Ingredient, MeasuringUnit, MeasuringUnitFilter } from 'dat-cocktails-types';
import { Observable, Subject } from "rxjs";


export interface RecipeFilter extends IFilter {
}

export interface IngredientFilter extends IFilter {
}

@Injectable({
    providedIn: 'root'
})
export abstract class IApiService {
    abstract getRecipes$(filter: RecipeFilter): Observable<Recipe[]>;
    abstract updateRecipe(recipe: Recipe): boolean;
    abstract createRecipe(recipe: Recipe): boolean;
    abstract deleteRecipe(recipe: Recipe): Observable<boolean>;
    abstract newRecipeDummy(name: string): void;
    abstract getAllRecipes$(): Observable<Recipe[]>;
    abstract getAllCachedRecipes$(): Observable<Recipe[]>;
    abstract getIngredients$(filter: IngredientFilter): Observable<Ingredient[]>;
    abstract getCachedIngredientsRequest$(filter: IngredientFilter): Observable<Ingredient[] | undefined>;
    abstract getAllIngredients$(): Observable<Ingredient[]>;
    abstract createBundledRequestFilter<K extends IFilter>(filters: K[]): object;
    abstract getRecipeChangedSubject(): Subject<null>;
    abstract getMeasuringUnits$(filter: MeasuringUnitFilter): Observable<MeasuringUnit[]>;
    abstract getAllMeasuringUnits$(): Observable<MeasuringUnit[]>;
    abstract getCachedMeasuringUnitRequest$(filter: MeasuringUnitFilter): Observable<MeasuringUnit[] | undefined>;
    abstract getBasePictureUrl(): string;
}
