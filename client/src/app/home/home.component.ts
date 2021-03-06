import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../auth.service";

//Declare pulls the variable from the html/js environment, so our gapi we declared in index gets pulled here.
declare let gapi: any;
//Gapi: The google api thing
//Auth2: Has to be initialized first (done in index.html), then contains a lot of useful things.
//gapi.auth2.getAuthInstance(). Type: gapi.auth2.GoogleAuth object. This is what is used to call most of the methods.
//authInstance.currentUser.get(). Type: GoogleUser. Gets all of the user's information as well as authenticating info.

//The google oauth biblé https://developers.google.com/identity/sign-in/web/reference

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  public auth: AuthService;
  public text: string;
  public buttonSource1: string;

  constructor(private authService: AuthService) {
    this.text = 'MoRide';
    this.auth = authService;
    this.buttonSource1 = "../../assets/GoogleButtons/btn_google_signin_light_normal_web.png";
  }

  //TODO: Need a way to check refresh after clicking sign in
  //TODO: Also potentially look into signing out on every refresh

  initGapi(): void {
    this.authService.loadClient();
  }

  ngOnInit(): void {
    this.initGapi();
  }
}
