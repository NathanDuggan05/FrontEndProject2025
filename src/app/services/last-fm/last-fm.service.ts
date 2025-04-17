
// import necessary packages
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
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



  getTopArtists(): Observable<any>{
    let url = `${API_URL}?method=chart.gettopartists&api_key=${API_KEY}&format=json`;
    return this.httpClient.get<any>(url);
  }

  getTopAlbums(): Observable<any>{
    let url = `${API_URL}?method=chart.gettopalbums&api_key=${API_KEY}&format=json`;
    return this.httpClient.get<any>(url);
  }


}