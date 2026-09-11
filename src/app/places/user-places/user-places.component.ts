import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  isFetching = signal(false);
  error = signal('');

  private destroyRef = inject(DestroyRef);
  private placeService = inject(PlacesService);
  places = this.placeService.loadedUserPlaces;

  ngOnInit() {
    this.isFetching.set(true);
    const subscribtion = this.placeService.loadUserPlaces().subscribe({
      error: (err: Error) => {
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

}
