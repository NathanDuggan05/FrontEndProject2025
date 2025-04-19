import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_KEY = "50e1f8067cf4a31aa6db277edf2fcb98";
const API_URL = "https://ws.audioscrobbler.com/2.0/";

@Injectable({
  providedIn: 'root'
})
export class LastFmService {
  // inject HttpClient
  private httpClient = inject(HttpClient);

  constructor() { }

  getTopArtists(): Observable<any> {
    let url = `${API_URL}?method=chart.gettopartists&api_key=${API_KEY}&format=json`;
    return this.httpClient.get<any>(url);
  }

  //the top 50 artists urls
  getArtistInfo(artistName: string): Observable<any> {
    const infoUrl = `${API_URL}?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${API_KEY}&format=json`;
    const albumsUrl = `${API_URL}?method=artist.gettopalbums&artist=${encodeURIComponent(artistName)}&api_key=${API_KEY}&limit=3&format=json`;

    return forkJoin({
      info: this.httpClient.get<any>(infoUrl),
      albums: this.httpClient.get<any>(albumsUrl)
    });

  }

  searchArtist(artistName: string): Observable<any> {
    const infoUrl = `${API_URL}?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${API_KEY}&format=json`;
    const topTracksUrl = `${API_URL}?method=artist.gettoptracks&artist=${encodeURIComponent(artistName)}&api_key=${API_KEY}&limit=5&format=json`;
    const albumsUrl = `${API_URL}?method=artist.gettopalbums&artist=${encodeURIComponent(artistName)}&api_key=${API_KEY}&limit=3&format=json`;

    return forkJoin({
      info: this.httpClient.get<any>(infoUrl),
      topTracks: this.httpClient.get<any>(topTracksUrl),
      albums: this.httpClient.get<any>(albumsUrl)
    });
  }

  searchTrack(trackName: string): Observable<any> {
    const url = `${API_URL}?method=track.search&track=${encodeURIComponent(trackName)}&api_key=${API_KEY}&format=json`;
    return this.httpClient.get<any>(url);
  }
  searchAlbum(albumName: string): Observable<any> {
    const url = `${API_URL}?method=album.search&album=${encodeURIComponent(albumName)}&api_key=${API_KEY}&format=json`;
    return this.httpClient.get<any>(url);
  }

}