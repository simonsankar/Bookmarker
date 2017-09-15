import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class FirebaseService {
  bookmarks: FirebaseListObservable<any[]>;

  constructor(private db: AngularFireDatabase) {
  }

  getBookmarks() {
   return this.bookmarks = this.db.list('/bookmarks');
  }

  addBookmark(bookmark) {
    this.bookmarks.push(bookmark);
  }

  removeBookmark(id) {
    this.db.object('/bookmarks/'+id).remove();
  }
}
