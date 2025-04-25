import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
// Custom services for storage and Last.fm API
import { StorageService } from './services/storage/storage.service';
import { LastFmService } from './services/last-fm/last-fm.service';

// Main application configuration object
export const appConfig: ApplicationConfig = {
  providers: [
    // Enable Zone.js change detection with event coalescing for better performance
    provideZoneChangeDetection({ eventCoalescing: true }), 
    // Configure routing using defined routes
    provideRouter(routes),
    // Enable HTTP client for API calls
    provideHttpClient(), 
    // Register custom services for dependency injection
    StorageService, 
    LastFmService 
  ]
};