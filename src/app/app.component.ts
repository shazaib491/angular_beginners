import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs?: Subscription;
  constructor(private AuthService: AuthService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.AuthService.getIsAuth();
    this.authListenerSubs = this.AuthService.getAuthStatusListener().subscribe(
      (isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      }
    );
    this.AuthService.autoAuthUser();
  }
  onLogout() {
    this.AuthService.logout();
  }
  ngOnDestroy() {
    this.authListenerSubs?.unsubscribe();
  }
}
