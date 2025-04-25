import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// Required Angular and Ionic imports for standalone component
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  // Ionic components needed for the UI
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonList, IonLabel, IonButton, IonSpinner,
  IonIcon, IonChip, IonSearchbar
} from '@ionic/angular/standalone';
// Capacitor plugin for getting user's location
import { Geolocation } from '@capacitor/geolocation';
import { LastFmService } from '../services/last-fm/last-fm.service';
import { EventResponse } from '../interfaces/event.interface';
// Types for the searchbar events
import { SearchbarCustomEvent } from '@ionic/angular';
import { SearchType } from '../interfaces/search-type.interface';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // Components needed in the template must be imported here
  imports: [
    CommonModule,
    FormsModule,
    // ...ionic components...
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonLabel,
    IonButton,
    IonSpinner,
    IonIcon,
    IonChip,
    IonSearchbar
  ]
})
export class Tab3Page {
  // Inject services using the new inject() function
  private lastFmService = inject(LastFmService);
  
  // State management properties
  isLoading = false;
  error: string | null = null;
  events: EventResponse[] = [];
  userLocation: { lat: number; lng: number } | null = null;
  searchTerm = '';
  searching = false;
  // Make Number available in template for formatting
  protected readonly Number = Number;

  // Add new properties for search type
  searchType: 'artist' | 'location' = 'artist';
  searchTypeLabel = 'Artist';

  // Initialize component by getting user location
  async ngOnInit() {
    await this.getCurrentLocation();
  }

  /**
   * Gets the user's current location using Capacitor's Geolocation
   * Then fetches nearby events based on coordinates
   */
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

  /**
   * Searches for events using the LastFmService
   * @param event - The searchbar event containing the search term
   */
  async searchEvents(event: SearchbarCustomEvent) {
    const term = event.detail.value?.trim();
    if (!term || term.length < 2) return;

    try {
      this.searching = true;
      this.error = null;
      
      const searchObservable = this.searchType === 'artist' 
        ? this.lastFmService.searchEventsByArtist(term)
        : this.lastFmService.searchEventsByCity(term); // Using searchEventsByCity for location searches

      searchObservable.subscribe({
        next: (data: EventResponse[]) => {
          this.events = data;
          this.searching = false;
        },
        error: (error: Error) => {
          this.error = `Unable to find events. Please try a different ${this.searchType}.`;
          this.searching = false;
        }
      });
    } catch (error) {
      this.error = 'Search failed. Please try again.';
      this.searching = false;
    }
  }

  // Add method to handle search type change
  setSearchType(type: 'artist' | 'location') {
    this.searchType = type;
    this.searchTypeLabel = type.charAt(0).toUpperCase() + type.slice(1);
    this.searchTerm = ''; // Clear search when changing type
    this.events = []; // Clear results when changing type
  }

  // Add toggle method
  toggleSearchType() {
    this.searchType = this.searchType === 'artist' ? 'location' : 'artist';
    this.searchTerm = ''; // Clear search when changing type
    this.events = []; // Clear results when changing type
  }

  /**
   * Retries getting the user's location and nearby events
   */
  async retryLocation() {
    this.error = null;
    this.searchTerm = '';
    await this.getCurrentLocation();
  }
}
