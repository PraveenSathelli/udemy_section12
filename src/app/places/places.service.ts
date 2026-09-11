import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private httpClient = inject(HttpClient);

  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places', 'Something went wrong in places..');
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3000/user-places', 'Something went wrong in user places..');
  }

  addPlaceToUserPlaces(place: Place) {
    this.userPlaces.update(previousPlace => {
    return  [...previousPlace,place]
    })
    // we can have catch error for identifying the error before processing the request
    return this.httpClient.put('http://localhost:3000/user-places', {
      placeId : place.id
    }).pipe(
      catchError(() =>  throwError( () =>{

      }))
    );
  }

  removeUserPlace(place: Place) { }

  fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient.get<{ places: Place[] }>(url).pipe(
      map((response) => {
        return response.places;
      }),
      tap({
        next: (places) => {
          this.userPlaces.set(places)
        }
      }),
      catchError((error) => {
        console.log("error: " + error);
        return throwError(() => {
          new Error(errorMessage);
        })
      })
    );
  }
}
