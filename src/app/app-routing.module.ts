import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToolSelectionComponent } from "./features/tool-selection/tool-selection.component";
import { LapComparisonComponent } from "./features/lap-comparison/lap-comparison.component";

const routes: Routes = [
  { path: 'lap-comparison', component: LapComparisonComponent },
  { path: '', component: ToolSelectionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
