
import { Component, ChangeDetectionStrategy, input, output, signal, effect, viewChild, ElementRef } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Service, Project } from './data.service';
import { MapComponent } from './map.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgOptimizedImage, MapComponent],
  templateUrl: './modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onClose()',
    '(document:keydown.tab)': 'onTab($event)',
  }
})
export class ModalComponent {
  service = input.required<Service>();
  projects = input<Project[]>([]);
  close = output<void>();

  closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');
  modalContainer = viewChild<ElementRef<HTMLElement>>('modalContainer');

  currentImageIndices = signal<Map<string, number>>(new Map());
  private touchStartX = 0;

  constructor() {
    effect(() => {
      const newMap = new Map<string, number>();
      this.projects().forEach(p => {
        newMap.set(p.title, 0);
      });
      this.currentImageIndices.set(newMap);
    });

    effect(() => {
      const closeButton = this.closeButton();
      if (closeButton) {
        closeButton.nativeElement.focus();
      }
    });
  }

  onTab(event: KeyboardEvent): void {
    const container = this.modalContainer();
    if (!container) return;
    
    const focusableElements = container.nativeElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).id === 'modal-backdrop') {
      this.onClose();
    }
  }

  getCurrentImageIndex(projectTitle: string): number {
    return this.currentImageIndices().get(projectTitle) ?? 0;
  }

  nextImage(project: Project): void {
    const currentIndex = this.getCurrentImageIndex(project.title);
    const nextIndex = (currentIndex + 1) % project.imageUrls.length;
    this.setCurrentImageIndex(project, nextIndex);
  }

  prevImage(project: Project): void {
    const currentIndex = this.getCurrentImageIndex(project.title);
    const prevIndex = (currentIndex - 1 + project.imageUrls.length) % project.imageUrls.length;
    this.setCurrentImageIndex(project, prevIndex);
  }

  setCurrentImageIndex(project: Project, index: number): void {
    this.currentImageIndices.update(map => {
        const newMap = new Map(map);
        newMap.set(project.title, index);
        return newMap;
    });
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent, project: Project): void {
    const touchEndX = event.changedTouches[0].clientX;
    const deltaX = this.touchStartX - touchEndX;
    const swipeThreshold = 50;

    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        this.nextImage(project);
      } else {
        this.prevImage(project);
      }
    }
  }
}
