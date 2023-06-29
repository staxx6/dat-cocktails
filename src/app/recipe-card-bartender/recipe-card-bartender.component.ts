import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IApiService } from "../services/i-api-service";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { RecipeCardComponent } from "../recipe-card/recipe-card.component";
import { MeasuringUnit, RecipeIngredient } from "../shared/i-recipe";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'recipe-card-bartender',
  standalone: true,
  imports: [
    CommonModule,
    RecipeCardComponent,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './recipe-card-bartender.component.html',
  styleUrls: ['./recipe-card-bartender.component.scss']
})
export class RecipeCardBartenderComponent extends RecipeCardComponent implements OnInit {

  formGroup: FormGroup;
  recipeIngredientsFormArray: FormArray;
  recipeIngredients: RecipeIngredient[];

  constructor(
    apiService: IApiService,
    route: ActivatedRoute,
    private _formBuilder: FormBuilder
  ) {
    super(
      apiService,
      route
    );

    this.recipeIngredientsFormArray = new FormArray([] as FormControl[]);

    this.formGroup = new FormGroup({
      'name': new FormControl(this.recipe.name),
      'recipeIngredients': this.recipeIngredientsFormArray
    });

    this.recipeIngredients = this.recipe.recipeIngredients;
    this.createRecipeIngredientControls();
  }

  private createRecipeIngredientControls(): void {
    this.recipeIngredients.forEach(recipeIngredient => {
      this.addRecipeIngredient(recipeIngredient);
    })
  }

  addRecipeIngredient(recipeIngredient: RecipeIngredient | undefined): void {
    if (!recipeIngredient) {
      recipeIngredient = {
        ingredientId: -1,
        amount: 1,
        measuringUnit: MeasuringUnit.none
      } as RecipeIngredient
    }
    // Das speichert direkt in das Model! Soll erst beim save passieren
    // this.recipe.recipeIngredients.push(recipeIngredient);
    this.recipeIngredientsFormArray.push(new FormGroup({
      'ingredientName': new FormControl(this.getIngredientName(recipeIngredient)),
      'ingredientAmount': new FormControl(recipeIngredient.amount),
      'ingredientUnit': new FormControl(recipeIngredient.measuringUnit),
    }));
  }

  ngOnInit() {
  }

  onSubmit(form: FormGroup): void {
    this.recipe.name = form.value.name;
  }

  private saveRecipe(): void {
    // TODO:
  }

  removeRecipeIngredient(index: number): void {
    this.recipe.recipeIngredients.splice(index);
    this.recipeIngredientsFormArray.removeAt(index);
  }

  getMeasuringUnit(recipeIngredient: RecipeIngredient): string {
    return recipeIngredient.measuringUnit;
  }
}
