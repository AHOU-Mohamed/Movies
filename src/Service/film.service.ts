import { Injectable } from '@angular/core';
import { Film } from "../Model/film";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {FavoritedMovie} from "../Model/FavoritedMovie";
import { CommentForm } from '../Model/commentForm';

@Injectable({
  providedIn: 'root',
})
export class FilmService {
  constructor(private http: HttpClient) { }
  
  formData: {idfilm: number, favorited: string } = { idfilm: 1, favorited: '' };

  FavoritedMovie:FavoritedMovie[]=[]
  test!:FavoritedMovie

  
 

  baseurl = "https://api.themoviedb.org/3/discover/movie";
  apikey = "4722616a8836f0b929a9cb3a04f6a6a4";

  secondBaseUrl="http://localhost:8080/Comments"

  thirdBaseUrl="http://localhost:8080/favorites"

  //commentaire
  getCommentaire():Observable<any>{
    return this.http.get<any>(`${this.secondBaseUrl}/A`)
  }
  getCommentaireFiltred(idFilm:number):Observable<any>{
    return this.http.get<any>(`${this.secondBaseUrl}/getcomment/${idFilm}`)
  }
  addComment(commentData: any): Observable<any> {
    return this.http.post<any>(`${this.secondBaseUrl}/postComment`, commentData);
  }
  deleteComment(id:number): Observable<any> {
    return this.http.delete<any>(`${this.secondBaseUrl}/deletecomment/${id}`);
  }

  //moviedb
  getPopularMovies(): Observable<any> {
    return this.http.get<any>(`${this.baseurl}?api_key=${this.apikey}`);
  }

  getPopularMoviesById(id: number): Observable<any> {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${this.apikey}`;
    return this.http.get<any>(url);
    console.log(url)
  }
  getimagefromapi( poster_path: string){
    return 'https://image.tmdb.org/t/p/w1280' + poster_path
  }
  searchMovies(moviePrefix: string): Observable<any> {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${this.apikey}&language=en-US&query=${moviePrefix}%20&page=1&include_adult=true`
    return this.http.get<any>(url).pipe(map((res: any) => res.results))
  }
  //favorisspring
  getAllFavorites(): Observable<any> {
    
    return this.http.get<any>(`${this.thirdBaseUrl}/A`);
  }

  addFavorite(favoritedMovie: any): Observable<FavoritedMovie> {
    this.test = {id:1,idfilm:this.formData.idfilm,favorited:this.formData.favorited}
    return this.http.post<FavoritedMovie>(`${this.thirdBaseUrl}/postFavorite`, favoritedMovie);
  }

  deleteFavorite(id: number): Observable<any> {
    return this.http.delete(`${this.thirdBaseUrl}/delete/${id}`);
  }

  deleteFavoriteByIdFilm(idfilm: number): Observable<any> {
    return this.http.delete(`${this.thirdBaseUrl}/deletefavorite/${idfilm}`);
  }

  getFavoritesByIdFilm(idfilm: number): Observable<FavoritedMovie[]> {
    return this.http.get<FavoritedMovie[]>(`${this.thirdBaseUrl}/getfavorite/${idfilm}`);

  }
}
