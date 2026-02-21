
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { DataService } from './data.service';
import { Project } from './data.service';
import { MapComponent } from './map.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, MapComponent],
  templateUrl: './project-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailComponent {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  
  private slug = toSignal(this.route.paramMap.pipe(map(params => params.get('slug'))));
  
  project = computed(() => {
    const slug = this.slug();
    if (!slug) return undefined;
    return this.dataService.projects().find(p => p.slug === slug);
  });

  currentImageIndex = signal(0);
  private touchStartX = 0;

  nextImage(): void {
    const proj = this.project();
    if (proj && proj.imageUrls.length > 1) {
      this.currentImageIndex.update(i => (i + 1) % proj.imageUrls.length);
    }
  }

  prevImage(): void {
    const proj = this.project();
    if (proj && proj.imageUrls.length > 1) {
      this.currentImageIndex.update(i => (i - 1 + proj.imageUrls.length) % proj.imageUrls.length);
    }
  }

  setCurrentImageIndex(index: number): void {
    this.currentImageIndex.set(index);
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    const touchEndX = event.changedTouches[0].clientX;
    const deltaX = this.touchStartX - touchEndX;
    const swipeThreshold = 50;

    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        this.nextImage();
      } else {
        this.prevImage();
      }
    }
  }
}
