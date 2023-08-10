import { Component, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'dc-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar bg-base-300 rounded-2xl flex flex-auto flex-wrap m-2 pb-2.5 pl-3">
      <a [routerLink]="['']"
         class="btn btn-ghost normal-case text-xl mr-2 text-gray-50 font-bold"
      >
        Home Cocktails
      </a>

      <a [routerLink]="['']"
         class="btn btn-sm btn-ghost normal-case m-1 text-accent text-opacity-90"
      >
        Cocktails
      </a>

      <a [routerLink]="['/bartender']"
         class="btn btn-sm btn-ghost normal-case m-1 text-accent text-opacity-90"
         *ngIf="developerView"
      >
        Bartender-Ansicht
      </a>

      <a [routerLink]="['/ingredients']"
         class="btn btn-sm btn-ghost normal-case m-1 text-accent text-opacity-90"
      >
        Zutaten
      </a>

      <a [routerLink]="['/bartender/ingredients']"
         class="btn btn-sm btn-ghost normal-case m-1 text-accent text-opacity-90"
         *ngIf="developerView"
      >
        Bartender-Ansicht für Zutaten
      </a>
    </nav>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @HostBinding('class') classes = 'flex w-5/6 flex-col items-center';

  developerView = true;
}
