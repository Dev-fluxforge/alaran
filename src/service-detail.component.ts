
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { DataService, Service, Project } from './data.service';
import { MapComponent } from './map.component';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MapComponent],
  templateUrl: './service-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceDetailComponent {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  
  private slug = toSignal(this.route.paramMap.pipe(map(params => params.get('slug'))));
  
  service = computed(() => {
    const slug = this.slug();
    if (!slug) return undefined;
    return this.dataService.services().find(s => s.slug === slug);
  });

  relatedProjects = computed(() => {
    const s = this.service();
    if (!s) return [];
    return this.dataService.projects().filter(p => p.serviceCategory === s.title);
  });
}
