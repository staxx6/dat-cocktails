import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule } from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import { IngredientCardComponent } from "../ingredient-card/ingredient-card.component";
import { IApiService } from "../services/i-api-service";
import {BackButtonDirective} from "../directives/back-button.directive";
import {switchMap} from "rxjs";

@Component({
  selector: 'dc-ingredient-card-bartender',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, BackButtonDirective],
  template: `
    <div class="bg-base-100 rounded p-3">
      <ng-container *ngIf="ingredient">
        <h2 class="text-accent">{{ingredient.name}}</h2>
        <figure *ngIf="getIngredientPicture()">
          <img [src]="getIngredientPicture()" class="w-36"/>
        </figure>
        <p>
          {{getDescription()}}
        </p>

        <form
          [formGroup]="formGroup"
          (ngSubmit)="onSubmit()"
          class="mt-5"
        >
          <label class="block">
            Name:
            <input type="text" formControlName="name" class="list-item-name">
          </label>
          <label class="block mt-3">
            Beschreibung:
            <input type="text" formControlName="description" class="list-item-name">
          </label>

          <h3 class="text-accent text-xl mt-3">Bild</h3>
          <input type="file" (change)="onFileSelected($event)">

          <p class="m-5">
            <button type="submit" class="btn btn-primary mr-3">Speichern</button>
            <button type="button" (click)="deleteIngredient()" class="btn">Zutat löschen</button>
          </p>
        </form>
      </ng-container>

      <button class="btn btn-secondary m-4" backButton>Zurück</button>
    </div>

  `,
  styles: ['']
})
export class IngredientCardBartenderComponent extends IngredientCardComponent {

  formGroup = this._formBuilder.group({
    name: '',
    active: false,
    description: ''
  })

  constructor(
    apiService: IApiService,
    route: ActivatedRoute,
    router: Router,
    location: Location,
    private _formBuilder: NonNullableFormBuilder,
  ) {
    super(
      apiService,
      route,
      router,
      location
    );

    const formCtrls = this.formGroup.controls;
    this.ingredientChanged.subscribe(ingredient => {
      formCtrls.name.setValue(ingredient?.name ?? '');
      formCtrls.description.setValue(ingredient?.description ?? '');
    })
  }

  onSubmit(): void {
    if (!this.ingredient) {
      throw new Error("Saving without a ingredient shouldn't be possible!");
    }

    const formCtrls = this.formGroup.controls;
    this.ingredient.name = formCtrls.name.value;
    this.ingredient.description = formCtrls.description.value;

    //
    // API
    //
    if (this.ingredient.id === -2 || this.ingredient.id === undefined) { // new ingredient
      this._apiService.createIngredient(this.ingredient); // gets new ID
    } else {
      this._apiService.updateIngredient(this.ingredient);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const reader = new FileReader();
      reader.readAsDataURL(input.files[0]);
      reader.onload = () => {
        if (this.ingredient) {
          this.ingredient.pictureB64 = reader.result as string;
        }
      }
      // this._selectedFile = input.files[0];
    }
  }


  /**
   * TODO: own popup
   */
  deleteIngredient(): void {
    if (confirm('Soll die Zutat wirklich gelöscht werden?')) {
      if (this.ingredient) {
        this._apiService.deleteIngredient(this.ingredient).pipe(
          switchMap(() => this._router.navigate(['/bartender']))
        ).subscribe();
      }
    }
  }
}
