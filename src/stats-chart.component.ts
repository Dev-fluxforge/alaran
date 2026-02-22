
import { Component, ElementRef, ViewChild, AfterViewInit, inject, effect, ChangeDetectionStrategy, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { DataService } from './data.service';

@Component({
  selector: 'app-stats-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl overflow-hidden">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h3 class="text-xl font-bold text-white">Project Distribution</h3>
          <p class="text-white/50 text-xs uppercase tracking-widest mt-1">By Service Category</p>
        </div>
        <div class="flex gap-2">
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-primary"></span>
            <span class="text-[10px] text-white/60 font-medium uppercase tracking-tighter">Projects</span>
          </div>
        </div>
      </div>
      
      <div #chartContainer class="w-full h-[300px] relative">
        <svg #svg class="w-full h-full overflow-visible"></svg>
      </div>
      
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
        @for (item of chartData(); track item.category) {
          <div class="flex flex-col">
            <span class="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{{ item.category.split(' ')[0] }}</span>
            <span class="text-lg font-black text-white">{{ item.count }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    ::ng-deep .domain {
      display: none;
    }
    ::ng-deep .tick line {
      stroke: rgba(255, 255, 255, 0.1);
    }
    ::ng-deep .tick text {
      fill: rgba(255, 255, 255, 0.4);
      font-size: 10px;
      font-family: inherit;
      font-weight: 500;
    }
    ::ng-deep .bar-rect {
      transition: all 0.3s ease;
    }
    ::ng-deep .bar-rect:hover {
      filter: brightness(1.2);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartContainer') container!: ElementRef<HTMLDivElement>;
  @ViewChild('svg') svgElement!: ElementRef<SVGSVGElement>;

  private dataService = inject(DataService);
  private resizeObserver?: ResizeObserver;

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
    const projects = this.dataService.projects();
    const categories = Array.from(new Set(projects.map(p => p.serviceCategory)));
    return categories.map(cat => ({
      category: cat,
      count: projects.filter(p => p.serviceCategory === cat).length
    }));
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
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    const margin = { top: 20, right: 20, bottom: 40, left: 30 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(element);
    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([0, innerWidth])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count) || 10])
      .range([innerHeight, 0])
      .nice();

    // Add grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .tickSize(-innerWidth)
        .tickFormat(() => '')
      );

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickFormat(d => d.split(' ')[0]))
      .selectAll('text')
      .attr('dy', '1.5em');

    // Y Axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(5));

    // Bars
    const bars = g.selectAll('.bar')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bar-group');

    // Gradient definition
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'bar-gradient')
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '0%')
      .attr('y2', '0%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#00FF00') // Primary color
      .attr('stop-opacity', 0.3);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#00FF00')
      .attr('stop-opacity', 1);

    bars.append('rect')
      .attr('class', 'bar-rect')
      .attr('x', d => x(d.category) || 0)
      .attr('y', innerHeight)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('rx', 4)
      .attr('fill', 'url(#bar-gradient)')
      .transition()
      .duration(1000)
      .delay((_, i) => i * 100)
      .attr('y', d => y(d.count))
      .attr('height', d => innerHeight - y(d.count));

    // Tooltip/Label on top of bars
    bars.append('text')
      .attr('x', d => (x(d.category) || 0) + x.bandwidth() / 2)
      .attr('y', d => y(d.count) - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('opacity', 0)
      .text(d => d.count)
      .transition()
      .duration(1000)
      .delay((_, i) => i * 100 + 500)
      .attr('opacity', 1);
  }
}
