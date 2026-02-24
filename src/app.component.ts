
import { Component, ChangeDetectionStrategy, signal, computed, effect, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ModalComponent } from './modal.component';
import { SearchModalComponent } from './search-modal.component';
import { DataService, Project, Service } from './data.service';
import { UiStateService } from './ui-state.service';

interface SearchResult {
  type: 'Service' | 'Project';
  title: string;
  description: string;
  link: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ModalComponent, SearchModalComponent]
})
export class AppComponent {
  public dataService = inject(DataService);
  private uiStateService = inject(UiStateService);

  isDarkMode = signal<boolean>(false);
  isMenuOpen = signal<boolean>(false);
  isMenuHovered = signal<boolean>(false);
  currentYear = signal(new Date().getFullYear());
  
  selectedService = this.uiStateService.selectedService;
  selectedStat = this.uiStateService.selectedStat;
  isSearchModalOpen = this.uiStateService.isSearchModalOpen;
  
  private allProjects = this.dataService.projects;
  private allServices = this.dataService.services;

  searchQuery = signal('');

  searchResults = computed<SearchResult[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (query.length < 2) {
      return [];
    }
    
    const projectResults: SearchResult[] = this.allProjects()
      .filter(p => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query))
      .map(p => ({
        type: 'Project',
        title: p.title,
        description: p.description,
        link: `/project/${p.slug}`
      }));

    const serviceResults: SearchResult[] = this.allServices()
      .filter(s => s.title.toLowerCase().includes(query) || s.description.toLowerCase().includes(query))
      .map(s => ({
        type: 'Service',
        title: s.title,
        description: s.description,
        link: '/services'
      }));

    return [...projectResults, ...serviceResults];
  });

  selectedServiceProjects = computed(() => {
    const service = this.selectedService();
    if (!service) {
      return [];
    }
    return this.allProjects().filter(p => p.serviceCategory === service.title);
  });

  constructor() {
    // Initialize based on user's OS/browser preference
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (isMobile || prefersDark) {
        this.isDarkMode.set(true);
    }

    effect(() => {
      if (typeof document !== 'undefined') {
        if (this.isDarkMode()) {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      }
    });
  }

  closeModal(): void {
    this.uiStateService.closeModal();
  }

  openSearchModal(): void {
    this.uiStateService.openSearchModal();
  }

  closeSearchModal(): void {
    this.uiStateService.closeSearchModal();
    this.searchQuery.set('');
  }

  onQueryChange(query: string): void {
    this.searchQuery.set(query);
  }

  toggleDarkMode(): void {
    this.isDarkMode.update(value => !value);
  }

  toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
    this.isMenuHovered.set(false);
  }
}
