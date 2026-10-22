import { Component, ChangeDetectionStrategy, computed, input, signal } from '@angular/core';
import { truncateAtWord } from './text-utils';

/**
 * Shows a short preview of a long text with a "Read more" / "Show less" toggle.
 * The full text is only swapped in on click, so cards stay compact by default.
 */
@Component({
  selector: 'app-read-more',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block grow mb-6' },
  template: `
    <p [class]="textClass()">{{ shown() }}</p>
    @if (isLong()) {
      <button
        type="button"
        (click)="toggle()"
        [attr.aria-expanded]="expanded()"
        class="relative z-10 mt-3 text-primary text-sm font-bold hover:underline focus-visible:outline-primary">
        {{ expanded() ? 'Show less' : 'Read more' }}
      </button>
    }
  `,
})
export class ReadMoreComponent {
  text = input.required<string>();
  limit = input(130);
  textClass = input('text-sm leading-relaxed');

  expanded = signal(false);
  isLong = computed(() => this.text().trim().length > this.limit());
  shown = computed(() =>
    this.expanded() || !this.isLong() ? this.text() : truncateAtWord(this.text(), this.limit())
  );

  toggle(): void {
    this.expanded.update(v => !v);
  }
}
