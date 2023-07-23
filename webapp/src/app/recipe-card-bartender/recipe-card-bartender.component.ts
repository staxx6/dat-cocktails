import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule
} from "@angular/forms";
import { switchMap } from "rxjs";

import { RecipeIngredient, RecipeStep, Ingredient, MeasuringUnit } from "dat-cocktails-types";

import { IApiService } from "../services/i-api-service";
import { RecipeCardComponent } from "../recipe-card/recipe-card.component";

export interface IRecipeIngredientsFormModel {
  ingredientId: FormControl<number>,
  ingredientAmount: FormControl<number>,
  ingredientUnitId: FormControl<number>
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
  // protected readonly MeasuringUnit = MeasuringUnit;
  protected readonly Object = Object;

  private _allPossibleIngredients: Ingredient[] = [];
  private _allPossibleMeasuringUnits: MeasuringUnit[] = [];

  recipeIngredients: RecipeIngredient[] = [];
  steps: RecipeStep[] = [];

  formGroup = this._formBuilder.group({
    name: '',
    active: false,
    recipeIngredients: this._formBuilder.array([
      this._formBuilder.group({
        ingredientId: -1,
        ingredientAmount: -1,
        ingredientUnitId: -1
      })
    ]),
    steps: this._formBuilder.array([
      this._formBuilder.group({
        // orderNumber: -1,
        text: '',
        // picture: ''
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
    this._apiService.getAllMeasuringUnits$().subscribe(res => this._allPossibleMeasuringUnits = res);
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
        // picture: ''
      }
    }

    this.formGroup.controls.steps.push(
      this._formBuilder.group({
        // orderNumber: step.orderNumber,
        text: step.text,
        // picture: step.picture ?? ''
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
        measuringUnitId: -1
      }
    }

    this.formGroup.controls.recipeIngredients.push(
      this._formBuilder.group({
        ingredientId: recipeIngredient.ingredientId,
        ingredientAmount: recipeIngredient.amount,
        ingredientUnitId: recipeIngredient.measuringUnitId
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
      const newIdMeasuringUnit = typeof recipeIngredientCtrls.ingredientUnitId === 'string' ? parseInt(recipeIngredientCtrls.ingredientUnitId) : recipeIngredientCtrls.ingredientUnitId;
      const newRecipeIngredient: RecipeIngredient = {
        ingredientId: newId ?? -1,
        amount: recipeIngredientCtrls.ingredientAmount ?? -1,
        measuringUnitId: newIdMeasuringUnit ?? -1
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

    //
    // Picture
    //
    // if (this._selectedFile) {
    //   const formData = new FormData();
    //   formData.append('image', this._selectedFile);
    // }

    //
    // API
    //
    if (this.recipe.id === -2 || this.recipe.id === undefined) { // new recipe
      this._apiService.createRecipe(this.recipe); // gets new ID
    } else {
      this._apiService.updateRecipe(this.recipe);
    }
  }

  /**
   * TODO: own popup
   */
  deleteRecipe(): void {
    if (confirm('Soll das Rezept wirklich gelöscht werden?')) {
      if (this.recipe) {
        this._apiService.deleteRecipe(this.recipe).pipe(
          switchMap(() => this._router.navigate(['/bartender']))
        ).subscribe();
      }
    }
  }

  removeRecipeIngredient(index: number): void {
    // this.recipe.recipeIngredients.splice(index);
    this.formGroup.controls.recipeIngredients.removeAt(index);
    // this.recipeIngredientsFormArray.removeAt(index);
  }

  removeStep(index: number): void {
    this.formGroup.controls.steps.removeAt(index);
  }

  getMeasuringUnitName(recipeIngredient: RecipeIngredient): string {
    return "TODO 1";
  }

  getMeasuringUnitDisplayName(id: number): string {
    return "TODO 2";
  }

  getAllMeasuringUnitsId(): number[] {
    return [-1]; // TODO
  }

  getAllPossibleIngredients(): Ingredient[] {
    return this._allPossibleIngredients;
  }

  getAllPossibleMeasuringUnits(): MeasuringUnit[] {
    return this._allPossibleMeasuringUnits;
  }

  private _selectedFile: File | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const reader = new FileReader();
      reader.readAsDataURL(input.files[0]);
      reader.onload = () => {
        if (this.recipe) {
          this.recipe.pictureB64 = reader.result as string;
        }
      }
      // this._selectedFile = input.files[0];
    }
  }

  getRecipePicture(): string {
    return `${this._apiService.getBasePictureUrl()}/${this.recipe?.pictureFileIdWithExt}`;
  }
}
