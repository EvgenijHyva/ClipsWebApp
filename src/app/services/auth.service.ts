import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { IUserCollection } from '../models/user.model';


@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private userCollection: AngularFirestoreCollection<IUserCollection>;
	public isAuthenticated$: boolean = false; // observable naming convention

	constructor(
		private auth: AngularFireAuth,
		private db: AngularFirestore
	) { 
		this.userCollection = db.collection("users")
		auth.user.subscribe(console.log)
	}

	public async createUser(email: string, password:string) {
		if(!password) {
			throw new Error("Password is required");
		}
		return await this.auth.createUserWithEmailAndPassword(
			email, password
		);
	}	

	public async createUserCollection(userUid: string , collection: IUserCollection) {
		if(!userUid) {
			throw new Error("User can't be found, please provide uid")
		}
		await this.userCollection.doc(userUid).set(collection);
	}
}
