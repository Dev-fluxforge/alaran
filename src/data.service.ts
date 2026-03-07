
import { Injectable, signal } from '@angular/core';

export interface Service {
  icon: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  color: string;
}

export interface Stat {
  value: string;
  label: string;
  borderColor: string;
  details: string;
}

export interface Project {
  title: string;
  slug: string;
  imageUrls: string[];
  description: string;
  longDescription: string;
  serviceCategory: string;
  client: string;
  location: string;
  coordinates?: { lat: number; lng: number };
}

export interface Technology {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  company: string;
}

export interface JobOpening {
  title: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Internship';
  department: string;
}

export interface Article {
  title: string;
  slug: string;
  imageUrl: string;
  excerpt: string;
  publishedDate: string;
  author: string;
}

// Helper to create URL-friendly slugs
const slugify = (text: string): string => 
  text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');


@Injectable({
  providedIn: 'root',
})
export class DataService {
  services = signal<Service[]>([
    {
      icon: 'architecture',
      title: 'Engineering Surveying',
      description: 'Topographic and setting out services for complex construction projects and civil engineering.',
      category: 'Construction Support',
      color: 'primary'
    },
    {
      icon: 'map',
      title: 'Cadastral Surveying',
      description: 'Title surveys and boundary mapping for property registration and land administration.',
      category: 'Land Administration',
      color: 'sand'
    },
    {
      icon: 'waves',
      title: 'Hydrographic Surveying',
      description: 'Bathymetric mapping and underwater surveying for ports, harbors, and offshore energy.',
      category: 'Marine Solutions',
      color: 'water'
    },
    {
      icon: 'flight',
      title: 'Aerial Mapping',
      description: 'High-resolution drone LiDAR and photogrammetry for rapid wide-area mapping.',
      category: 'UAV Technology',
      color: 'light-blue'
    }
  ].map(s => ({ ...s, slug: slugify(s.title) })));

  stats = signal<Stat[]>([
    { 
      value: '99.9%', 
      label: 'Accuracy Rate', 
      borderColor: 'border-primary', 
      details: 'Our commitment to precision is backed by rigorous quality control and the latest GNSS technology, ensuring sub-centimeter accuracy in every project.' 
    },
    { 
      value: '15+', 
      label: 'Licensed Experts', 
      borderColor: 'border-primary', 
      details: 'Our team consists of highly qualified, licensed surveyors and geospatial engineers with decades of combined experience in complex infrastructure projects.' 
    },
    { 
      value: '500+', 
      label: 'Projects Delivered', 
      borderColor: 'border-accent-yellow', 
      details: 'From small-scale boundary surveys to massive national infrastructure projects, we have a proven track record of delivering excellence across Nigeria.' 
    },
    { 
      value: '24h', 
      label: 'Rapid Deployment', 
      borderColor: 'border-accent-yellow', 
      details: 'We understand that time is critical. Our mobile teams are ready to deploy anywhere in the country within 24 hours of project confirmation.' 
    },
  ]);

  partners = signal<string[]>([
    'METRO-CORP',
    'PLAN-GRID',
    'CITY-DEV',
    'LAND-REG',
    'STRUCT-ENG',
    'AERO-MAP'
  ]);

  technologies = signal<Technology[]>([
    {
      icon: 'hub',
      title: 'GNSS',
      description: 'Utilizing Trimble and Leica systems for centimeter-level accuracy in real-time positioning.'
    },
    {
      icon: 'straighten',
      title: 'Total Station',
      description: 'High-precision optical instruments for measuring angles and distances in construction and land surveying.'
    },
    {
      icon: 'water',
      title: 'Kongsberg Echo Sounder',
      description: 'Advanced multibeam echosounders for high-resolution seafloor mapping and underwater object detection.'
    },
    {
      icon: 'scanner',
      title: '3D Laser Scanners',
      description: 'Employing Faro and Riegl scanners to capture high-density point clouds for detailed as-built models.'
    },
    {
      icon: 'flight_takeoff',
      title: 'Drone LiDAR & Photogrammetry',
      description: 'Deploying UAVs with advanced sensors for rapid, large-scale topographic mapping and inspections.'
    },
    {
      icon: 'share_location',
      title: 'GIS & Data Processing',
      description: 'Leveraging ArcGIS and QGIS for spatial analysis, data management, and creating insightful cartographic products.'
    }
  ]);

  testimonials = signal<Testimonial[]>([
    {
      quote: "Alaran Geo-Service's accuracy and rapid deployment are unmatched. They are our go-to partner for all critical engineering surveys.",
      author: "Tunde Okoro",
      company: "Metro-Corp Construction"
    },
    {
      quote: "The detailed topographic data from their aerial mapping team saved us weeks of planning time on the pipeline project.",
      author: "Amina Bello",
      company: "Plan-Grid Engineering"
    },
    {
      quote: "Their expertise in cadastral surveying was instrumental in resolving a complex land dispute for our development.",
      author: "David Chen",
      company: "City-Dev Properties"
    },
    {
      quote: "The hydrographic survey they conducted was incredibly thorough, providing critical data for our port expansion.",
      author: "Dr. Ifeanyi Adeleke",
      company: "Marine Solutions Ltd."
    },
     {
      quote: "Professional, reliable, and technologically advanced. Alaran Geo-Service consistently exceeds our expectations.",
      author: "Fatima Aliyu",
      company: "Struct-Eng Group"
    }
  ]);

  jobs = signal<JobOpening[]>([
    { title: 'Senior Party Chief', location: 'Lagos, Nigeria', type: 'Full-time', department: 'Field Operations' },
    { title: 'UAV/Drone Pilot', location: 'Abuja, Nigeria', type: 'Full-time', department: 'Aerial Mapping' },
    { title: 'GIS Analyst', location: 'Remote', type: 'Contract', department: 'Data Processing' },
    { title: 'Hydrographic Surveyor', location: 'Port Harcourt, Nigeria', type: 'Full-time', department: 'Marine Solutions' },
    { title: 'Survey Technician', location: 'Lagos, Nigeria', type: 'Full-time', department: 'Field Operations' },
    { title: 'Business Development Manager', location: 'Lagos, Nigeria', type: 'Full-time', department: 'Administration' },
  ]);

  news = signal<Article[]>([
    { 
      title: 'Alaran Geo-Service Acquires New Fleet of WingtraOne Gen II Drones', 
      slug: 'acquires-new-drones',
      imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=1200',
      excerpt: 'To further enhance our aerial mapping capabilities, we have invested in state-of-the-art VTOL drones, enabling faster and more efficient data capture for large-scale projects.',
      publishedDate: '2024-07-15',
      author: 'Chidinma Okoro'
    },
    { 
      title: 'Case Study: 3D Laser Scanning for Heritage Site Preservation', 
      slug: 'case-study-heritage',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200',
      excerpt: 'Discover how our team used high-density laser scanning to create a detailed digital twin of a national monument, aiding in its preservation and restoration efforts.',
      publishedDate: '2024-06-28',
      author: 'Admin'
    },
    { 
      title: 'Our Commitment to Sustainable Surveying Practices', 
      slug: 'sustainable-surveying',
      imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200',
      excerpt: 'Learn about our initiatives to reduce our carbon footprint in the field, from solar-powered equipment to optimized travel routes, ensuring we protect the environments we map.',
      publishedDate: '2024-05-20',
      author: 'Dr. Adebayo Alaran'
    },
  ]);

  private allProjects: Project[] = [
    {
      title: 'City Center Tower Construction',
      imageUrls: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1503387762-592dee58c460?auto=format&fit=crop&q=80&w=1200'],
      description: 'High-precision setting out and as-built surveys for a 50-story skyscraper.',
      longDescription: 'Our team provided continuous on-site support for the construction of the landmark City Center Tower. We were responsible for establishing the primary site control, setting out gridlines and foundations, and conducting verticality checks as the structure rose. Our as-built surveys at each stage ensured that the construction perfectly matched the design specifications, minimizing rework and delays.',
      serviceCategory: 'Engineering Surveying',
      client: 'Metro-Corp Construction',
      location: 'Lagos, Nigeria',
      coordinates: { lat: 6.4654, lng: 3.4064 }
    },
    {
      title: 'Highway Interchange Realignment',
      imageUrls: ['https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=1200'],
      description: 'Volumetric calculations and machine control data for a major transportation infrastructure upgrade.',
      longDescription: 'For the N1 highway interchange upgrade, we performed detailed topographic surveys of the existing infrastructure and terrain. This data was used to calculate earthwork volumes (cut and fill) and to generate 3D models for GPS-guided construction machinery, significantly accelerating the construction timeline and improving accuracy.',
      serviceCategory: 'Engineering Surveying',
      client: 'Federal Ministry of Works',
      location: 'Abuja, Nigeria',
      coordinates: { lat: 9.0765, lng: 7.3986 }
    },
    {
      title: 'Industrial Plant Layout & As-Built',
      imageUrls: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200'],
      description: 'Precision alignment for heavy machinery in a new manufacturing plant.',
      longDescription: 'We ensured micrometer-level accuracy for the installation of sensitive manufacturing equipment. Our 3D laser scanning services provided a complete as-built model of the facility, which was crucial for clash detection and future maintenance planning.',
      serviceCategory: 'Engineering Surveying',
      client: 'Dangote Industries',
      location: 'Kano, Nigeria',
      coordinates: { lat: 12.0022, lng: 8.5920 }
    },
    {
      title: 'Bridge Deformation Monitoring',
      imageUrls: ['https://images.unsplash.com/photo-1449156730764-d4a921596f11?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=1200'],
      description: 'Periodic monitoring of a suspension bridge to ensure public safety.',
      longDescription: 'We have an ongoing contract to monitor the structural health of the Third Mainland Bridge. Using high-precision total stations and GNSS receivers, we measure for any displacement or deformation, providing engineers with the critical data needed to maintain the bridge\'s integrity.',
      serviceCategory: 'Engineering Surveying',
      client: 'Lagos State Government',
      location: 'Lagos, Nigeria',
      coordinates: { lat: 6.5080, lng: 3.3910 }
    },
    {
      title: 'Dam Construction Control Survey',
      imageUrls: ['https://images.unsplash.com/photo-1511068129126-53061a5aa811?auto=format&fit=crop&q=80&w=1200'],
      description: 'Establishing high-accuracy control for a large hydroelectric dam.',
      longDescription: 'Our surveyors established the primary and secondary control networks that governed all construction activities for the Zungeru Hydroelectric Dam. Precision was paramount to ensure the correct alignment and elevation of this massive concrete structure.',
      serviceCategory: 'Engineering Surveying',
      client: 'Federal Ministry of Power',
      location: 'Niger State, Nigeria',
      coordinates: { lat: 9.9309, lng: 6.5356 }
    },
    {
      title: 'Greenfield Residential Estate',
      imageUrls: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&q=80&w=1200'],
      description: 'Boundary definition and land parcel subdivision for a 200-hectare development.',
      longDescription: 'We were contracted by City-Dev Properties to perform the complete cadastral survey for their new Oceanview Estate. This involved the precise demarcation of the outer boundary and the subdivision of the land into over 500 residential plots, roads, and recreational areas, all in accordance with local planning regulations.',
      serviceCategory: 'Cadastral Surveying',
      client: 'City-Dev Properties',
      location: 'Lekki, Nigeria',
      coordinates: { lat: 6.4411, lng: 3.5732 }
    },
    {
      title: 'Urban Property Dispute Resolution',
      imageUrls: ['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200'],
      description: 'Expert witness and precise boundary re-establishment.',
      longDescription: 'Our senior cadastral surveyors acted as expert witnesses in a high-profile land dispute case. By meticulously researching historical survey records and performing a detailed field survey, we successfully re-established the true boundary, leading to a fair resolution.',
      serviceCategory: 'Cadastral Surveying',
      client: 'Private Landowner',
      location: 'Ikeja, Nigeria',
      coordinates: { lat: 6.5967, lng: 3.3421 }
    },
    {
      title: 'Rural Land Titling Program',
      imageUrls: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1200'],
      description: 'Systematic land adjudication and demarcation for a government initiative.',
      longDescription: 'In partnership with the state government, we helped implement a large-scale land titling program. Our teams worked with local communities to adjudicate and survey thousands of farm plots, providing landowners with official titles and enhancing land tenure security.',
      serviceCategory: 'Cadastral Surveying',
      client: 'State Ministry of Lands',
      location: 'Oyo State, Nigeria',
      coordinates: { lat: 7.3775, lng: 3.9470 }
    },
    {
      title: 'Government Infrastructure Corridor',
      imageUrls: ['https://images.unsplash.com/photo-1474487022159-7600a603c1d1?auto=format&fit=crop&q=80&w=1200'],
      description: 'Cadastral surveys for land acquisition along a new railway line.',
      longDescription: 'We conducted the cadastral surveys necessary for the government to acquire land for the new Lagos-Kano Standard Gauge Railway. Our work ensured that all affected properties were accurately identified and surveyed, facilitating a fair compensation process.',
      serviceCategory: 'Cadastral Surveying',
      client: 'Nigerian Railway Corporation',
      location: 'Nationwide'
    },
    {
      title: 'Historical Boundary Retracement',
      imageUrls: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200'],
      description: 'Re-establishing colonial-era property boundaries.',
      longDescription: 'A client required the retracement of boundaries defined in a 1920s deed. Our team of experts combined archival research with modern GNSS technology to accurately locate the original monuments and re-establish the property lines for legal purposes.',
      serviceCategory: 'Cadastral Surveying',
      client: 'Family Estate',
      location: 'Calabar, Nigeria'
    },
    {
      title: 'Port Dredging & Expansion',
      imageUrls: ['https://images.unsplash.com/photo-1524522173746-f628baad3644?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1494412574743-0194852482ab?auto=format&fit=crop&q=80&w=1200'],
      description: 'Pre- and post-dredge surveys for safe navigational depths.',
      longDescription: 'For the Apapa Port expansion, we performed comprehensive multibeam echosounder surveys before and after dredging operations. This allowed us to precisely calculate the volume of material removed and to certify the new navigational depths for safe passage of larger container ships.',
      serviceCategory: 'Hydrographic Surveying',
      client: 'Nigerian Ports Authority',
      location: 'Lagos, Nigeria',
      coordinates: { lat: 6.4468, lng: 3.3675 }
    },
    {
      title: 'Offshore Wind Farm Seabed Mapping',
      imageUrls: ['https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1466611653911-95282fc3656b?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1413882353057-a15144677510?auto=format&fit=crop&q=80&w=1200'],
      description: 'Detailed seabed characterization for turbine foundation planning.',
      longDescription: 'In the preliminary stages of a major offshore wind farm project, we mapped a 100-square-kilometer area of the seabed. Our hydrographic data revealed the underwater topography and sediment types, which was essential information for the engineers designing the turbine foundations.',
      serviceCategory: 'Hydrographic Surveying',
      client: 'Green Energy Consortium',
      location: 'Offshore, Ondo State'
    },
    {
      title: 'Subsea Cable Route Survey',
      imageUrls: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=1200'],
      description: 'Mapping the seabed for a new subsea fiber optic cable.',
      longDescription: 'We provided the bathymetric and geophysical data needed to plan the route of a new international fiber optic cable landing in Nigeria. Our survey identified potential hazards on the seafloor, ensuring a safe and secure route for this critical piece of telecommunications infrastructure.',
      serviceCategory: 'Hydrographic Surveying',
      client: 'MainOne Cable Company',
      location: 'Atlantic Ocean'
    },
    {
      title: 'Coastal Erosion Monitoring',
      imageUrls: ['https://images.unsplash.com/photo-1505118380757-91f5f45d8de4?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200'],
      description: 'Monitoring shoreline changes to inform coastal management.',
      longDescription: 'Along the Victoria Island coastline, we conduct regular surveys to monitor the rate of coastal erosion. By combining topographic LiDAR scans with near-shore bathymetry, we create a complete 3D model of the coastal zone that helps authorities plan effective mitigation strategies.',
      serviceCategory: 'Hydrographic Surveying',
      client: 'Lagos State Min. of Environment',
      location: 'Lagos, Nigeria',
      coordinates: { lat: 6.4253, lng: 3.4219 }
    },
    {
      title: 'Reservoir Sedimentation Study',
      imageUrls: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1200'],
      description: 'Calculating sediment volume and remaining water capacity.',
      longDescription: 'We performed a full bathymetric survey of the Kainji Dam reservoir. By comparing our results to historical data, we were able to calculate the volume of sediment that has accumulated over the years, providing vital information for the long-term management of the dam and its power generation capacity.',
      serviceCategory: 'Hydrographic Surveying',
      client: 'Mainstream Energy Solutions',
      location: 'Niger State, Nigeria'
    },
    {
      title: 'Agricultural Land Assessment',
      imageUrls: ['https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200'],
      description: 'UAV-based multispectral imaging to assess crop health.',
      longDescription: 'Using drones equipped with multispectral sensors, we mapped a large commercial farm to assess crop health. The resulting NDVI (Normalized Difference Vegetation Index) maps helped the client identify areas of stress, optimize fertilizer application, and increase overall yield.',
      serviceCategory: 'Aerial Mapping',
      client: 'Olam Agri',
      location: 'Kaduna, Nigeria',
      coordinates: { lat: 10.5105, lng: 7.4165 }
    },
    {
      title: 'Corridor Mapping for Pipeline',
      imageUrls: ['https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&q=80&w=1200'],
      description: 'Generating a high-resolution DTM for a 150km pipeline route.',
      longDescription: 'We utilized drone-based LiDAR to rapidly survey a 150km corridor for a new gas pipeline. The high-resolution Digital Terrain Model (DTM) we produced was essential for detailed route planning, minimizing environmental impact and construction costs.',
      serviceCategory: 'Aerial Mapping',
      client: 'Nigerian National Petroleum Corporation',
      location: 'Niger Delta'
    },
    {
      title: 'Urban Planning 3D Model',
      imageUrls: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=1200'],
      description: 'Creating a detailed 3D reality mesh for urban development.',
      longDescription: 'From thousands of high-resolution aerial photographs, we generated a photorealistic 3D model of Eko Atlantic City. This "digital twin" is used by planners and architects to visualize new developments and conduct solar and shadow analysis.',
      serviceCategory: 'Aerial Mapping',
      client: 'Eko Atlantic Development',
      location: 'Lagos, Nigeria'
    },
    {
      title: 'Forestry Inventory Management',
      imageUrls: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200'],
      description: 'Using drone LiDAR to count trees and estimate timber volume.',
      longDescription: 'For a sustainable forestry company, we used LiDAR data to penetrate the forest canopy and create a detailed model of the ground beneath. This data also allowed us to automatically count individual trees, measure their height, and estimate the total timber volume, revolutionizing their inventory management.',
      serviceCategory: 'Aerial Mapping',
      client: 'Global Woods Ltd.',
      location: 'Cross River State, Nigeria'
    },
    {
      title: 'Solar Farm Site Assessment',
      imageUrls: ['https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1200'],
      description: 'High-resolution aerial survey for optimal panel placement.',
      longDescription: 'Before the construction of a new 50-megawatt solar farm, we conducted a high-resolution aerial survey of the proposed site. The resulting DTM and orthophoto allowed engineers to precisely plan the layout of the solar panels, optimizing their orientation to the sun and maximizing energy production.',
      serviceCategory: 'Aerial Mapping',
      client: 'Renewable Energy Systems NG',
      location: 'Sokoto, Nigeria',
      coordinates: { lat: 13.0059, lng: 5.2476 }
    }
  ].map(p => ({...p, slug: slugify(p.title)}));
  
  projects = signal<Project[]>(this.allProjects);
}
