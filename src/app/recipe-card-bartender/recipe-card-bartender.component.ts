import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IApiService } from "../services/i-api-service";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { RecipeCardComponent } from "../recipe-card/recipe-card.component";
import { MeasuringUnit, RecipeIngredient } from "../shared/i-recipe";
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Ingredient } from "../shared/i-ingredient";

export interface RecipeIngredientModel extends FormGroup<{
  ingredientId: FormControl<number>,
  ingredientAmount: FormControl<number>,
  ingredientUnit: FormControl<MeasuringUnit>
}> {
}

export interface RecipeIngredientModel2 {
  ingredientId: FormControl<number>,
  ingredientAmount: FormControl<number>,
  ingredientUnit: FormControl<MeasuringUnit>
}

// export interface RecipeFormModel extends FormGroup<{
//   name: FormControl<string>;
//   recipeIngredients: FormArray<RecipeIngredientModel>;
// }> {}

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


  recipeIngredientsFormArray = this._formBuilder.array([this._formBuilder.group({
    ingredientId: FormControl<number>,
    ingredientAmount: FormControl<number>,
    ingredientUnit: FormControl<MeasuringUnit>
  })]);
  recipeIngredients: RecipeIngredient[];

  formGroup = this._formBuilder.group({
    name: FormControl<string>,
    recipeIngredients: this.recipeIngredientsFormArray
  })

  constructor(
    apiService: IApiService,
    route: ActivatedRoute,
    private _formBuilder: FormBuilder
  ) {
    super(
      apiService,
      route
    );

    // this.recipeIngredientsFormArray = this._formBuilder.group({
    //   ingredientId: new FormControl<number>(-1, {nonNullable: true}),
    //   ingredientAmount: new FormControl<number>(-1, {nonNullable: true}),
    //   ingredientUnit: new FormControl<MeasuringUnit>(MeasuringUnit.none, {nonNullable: true})
    // })
    // new FormArray([] as FormControl[]);

    // this.formGroup = new FormGroup({
    //   name: new FormControl<string>(this.recipe.name),
    //   recipeIngredients: this.recipeIngredientsFormArray
    // });

    // this.formGroup = this._formBuilder.group({
    //   name: this.recipe.name,
    //   //
    //   recipeIngredients: new FormArray<FormGroup<RecipeIngredientModel>>([])
    // })

    // this.recipeIngredientsFormArray = this._formBuilder.array<RecipeIngredientModel>([]);

    // this.recipeIngredientsFormArray = this._formBuilder.array([this._formBuilder.group({
    //   ingredientId: -1,
    //   ingredientAmount: 0,
    //   ingredientUnit: MeasuringUnit.none
    // })])

    // this.recipeIngredientsFormArray = this._formBuilder.array(this._formBuilder.group({
    //   ingredientId: FormControl<number>,
    //   ingredientAmount: FormControl<number>,
    //   ingredientUnit: FormControl<MeasuringUnit>
    // }));

    // this.formGroup = this._formBuilder.group({
    //   name: this.recipe.name,
    //   recipeIngredients: this.recipeIngredientsFormArray
    // })

    this.formGroup.controls.name ;

    this.recipeIngredients = this.recipe.recipeIngredients;
    this.createRecipeIngredientControls();
  }

  private createRecipeIngredientControls(): void {
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
      } as RecipeIngredient
    }
    this.recipeIngredientsFormArray.push(this._formBuilder.group({
      ingredientId: recipeIngredient.ingredientId,
      ingredientAmount: recipeIngredient.amount,
      ingredientUnit: recipeIngredient.measuringUnit
    }));
    // this.recipeIngredientsFormArray.push(new FormGroup({
    //   ingredientId: new FormControl(recipeIngredient.ingredientId),
    //   ingredientAmount: new FormControl(recipeIngredient.amount),
    //   ingredientUnit: new FormControl(recipeIngredient.measuringUnit),
    // }));
  }

  ngOnInit() {
  }

  onSubmit(form: FormGroup): void {
    this.recipe.name = form.value.name;
    this.recipeIngredientsFormArray.controls.forEach(ctrl => {
      // console.log(ctrl.get('ingredientId')?.value);
      console.log(ctrl.value.ingredientId);
    })
  }

  private saveRecipe(): void {
    // TODO:
  }

  removeRecipeIngredient(index: number): void {
    // this.recipe.recipeIngredients.splice(index);
    this.recipeIngredientsFormArray.removeAt(index);
  }

  getMeasuringUnit(recipeIngredient: RecipeIngredient): string {
    return recipeIngredient.measuringUnit;
  }

  getMeasuringUnitDisplayName(unit: string): string {
    return MeasuringUnit[unit as keyof typeof MeasuringUnit].toString();
  }

  getAllIngredients(): Ingredient[] {
    return this._apiService.getAllIngredients();
  }

  protected readonly MeasuringUnit = MeasuringUnit;
  protected readonly Object = Object;
}
