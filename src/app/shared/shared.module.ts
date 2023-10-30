import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { StepsModule } from 'primeng/steps';
import { DividerModule } from 'primeng/divider';
import { NgChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ProgressBarModule } from "primeng/progressbar";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ToastModule } from "primeng/toast";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MenubarModule,
    CardModule,
    ButtonModule,
    DropdownModule,
    AutoCompleteModule,
    StepsModule,
    NgChartsModule,
    NgApexchartsModule,
    DividerModule,
    ToastModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    MenubarModule,
    CardModule,
    ButtonModule,
    DropdownModule,
    AutoCompleteModule,
    StepsModule,
    NgChartsModule,
    NgApexchartsModule,
    DividerModule
  ]
})
export class SharedModule {
}
