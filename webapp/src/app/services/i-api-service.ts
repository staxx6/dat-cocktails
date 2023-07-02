import { Injectable } from '@angular/core';
import { Recipe } from '../shared/i-recipe';
import { Ingredient } from '../shared/i-ingredient';

interface Filter {
    id?: number,
    name?: string,
    tags?: string[]
}

export interface RecipeFilter extends Filter {
}

export interface IngredientFilter extends Filter {
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
