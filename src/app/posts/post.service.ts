import { Injectable } from '@angular/core';
import {Post} from './post.model';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>()
  constructor() { }

  getPosts() {
    // a new array is created with the previous array being copied
    return [...this.posts];
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {title: title, content: content};
    this.posts.push(post);
    this.postsUpdated.next([...this.posts])
  }
}