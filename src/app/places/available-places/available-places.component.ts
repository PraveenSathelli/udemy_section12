import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

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

  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.isFetching.set(true);
    const subscribtion = this.httpClient.get<{ places: Place[] }>('http://localhost:3000/places').pipe(
      map((response) => {
        return response.places;
      })
    ).subscribe({
      next: (data) => {
        console.log(data)
        this.places.set(data)
      }, error: (err) => {
        console.error(err.message)
        this.error.set("SOmething went wrong..")
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