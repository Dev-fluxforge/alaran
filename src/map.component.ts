
import { Component, OnInit, OnDestroy, ElementRef, ViewChild, inject, input, effect, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { Project } from './data.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-deep-green/10 dark:border-white/10">
      <div #mapContainer class="w-full h-full z-0"></div>
      
      <!-- Enhanced Map Legend -->
      <div class="absolute top-4 right-4 z-[1000] bg-white/95 dark:bg-deep-green/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-deep-green/10 dark:border-white/10 w-56">
        <h4 class="text-[10px] font-bold uppercase tracking-[0.2em] text-deep-green/40 dark:text-white/40 mb-3">Service Areas</h4>
        <div class="space-y-2.5">
          @for (item of legendItems; track item.label) {
            <div class="flex items-center gap-3 group cursor-default">
              <span [class]="'w-3 h-3 rounded-full shrink-0 shadow-sm ' + item.colorClass"></span>
              <span class="text-[11px] font-semibold text-deep-green/80 dark:text-white/80 leading-tight">{{ item.label }}</span>
            </div>
          }
        </div>
        <div class="mt-4 pt-3 border-t border-deep-green/5 dark:border-white/5">
          <p class="text-[9px] text-deep-green/40 dark:text-white/30 italic">Nationwide project coverage across Nigeria.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    .leaflet-control-container {
      z-index: 40;
    }
    ::ng-deep .custom-div-icon {
      background: none !important;
      border: none !important;
    }
    @keyframes marker-ripple {
      0% { transform: scale(0.8); opacity: 0.8; }
      100% { transform: scale(2.5); opacity: 0; }
    }
    .marker-ripple {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      animation: marker-ripple 2s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
    .ripple-2 {
      animation-delay: 1s;
    }
    @keyframes marker-drop {
      0% { transform: translateY(-30px) scale(0); opacity: 0; }
      60% { transform: translateY(10px) scale(1.1); opacity: 1; }
      100% { transform: translateY(0) scale(1); opacity: 1; }
    }
    .marker-container {
      animation: marker-drop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    .marker-core {
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .custom-div-icon:hover .marker-core {
      transform: scale(1.4);
      box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.5);
    }
  `]
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  
  projects = input<Project[]>([]);
  
  private map?: L.Map;
  private markers: L.Marker[] = [];

  readonly legendItems = [
    { label: 'Engineering Surveying', colorClass: 'bg-primary' },
    { label: 'Cadastral Surveying', colorClass: 'bg-blue-500' },
    { label: 'Hydrographic Surveying', colorClass: 'bg-cyan-500' },
    { label: 'Aerial Mapping', colorClass: 'bg-purple-500' }
  ];

  private categoryColors: Record<string, string> = {
    'Engineering Surveying': 'bg-primary',
    'Cadastral Surveying': 'bg-blue-500',
    'Hydrographic Surveying': 'bg-cyan-500',
    'Aerial Mapping': 'bg-purple-500'
  };

  private categoryTextColors: Record<string, string> = {
    'Engineering Surveying': 'text-primary',
    'Cadastral Surveying': 'text-blue-500',
    'Hydrographic Surveying': 'text-cyan-500',
    'Aerial Mapping': 'text-purple-500'
  };

  constructor() {
    effect(() => {
      this.addMarkers();
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    // Default center of Nigeria
    const center: L.LatLngExpression = [9.0820, 8.6753];
    
    this.map = L.map(this.mapContainer.nativeElement, {
      center: center,
      zoom: 6,
      scrollWheelZoom: false // Better for page scrolling
    });

    // Add Tile Layer (using a clean, modern style)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(this.map);

    this.addMarkers();
  }

  private addMarkers(): void {
    if (!this.map) return;

    // Clear existing markers
    this.markers.forEach(m => m.remove());
    this.markers = [];

    const projectList = this.projects();
    const bounds = L.latLngBounds([]);

    projectList.forEach(project => {
      if (project.coordinates) {
        const colorClass = this.categoryColors[project.serviceCategory] || 'bg-slate-400';
        const textColorClass = this.categoryTextColors[project.serviceCategory] || 'text-slate-400';
        
        const markerIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div class="w-8 h-8 flex items-center justify-center marker-container">
              <div class="absolute inset-0 ${colorClass} marker-ripple"></div>
              <div class="absolute inset-0 ${colorClass} marker-ripple ripple-2"></div>
              <div class="relative w-4 h-4 ${colorClass} rounded-full border-2 border-white shadow-lg flex items-center justify-center z-10 marker-core">
                <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([project.coordinates.lat, project.coordinates.lng], { icon: markerIcon })
          .addTo(this.map!)
          .bindPopup(`
            <div class="p-3 min-w-[200px]">
              <div class="flex items-center gap-2 mb-2">
                <span class="w-2 h-2 rounded-full ${colorClass}"></span>
                <span class="text-[10px] font-bold uppercase tracking-wider ${textColorClass}">${project.serviceCategory}</span>
              </div>
              <h5 class="font-bold text-deep-green dark:text-white text-sm mb-1">${project.title}</h5>
              <p class="text-[11px] text-deep-green/60 dark:text-white/60 mb-3 flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">location_on</span>
                ${project.location}
              </p>
              <a href="#/project/${project.slug}" class="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline">
                View Project Details
                <span class="material-symbols-outlined text-[10px]">arrow_forward</span>
              </a>
            </div>
          `, {
            className: 'custom-popup',
            maxWidth: 300
          });

        this.markers.push(marker);
        bounds.extend([project.coordinates.lat, project.coordinates.lng]);
      }
    });

    // Fit bounds if we have markers
    if (this.markers.length > 0) {
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }
}
