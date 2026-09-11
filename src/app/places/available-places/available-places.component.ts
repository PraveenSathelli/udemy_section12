import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private placesService = inject(PlacesService);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.isFetching.set(true);
    const subscribtion = this.placesService.loadAvailablePlaces().subscribe({
      next: (data) => {
        console.log(data)
        this.places.set(data)
      }, error: (err: Error) => {
        this.error.set(err.message);
      }, complete: () => {
        //we can use set but just want to check this :) 
        this.isFetching.update((oldValue) => oldValue ? false : true);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscribtion.unsubscribe();
    });
  }

  onSelectPlace(selectPlace: Place) {
    const subscribtion = this.placesService.addPlaceToUserPlaces(selectPlace).subscribe({
      next: (value) => {
        console.log(value)
      },
    });

    this.destroyRef.onDestroy(() => {
      subscribtion.unsubscribe();
    });
  }
}