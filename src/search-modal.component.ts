
import { Component, ChangeDetectionStrategy, input, output, effect, viewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';

interface SearchResult {
  type: 'Service' | 'Project';
  title: string;
  description: string;
  link: string;
}

@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './search-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onClose()',
    '(document:keydown.tab)': 'onTab($event)',
  }
})
export class SearchModalComponent {
  query = input<string>('');
  results = input<SearchResult[]>([]);
  close = output<void>();
  queryChange = output<string>();

  searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  modalContainer = viewChild<ElementRef<HTMLElement>>('modalContainer');

  constructor() {
    // Autofocus the input when the modal is created
    effect(() => {
        const searchInput = this.searchInput();
        if (searchInput) {
            searchInput.nativeElement.focus();
        }
    });
  }

  onTab(event: KeyboardEvent): void {
    if (!this.modalContainer()) return;
    
    const focusableElements = this.modalContainer()!.nativeElement.querySelectorAll(
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

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.queryChange.emit(inputElement.value);
  }

  onClose(): void {
    this.close.emit();
  }
  
  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).id === 'search-modal-backdrop') {
      this.onClose();
    }
  }

  onResultClick(): void {
    this.onClose();
  }
}
