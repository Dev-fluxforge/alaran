
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from './data.service';
import { MapComponent } from './map.component';
import { UiStateService } from './ui-state.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RouterLink, MapComponent],
  templateUrl: './projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onWindowScroll()'
  }
})
export class ProjectsComponent {
  private dataService = inject(DataService);
  private uiStateService = inject(UiStateService);

  private allProjects = this.dataService.projects;
  services = this.dataService.services;
  
  activeCategory = signal<string>('All');
  hoveredProjectId = this.uiStateService.hoveredProjectId;
  showScrollTop = signal<boolean>(false);
  
  categoriesWithCounts = computed(() => {
    const projects = this.allProjects();
    const services = this.services();
    
    const counts = services.map(service => ({
      title: service.title,
      count: projects.filter(p => p.serviceCategory === service.title).length
    }));
    
    return [
      { title: 'All', count: projects.length },
      ...counts
    ];
  });
  
  filteredProjects = computed(() => {
    const category = this.activeCategory();
    const projects = this.allProjects();
    
    if (category === 'All') {
      return projects;
    }
    
    return projects.filter(p => p.serviceCategory === category);
  });
  
  setFilter(category: string): void {
    this.activeCategory.set(category);
  }

  setHoveredProject(id: string | null): void {
    this.uiStateService.setHoveredProject(id);
  }

  onWindowScroll(): void {
    const scrollOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showScrollTop.set(scrollOffset > 400);
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
