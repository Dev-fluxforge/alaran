
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { DataService } from './data.service';
import { Project } from './data.service';
import { MapComponent } from './map.component';
import { ImageGalleryComponent } from './image-gallery.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, MapComponent, ImageGalleryComponent],
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
}
