import {Component, OnInit} from '@angular/core';
import {AppService} from "./app.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";

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
    this.googleAuth = gapi.auth2.getAuthInstance();
    console.log(" This is google Auth " + this.googleAuth);
    this.googleAuth.grantOfflineAccess().then((resp) => {
      localStorage.setItem('isSignedIn', 'true');
      this.sendAuthCode(resp.code);
    });
  }

  signOut() {
    this.handleClientLoad();

    this.googleAuth = gapi.auth2.getAuthInstance();

    this.googleAuth.then(() => {
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
