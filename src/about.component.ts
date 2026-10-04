
import { Component, ChangeDetectionStrategy, signal, AfterViewInit, ElementRef, viewChild } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { animate, stagger } from 'motion';

interface TeamMember {
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  socials: {
    linkedin: string;
    twitter: string;
  };
}

interface Value {
    icon: string;
    title: string;
    description: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements AfterViewInit {
  heroContainer = viewChild<ElementRef>('heroContent');

  ngAfterViewInit() {
    const container = this.heroContainer()?.nativeElement;
    if (container) {
      const children = container.querySelectorAll('.animate-item');
      animate(
        children,
        { 
          opacity: [0, 1], 
          y: [15, 0],
          scale: [0.98, 1]
        },
        {
          delay: stagger(0.12),
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1]
        }
      );
    }
  }

  team = signal<TeamMember[]>([
  {
    name: 'Surv. Habeeb Alaran (B.Sc, M.Sc)',
    title: 'Founder & Chief Surveyor',
    description: 'Dedicated to pushing the boundaries of geospatial accuracy and leading our team of experts in delivering world-class surveying solutions.',
    imageUrl: '/images/ceo.jpg',
    socials: { linkedin: 'https://www.linkedin.com/in/habeeb-alaran-6a7644187?utm_source=share_via&utm_content=profile&utm_medium=member_android', twitter: 'https://x.com/HabeebAlaran' }
  },
  {
    name: 'Surv. Salako Tobi',
    title: 'Lead Hydrographic Specialist',
    description: 'A Registered Surveyor and marine mapping expert who brings dual-tier academic and practical excellence to our offshore operations. Holding a B.Sc. in Surveying and an M.Sc. in Professional Hydrography, he expertly directs complex geophysical surveys, dive support, pipe installation, and construction hydrography. His deep technical command bridges terrestrial precision with advanced underwater data acquisition, ensuring unmatched accuracy and safety across our major marine infrastructure and energy projects.',
    imageUrl: '/images/Lead.jpeg',
    socials: { linkedin: 'https://www.linkedin.com/in/oluwatobi-salako-4bab1012b?utm_source=share_via&utm_content=profile&utm_medium=member_android', twitter: 'https://x.com/SalakoTobi' }
  },
  {
    name: 'Tijani Hamedat M',
    title: 'ACA',
    description: 'A dedicated and meticulous Chartered Accountant with experience in maintaining financial integrity and optimizing accounting systems. Combines a strong academic foundation with sharp analytical skills to deliver accurate financial reporting, regulatory compliance, and strategic tax planning that supports sustainable business growth.',
    imageUrl: '/images/ACA.jpeg',
    socials: { linkedin: 'https://www.linkedin.com/in/musa-bello-5b6c7d8e?utm_source=share_via&utm_content=profile&utm_medium=member_android', twitter: 'https://x.com/TijaniHamedat' }
  },
  {
    name: 'Adebayo Taiwo O.',
    title: 'Land & Engineering Survey',
    description: 'He specialised in high-precision land and engineering surveys. Backed by rigorous technical expertise, he expertly oversees boundary mapping, topographic detailing, and complex construction staking to ensure flawless foundation execution for our structural and infrastructural projects.',
    imageUrl: '/images/bayo.jpeg',
    socials: { linkedin: 'https://www.linkedin.com/in/fatima-garba-3c4d5e6f?utm_source=share_via&utm_content=profile&utm_medium=member_android', twitter: 'https://twitter.com/fatima_garba' }
  },
  {
    name: 'Ayeni Alex Emmanuel',
    title: 'Geospatial Analyst',
    description: 'A Surveying graduate and skilled Geospatial Analyst who transforms complex spatial data into actionable geographic insights. Combining a solid foundational background in surveying with modern GIS and remote sensing capabilities, he specializes in data modeling, terrain analysis, and digital mapping to drive precision and informed decision-making across all our land and marine projects.',
    imageUrl: '/images/gsi.jpeg',
    socials: { linkedin: 'https://www.linkedin.com/in/fatima-garba-3c4d5e6f?utm_source=share_via&utm_content=profile&utm_medium=member_android', twitter: 'https://x.com/AyeniAlexEmmanuel' }
  }
]);

  currentMemberIndex = signal(0);

  nextMember(): void {
    const total = this.team().length;
    this.currentMemberIndex.update(i => (i + 1) % total);
  }

  prevMember(): void {
    const total = this.team().length;
    this.currentMemberIndex.update(i => (i - 1 + total) % total);
  }

  setMemberIndex(index: number): void {
    this.currentMemberIndex.set(index);
  }

  values = signal<Value[]>([
    { icon: 'target', title: 'Precision', description: 'Every measurement, every coordinate, and every deliverable is held to the highest standard of accuracy.' },
    { icon: 'verified', title: 'Integrity', description: 'We conduct our business with unwavering honesty and a commitment to ethical practices.' },
    { icon: 'bulb', title: 'Innovation', description: 'Leveraging the latest technology to provide efficient, state-of-the-art geospatial solutions.' },
    { icon: 'groups', title: 'Collaboration', description: 'Working closely with our clients to understand their needs and achieve shared success.' },
  ]);
}