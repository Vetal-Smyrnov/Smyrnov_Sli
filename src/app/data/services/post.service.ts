import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  PostCreateDto,
  Post,
  CommentCreateDto,
  PostComment,
} from './post.interface';
import { map, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  #http = inject(HttpClient);
  baseApiUrl = 'https://icherniakov.ru/yt-course/';

  posts = signal<Post[]>([]);

  createPost(payLoad: PostCreateDto) {
    return this.#http.post<Post>(`${this.baseApiUrl}post/`, payLoad).pipe(
      switchMap(() => {
        return this.fetchPost();
      })
    );
  }

  fetchPost() {
    return this.#http
      .get<Post[]>(`${this.baseApiUrl}post/`)
      .pipe(tap((res) => this.posts.set(res)));
  }

  createComment(payLoad: CommentCreateDto) {
    return this.#http.post<PostComment>(`${this.baseApiUrl}comment/`, payLoad);
  }

  getCommentsByPostId(postId: number) {
    return this.#http
      .get<Post>(`${this.baseApiUrl}post/${postId}`)
      .pipe(map((res) => res.comments));
  }
}
