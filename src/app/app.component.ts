import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface Movie {
  title: string;
  genre: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isLoading = false;
  errorMessage: null;

  @ViewChild('form') form;
  loadedMovies: Movie[];
  constructor(private http: HttpClient) {}

  onSubmit(form: NgForm) {
    this.onCreatePost(form.value);
    this.form.reset();
  }

  onCreatePost(postData: { title: string; genre: string }) {
    //http post request
    this.isLoading = true;
    this.http
      .post(
        'https://movies-project-d0259-default-rtdb.firebaseio.com/movies.json',
        postData
      )
      .subscribe((responseData) => {
        this.isLoading = false;
        this.onFetchMovies();
        console.log(responseData);
      });
  }

  onFetchMovies() {
    this.isLoading = true;
    this.http
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
          this.isLoading = false;
          return throwError(errorResponse);
        })
      )
      .subscribe((fetchedMovies) => {
        this.loadedMovies = fetchedMovies;
        this.isLoading = false;
      });
  }

  onDeleteMovies() {
    this.http
      .delete(
        'https://movies-project-d0259-default-rtdb.firebaseio.com/movies.json'
      )
      .subscribe({
        next: (response) => {
          console.log('Delete successful');
          this.onFetchMovies();
        },
        error: (error) => {
          console.error('An error occured!', error);
        },
      });
  }

  getFakeData() {
    this.http.get('https://Im-a-fake-URL.com').subscribe(
      (response) => {
        console.log('response received!');
      },
      (error) => {
        console.error("An error has occurred");
        this.errorMessage = error;
      }
    );
  }
}
