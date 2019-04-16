import {Component, OnInit} from '@angular/core';
import {AppService} from "./app.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../environments/environment";

declare let gapi: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Mongo-Angular-Spark lab';
  googleAuth;

  constructor(private http: HttpClient, public appService: AppService,) {
  }


  signIn() {
    console.log(gapi);
    this.googleAuth = gapi.auth2.getAuthInstance();
    console.log(this.googleAuth);
    this.googleAuth.grantOfflineAccess().then((resp) => {
      console.log("********");
      console.log(resp);
      localStorage.setItem('isSignedIn', 'true');
      this.sendAuthCode(resp.code);
    });
  }

  onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
  }

  signOut() {
    this.handleClientLoad();

    this.googleAuth = gapi.auth2.getAuthInstance();

    this.googleAuth.then((data) => {
      console.log("DATA BELOW ***");
      console.log(data);
      this.googleAuth.signOut();
      localStorage.setItem('isSignedIn', 'false');
      localStorage.setItem("userID", "");
      window.location.reload();
      console.log(" This is sign in status: " + this.appService.isSignedIn());
    })
  }

  sendAuthCode(code: string): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    this.http.post(environment.API_URL + "login", {code: code}, httpOptions)
      .subscribe(onSuccess => {
        console.log(code);
        console.log("Code sent to server");
        console.log(onSuccess);
        console.log(onSuccess["_id"]);
        console.log(onSuccess["_id"]["$oid"]);
        console.log(onSuccess["email"]);
        console.log(onSuccess["fullName"]);
        console.log(onSuccess["pictureUrl"]);
        localStorage.setItem("oid", onSuccess["_id"]["$oid"]);
        localStorage.setItem("email", onSuccess["email"]);
        localStorage.setItem("userFullName", onSuccess["fullName"]);
        localStorage.setItem("pictureUrl", onSuccess["pictureUrl"]);
      }, onFail => {
        console.log("ERROR: Code couldn't be sent to the server");
      });
  }


  handleClientLoad(){
    gapi.load('client:auth2', this.initClient);
  }

  initClient(){
    gapi.client.init({
      'clientId': '375549452265-kpv6ds6lpfc0ibasgeqcgq1r6t6t6sth.apps.googleusercontent.com',
      'scope': 'profile email'
    });
  }

  ngOnInit() {
    this.handleClientLoad();
    /*gapi.load('client:auth2', this.initClient);*/
  }
}
