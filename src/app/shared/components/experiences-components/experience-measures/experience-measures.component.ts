import { Component, Input } from '@angular/core';

export interface MeasureCard {
  value: string;
  label: string;
  graphicType: 'blob' | 'progress' | 'overlapping-circles' | 'number-outline';
  graphicValue?: number; // For progress bar percentage or number outline
}

@Component({
  selector: 'app-experience-measures',
  templateUrl: './experience-measures.component.html',
  styleUrls: ['./experience-measures.component.scss']
})
export class ExperienceMeasuresComponent {
  @Input() measures: MeasureCard[] = [
    {
      value: '10+',
      label: 'years of expertise',
      graphicType: 'overlapping-circles'
    },
    {
      value: '92%',
      label: 'client retention',
      graphicType: 'progress',
      graphicValue: 84
    },
    {
      value: '300+',
      label: 'corporate events delivered',
      graphicType: 'blob'
    },
    {
      value: '50+',
      label: 'brands partnered',
      graphicType: 'number-outline',
      graphicValue: 30
    },
    {
      value: '10+',
      label: 'years of expertise',
      graphicType: 'number-outline',
      graphicValue: 40
    }
  ];

  getProgressDashOffset(percentage: number): number {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    return circumference * (1 - percentage / 100);
  }

  getProgressDashArray(percentage: number): number {
    const radius = 80;
    return 2 * Math.PI * radius;
  }
}
