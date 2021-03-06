import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.css']
})
export class SingupComponent implements OnInit,OnDestroy {
  isLoading=false;
  private authStatusSub?:Subscription;
  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.authStatusSub=this.authService.getAuthStatusListener().subscribe(
      authStatus=>{
        this.isLoading=false
      }
    );
  }

  onLogin(form:NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading=true;
    this.authService.createUser(form.value.email,form.value.password)
  }

  ngOnDestroy(){
    this.authStatusSub?.unsubscribe()
  }

}
