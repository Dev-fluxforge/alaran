
import { Component, ChangeDetectionStrategy, inject, signal, HostListener, computed } from '@angular/core';
import { DataService, Service } from './data.service';
import { UiStateService } from './ui-state.service';
import { MapComponent } from './map.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MapComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private dataService = inject(DataService);
  private uiStateService = inject(UiStateService);

  services = this.dataService.services;
  stats = this.dataService.stats;
  partners = this.dataService.partners;
  technologies = this.dataService.technologies;
  testimonials = this.dataService.testimonials;
  projects = this.dataService.projects;

  currentTestimonialIndex = signal(0);
  scrollOffset = signal(0);

  parallaxTransform = computed(() => {
    const offset = this.scrollOffset();
    // Move background at 40% of scroll speed to create parallax effect
    return `translateY(${offset * 0.4}px)`;
  });

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.scrollOffset.set(window.pageYOffset);
  }
  
  selectService(service: Service): void {
    this.uiStateService.selectService(service);
  }

  nextTestimonial(): void {
    const total = this.testimonials().length;
    this.currentTestimonialIndex.update(i => (i + 1) % total);
  }

  prevTestimonial(): void {
    const total = this.testimonials().length;
    this.currentTestimonialIndex.update(i => (i - 1 + total) % total);
  }

  setTestimonialIndex(index: number): void {
    this.currentTestimonialIndex.set(index);
  }
}
