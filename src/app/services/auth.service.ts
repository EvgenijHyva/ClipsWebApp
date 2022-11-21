import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { delay, map, Observable } from 'rxjs';
import { IUserCollection } from '../models/user.model';


@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private userCollection: AngularFirestoreCollection<IUserCollection>;
	public isAuthenticated$: Observable<boolean>; // observable naming convention
	public isAuthenticatedWithDelay$: Observable<boolean>;

	constructor(
		private auth: AngularFireAuth,
		private db: AngularFirestore,
		private readonly router: Router
	) { 
		this.userCollection = db.collection("users")
		this.isAuthenticated$ = auth.user.pipe(
			map(item => !!item)
		)
		this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
			delay(1500)
		)
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

	public async logout(event?: Event) {
		if (event) 
			event.preventDefault();
		await this.auth.signOut();
		await this.router.navigateByUrl('/')
	}
}
