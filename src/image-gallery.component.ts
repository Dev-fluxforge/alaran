import { Component, ChangeDetectionStrategy, input, signal, viewChildren, ElementRef, effect, HostListener } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <div class="gallery-container">
      <!-- Main Image Display -->
      <div class="relative w-full h-[1000px] rounded-2xl overflow-hidden shadow-2xl bg-deep-green/5 group"
           (touchstart)="onTouchStart($event)"
           (touchend)="onTouchEnd($event)">
        
        @for (imageUrl of imageUrls(); track $index) {
          @if (isVideo(imageUrl)) {
            <video #mainVideo
                   [src]="imageUrl"
                   class="w-full h-full object-contain absolute top-0 left-0 transition-all duration-700 ease-in-out"
                   [class.opacity-0]="currentIndex() !== $index"
                   [class.scale-110]="currentIndex() !== $index"
                   [attr.data-index]="$index"
                   muted
                   loop
                   playsinline
                   preload="metadata">
            </video>
          } @else {
            <img [ngSrc]="imageUrl" 
                 [alt]="'Gallery image ' + ($index + 1)" 
                 fill 
                 class="w-full h-full object-contain absolute top-0 left-0 transition-all duration-700 ease-in-out"
                 [class.opacity-0]="currentIndex() !== $index"
                 [class.scale-110]="currentIndex() !== $index"
                 [priority]="$index === 0" />
          }
        }

        <!-- Navigation Overlay -->
        @if (imageUrls().length > 1) {
          <div class="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <button (click)="prev($event)" 
                    class="w-12 h-12 rounded-full bg-white/90 dark:bg-deep-green/90 text-deep-green dark:text-white hover:bg-primary hover:text-deep-green flex items-center justify-center shadow-xl transition-all hover:scale-110 focus:outline-none"
                    aria-label="Previous image">
              <span class="material-symbols-outlined">arrow_back</span>
            </button>
            <button (click)="next($event)" 
                    class="w-12 h-12 rounded-full bg-white/90 dark:bg-deep-green/90 text-deep-green dark:text-white hover:bg-primary hover:text-deep-green flex items-center justify-center shadow-xl transition-all hover:scale-110 focus:outline-none"
                    aria-label="Next image">
              <span class="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>

          <!-- Counter -->
          <div class="absolute bottom-6 right-6 z-20 bg-black/50 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
            {{ currentIndex() + 1 }} / {{ imageUrls().length }}
          </div>
        }
      </div>

      <!-- Thumbnail Navigation -->
      @if (imageUrls().length > 1) {
        <div class="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          @for (imageUrl of imageUrls(); track $index) {
            <button 
              (click)="setIndex($index)"
              class="relative flex-shrink-0 w-24 aspect-video rounded-lg overflow-hidden border-2 transition-all duration-300"
              [class]="currentIndex() === $index ? 'border-primary ring-4 ring-primary/20 scale-105 z-10' : 'border-transparent opacity-50 hover:opacity-100'">
              @if (isVideo(imageUrl)) {
                <video [src]="imageUrl" class="w-full h-full object-cover" muted preload="metadata"></video>
                <div class="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span class="material-symbols-outlined text-white text-lg drop-shadow">play_circle</span>
                </div>
              } @else {
                <img [ngSrc]="imageUrl" [alt]="'Thumbnail ' + ($index + 1)" 
                     width="96" height="54"
                     class="w-full h-full object-cover">
              }
              @if (currentIndex() === $index) {
                <div class="absolute inset-0 bg-primary/10"></div>
              }
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageGalleryComponent {
  imageUrls = input<string[]>([]);
  currentIndex = signal(0);
  private touchStartX = 0;
  private static readonly VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.ogg'];

  private mainVideos = viewChildren<ElementRef<HTMLVideoElement>>('mainVideo');

  constructor() {
    effect(() => {
      const active = this.currentIndex();

      for (const ref of this.mainVideos()) {
        const video = ref.nativeElement;
        const index = Number(video.dataset['index']);
        if (index === active) {
          video.play().catch(err => console.warn('Gallery video failed to play:', video.src, err));
        } else {
          video.pause();
        }
      }
    });
  }

  // Arrow-key navigation. Ignored while the user is typing in a form field
  // elsewhere on the page, so it never fights with normal text editing.
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.imageUrls().length <= 1) return;

    const target = event.target as HTMLElement | null;
    const tag = target?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) {
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.prev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.next();
    }
  }

  isVideo(url: string): boolean {
    const clean = url.split('?')[0].toLowerCase();
    return ImageGalleryComponent.VIDEO_EXTENSIONS.some(ext => clean.endsWith(ext));
  }

  next(event?: Event): void {
    if (event) event.stopPropagation();
    const total = this.imageUrls().length;
    if (total > 1) {
      this.currentIndex.update(i => (i + 1) % total);
    }
  }

  prev(event?: Event): void {
    if (event) event.stopPropagation();
    const total = this.imageUrls().length;
    if (total > 1) {
      this.currentIndex.update(i => (i - 1 + total) % total);
    }
  }

  setIndex(index: number): void {
    this.currentIndex.set(index);
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
        this.next();
      } else {
        this.prev();
      }
    }
  }
}
