
import { Component, ChangeDetectionStrategy, inject, signal, HostListener, computed } from '@angular/core';
import { DataService, Service } from './data.service';
import { UiStateService } from './ui-state.service';
import { MapComponent } from './map.component';
import { StatsChartComponent } from './stats-chart.component';
import { StatsPieChartComponent } from './stats-pie-chart.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MapComponent, StatsChartComponent, StatsPieChartComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private dataService = inject(DataService);
  private uiStateService = inject(UiStateService);

  services = this.dataService.services;
  stats = this.dataService.stats;
  partners = this.dataService.partners;
  technologies = this.dataService.technologies;
  testimonials = this.dataService.testimonials;
  projects = this.dataService.projects;

  currentTestimonialIndex = signal(0);
  currentQuoteIndex = signal(0);
  scrollOffset = signal(0);

  surveyingQuotes = signal([
    { quote: "I was once a surveyor.", author: "George Washington", title: "1st U.S. President" },
    { quote: "The work of the surveyor is the basis of all property rights.", author: "Abraham Lincoln", title: "16th U.S. President" },
    { quote: "The surveyor is the pioneer of civilization.", author: "Thomas Jefferson", title: "3rd U.S. President" },
    { quote: "Geography is the subject which holds the key to our future.", author: "Michael Palin", title: "Geographer & Broadcaster" },
    { quote: "Everything happens somewhere.", author: "Nancy Tosta", title: "Geospatial Expert" },
    { quote: "The application of GIS is limited only by the imagination of those who use it.", author: "Jack Dangermond", title: "Founder of Esri" },
    { quote: "Buy land, they're not making it anymore.", author: "Mark Twain", title: "Author & Humorist" },
    { quote: "Without geography, you're nowhere.", author: "Jimmy Buffett", title: "Musician & Pilot" },
    { quote: "The map is not the territory.", author: "Alfred Korzybski", title: "Philosopher & Scientist" },
    { quote: "Surveying is the art of making the invisible visible.", author: "Unknown", title: "Industry Proverb" },
    { quote: "A surveyor is a person who measures the land to determine its boundaries and features.", author: "Henry David Thoreau", title: "Author & Surveyor" },
    { quote: "The history of the world is the history of the map.", author: "John Noble Wilford", title: "Science Journalist" },
    { quote: "Precision is the soul of surveying.", author: "Old Surveyor's Maxim", title: "Traditional Wisdom" },
    { quote: "Knowing where things are, and why, is the essential first step in making the world a better place.", author: "Jack Dangermond", title: "GIS Pioneer" },
    { quote: "The land is the only thing that lasts.", author: "Margaret Mitchell", title: "Author of Gone with the Wind" },
    { quote: "Maps are a way of organizing wonder.", author: "Peter Steinhart", title: "Nature Writer" }
  ]);

  parallaxTransform = computed(() => {
    const offset = this.scrollOffset();
    // Move background at 40% of scroll speed to create parallax effect
    return `translateY(${offset * 0.4}px)`;
  });

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.scrollOffset.set(window.pageYOffset);
  }
  
  selectService(service: Service): void {
    this.uiStateService.selectService(service);
  }

  nextTestimonial(): void {
    const total = this.testimonials().length;
    this.currentTestimonialIndex.update(i => (i + 1) % total);
  }

  prevTestimonial(): void {
    const total = this.testimonials().length;
    this.currentTestimonialIndex.update(i => (i - 1 + total) % total);
  }

  setTestimonialIndex(index: number): void {
    this.currentTestimonialIndex.set(index);
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
