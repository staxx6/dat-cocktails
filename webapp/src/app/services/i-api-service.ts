import { Injectable } from '@angular/core';
import { Recipe } from '../shared/i-recipe';
import { Ingredient } from '../shared/i-ingredient';
import { IFilter } from 'dat-cocktails-types';


export interface RecipeFilter extends IFilter {
}

export interface IngredientFilter extends IFilter {
}

@Injectable({
    providedIn: 'root'
})
export abstract class IApiService {
    abstract getRecipes(filter: RecipeFilter): Recipe[];
    abstract getAllRecipes(): Recipe[];
    abstract getIngredients(filter: IngredientFilter): Ingredient[];
    abstract getAllIngredients(): Ingredient[];
}
