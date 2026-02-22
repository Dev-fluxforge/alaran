
import { Injectable, signal } from '@angular/core';
import { Service } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class UiStateService {
  readonly selectedService = signal<Service | null>(null);
  readonly isSearchModalOpen = signal(false);
  readonly hoveredProjectId = signal<string | null>(null);

  selectService(service: Service): void {
    this.selectedService.set(service);
  }

  setHoveredProject(id: string | null): void {
    this.hoveredProjectId.set(id);
  }

  closeModal(): void {
    this.selectedService.set(null);
  }

  openSearchModal(): void {
    this.isSearchModalOpen.set(true);
  }

  closeSearchModal(): void {
    this.isSearchModalOpen.set(false);
  }
}
