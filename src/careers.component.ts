
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-careers',
  standalone: true,
  templateUrl: './careers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareersComponent {
  private dataService = inject(DataService);
  jobs = this.dataService.jobs;
}
