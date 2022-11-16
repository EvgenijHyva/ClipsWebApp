import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
	providedIn: 'root'
})
export class AuthService {

	constructor(
		private auth: AngularFireAuth,
		private db: AngularFirestore
	) { }

	public async createUser(email: string, password:string) {
		await this.auth.createUserWithEmailAndPassword(
			email, password
		);
	}	

	public async createUserCollection(collection: IUserCollection) {	
		await this.db.collection("users").add(collection);
	}
}


export interface IUserCollection {
	name: string,
	email: string,
	age: string,
	phone_number: string
}