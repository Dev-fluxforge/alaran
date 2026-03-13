
import { Component, ElementRef, ViewChild, AfterViewInit, inject, effect, ChangeDetectionStrategy, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { DataService } from './data.service';

@Component({
  selector: 'app-stats-pie-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl overflow-hidden">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h3 class="text-xl font-bold text-white">Service Expertise</h3>
          <p class="text-white/50 text-xs uppercase tracking-widest mt-1">By Category Weight</p>
        </div>
      </div>
      
      <div #chartContainer class="w-full h-[300px] relative flex items-center justify-center">
        <svg #svg class="overflow-visible"></svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span class="text-3xl font-black text-white">{{ totalServices() }}</span>
          <span class="text-[10px] text-white/40 font-bold uppercase tracking-widest">Total Services</span>
        </div>
      </div>
      
      <div class="mt-8 space-y-3">
        @for (item of chartData(); track item.category) {
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full" [style.background-color]="item.color"></span>
              <span class="text-xs text-white/70 font-medium">{{ item.category }}</span>
            </div>
            <span class="text-xs font-bold text-white">{{ item.percentage }}%</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    ::ng-deep .arc path {
      transition: all 0.3s ease;
      cursor: pointer;
    }
    ::ng-deep .arc:hover path {
      filter: brightness(1.2);
      transform: scale(1.05);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsPieChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartContainer') container!: ElementRef<HTMLDivElement>;
  @ViewChild('svg') svgElement!: ElementRef<SVGSVGElement>;

  private dataService = inject(DataService);
  private resizeObserver?: ResizeObserver;

  totalServices = computed(() => this.dataService.services().length);
  chartData = computed(() => this.processedData());

  constructor() {
    effect(() => {
      const data = this.chartData();
      if (data.length > 0 && this.svgElement) {
        this.renderChart();
      }
    });
  }

  processedData() {
    const services = this.dataService.services();
    const categories = Array.from(new Set(services.map(s => s.category)));
    const total = services.length;
    
    const colors = ['#00FF00', '#00CC00', '#009900', '#006600'];
    
    return categories.map((cat, i) => {
      const count = services.filter(s => s.category === cat).length;
      return {
        category: cat,
        count: count,
        percentage: Math.round((count / total) * 100),
        color: colors[i % colors.length]
      };
    });
  }

  ngAfterViewInit() {
    this.renderChart();
    
    if (typeof window !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.renderChart();
      });
      this.resizeObserver.observe(this.container.nativeElement);
    }
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  private renderChart() {
    if (!this.svgElement || !this.container) return;

    const data = this.chartData();
    const element = this.svgElement.nativeElement;
    const container = this.container.nativeElement;
    
    const width = Math.min(container.clientWidth, container.clientHeight);
    const height = width;
    const radius = width / 2;

    const svg = d3.select(element)
      .attr('width', width)
      .attr('height', height);
    
    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3.pie<any>()
      .value(d => d.count)
      .sort(null)
      .padAngle(0.05);

    const arc = d3.arc<any>()
      .innerRadius(radius * 0.75)
      .outerRadius(radius)
      .cornerRadius(8);

    const arcs = g.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('fill', d => d.data.color)
      .attr('d', arc)
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(i(t)) || '';
        };
      });
  }
}
