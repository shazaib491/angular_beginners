import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AngulaMaterialModule } from "../angula-material/angula-material.module";
import { LoginComponent } from "./login/login.component";
import { SingupComponent } from "./singup/singup.component";
import { AuthRoutingModule } from "./auth-routing.module";
import { CommonModule } from "@angular/common";
@NgModule({
  declarations:[
    LoginComponent,
    SingupComponent
  ],
  imports:[
    FormsModule,
    AngulaMaterialModule,
    AuthRoutingModule,
    CommonModule,

  ]
})

export class AuthModule{}
