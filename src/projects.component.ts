
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
}
