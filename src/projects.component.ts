
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from './data.service';
import { MapComponent } from './map.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, MapComponent],
  templateUrl: './projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent {
  private dataService = inject(DataService);

  private allProjects = this.dataService.projects;
  services = this.dataService.services;
  
  activeCategory = signal<string>('All');
  
  filteredProjects = computed(() => {
    const category = this.activeCategory();
    if (category === 'All') {
      return this.allProjects();
    }
    const service = this.services().find(s => s.title === category);
    return this.allProjects().filter(p => p.serviceCategory === service?.title);
  });
  
  setFilter(category: string): void {
    this.activeCategory.set(category);
  }
}
