import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Movie } from './movie.model';
import { DataStorageService } from './data-storage.service';

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
  constructor(
    private http: HttpClient,
    private dataStorageService: DataStorageService
  ) {}

  onSubmit(form: NgForm) {
    this.isLoading = true;
    this.onCreatePost(form.value);
    this.form.reset();
  }

  onCreatePost(postData: Movie) {
    this.isLoading = true;
    this.dataStorageService.createPost(postData.title, postData.genre);
    this.onFetchMovies();
  }

  onFetchMovies() {
    this.isLoading = true;
    this.dataStorageService.fetchMovies().subscribe((movies) => {
      this.isLoading = false;
      this.loadedMovies = movies;
    });
  }

  onDeleteMovies() {
    this.dataStorageService.deleteAllMovies().subscribe({
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
        console.error('An error has occurred');
        this.errorMessage = error;
      }
    );
  }
}
