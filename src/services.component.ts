
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DataService, Service } from './data.service';
import { UiStateService } from './ui-state.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [],
  templateUrl: './services.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesComponent {
  private dataService = inject(DataService);
  private uiStateService = inject(UiStateService);

  services = this.dataService.services;
  
  selectService(service: Service): void {
    this.uiStateService.selectService(service);
  }
}
