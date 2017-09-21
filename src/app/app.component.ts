import { Component, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';

import { FirebaseService } from './services/firebase.service';
import { AuthService } from './services/auth.service';
import { ChipsComponent } from '@jaspero/ng2-chips';
import { ModalModule, Modal } from 'ngx-modal';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'BOOKMARKER';
  today;
  bookmarks: any = [];
  // Adding Bookmark
  tags = [];
  bookmark = {
    url:'',
    title:'',
    description:'',
    tags:this.tags,
    date: '',
    timeAdded: 0
  }
  //Indicators
  inputTitle = '';
  inputDescription = '';
  inputURL = '';
  inputTags = 'hide';

  // Searchbar         
  tagsList = [];
  none = true;

  //User
  user = {
    email:'',
    password:''
  }
  error ='';
  
  constructor(private firebaseService: FirebaseService, public auth: AuthService) { }

  ngOnInit() {
    let d = new Date;
    this.today = d.toDateString();
    console.log(this.today,d.getTime());
    
    this.firebaseService.getBookmarks().subscribe(bookmarks => {
      bookmarks = _.orderBy(bookmarks,'timeAdded','desc');
      this.bookmarks = bookmarks;
      console.log(this.bookmarks);

      this.tagsList = [];
      bookmarks.forEach(b => {
        b.tags.forEach(tag => {
          if(!this.tagsList.includes(tag)){
            this.tagsList.push(tag);
          }
        });
      });
      this.tagsList.sort();
      console.log(this.tagsList);
      if(bookmarks.length > 0)
      this.none = false;
    });
  }

  change(){
    console.log(this.bookmark);
  }

  removeBookmark(id) {
    this.firebaseService.removeBookmark(id);
  }

  addBookmark() {
    let d = new Date;
    this.bookmark.date = d.toDateString();
    this.bookmark.timeAdded = d.getTime()
    if(!this.validate()) {
      console.log('Adding:',this.bookmark);
      console.log('Added!');
      this.firebaseService.addBookmark(this.bookmark);
      this.reset();
    } else {
      console.log('Not added');
      
    }
    
  }

  validate() {
    let err = 0;

    if(this.bookmark.title === ''){
      err++;
      this.inputTitle  = 'has-error';
    }else this.inputTitle = 'has-success';

    if(this.bookmark.description === ''){
      err++;
      this.inputDescription  = 'has-error';
    }else this.inputDescription = 'has-success';
    
    if(this.bookmark.url === ''){
      err++;
      this.inputURL  = 'has-error';
    }else this.inputURL = 'has-success';
    
    if(this.bookmark.tags.length < 1){
      err++;
      this.inputTags  = '';
    }else this.inputTags = 'hide';

    console.log(err);
    
    return err;
  }

  reset() {
    this.tags = [];
    this.bookmark = {
      url:'',
      title:'',
      description:'',
      tags:this.tags,
      date: '',
      timeAdded:0
    }
    this.inputTitle = '';
    this.inputDescription = '';
    this.inputURL = '';
  }
  
  // Searching
  selected(value:any):void {
    console.log('Selected value is: ', value);
    
  }
 
  removed(value:any):void {
    console.log('Removed value is: ', value);
  }
 
  refreshValue(value:any):void {
    this.none = true;
    console.log('Refreshed',value);
    this.firebaseService.getBookmarks().subscribe(bookmarks =>{ 
      this.bookmarks = bookmarks.filter(b => { //This might be horrible code
        let matches = 0;
        value.forEach(val => {
          if(b.tags.includes(val.id))
            matches++;
        });
        if(matches == value.length)
          return b;
      });
      if(this.bookmarks.length > 0) {
        this.bookmarks = _.orderBy(this.bookmarks, 'timeAdded','desc');
        this.none = true;
      }
      else this.none = false;
    });
  }

  @ViewChild('loginModal')
  loginModal:Modal
  login() {
    this.auth.login(this.user.email+'',this.user.password+'')
    .then(value => {
      if(value == true) {
        this.error = '';
        this.loginModal.close();
      } else {
        this.error = value.message;
      }
    });
    
  }

  logout() {
    this.auth.logout();
  }
}


