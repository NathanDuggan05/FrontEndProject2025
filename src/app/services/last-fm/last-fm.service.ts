import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EventResponse } from '../../interfaces/event.interface';

// Last.fm API credentials
const API_KEY = "50e1f8067cf4a31aa6db277edf2fcb98";
const API_URL = "https://ws.audioscrobbler.com/2.0/";

@Injectable({
  providedIn: 'root'
})
export class LastFmService {
  // Inject HttpClient using the new inject function instead of constructor injection
  private httpClient = inject(HttpClient);

  constructor() { }

  // Fetch top artists from Last.fm charts
  getTopArtists(): Observable<any> {
    let url = `${API_URL}?method=chart.gettopartists&api_key=${API_KEY}&format=json`;
    return this.httpClient.get<any>(url);
  }

  // Get detailed information about an artist and their top albums
  getArtistInfo(artistName: string): Observable<any> {
    // URL for basic artist information
    const infoUrl = `${API_URL}?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${API_KEY}&format=json`;
    // URL for artist's top albums, limited to 3
    const albumsUrl = `${API_URL}?method=artist.gettopalbums&artist=${encodeURIComponent(artistName)}&api_key=${API_KEY}&limit=3&format=json`;

    // Combine both requests into a single observable
    return forkJoin({
      info: this.httpClient.get<any>(infoUrl),
      albums: this.httpClient.get<any>(albumsUrl)
    });
  }

  // Search for an artist and get their details, top tracks, and albums
  searchArtist(artistName: string): Observable<any> {
    // Encode artist name to handle special characters in URLs
    const infoUrl = `${API_URL}?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${API_KEY}&format=json`;
    const topTracksUrl = `${API_URL}?method=artist.gettoptracks&artist=${encodeURIComponent(artistName)}&api_key=${API_KEY}&limit=5&format=json`;
    const albumsUrl = `${API_URL}?method=artist.gettopalbums&artist=${encodeURIComponent(artistName)}&api_key=${API_KEY}&limit=3&format=json`;

    // Combine three API calls into a single observable
    return forkJoin({
      info: this.httpClient.get<any>(infoUrl),
      topTracks: this.httpClient.get<any>(topTracksUrl),
      albums: this.httpClient.get<any>(albumsUrl)
    });
  }

  // Search for tracks by name
  searchTrack(trackName: string): Observable<any> {
    const url = `${API_URL}?method=track.search&track=${encodeURIComponent(trackName)}&api_key=${API_KEY}&format=json`;
    return this.httpClient.get<any>(url);
  }

  // Search for albums by name
  searchAlbum(albumName: string): Observable<any> {
    const url = `${API_URL}?method=album.search&album=${encodeURIComponent(albumName)}&api_key=${API_KEY}&format=json`;
    return this.httpClient.get<any>(url);
  }

  // Get events near a geographic location (using top artists as proxy since events API is deprecated)
  getNearbyEvents(lat: number, lng: number): Observable<any> {
    // Use geo.gettopartists as a workaround for the deprecated events API
    const url = `${API_URL}?method=geo.gettopartists&lat=${lat}&long=${lng}&api_key=${API_KEY}&format=json`;
    
    return this.httpClient.get<any>(url).pipe(
      map(response => {
        // Return empty array if no artists found
        if (!response.topartists?.artist) {
          return [];
        }

        // Transform artist data into event-like format
        return response.topartists.artist.map((artist: any) => ({
          id: artist.mbid,
          name: artist.name,
          // Generate random future date within 30 days
          date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
          // Mock venue data since we don't have real venues
          venue: {
            name: 'Local Venue',
            city: 'Nearby City',
            state: 'State'
          },
          image: artist.image[2]['#text'],  // Use medium-size image
          listeners: artist.listeners,
          url: artist.url
        }));
      })
    );
  }

  // Search for events by term (creates mock events from artist search)
  searchEvents(searchTerm: string): Observable<EventResponse[]> {
    // Use artist.search as base for mock events
    const url = `${API_URL}?method=artist.search&artist=${encodeURIComponent(searchTerm)}&api_key=${API_KEY}&format=json`;
    
    return this.httpClient.get<any>(url).pipe(
      map(response => {
        // Return empty array if no matches found
        if (!response.results?.artistmatches?.artist) {
          return [];
        }

        // Transform artist search results into event-like data
        return response.results.artistmatches.artist.map((artist: any) => ({
          id: artist.mbid || crypto.randomUUID(), // Use UUID if mbid is missing
          name: artist.name,
          // Generate random future date within 30 days
          date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          venue: {
            name: 'Local Venue',
            city: searchTerm  // Use search term as city name
          },
          image: artist.image[2]['#text'],  // Use medium-size image
          url: artist.url,
          listeners: parseInt(artist.listeners)  // Convert string to number
        }));
      })
    );
  }

  /**
   * Search for events by artist name
   */
  searchEventsByArtist(artistName: string): Observable<EventResponse[]> {
    const url = `${API_URL}?method=artist.search&artist=${encodeURIComponent(artistName)}&api_key=${API_KEY}&format=json`;
    
    return this.httpClient.get<any>(url).pipe(
      map(response => {
        if (!response.results?.artistmatches?.artist) {
          return [];
        }

        return response.results.artistmatches.artist.map((artist: any) => ({
          id: artist.mbid || crypto.randomUUID(),
          name: artist.name,
          date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          venue: {
            name: 'Local Venue',
            city: 'Various Cities'
          },
          image: artist.image[2]['#text'],
          url: artist.url,
          listeners: parseInt(artist.listeners)
        }));
      })
    );
  }

  /**
   * Search for events by city name
   */
  searchEventsByCity(cityName: string): Observable<EventResponse[]> {
    // Since Last.fm doesn't have city-specific events, we'll use geo.gettopartists
    const url = `${API_URL}?method=geo.gettopartists&location=${encodeURIComponent(cityName)}&api_key=${API_KEY}&format=json`;
    
    return this.httpClient.get<any>(url).pipe(
      map(response => {
        if (!response.topartists?.artist) {
          return [];
        }

        return response.topartists.artist.map((artist: any) => ({
          id: artist.mbid || crypto.randomUUID(),
          name: artist.name,
          date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          venue: {
            name: 'Local Venue',
            city: cityName
          },
          image: artist.image[2]['#text'],
          url: artist.url,
          listeners: parseInt(artist.listeners)
        }));
      })
    );
  }
}