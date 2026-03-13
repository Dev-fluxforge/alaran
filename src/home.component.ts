
import { Component, ChangeDetectionStrategy, inject, signal, HostListener, computed, OnInit, OnDestroy, ElementRef, viewChild, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService, Service, Stat } from './data.service';
import { UiStateService } from './ui-state.service';
import { MapComponent } from './map.component';
import { StatsChartComponent } from './stats-chart.component';
import { StatsPieChartComponent } from './stats-pie-chart.component';
import { animate, stagger } from 'motion';

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

  currentTestimonialIndex = signal(0);
  currentQuoteIndex = signal(0);
  
  private testimonialInterval: any;
  private quoteInterval: any;

  testimonialCard = viewChild<ElementRef>('testimonialCard');
  quoteCard = viewChild<ElementRef>('quoteCard');

  surveyingQuotes = signal([
    { quote: "I was once a surveyor.", author: "George Washington", title: "1st U.S. President", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg/500px-Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg", country: "us" },
    { quote: "The work of the surveyor is the basis of all property rights.", author: "Abraham Lincoln", title: "16th U.S. President", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Abraham_Lincoln_head_on_shoulders_photo_portrait.jpg/800px-Abraham_Lincoln_head_on_shoulders_photo_portrait.jpg", country: "us" },
    { quote: "The surveyor is the pioneer of civilization.", author: "Thomas Jefferson", title: "3rd U.S. President", imageUrl: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=400&h=400", country: "us" },
    { quote: "Geography is the subject which holds the key to our future.", author: "Michael Palin", title: "Geographer & Broadcaster", imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400", country: "gb" },
    { quote: "Everything happens somewhere.", author: "Nancy Tosta", title: "Geospatial Expert", imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400", country: "us" },
    { quote: "The application of GIS is limited only by the imagination of those who use it.", author: "Jack Dangermond", title: "Founder of Esri", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400", country: "us" },
    { quote: "Buy land, they're not making it anymore.", author: "Mark Twain", title: "Author & Humorist", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400", country: "us" },
    { quote: "Without geography, you're nowhere.", author: "Jimmy Buffett", title: "Musician & Pilot", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400", country: "us" },
    { quote: "The map is not the territory.", author: "Alfred Korzybski", title: "Philosopher & Scientist", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400", country: "pl" },
    { quote: "Surveying is the art of making the invisible visible.", author: "Unknown", title: "Industry Proverb", imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?auto=format&fit=crop&q=80&w=400&h=400", country: "ng" },
    { quote: "A surveyor is a person who measures the land to determine its boundaries and features.", author: "Henry David Thoreau", title: "Author & Surveyor", imageUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=400&h=400", country: "us" },
    { quote: "The history of the world is the history of the map.", author: "John Noble Wilford", title: "Science Journalist", imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400", country: "us" },
    { quote: "Precision is the soul of surveying.", author: "Old Surveyor's Maxim", title: "Traditional Wisdom", imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=400", country: "ng" },
    { quote: "Knowing where things are, and why, is the essential first step in making the world a better place.", author: "Jack Dangermond", title: "GIS Pioneer", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400", country: "us" },
    { quote: "The land is the only thing that lasts.", author: "Margaret Mitchell", title: "Author of Gone with the Wind", imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400", country: "us" },
    { quote: "Maps are a way of organizing wonder.", author: "Peter Steinhart", title: "Nature Writer", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400", country: "us" },
    { quote: "Man is a spatial animal.", author: "Edward T. Hall", title: "Anthropologist", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=400", country: "us" },
    { quote: "The survey is the first step in any great endeavor.", author: "Ancient Builder's Creed", title: "Historical Wisdom", imageUrl: "https://images.unsplash.com/photo-1590086782792-42dd2350140d?auto=format&fit=crop&q=80&w=400&h=400", country: "eg" },
    { quote: "To know the land is to respect the land.", author: "Indigenous Proverb", title: "Cultural Wisdom", imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400&h=400", country: "au" },
    { quote: "Data is the new oil, but spatial data is the engine.", author: "Modern Geospatialist", title: "Industry Insight", imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=400&h=400", country: "de" }
  ]);




  constructor() {
    effect(() => {
      const index = this.currentTestimonialIndex();
      const el = this.testimonialCard()?.nativeElement;
      if (el) {
        animate(el, { opacity: [0, 1], x: [20, 0], scale: [0.98, 1] }, { duration: 1.2, ease: 'easeOut' });
      }
    });

    effect(() => {
      const index = this.currentQuoteIndex();
      const el = this.quoteCard()?.nativeElement;
      if (el) {
        animate(el, { opacity: [0, 1], y: [20, 0] }, { duration: 1.5, ease: 'easeOut' });
      }
    });
  }

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  private startAutoPlay(): void {
    this.testimonialInterval = setInterval(() => {
      this.nextTestimonial();
    }, 8000);

    this.quoteInterval = setInterval(() => {
      this.nextQuote();
    }, 12000);
  }

  private stopAutoPlay(): void {
    if (this.testimonialInterval) clearInterval(this.testimonialInterval);
    if (this.quoteInterval) clearInterval(this.quoteInterval);
  }

  selectService(service: Service): void {
    this.uiStateService.selectService(service);
  }

  selectStat(stat: Stat): void {
    this.uiStateService.selectStat(stat);
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

