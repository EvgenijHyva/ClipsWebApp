import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent  {
	name = new FormControl('', [
		Validators.required,
		Validators.minLength(3)
	])
	email = new FormControl('', [
		Validators.required,
		Validators.email
	])
	age = new FormControl('', [
		Validators.max(120),
		Validators.min(14)
	])
	password = new FormControl('', [
		Validators.required,
		Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
	])
	confirm_password = new FormControl('', [
		Validators.required,
	])
	phone_number = new FormControl('', [
		Validators.required,
		Validators.maxLength(21),
		Validators.minLength(21)
	])

	registerForm: FormGroup = new FormGroup({
		name: this.name,
		email: this.email,
		age: this.age,
		password: this.password,
		confirm_password: this.confirm_password,
		phone_number: this.phone_number
	});

	register() {
		console.log("this")
	}
}
