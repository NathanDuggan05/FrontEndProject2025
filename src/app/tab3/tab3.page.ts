import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonList, IonItem, IonLabel, IonButton, IonSpinner,
  IonIcon, IonChip, IonBadge
} from '@ionic/angular/standalone';
import { Geolocation } from '@capacitor/geolocation';
import { LastFmService } from '../services/last-fm/last-fm.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonList, IonItem, IonLabel, IonButton, IonSpinner,
    IonIcon, IonChip, IonBadge
  ]
})
export class Tab3Page {
  private lastFmService = inject(LastFmService);
  isLoading = false;
  error: string | null = null;
  events: any[] = [];
  userLocation: { lat: number; lng: number } | null = null;

  async ngOnInit() {
    await this.getCurrentLocation();
  }

  async getCurrentLocation() {
    try {
      this.isLoading = true;
      const coordinates = await Geolocation.getCurrentPosition();
      this.userLocation = {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      };
      await this.fetchNearbyEvents();
    } catch (error) {
      this.error = 'Unable to get location. Please enable location services.';
    } finally {
      this.isLoading = false;
    }
  }

  async fetchNearbyEvents() {
    if (!this.userLocation) return;
    
    try {
      this.isLoading = true;
      this.lastFmService.getNearbyEvents(
        this.userLocation.lat,
        this.userLocation.lng
      ).subscribe({
        next: (data) => {
          this.events = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Unable to fetch nearby events.';
          this.isLoading = false;
        }
      });
    } catch (error) {
      this.error = 'Unable to fetch nearby events.';
      this.isLoading = false;
    }
  }
}
