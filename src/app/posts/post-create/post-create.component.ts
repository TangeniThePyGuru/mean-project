import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {PostService} from '../post.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Post} from '../post.model';
import {mimeType} from './mine-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  post: Post;
  private mode = 'create';
  private postId: string;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  constructor(public postsService: PostService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3) ]
      }),
      'content': new FormControl(null, {
        validators: [Validators.required]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    // in-built subscribers we never need to un-subscribe
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId)
            .subscribe(postData => {
              this.isLoading = false;
              this.post = {id: postData._id, title: postData.title, content: postData.content};
            //  initializing the angular form template
              this.form.setValue({
                title: this.post.title,
                content: this.post.content
              });
            });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    // console.dir(postInput)
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'edit') {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content);
    } else {
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    }
    // reactive forms use reset() and not resetForm()
    this.form.reset();
  }

  onImagePicked(event: Event) {
    // type conversion
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    // synchronous function
    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    reader.readAsDataURL(file);
    console.log(file);
    console.log(this.form);
  }

}
