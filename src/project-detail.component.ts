
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { DataService } from './data.service';
import { Project } from './data.service';
import { ImageGalleryComponent } from './image-gallery.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ImageGalleryComponent],
  templateUrl: './project-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailComponent {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private sanitizer = inject(DomSanitizer);

  private slug = toSignal(this.route.paramMap.pipe(map(params => params.get('slug'))));

  project = computed(() => {
    const slug = this.slug();
    if (!slug) return undefined;
    return this.dataService.projects().find(p => p.slug === slug);
  });

  // Same reliable embed format used on the Contact page's office map —
  // no API key, no extra library, just Google's public embed endpoint.
  mapEmbedUrl(project: Project): SafeResourceUrl {
    const coords = project.coordinates;
    const query = coords ? `${coords.lat},${coords.lng}` : encodeURIComponent(project.location);
    const url = `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
