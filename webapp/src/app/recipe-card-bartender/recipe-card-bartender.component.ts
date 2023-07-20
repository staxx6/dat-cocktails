import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IApiService } from "../services/i-api-service";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { RecipeCardComponent } from "../recipe-card/recipe-card.component";
import { MeasuringUnit, RecipeIngredient, RecipeStep } from "../shared/i-recipe";
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Ingredient } from "../shared/i-ingredient";

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

  // Visibility for template
  protected readonly MeasuringUnit = MeasuringUnit;
  protected readonly Object = Object;

  private _allPossibleIngredients: Ingredient[] = [];

  recipeIngredients: RecipeIngredient[] = [];
  steps: RecipeStep[] = [];

  formGroup = this._formBuilder.group({
    name: '',
    active: false,
    recipeIngredients: this._formBuilder.array([
      this._formBuilder.group({
        ingredientId: -1,
        ingredientAmount: -1,
        ingredientUnit: MeasuringUnit.none
      })
    ]),
    steps: this._formBuilder.array([
      this._formBuilder.group({
        // orderNumber: -1,
        text: '',
        picture: ''
      })
    ])
  })

  constructor(
    apiService: IApiService,
    route: ActivatedRoute,
    private _formBuilder: NonNullableFormBuilder,
    private _router: Router
  ) {
    super(
      apiService,
      route
    );

    this.recipeChanged.subscribe(recipe => {
      this.formGroup.controls.name.setValue(recipe?.name ?? '');
      this.formGroup.controls.active.setValue(recipe?.active ?? false);

      this.recipeIngredients = recipe?.recipeIngredients ?? [];
      this.createRecipeIngredientControls();

      this.steps = recipe?.steps ?? [];
      this.createStepControls();
    });

    this._apiService.getAllIngredients$().subscribe(res => this._allPossibleIngredients = res);
  }

  private createStepControls(): void {
    if (this.steps.length !== 0) {
      // Remove dummy controls
      this.formGroup.controls.steps.removeAt(0);
    }
    this.steps.forEach(step => {
      this.addStep(step);
    })
  }

  addStep(step?: RecipeStep): void {
    if (!step) {
      step = {
        orderNumber: this.steps[this.steps.length - 1].orderNumber + 1,
        text: '',
        picture: ''
      }
    }

    this.formGroup.controls.steps.push(
      this._formBuilder.group({
        // orderNumber: step.orderNumber,
        text: step.text,
        picture: step.picture ?? ''
      })
    );
  }

  private createRecipeIngredientControls(): void {
    if (this.recipeIngredients.length !== 0) {
      // Remove dummy controls
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
   * FIXME Wieder aktivieren
   */
  onSubmit(): void {
    if (!this.recipe) {
      throw new Error("Saving without a recipe shouldn't be possible!");
    }

    const formCtrls = this.formGroup.controls;

    this.recipe.name = formCtrls.name.value;
    this.recipe.active = formCtrls.active.value;

    //
    // Ingredients
    //
    const currRecipeIngredientsSize = this.recipe.recipeIngredients.length;
    this.formGroup.controls.recipeIngredients.value.forEach(recipeIngredientCtrls => {
      const newId = typeof recipeIngredientCtrls.ingredientId === 'string' ? parseInt(recipeIngredientCtrls.ingredientId) : recipeIngredientCtrls.ingredientId;
      const newRecipeIngredient: RecipeIngredient = {
        ingredientId: newId ?? -1,
        amount: recipeIngredientCtrls.ingredientAmount ?? -1,
        measuringUnit: recipeIngredientCtrls.ingredientUnit ?? MeasuringUnit.none
      }
      this.recipe!.recipeIngredients.push(newRecipeIngredient);
    })
    // First, add all new recipeIngredients
    // After that remove the old one, maybe it's safer this way
    this.recipe.recipeIngredients.splice(0, currRecipeIngredientsSize);

    //
    // Steps
    //
    const currStepsSize = this.recipe.steps.length;
    this.formGroup.controls.steps.value.forEach(stepCtrls => {
      // const newId = typeof stepCtrls.ingredientId === 'string' ? parseInt(stepCtrls.ingredientId) : stepCtrls.ingredientId;
      const newStep: RecipeStep = {
        text: stepCtrls.text ?? '',
        orderNumber: -1
      }
      this.recipe!.steps.push(newStep);
    })
    // First, add all new steps
    // After that remove the old one, maybe it's safer this way
    this.recipe.steps.splice(0, currStepsSize);

    if (this.recipe.id === -2 || this.recipe.id === undefined) { // new recipe
      this._apiService.createRecipe(this.recipe); // gets new ID
    } else {
      this._apiService.updateRecipe(this.recipe);
    }
  }

  /**
   * TODO: own popup
   */
  async deleteRecipe(): Promise<undefined> {
    if (confirm('Soll das Rezept wirklich gelöscht werden?')) {
      if (this.recipe) {
        this._apiService.deleteRecipe(this.recipe);
      }
    }
    await this._router.navigate(['/bartender']);
  }

  removeRecipeIngredient(index: number): void {
    // this.recipe.recipeIngredients.splice(index);
    this.formGroup.controls.recipeIngredients.removeAt(index);
    // this.recipeIngredientsFormArray.removeAt(index);
  }

  removeStep(index: number): void {
    this.formGroup.controls.steps.removeAt(index);
  }

  getMeasuringUnit(recipeIngredient: RecipeIngredient): string {
    return recipeIngredient.measuringUnit;
  }

  getMeasuringUnitDisplayName(unit: string): string {
    return MeasuringUnit[unit as keyof typeof MeasuringUnit].toString();
  }

  getAllPossibleIngredients(): Ingredient[] {
    return this._allPossibleIngredients;
  }
}
