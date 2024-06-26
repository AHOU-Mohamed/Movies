import { Component, OnInit } from '@angular/core';
import { FilmService } from '../../Service/film.service';
import { FavoritedMovie } from '../../Model/FavoritedMovie';
import { CommonModule } from '@angular/common';
import { Film } from '../../Model/film';
import { forkJoin } from 'rxjs';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-favorited',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './favorited.component.html',
  styleUrls: ['./favorited.component.css'],
})
export class FavoritedComponent implements OnInit {
  favoritedMovies!: FavoritedMovie[];
  favoritedMovieDetailsList: Film[] = [];

  constructor(private filmservice: FilmService) {}

  ngOnInit(): void {
    this.getAllFavoritesWithDetails();
  }
  getUrl(name : any){
    return this.filmservice.getimagefromapi(name);
  }

  getAllFavoritesWithDetails() {
    this.filmservice.getAllFavorites().subscribe((data) => {
      this.favoritedMovies = data;
      console.log("All favorited movies:", this.favoritedMovies);
  
      // Use forkJoin to parallelize requests
      const filteredMovies = this.favoritedMovies.filter((favoritedMovie) => favoritedMovie.idfilm);
      console.log("Filtered favorited movies:", filteredMovies);
  
      const requests = filteredMovies.map((favoritedMovie) =>
        this.filmservice.getPopularMoviesById(favoritedMovie.idfilm)
      );
  
      forkJoin(requests).subscribe((results) => {
        this.favoritedMovieDetailsList = results.filter((result) => !!result);
        console.log("Favorited movie details:", this.favoritedMovieDetailsList);
      });
    });
  }
  
}
