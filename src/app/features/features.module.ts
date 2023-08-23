import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LapComparisonComponent } from './lap-comparison/lap-comparison.component';
import { ToolSelectionComponent } from './tool-selection/tool-selection.component';
import { SharedModule } from "../shared/shared.module";
import { RouterModule } from "@angular/router";
import { TelemetryAnalysisComponent } from './lap-comparison/components/telemetry-analysis-component/telemetry-analysis.component';
import { TrackMapComponent } from './lap-comparison/components/track-map/track-map.component';

@NgModule({
    declarations: [
        LapComparisonComponent,
        ToolSelectionComponent,
        TelemetryAnalysisComponent,
        TrackMapComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        RouterModule
    ]
})
export class FeaturesModule { }
