import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { LastFmService } from '../services/last-fm/last-fm.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})
export class Tab1Page {
  private lastFmService = inject(LastFmService);

  public songs: any | undefined = undefined; //assigning any/undefined to songs is valid

  constructor() { }


  ngOnInit() {
    this.lastFmService.getTopArtists().subscribe({
      next: (response: any) => {

        if (response) {
          this.songs = response;

          // Debug logging for image data structure
          console.log('Songs:');
      console.log(this.songs);
        } else {
          console.error('No song data in the response');
        }
      },
      error: (err) => {
        console.error('Error fetching event details:', err);
      }
    });




  }
}
