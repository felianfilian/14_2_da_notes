import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
} from '@angular/fire/firestore';
import { Note } from '../interfaces/note.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoteListService {
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  items$;
  items: any;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.items$ = collectionData(this.getNotesRef());
    this.items = this.items$.subscribe((list) => {
      list.forEach((element) => {
        console.log(element);
      });
    });
    this.items.unsubscribe();
  }

  // const itemCollection = collection(this.firestore, 'items');

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
