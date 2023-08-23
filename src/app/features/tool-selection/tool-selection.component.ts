import { Component } from '@angular/core';

@Component({
  selector: 'app-tool-selection',
  templateUrl: './tool-selection.component.html',
  styleUrls: ['./tool-selection.component.scss']
})
export class ToolSelectionComponent {

  tools = [
    {
      name: 'Lap Comparison',
      description: 'Compare laps from the same track.',
      link: '/lap-comparison',
      image: '/assets/tool-background-images/lap-comparison.png'
    },
    // Add more tools here
  ];

}
