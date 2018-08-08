import { Injectable } from '@angular/core';
import {Post} from './post.model';
import { Subject } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CONFIG} from '../config/config';
@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient) { }

  getPosts() {
    // a new array is created with the previous array being copied
    // return [...this.posts];
    this.http.get<{message: string, posts: Post[]}>(`${CONFIG.api_url}/api/posts`)
        .subscribe((postData) => {
          this.posts = postData.posts;
          // notify all the arrays about the new data
          this.postsUpdated.next([...this.posts]);
        });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{message: string}>(`${CONFIG.api_url}/api/posts`, post)
        .subscribe((responseData) => {
          console.log(responseData.message);
          // only happen when post has been updated
          this.posts.push(post);
          this.postsUpdated.next([...this.posts]);
        });

  }
}
