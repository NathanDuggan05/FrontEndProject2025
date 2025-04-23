import { Injectable } from "@angular/core";
import { Preferences } from "@capacitor/preferences";

@Injectable({
    providedIn: 'root' //globally available
})
export class StorageService {
    // Save data to storage with a key
    async set(key: string, value: any): Promise<void> {
        try {
            await Preferences.set({
                key: key,
                value: JSON.stringify(value) // Convert the object to a string
            });
        } catch (error) {
            console.error('Error saving data to storage', error);
        }
    }

    // Get data from storage with a key
    async get(key: string): Promise<any> {
        try {
            const { value } = await Preferences.get({ key: key });
            return value ? JSON.parse(value) : null; // Convert the string back to an object
        } catch (error) {
            console.error('Error retrieving data from storage', error);
            return null;
        }
    }

    // Remove data from storage with a key
    async remove(key: string): Promise<void> {
        try {
            await Preferences.remove({ key: key });
        } catch (error) {
            console.error('Error removing data from storage', error);
        }
    }

    // Clear all data from storage
    async clear(): Promise<void> {
        try {
            await Preferences.clear();
        } catch (error) {
            console.error('Error clearing storage', error);
        }
    }
}