import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonList, IonItem, IonLabel, IonThumbnail, IonImg,
  IonIcon, IonSpinner, IonChip
} from '@ionic/angular/standalone';
import { LastFmService } from '../services/last-fm/last-fm.service';
import { addIcons } from 'ionicons';
import { playOutline, headsetOutline } from 'ionicons/icons';
//import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent,
    IonSearchbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonList, IonItem, IonLabel, IonThumbnail, IonImg,
    IonIcon, IonSpinner, IonChip]
})
export class Tab2Page {
  private lastFmService = inject(LastFmService);
  searchTerm: string = '';
  artistData: any = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    addIcons({
      playOutline,
      headsetOutline
    });
  }

  async handleSearch(event: any) {
    const term = event.target.value.trim();
    if (term.length < 2) {
      this.artistData = null;
      return;
    }

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

  cleanBioText(text: string): string {
    if (!text) return 'No biography available';
    return text
      .split('<a')[0]
      .replace(/<[^>]*>/g, '')
      .trim();
  }
}
