import { Injectable } from "@angular/core";
// Importing Capacitor's Preferences API for persistent storage
import { Preferences } from "@capacitor/preferences";

@Injectable({
    providedIn: 'root' // Makes this service available throughout the app without explicit imports
})
export class StorageService {
    /**
     * Saves data to persistent storage
     * @param key - Unique identifier for the stored data
     * @param value - Any data that can be JSON stringified
     * @returns Promise that resolves when data is saved
     */
    async set(key: string, value: any): Promise<void> {
        try {
            await Preferences.set({
                key: key,
                value: JSON.stringify(value) // Convert objects/arrays to string format for storage
            });
        } catch (error) {
            console.error('Error saving data to storage', error);
            // Error is logged but not thrown to prevent app crashes
        }
    }

    /**
     * Retrieves data from storage
     * @param key - Unique identifier for the stored data
     * @returns Promise that resolves with the parsed data or null if not found
     */
    async get(key: string): Promise<any> {
        try {
            const { value } = await Preferences.get({ key: key });
            return value ? JSON.parse(value) : null; // Convert stored string back to original format
        } catch (error) {
            console.error('Error retrieving data from storage', error);
            return null; // Return null instead of throwing to maintain app stability
        }
    }

    /**
     * Removes a specific item from storage
     * @param key - Unique identifier for the stored data to remove
     * @returns Promise that resolves when data is removed
     */
    async remove(key: string): Promise<void> {
        try {
            await Preferences.remove({ key: key });
        } catch (error) {
            console.error('Error removing data from storage', error);
            // Error is logged but not thrown to maintain app stability
        }
    }

    /**
     * Removes all data from storage
     * @returns Promise that resolves when storage is cleared
     */
    async clear(): Promise<void> {
        try {
            await Preferences.clear();
        } catch (error) {
            console.error('Error clearing storage', error);
            // Error is logged but not thrown to maintain app stability
        }
    }
}