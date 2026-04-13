
import { Injectable, signal } from '@angular/core';
import { Service, Stat } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class UiStateService {
  readonly isDarkMode = signal<boolean>(false);
  readonly selectedService = signal<Service | null>(null);
  readonly selectedStat = signal<Stat | null>(null);
  readonly isSearchModalOpen = signal(false);
  readonly hoveredProjectId = signal<string | null>(null);

  constructor() {
    this.initializeDarkMode();
  }

  private initializeDarkMode(): void {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.isDarkMode.set(mediaQuery.matches);

      // Listen for system theme changes
      mediaQuery.addEventListener('change', (e) => {
        this.isDarkMode.set(e.matches);
      });
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode.update(v => !v);
  }

  selectService(service: Service): void {
    this.selectedService.set(service);
  }

  selectStat(stat: Stat | null): void {
    this.selectedStat.set(stat);
  }

  setHoveredProject(id: string | null): void {
    this.hoveredProjectId.set(id);
  }

  closeModal(): void {
    this.selectedService.set(null);
    this.selectedStat.set(null);
  }

  openSearchModal(): void {
    this.isSearchModalOpen.set(true);
  }

  closeSearchModal(): void {
    this.isSearchModalOpen.set(false);
  }
}
