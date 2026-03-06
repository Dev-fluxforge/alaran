
import { Component, ChangeDetectionStrategy, inject, signal, HostListener, computed, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService, Service, Stat } from './data.service';
import { UiStateService } from './ui-state.service';
import { MapComponent } from './map.component';
import { StatsChartComponent } from './stats-chart.component';
import { StatsPieChartComponent } from './stats-pie-chart.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MapComponent, StatsChartComponent, StatsPieChartComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private uiStateService = inject(UiStateService);

  services = this.dataService.services;
  stats = this.dataService.stats;
  partners = this.dataService.partners;
  technologies = this.dataService.technologies;
  testimonials = this.dataService.testimonials;
  projects = this.dataService.projects;

  currentQuoteIndex = signal(0);
  
  private quoteInterval: any;

  surveyingQuotes = signal([
    { quote: "I was once a surveyor.", author: "George Washington", title: "1st U.S. President", imageUrl: "https://images.unsplash.com/photo-1580129924098-9533375803fa?auto=format&fit=crop&q=80&w=400&h=400" },
    { quote: "The work of the surveyor is the basis of all property rights.", author: "Abraham Lincoln", title: "16th U.S. President", imageUrl: "https://images.unsplash.com/photo-1585076641399-5c0f74408027?auto=format&fit=crop&q=80&w=400&h=400" },
    { quote: "The surveyor is the pioneer of civilization.", author: "Thomas Jefferson", title: "3rd U.S. President", imageUrl: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=400&h=400" },
    { quote: "Geography is the subject which holds the key to our future.", author: "Michael Palin", title: "Geographer & Broadcaster", imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400" },
    { quote: "Everything happens somewhere.", author: "Nancy Tosta", title: "Geospatial Expert", imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400" },
    { quote: "The application of GIS is limited only by the imagination of those who use it.", author: "Jack Dangermond", title: "Founder of Esri", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400" },
    { quote: "Buy land, they're not making it anymore.", author: "Mark Twain", title: "Author & Humorist", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400" },
    { quote: "Without geography, you're nowhere.", author: "Jimmy Buffett", title: "Musician & Pilot", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400" },
    { quote: "The map is not the territory.", author: "Alfred Korzybski", title: "Philosopher & Scientist", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400" },
    { quote: "Surveying is the art of making the invisible visible.", author: "Unknown", title: "Industry Proverb", imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=400&h=400" },
    { quote: "A surveyor is a person who measures the land to determine its boundaries and features.", author: "Henry David Thoreau", title: "Author & Surveyor", imageUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=400&h=400" },
    { quote: "The history of the world is the history of the map.", author: "John Noble Wilford", title: "Science Journalist", imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400" },
    { quote: "Precision is the soul of surveying.", author: "Old Surveyor's Maxim", title: "Traditional Wisdom", imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=400" },
    { quote: "Knowing where things are, and why, is the essential first step in making the world a better place.", author: "Jack Dangermond", title: "GIS Pioneer", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400" },
    { quote: "The land is the only thing that lasts.", author: "Margaret Mitchell", title: "Author of Gone with the Wind", imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400" },
    { quote: "Maps are a way of organizing wonder.", author: "Peter Steinhart", title: "Nature Writer", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400" }
  ]);

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  private startAutoPlay(): void {
    this.quoteInterval = setInterval(() => {
      this.nextQuote();
    }, 8000);
  }

  private stopAutoPlay(): void {
    if (this.quoteInterval) clearInterval(this.quoteInterval);
  }

  selectService(service: Service): void {
    this.uiStateService.selectService(service);
  }

  selectStat(stat: Stat): void {
    this.uiStateService.selectStat(stat);
  }

  nextQuote(): void {
    const total = this.surveyingQuotes().length;
    this.currentQuoteIndex.update(i => (i + 1) % total);
  }

  prevQuote(): void {
    const total = this.surveyingQuotes().length;
    this.currentQuoteIndex.update(i => (i - 1 + total) % total);
  }

  setQuoteIndex(index: number): void {
    this.currentQuoteIndex.set(index);
  }
}
