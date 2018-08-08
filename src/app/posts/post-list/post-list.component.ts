import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Post} from '../post.model';
import {PostService} from '../post.service';
import {Subscription} from 'rxjs';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postsSub: Subscription;
  constructor(public postsService: PostService) { }

  ngOnInit() {
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
        .subscribe((posts: Post[]) =>  {
          this.posts = posts;
        });
  }

  ngOnDestroy() {
    // prevents memory leak
    this.postsSub.unsubscribe();
  }

}
