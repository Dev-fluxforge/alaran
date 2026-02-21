
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
  }
})
export class SearchModalComponent {
  query = input<string>('');
  results = input<SearchResult[]>([]);
  close = output<void>();
  queryChange = output<string>();

  searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  constructor() {
    // Autofocus the input when the modal is created
    effect(() => {
        this.searchInput()?.nativeElement.focus();
    });
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
