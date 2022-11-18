import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';

@Injectable({
	providedIn: 'root'
}) // dependencies injection
export class EmailTaken implements AsyncValidator { // type safety
	constructor(private readonly auth: AngularFireAuth) {}

	validate = (control: AbstractControl): Promise<ValidationErrors | null> => {
		return this.auth.fetchSignInMethodsForEmail(control.value)
			.then( respone => respone.length ? { emailTaken: true} : null)
	}
}
