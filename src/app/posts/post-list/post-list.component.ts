import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // pagination Property
  totalPosts = 0;
  postPerpage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;
  // pagination Property
userisAutheticated=false;
  posts: Post[] = [];
  private postsSub: Subscription = new Subscription();
  private authStatusSubs?:Subscription;
  public isLoading = false;
  public userId?:string;
  constructor(public postService: PostService,
              private authService:AuthService
    ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.postPerpage, 1);
    this.postsSub = this.postService
      .getPostEventListener()
      .subscribe((postData: {posts:Post[],postCount:number}) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts=postData.postCount
      });
      this.userId=this.authService.getUserId();
      this.userisAutheticated=this.authService.getIsAuth();
      this.authStatusSubs=this.authService.getAuthStatusListener().subscribe((isAuthenticated)=>{
        this.userisAutheticated=isAuthenticated;

      })
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSubs?.unsubscribe();
  }

  onDelete(postId: any) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postPerpage, this.currentPage);
    },error=>{
      this.isLoading = false;

    });
  }
  // pagination
  onChangePost(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = this.paginator.pageIndex +1;
    console.log(this.currentPage);
    this.postPerpage = pageData.pageSize;
    this.postService.getPosts(this.postPerpage, this.currentPage);
  }
}
