import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, style, transition, animate, group } from '@angular/animations';

import { FirebaseService } from './services/firebase.service';
import { AuthService } from './services/auth.service';
import { ChipsComponent } from '@jaspero/ng2-chips';
import { ModalModule, Modal } from 'ngx-modal';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('itemAnim', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate(50)
      ]),
      transition(':leave', [
        group([
          animate('0.2s ease', style({
            transform: 'translate(150px,0px)'
          })),
          animate('0.1s 0.2s ease', style({
            opacity: 0
          }))
        ])
      ])
    ])
  ]
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
    date: ''
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
    console.log(this.today);
    
    this.firebaseService.getBookmarks().subscribe(bookmarks => {
      bookmarks.sort(b => b.date).reverse();
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
      date: ''
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
      }).sort(b => b.date).reverse();
      if(this.bookmarks.length > 0)
        this.none = true;
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


