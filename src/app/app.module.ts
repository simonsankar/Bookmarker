import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { JasperoChipsModule } from '@jaspero/ng2-chips';
import { SelectModule } from 'ng2-select';
import { ModalModule } from 'ngx-modal';

import { FirebaseService } from './services/firebase.service';
import { AuthService } from './services/auth.service';

import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    JasperoChipsModule,
    SelectModule,
    ModalModule,
  ],
  providers: [FirebaseService,AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
