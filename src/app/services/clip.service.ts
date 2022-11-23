import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { IClip } from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ClipService {
	public clipsCollection: AngularFirestoreCollection<IClip>

    constructor(
		private readonly db: AngularFirestore,
		private readonly auth: AngularFireAuth
	) { 
		this.clipsCollection = db.collection('clips')
	}

	createClip(data: IClip): Promise<DocumentReference<IClip>> {
		return this.clipsCollection.add(data)
	}

	getUserClips() {
		return this.auth.user.pipe(
			switchMap(user => {
				if(!user) {
					return of([])
				}
				const query = this.clipsCollection.ref.where(
					'uid', "==", user.uid
				)

				return query.get()
			})
		)
	}
}
