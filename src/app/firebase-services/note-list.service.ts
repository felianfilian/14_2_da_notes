import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Note } from '../interfaces/note.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoteListService {
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  nomralMarkedNotes: Note[] = [];

  firestore: Firestore = inject(Firestore);

  unsubTrash;
  unsubNotes;
  unsubMarkedNotes;

  constructor() {
    this.unsubTrash = this.subTrashList();
    this.unsubNotes = this.subNotesList();
    this.unsubMarkedNotes = this.subMarkedNotesList();
  }

  async deleteNote(colId: 'notes' | 'trash', docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch((err) => {
      console.log(err);
    });
  }

  async updateNote(note: Note) {
    if (note.id) {
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJson(note)).catch((err) => {
        console.log(err);
      });
    }
  }

  getCleanJson(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    };
  }

  getColIdFromNote(note: Note) {
    if (note.type == 'note') {
      return 'notes';
    } else {
      return 'trash';
    }
  }

  async addNote(item: Note, colId: 'notes' | 'trash') {
    let colRef;
    if (colId == 'notes') {
      colRef = this.getNotesRef();
    } else {
      colRef = this.getTrashRef();
    }
    await addDoc(colRef, item).catch((err) => {
      console.error(err);
    });
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach((element) => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subNotesList() {
    let ref = collection(
      doc(collection(this.firestore, 'notes'), 'MARPygZziO2AZY1lptKJ'),
      'notesExtra'
    );
    const q = query(ref, limit(100));
    return onSnapshot(q, (list) => {
      this.normalNotes = [];
      list.forEach((element) => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subMarkedNotesList() {
    const q = query(
      this.getNotesRef(),
      where('marked', '==', true),
      limit(100)
    );
    return onSnapshot(q, (list) => {
      this.nomralMarkedNotes = [];
      list.forEach((element) => {
        this.nomralMarkedNotes.push(
          this.setNoteObject(element.data(), element.id)
        );
      });
    });
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id,
      type: obj.type || 'note',
      title: obj.title || '',
      content: obj.content || '',
      marked: obj.marked || false,
    };
  }

  ngonDestroy() {
    this.unsubTrash();
    this.unsubNotes();
    this.unsubMarkedNotes();
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
