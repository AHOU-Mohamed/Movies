import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FilmService } from "../../Service/film.service";
import { Filmdetails } from "../../Model/filmdetails";
import { Genre } from "../../Model/genre";
import { CommonModule } from "@angular/common";
import { Editor, NgxEditorModule, Validators } from 'ngx-editor';
import {FormControl, FormGroup, FormsModule} from "@angular/forms";
import {Commentaire} from "../../Model/Commentaire";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommentForm } from '../../Model/commentForm';


@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, NgxEditorModule, FormsModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy {
  constructor(private filmservice: FilmService, private activatedRoute: ActivatedRoute,private sanitizer: DomSanitizer) {
  }

  formData: { nom: string, comment: string } = { nom: '', comment: '' };

  comments:CommentForm[]=[]
  test!:CommentForm

  submit_commentaire(){
    const commentData = {
      idfilm: this.filmId,
      name: this.formData.nom,
      commentaire: this.formData.comment,
    };
    this.test = {nom:this.formData.nom,comment:this.formData.comment}
    console.log(commentData)
    this.filmservice.addComment(commentData).subscribe(
      (response) => {
        // Handle success if needed
        console.log('Comment added successfully', response);
        // Refresh comment data after adding a new comment
        this.getCommentaireFiltred();
        console.log("comments from list ", this.comments.map(comment => comment.comment));

      

      },
      (error) => {
        // Handle error if needed
        console.error('Error adding comment', error);
      }
    );

  }
  addList(){
    this.comments.push(this.test)

  }


  filmdetails!: Filmdetails;
  commentaire!:Commentaire;
  commentaireFiltred!:Commentaire[];
  filmId!:number;
  genre!: Genre[];


  //text editor
  editor!: Editor;
  html: string = 'hello world';
  form = new FormGroup({
    editorContent: new FormControl('', Validators.required()),
  });
  submitEditorContent() {
    // Access the content using the editor's content property
    const editorContent = this.html;

    // Do something with the content, e.g., send it to the server or log it
    console.log('Editor content submitted:',);
  }

  getPopularMoviesById() {//get details
    this.filmservice.getPopularMoviesById(this.activatedRoute.snapshot.params["id"]).
    subscribe((result) => {
      this.filmdetails = result;
      this.genre = this.filmdetails.genres;
    });
  }
  getCommentaire(){
    this.filmservice.getCommentaire().subscribe((result)=>{
      this.commentaire=result
    })
  }
  getCommentaireFiltred(){
    // console.log("now poe ",this.filmId);
    // this.filmservice.getCommentaireFiltred(idFilm).subscribe((result)=>{
    //   this.commentaireFiltred=result
    // })
    if(this.test!=null){this.comments.push(this.test)}
    

  }
  deleteComment(id: number) {
    this.filmservice.deleteComment(id).subscribe(
      (response) => {
        // Handle success if needed
        console.log('Comment deleted successfully', response);
        // Refresh comment data after adding a new comment
        this.getCommentaireFiltred();
      },
      (error) => {
        // Handle error if needed
        console.error('Error adding comment', error);
      }
    );
  }

  ngOnInit(): void {
    this.getPopularMoviesById();
    this.getCommentaire();
    this.submit_commentaire();
    this.editor = new Editor();
    this.activatedRoute.params.subscribe(params => {
      // Access the film.id parameter
      const id = params['id'];
      this.filmId=id;

      // Use the id as needed, for example, call your service method
      this.getCommentaireFiltred();

    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  protected readonly Editor = Editor;
  sanitizeHTML(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

}
