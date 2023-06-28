import { Routes } from '@angular/router';
import { RecipesListComponent } from "./recipes-list/recipes-list.component";
import { RecipeCardUserComponent } from "./recipe-card-user/recipe-card-user.component";

export const routes: Routes = [
  {
    path: '',
    component: RecipesListComponent
  },
  {
    path: ':id',
    component: RecipeCardUserComponent
  }
];
