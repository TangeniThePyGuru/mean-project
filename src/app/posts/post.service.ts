import { Injectable } from '@angular/core';
import {Post} from './post.model';
import { Subject } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CONFIG} from '../config/config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient) { }
  // transform the post
  getPosts() {
    // a new array is created with the previous array being copied
    // return [...this.posts];
    this.http
        .get<{message: string, posts: any}>(`${CONFIG.api_url}/api/posts`)
        .pipe(map((postData) => {
            return postData.posts.map(post => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id
                };
            });
        }))
        .subscribe((transformedPosts) => {
          this.posts = transformedPosts;
          // notify all the arrays about the new data
          this.postsUpdated.next([...this.posts]);
        });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{message: string, postId: string}>(`${CONFIG.api_url}/api/posts`, post)
        .subscribe((responseData) => {
            post.id = responseData.postId;
          // only happen when post has been updated
          this.posts.push(post);
          // update the array on the interface
          this.postsUpdated.next([...this.posts]);
        });

  }

  deletePost(postId: string) {
      this.http.delete(`${CONFIG.api_url}/api/posts/${postId}`)
          .subscribe(() => {
            console.log('Deleted');
            const updatedPosts = this.posts.filter(post => post.id !== postId);
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
          });
  }
}
