import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IApiService } from "../services/i-api-service";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { RecipeCardComponent } from "../recipe-card/recipe-card.component";
import { MeasuringUnit, RecipeIngredient } from "../shared/i-recipe";
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Ingredient } from "../shared/i-ingredient";
import { Observable } from "rxjs";

export interface IRecipeIngredientsFormModel {
  ingredientId: FormControl<number>,
  ingredientAmount: FormControl<number>,
  ingredientUnit: FormControl<MeasuringUnit>
}

export interface IFormGroupModel {
  name: FormControl<string>,
  recipeIngredients: FormArray<FormGroup<IRecipeIngredientsFormModel>>
}

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

  recipeIngredients: RecipeIngredient[];

  formGroup = this._formBuilder.group({
    name: '',
    recipeIngredients: this._formBuilder.array([
      this._formBuilder.group({
        ingredientId: -1,
        ingredientAmount: -1,
        ingredientUnit: MeasuringUnit.none
      })
    ])
  })

  constructor(
    apiService: IApiService,
    route: ActivatedRoute,
    private _formBuilder: NonNullableFormBuilder
  ) {
    super(
      apiService,
      route
    );

    this.formGroup.controls.name.setValue(this.recipe.name);

    this.recipeIngredients = this.recipe.recipeIngredients;
    this.createRecipeIngredientControls();
  }

  private createRecipeIngredientControls(): void {
    if (this.recipeIngredients.length !== 0) {
      this.formGroup.controls.recipeIngredients.removeAt(0);
    }
    this.recipeIngredients.forEach(recipeIngredient => {
      this.addRecipeIngredient(recipeIngredient);
    })
  }

  addRecipeIngredient(recipeIngredient?: RecipeIngredient): void {
    if (!recipeIngredient) {
      recipeIngredient = {
        ingredientId: -1,
        amount: 1,
        measuringUnit: MeasuringUnit.none
      }
    }

    this.formGroup.controls.recipeIngredients.push(
      this._formBuilder.group({
        ingredientId: recipeIngredient.ingredientId,
        ingredientAmount: recipeIngredient.amount,
        ingredientUnit: recipeIngredient.measuringUnit
      })
    );
  }

  ngOnInit() {
  }

  /**
   * Saves currently only in memory
   */
  onSubmit(): void {
    const formCtrls = this.formGroup.controls;

    this.recipe.name = formCtrls.name.value;

    const currRecipeIngredientsSize = this.recipe.recipeIngredients.length;

    this.formGroup.controls.recipeIngredients.value.forEach(recipeIngredientCtrls => {
      const newId = typeof recipeIngredientCtrls.ingredientId === 'string' ? parseInt(recipeIngredientCtrls.ingredientId) : recipeIngredientCtrls.ingredientId;
      const newRecipeIngredient: RecipeIngredient = {
        ingredientId: newId ?? -1,
        amount: recipeIngredientCtrls.ingredientAmount ?? -1,
        measuringUnit: recipeIngredientCtrls.ingredientUnit ?? MeasuringUnit.none
      }
      this.recipe.recipeIngredients.push(newRecipeIngredient);
    })
    // First, add all new recipeIngredients
    // After that remove the old one, maybe it's safer this way
    this.recipe.recipeIngredients.splice(0, currRecipeIngredientsSize);
  }

  private saveRecipe(): void {
    // TODO:
  }

  removeRecipeIngredient(index: number): void {
    // this.recipe.recipeIngredients.splice(index);
    this.formGroup.controls.recipeIngredients.removeAt(index);
    // this.recipeIngredientsFormArray.removeAt(index);
  }

  getMeasuringUnit(recipeIngredient: RecipeIngredient): string {
    return recipeIngredient.measuringUnit;
  }

  getMeasuringUnitDisplayName(unit: string): string {
    return MeasuringUnit[unit as keyof typeof MeasuringUnit].toString();
  }

  getAllIngredients$(): Observable<Ingredient[]> {
    return this._apiService.getAllIngredients$();
  }

  protected readonly MeasuringUnit = MeasuringUnit;
  protected readonly Object = Object;
}
