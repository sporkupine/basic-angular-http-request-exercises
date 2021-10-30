import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { catchError, map } from "rxjs/operators";
import { throwError } from 'rxjs';

interface Movie {
  title: string,
  genre: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  @ViewChild('form') form;
  loadedMovies: Movie[];
  constructor(private http: HttpClient) {}

  onSubmit(form: NgForm) {
    this.onCreatePost(form.value)
    this.form.reset();
  }

  onCreatePost(postData: { title: string; genre: string }) {
    //http post request
    this.http.post(
      'https://movies-project-d0259-default-rtdb.firebaseio.com/movies.json',
      postData
    ).subscribe(responseData => {
      console.log(responseData);
    });
  }

  onFetchMovies() {
    this.http.get<Movie[]>('https://movies-project-d0259-default-rtdb.firebaseio.com/movies.json'
    ).pipe(
      map((responseData) => {
        const fetchedMovies = [];
        for(const elem in responseData) {
          fetchedMovies.push(responseData[elem])
        }
        console.log(fetchedMovies);
        return fetchedMovies;
      }), catchError(errorResponse => {
        return throwError(errorResponse);
      })).subscribe(fetchedMovies => {
        this.loadedMovies = fetchedMovies;
      });

  }
}
