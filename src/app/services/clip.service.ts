import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { IClip } from '../models/clip.model';

@Injectable({
    providedIn: 'root'
})
export class ClipService {
	public clipsCollection: AngularFirestoreCollection<IClip>

    constructor(
		private readonly db: AngularFirestore
	) { 
		this.clipsCollection = db.collection('clips')
	}

	async createClip(data: IClip): Promise<void> {
		await this.clipsCollection.add(data)
	}
}
