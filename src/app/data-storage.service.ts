import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Movie } from './movie.model';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient) { }

  createPost(title: string, genre: string) {
    const postData: Movie = {title: title, genre: genre};
    this.http
      .post(
        'https://movies-project-d0259-default-rtdb.firebaseio.com/movies.json',
        postData
      )
      .subscribe((responseData) => {
        this.fetchMovies();
        console.log(responseData);
      });
  }

  fetchMovies() {
    return this.http
    .get<Movie[]>(
      'https://movies-project-d0259-default-rtdb.firebaseio.com/movies.json'
    )
    .pipe(
      map((responseData) => {
        const fetchedMovies = [];
        for (const elem in responseData) {
          fetchedMovies.push(responseData[elem]);
        }
        console.log(fetchedMovies);
        return fetchedMovies;
      }),
      catchError((errorResponse) => {
        return throwError(errorResponse);
      })
    );
  }

  deleteAllMovies() {
    return this.http.delete('https://movies-project-d0259-default-rtdb.firebaseio.com/movies.json')
  }

}
