import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { Cat } from '../_services/rest-api/cat.type';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnChanges, AfterViewInit {
  @Input() cats: Cat[] = [];
  @Input() insertMode: boolean = false;
  @Output() coordinatesSelected = new EventEmitter<{ lat: number; lng: number }>();
  @Input() style: string = "w-[300px] h-[300px]";

  map: any;
  insertMarker: L.Marker | null = null;

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cats'] && this.map && !this.insertMode) {
      this.placeMarkers();
    }
  }

  initializeMap() {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'marker-icon-2x.png',
      iconUrl: 'marker-icon.png',
      shadowUrl: 'marker-shadow.png'
    });

    this.map = L.map('map').setView([40.8907851404208, 14.239143453192677], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Fix: assicurati che la mappa ricalcoli le dimensioni correttamente
    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);

    if (!this.insertMode) {
      this.placeMarkers();
    }

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.insertMode) {
        if (this.insertMarker) {
          this.map.removeLayer(this.insertMarker);
        }

        this.insertMarker = L.marker([e.latlng.lat, e.latlng.lng])
          .addTo(this.map)
          .bindPopup('Il tuo randagio si trova qui')
          .openPopup();

        this.coordinatesSelected.emit({
          lat: e.latlng.lat,
          lng: e.latlng.lng
        });
      }
    });
  }

  placeMarkers() {
    if (!this.map) return;
    this.cats.forEach(cat => {
      L.marker([+cat.latitude, +cat.longitude])
        .addTo(this.map)
        .bindPopup(`<a href="cats/${cat.catId}"><b>${cat.title}</b></a>`);
    });
  }
}