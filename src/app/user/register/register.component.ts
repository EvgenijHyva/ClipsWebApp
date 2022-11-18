import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertColorEnum } from 'src/app/shared/alert/alert.component';
import { AuthService } from 'src/app/services/auth.service';
import { IUserCollection } from 'src/app/models/user.model';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent  {
	constructor(
		private readonly authService: AuthService,
		private readonly emailTaken: EmailTaken
	) {}

	inSubmission: boolean = false;

	name = new FormControl('', [
		Validators.required,
		Validators.minLength(3)
	])
	email = new FormControl('', [
		Validators.required,
		Validators.email
	], [this.emailTaken.validate])
	age = new FormControl<number | null>(null, [
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
	}, [RegisterValidators.match("password", "confirm_password")]);

	async register(): Promise<void> {
		this.alertColor = AlertColorEnum.BLUE
		this.alertMessage = 'Please wait, processing account creation'
		this.inSubmission = true
		this.showAlert = true

		const { email, password } = this.registerForm.value;
		try {
			const userCredentials = await this.authService.createUser(email, password);
			
			await this.authService.createUserCollection(userCredentials.user!.uid, {
				name: this.name.value,
				email: this.email.value,
				age: this.age.value,
				phone_number: this.phone_number.value
			} as IUserCollection)
			
			await userCredentials.user?.updateProfile({ displayName: this.name.value })

		} catch (e) {
			console.error(e)
			this.alertMessage = "An unexpected error occurred."
			this.alertColor = AlertColorEnum.RED
			this.inSubmission = false
			return
		}

		this.alertMessage = `Success! your account has been created.`
		this.alertColor = AlertColorEnum.GREEN;
	}

	showAlert: boolean = false;
	alertColor: AlertColorEnum = AlertColorEnum.BLUE;
	alertMessage: string = 'Please wait, processing account creation';
}
