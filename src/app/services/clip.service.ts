import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import { IClip } from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of, switchMap, map } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
    providedIn: 'root'
})
export class ClipService {
	public clipsCollection: AngularFirestoreCollection<IClip>

    constructor(
		private readonly db: AngularFirestore,
		private readonly auth: AngularFireAuth,
		private readonly storage: AngularFireStorage
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
			}),
			map(snapshot => (snapshot as QuerySnapshot<IClip>).docs)
		)
	}

	updateClip(id: string, title: string) {
		return this.clipsCollection.doc(id).update({
			title
		})
	}

	async deleteUserClip(clip: IClip) {
		const clipRef = this.storage.ref(`clips/${clip.fileName}`)
		await clipRef.delete();
		
		await this.clipsCollection.doc(clip.docID).delete();
	}
}
