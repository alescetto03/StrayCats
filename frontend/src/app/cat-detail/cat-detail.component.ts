import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { ApiService, BASE_HOST } from '../_services/rest-api/api.service';
import { MapComponent } from "../map/map.component";
import { DatePipe } from '@angular/common';
import { AuthService } from '../_services/auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { Cat } from '../_services/rest-api/cat.type';
import { Comment } from '../_services/rest-api/comment.type';

@Component({
  selector: 'app-cat-detail',
  standalone: true,
  imports: [MapComponent, RouterLink, RouterModule, ReactiveFormsModule, MarkdownModule],
  providers: [DatePipe],
  templateUrl: './cat-detail.component.html',
  styleUrl: './cat-detail.component.css'
})
export class CatDetailComponent {
  constructor(private route: ActivatedRoute, private datePipe: DatePipe) {}
  id: bigint = 0n;
  cat: Cat | null = null;
  comments: Comment[] = [];
  image: string  = "";
  restService = inject(ApiService);
  authService = inject(AuthService);
  commentForm = new FormGroup({
    text: new FormControl('', [
      Validators.required, 
      Validators.minLength(1)
    ])
  })
  @ViewChild('commentBox') commentBox!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('submitComment') submitComment!: ElementRef<HTMLButtonElement>

  ngOnInit() {
    this.id = this.route.snapshot.params["id"];
    console.log(this.id)
    this.restService.getCatById(this.id)
      .subscribe({
        next: (data: any) => {
          this.cat = data;
          this.image = BASE_HOST + "/public/cats/" + this.cat?.image
        },
        error: (err) => {
          console.log(err);
        }
      });
    this.restService.getComments(this.id)
      .subscribe({
        next: (data: any) => {
          this.comments = data
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  ngAfterViewInit() {
    this.commentBox.nativeElement.style.height = '20px';
  }

  async handleCommentSubmit() {
    const text = this.commentForm.value.text?.trim();
    if (!text || !this.cat?.catId) return;

    try {
      const result = await this.restService.saveComment(text, this.cat.catId);
      this.comments.push(result);
      this.commentForm.reset();
      this.commentBox.nativeElement.style.height = '20px';
      this.submitComment.nativeElement.disabled = true;
    } catch (err) {
      console.error('Errore durante il salvataggio del commento:', err);
    }
  }


  handleCommentInput(el: HTMLTextAreaElement) {
    const minHeight = 20;
    const maxHeight = 80;
    if (!el.value.trim()) {
      el.style.height = `${minHeight}px`;
      this.submitComment.nativeElement.disabled = true;
      return;
    } else {
      this.submitComment.nativeElement.disabled = false
    }
    const newHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${newHeight}px`;
  }

  formatDate(rawDate: Date | undefined): string | null {
    return this.datePipe.transform(rawDate, 'd MMMM y', '', 'it')
  }
}
