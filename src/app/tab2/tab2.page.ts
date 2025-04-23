import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonList, IonItem, IonLabel, IonThumbnail, IonImg,
  IonIcon, IonSpinner, IonChip, IonCardSubtitle, IonButton, IonBadge
} from '@ionic/angular/standalone';
import { LastFmService } from '../services/last-fm/last-fm.service';
import { addIcons } from 'ionicons';
import { playOutline, headsetOutline } from 'ionicons/icons';
import { StorageService } from '../services/storage/storage.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent,
    IonSearchbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonList, IonItem, IonLabel, IonThumbnail, IonImg,
    IonIcon, IonSpinner, IonChip, IonCardSubtitle, IonButton, IonBadge]
})
export class Tab2Page {
  private lastFmService = inject(LastFmService);
  private storageService = inject(StorageService);
  searchTerm: string = '';
  artistData: any = null;
  isLoading: boolean = false;
  error: string | null = null;

  artistSearchTerm: string = '';
  trackSearchTerm: string = '';
  albumSearchTerm: string = '';

  trackData: any[] = [];
  albumData: any[] = [];

  isArtistLoading: boolean = false;
  isTrackLoading: boolean = false;
  isAlbumLoading: boolean = false;

  searchHistory: Array<{
    term: string;
    type: 'artist' | 'track' | 'album';
    timestamp: string;
  }> = [];

  constructor() {
    addIcons({
      playOutline,
      headsetOutline
    });
    this.loadSearchHistory();
  }

  private async loadSearchHistory() {
    this.searchHistory = await this.storageService.get('searchHistory') || [];
  }

  private async saveSearch(term: string, type: 'artist' | 'track' | 'album') {
    const search = {
      term,
      type,
      timestamp: new Date().toISOString()
    };

    // Add to start of array and keep only last 10 searches
    this.searchHistory.unshift(search);
    this.searchHistory = this.searchHistory.slice(0, 10);
    
    await this.storageService.set('searchHistory', this.searchHistory);
  }

  async handleArtistSearch(event: any) {
    // Only proceed if it's an Enter key press or a search submission
    if (event.type === 'ionInput' && event.detail.inputType !== 'insertLineBreak') {
      return;
    }

    const term = event.target.value.trim();
    if (term.length < 2) {
      this.artistData = null;
      return;
    }

    await this.saveSearch(term, 'artist');

    this.isLoading = true;
    this.error = null;

    this.lastFmService.searchArtist(term).subscribe({
      next: (data) => {
        if (data.info.artist) {
          this.artistData = {
            ...data.info.artist,
            topTracks: data.tracks?.toptracks?.track || [],
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
        this.trackData = data.results?.trackmatches?.track || [];
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
        this.albumData = data.results?.albummatches?.album || [];
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

  cleanBioText(text: string): string {
    if (!text) return 'No biography available';
    return text
      .split('<a')[0]
      .replace(/<[^>]*>/g, '')
      .trim();
  }

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
}
