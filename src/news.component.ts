
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from './data.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './news.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent {
  private dataService = inject(DataService);
  articles = this.dataService.news;
}
