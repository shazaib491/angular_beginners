import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject<{ posts: Post[]; postCount: number }>();
  private BACKEND_URL = 'posts/';
  constructor(private http: HttpClient, private router: Router) {}
  getPosts(postPerPage: number, currentPage: number) {
    // return [...this.posts];
    const queryParams = `?pageSize=${postPerPage}&currentPage=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        environment.apiUrl + this.BACKEND_URL + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post: any) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((tranformedPostData) => {
        console.log(tranformedPostData);
        this.posts = tranformedPostData.posts;
        this.postUpdated.next({
          posts: [...this.posts],
          postCount: tranformedPostData.maxPosts,
        });
      });
  }

  getPostEventListener() {
    return this.postUpdated.asObservable();
  }

  getPost(id: any) {
    // return { ...this.posts.find((p) => p.id === id) };
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(`${environment.apiUrl}${this.BACKEND_URL}${id}`);
  }
  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image);

    this.http
      .post<{ message: string; post: Post }>(
        environment.apiUrl + this.BACKEND_URL,
        postData
      )
      .subscribe((responseData) => {
        // const post: Post = {
        //   id: responseData.post.id,
        //   title: title,
        //   content: content,
        //   imagePath: responseData.post.imagePath,
        // };
        // this.posts.push(post);
        // this.postUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }
  updatePost(id: string, title: string, content: string, image: File | string) {
    let Postdata;
    if (typeof image == 'object') {
      Postdata = new FormData();
      Postdata.append('id', id);
      Postdata.append('title', title);
      Postdata.append('content', content);
      Postdata.append('image', image);
    } else {
      Postdata = {
        id: id,
        title: title,
        content: content,
        image: image,
        creator: null,
      };
    }
    this.http
      .put(`${environment.apiUrl}${this.BACKEND_URL}${id}`, Postdata)
      .subscribe(
        (response) => {
          // const updatedPost = [...this.posts];
          // const oldPostIndex = updatedPost.findIndex((p) => p.id === id);
          // const post: Post = {
          //   id: id,
          //   title: title,
          //   content: content,
          //   imagePath: '',
          // };
          // updatedPost[oldPostIndex] = post;
          // this.posts = updatedPost;
          // console.log(this.posts);

          // this.postUpdated.next([...this.posts]);
          this.router.navigate(['/']);
        },
        (error) => {
          this.router.navigate(['/']);
        }
      );
  }

  deletePost(postId: String) {
    return this.http.delete(environment.apiUrl + this.BACKEND_URL + postId);
    // .subscribe(() => {
    //   const updatedData = this.posts.filter((post) => post.id !== postId);
    //   this.posts = updatedData;
    //   this.postUpdated.next([...this.posts]);
    // });
  }
}
