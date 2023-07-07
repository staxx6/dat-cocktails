import { Routes } from '@angular/router';
import { RecipesListComponent } from "./recipes-list/recipes-list.component";
import { RecipeCardUserComponent } from "./recipe-card-user/recipe-card-user.component";
import { RecipeCardBartenderComponent } from "./recipe-card-bartender/recipe-card-bartender.component";
import { IngredientsListComponent } from "./ingredients-list/ingredients-list.component";

export const routes: Routes = [
  {
    path: '',
    component: RecipesListComponent
  },
  {
    path: 'cocktail/:id',
    component: RecipeCardUserComponent
  },
  {
    path: 'bartender',
    component: RecipesListComponent
  },
  {
    path: 'bartender/cocktail/:id',
    component: RecipeCardBartenderComponent
  },
  {
    path: 'ingredients',
    component: IngredientsListComponent
  },
  {
    path: 'bartender/ingredients',
    component: IngredientsListComponent
  }
];
