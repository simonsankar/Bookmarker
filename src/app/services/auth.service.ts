import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  public user: Observable<firebase.User>;
  loggedIn:boolean = false;

  constructor(public auth: AngularFireAuth) {
    this.user = auth.authState;
    this.user.subscribe(value => {
      if(value)
        this.loggedIn = true;
      else this.loggedIn =false;
    })
  }

  login(email: string, password: string) {
    return this.auth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });
  }

  logout() {
    this.auth
      .auth
      .signOut();
  }

}
