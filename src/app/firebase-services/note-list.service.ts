import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc } from '@angular/fire/firestore';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root',
})
export class NoteListService {
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  firestore: Firestore = inject(Firestore);

  constructor() {}

  // const itemCollection = collection(this.firestore, 'items');

  getNoteRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
