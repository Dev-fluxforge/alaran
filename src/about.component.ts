
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

interface TeamMember {
  name: string;
  title: string;
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
export class AboutComponent {
  team = signal<TeamMember[]>([
    { name: 'Dr. Adebayo Alaran', title: 'Founder & Chief Surveyor', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400', socials: { linkedin: '#', twitter: '#' } },
    { name: 'Chidinma Okoro', title: 'Head of Aerial Mapping', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400', socials: { linkedin: '#', twitter: '#' } },
    { name: 'Musa Bello', title: 'Lead Hydrographic Specialist', imageUrl: '/assets/images/badmus.png', socials: { linkedin: '#', twitter: '#' } },
    { name: 'Fatima Garba', title: 'Principal Cadastral Expert', imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400', socials: { linkedin: '#', twitter: '#' } },
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