import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertColorEnum } from 'src/app/shared/alert/alert.component';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent {
	constructor(
		private readonly auth: AngularFireAuth
		) {}

	creadentials: { email: string, password: string } = {
		email: '',
		password: ''
	}

	alertMessage!: string;
	alertColor!: AlertColorEnum;
	showAlert: boolean = false;
	inSubmission: boolean = false

	async login(): Promise<void> {
		this.alertMessage = 'Please wait, login processing'
		this.alertColor = AlertColorEnum.BLUE
		this.inSubmission = true
		this.showAlert = true;
		try{
			await this.auth.signInWithEmailAndPassword(
				this.creadentials.email, this.creadentials.password
			);
		} catch (e) {
			setTimeout((): boolean => this.inSubmission = false, 3000)
			this.alertMessage = 'Unexpected error occured. Please try again later :(';
			this.alertColor = AlertColorEnum.RED
			return
		}
		this.alertMessage = 'Success'
		this.alertColor = AlertColorEnum.GREEN
	}
}
