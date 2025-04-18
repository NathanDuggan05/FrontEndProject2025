import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonImg,
  IonIcon,
  IonButton,
  IonSpinner,
  IonChip,
  IonItemGroup
} from '@ionic/angular/standalone';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { LastFmService } from '../services/last-fm/last-fm.service';
import { addIcons } from 'ionicons';
import {
  playOutline,
  headsetOutline,
  openOutline,
  chevronUpOutline,
  chevronDownOutline
} from 'ionicons/icons';
import { Artist } from '../interfaces/artists';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [ CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonThumbnail, IonImg, IonIcon, IonButton,IonSpinner, IonChip, IonItemGroup, NgFor, NgIf ]
})
export class Tab1Page {
  private lastFmService = inject(LastFmService);
  public artists: (Artist & { showBio?: boolean; bio?: any })[] = []; // Initialize as empty array

  constructor() {
    addIcons({
      playOutline,
      headsetOutline,
      openOutline,
      chevronUpOutline,
      chevronDownOutline
    });
  }

  ngOnInit() {
    this.lastFmService.getTopArtists().subscribe({
      next: (response: any) => {
        if (response && response.artists && response.artists.artist) {
          this.artists = response.artists.artist; // Assign the array of artists
          console.log('Artists:', this.artists);
        } else {
          console.error('No artist data in the response');
        }
      },
      error: (err) => {
        console.error('Error fetching artists:', err);
      }
    });
  }

  toggleBio(artist: any) {
    if (!artist.bio && !artist.loadingBio) {
      artist.loadingBio = true;
      this.lastFmService.getArtistInfo(artist.name).subscribe({
        next: (data: any) => {
          artist.bio = {
            summary: this.cleanBioText(data.info.artist.bio.summary),
            tags: data.info.artist.tags.tag.map((t: any) => t.name),
            topAlbums: data.albums.topalbums.album.slice(0, 3)
          };
          artist.loadingBio = false;
        },
        error: () => {
          artist.loadingBio = false;
          artist.bio = {
            summary: 'Biography not available.',
            topAlbums: []
          };
        }
      });
    }
    artist.showBio = !artist.showBio;
  }

  private cleanBioText(text: string): string {
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .split('.')[0] + '.'; // Get first sentence only
  }
}
