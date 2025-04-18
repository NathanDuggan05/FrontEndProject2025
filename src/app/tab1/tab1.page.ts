import { Component, inject, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { LastFmService } from '../services/last-fm/last-fm.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonList, IonItem, IonLabel, FormsModule, NgFor, NgIf, NgStyle, CommonModule]
})
export class Tab1Page {
  private lastFmService = inject(LastFmService);
  public artists: any[] = []; // Initialize as empty array

  constructor() { }

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
}
