import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import { IClip } from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of, switchMap, map, BehaviorSubject, combineLatest } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { clipsSortingDirection } from '../video/manage/manage.component';

@Injectable({
    providedIn: 'root'
})
export class ClipService {
	public clipsCollection: AngularFirestoreCollection<IClip>;
	pageClips: IClip[] = [];
	pendingRequest: boolean = false;

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

	getUserClips(sort$: BehaviorSubject<clipsSortingDirection>) {
		return combineLatest([
			this.auth.user, 
			sort$ // combined sorting observable defined in manage component
		]).pipe(
			switchMap(values => {
				const [user, sort] = values;
				if(!user) {
					return of([])
				}
				const query = this.clipsCollection.ref.where(
					'uid', "==", user.uid
				).orderBy(
					'timestamp',	// sorting property name 
					sort === '1' ? 'desc' : 'asc' // sort direction
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
		const clipRef = this.storage.ref(`clips/${clip.fileName}`);
		const screenshotRef = this.storage.ref(`screenshots/${clip.screenshotFileName}`);
		await clipRef.delete();
		await screenshotRef.delete();
		await this.clipsCollection.doc(clip.docID).delete();
	}

	async getClips() {
		if (this.pendingRequest) return;
		this.pendingRequest = true;

		let query = this.clipsCollection.ref.orderBy(
			'timestamp', 'desc'
		).limit(6)

		const { length } = this.pageClips;
		if (length) {
			const lascDocID = this.pageClips[length-1].docID;
			const lastDoc = await this.clipsCollection.doc(lascDocID)
				.get() // init query, returns Observable
				.toPromise() // convert into promise
			
			query = query.startAfter(lastDoc);
		}
		const snapshot = await query.get();
		snapshot.forEach(doc => {
			this.pageClips.push({
				docID: doc.id,
				...doc.data()
			})
		})

		this.pendingRequest = false;
	}
}
