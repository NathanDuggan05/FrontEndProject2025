// Core Angular and form handling imports
import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Ionic UI components for building the interface
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonList, IonItem, IonLabel, IonThumbnail, IonImg,
  IonIcon, IonSpinner, IonChip, IonCardSubtitle, IonButton, IonBadge, 
  IonFab, IonFabButton
} from '@ionic/angular/standalone';

// Custom services and icon imports
import { LastFmService } from '../services/last-fm/last-fm.service';
import { StorageService } from '../services/storage/storage.service';
import { addIcons } from 'ionicons';
import { playOutline, headsetOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  // Required components for the template
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent,
    IonSearchbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonList, IonItem, IonLabel, IonThumbnail, IonImg,
    IonIcon, IonSpinner, IonChip, IonCardSubtitle, IonButton, IonBadge,
    IonFab, IonFabButton]
})
export class Tab2Page {
  // Modern dependency injection pattern - more testable than constructor injection
  private lastFmService = inject(LastFmService);
  private storageService = inject(StorageService);

  // Add ViewChild to get reference to the content
  @ViewChild(IonContent) content?: IonContent;
  
  // Add property for scroll button visibility
  showScrollButton = false;

  // Search terms maintained separately to handle different search types independently
  searchTerm: string = '';
  artistSearchTerm: string = '';
  trackSearchTerm: string = '';
  albumSearchTerm: string = '';

  // Store API responses - 'any' type used due to complex Last.fm API response structure
  artistData: any = null;
  trackData: any[] = [];
  albumData: any[] = [];

  // Loading states tracked separately for concurrent searches
  isLoading: boolean = false;
  isArtistLoading: boolean = false;
  isTrackLoading: boolean = false;
  isAlbumLoading: boolean = false;
  error: string | null = null;

  // Type-safe search history structure with timestamps
  searchHistory: Array<{
    term: string;
    type: 'artist' | 'track' | 'album';
    timestamp: string;
  }> = [];

  // Make Number available in template for formatting
  protected readonly Number = Number;

  constructor() {
    // Register Ionicons for use in template
    addIcons({
      playOutline,
      headsetOutline
    });
    // Load previous searches on component initialization
    this.loadSearchHistory();
  }

  /**
   * Retrieves search history from persistent storage
   * Falls back to empty array if no history exists
   */
  private async loadSearchHistory() {
    this.searchHistory = await this.storageService.get('searchHistory') || [];
  }

  /**
   * Saves search term to history with timestamp
   * Maintains only the 10 most recent searches
   * @param term - The search query
   * @param type - Category of search (artist/track/album)
   */
  private async saveSearch(term: string, type: 'artist' | 'track' | 'album') {
    const search = {
      term,
      type,
      timestamp: new Date().toISOString()
    };

    // Add new search to start and limit history to 10 items
    this.searchHistory.unshift(search);
    this.searchHistory = this.searchHistory.slice(0, 10);
    
    await this.storageService.set('searchHistory', this.searchHistory);
  }

  /**
   * Handles artist search with debouncing and Enter key support
   * @param event - Input or keyboard event from searchbar
   */
  async handleArtistSearch(event: any) {
    // Prevent search on regular input - only process on Enter key
    if (event.type === 'ionInput' && event.detail.inputType !== 'insertLineBreak') {
      return;
    }

    const term = event.target.value.trim();
    // Clear results if search term is too short
    if (term.length < 2) {
      this.artistData = null;
      return;
    }

    await this.saveSearch(term, 'artist');

    this.isLoading = true;
    this.error = null;

    this.lastFmService.searchArtist(term).subscribe({
      next: (data) => {
        // Restructure API response for easier template binding
        if (data.info.artist) {
          this.artistData = {
            ...data.info.artist,
            // Limit to top 10 tracks
            topTracks: (data.tracks?.toptracks?.track || []).slice(0, 10),
            stats: {
              listeners: data.info.artist.stats.listeners,
              playcount: data.info.artist.stats.playcount
            }
          };
        } else {
          this.error = 'Artist not found';
          this.artistData = null;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error searching for artist';
        this.isLoading = false;
        this.artistData = null;
      }
    });
  }

  async handleTrackSearch(event: any) {
    if (event.type === 'ionInput' && event.detail.inputType !== 'insertLineBreak') {
      return;
    }

    const term = event.target.value.trim();
    if (term.length < 2) {
      this.trackData = [];
      return;
    }

    await this.saveSearch(term, 'track');

    this.isTrackLoading = true;
    this.lastFmService.searchTrack(term).subscribe({
      next: (data) => {
        // Limit to top 10 results
        this.trackData = (data.results?.trackmatches?.track || []).slice(0, 10);
        this.isTrackLoading = false;
      },
      error: (err) => {
        this.isTrackLoading = false;
        this.trackData = [];
      }
    });
  }

  async handleAlbumSearch(event: any) {
    if (event.type === 'ionInput' && event.detail.inputType !== 'insertLineBreak') {
      return;
    }

    const term = event.target.value.trim();
    if (term.length < 2) {
      this.albumData = [];
      return;
    }

    await this.saveSearch(term, 'album');

    this.isAlbumLoading = true;
    this.lastFmService.searchAlbum(term).subscribe({
      next: (data) => {
        // Limit to top 10 results
        this.albumData = (data.results?.albummatches?.album || []).slice(0, 10);
        this.isAlbumLoading = false;
      },
      error: (err) => {
        this.isAlbumLoading = false;
        this.albumData = [];
      }
    });
  }

  async clearSearchHistory() {
    this.searchHistory = [];
    await this.storageService.remove('searchHistory');
  }

  /**
   * Removes HTML tags and truncates biography text
   * @param text - Raw biography text from Last.fm API
   * @returns Cleaned and formatted biography text
   */
  cleanBioText(text: string): string {
    if (!text) return 'No biography available';
    
    // Remove HTML and links
    const cleanText = text
      .split('<a')[0]
      .replace(/<[^>]*>/g, '')
      .trim();
    
    // Limit to approximately 100 words
    const words = cleanText.split(/\s+/);
    if (words.length > 100) {
      return words.slice(0, 100).join(' ') + '...';
    }
    
    return cleanText;
  }

  /**
   * Clears search results and terms for specified search type
   * @param type - Category to clear (artist/track/album)
   */
  handleClear(type: 'artist' | 'track' | 'album') {
    switch(type) {
      case 'artist':
        this.artistData = null;
        this.artistSearchTerm = '';
        break;
      case 'track':
        this.trackData = [];
        this.trackSearchTerm = '';
        break;
      case 'album':
        this.albumData = [];
        this.albumSearchTerm = '';
        break;
    }
  }

  // Add scroll handler method
  async scrollToTop() {
    await this.content?.scrollToTop(500);
  }

  // Add method to handle scroll events
  onScroll(event: any) {
    // Show button when scrolled down 100px
    this.showScrollButton = event.detail.scrollTop > 100;
  }
}
