import { ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';

export class RegisterValidators {
	public static match(controlName: string, matchingControlName: string): ValidatorFn {

		return (group: AbstractControl): ValidationErrors | null => {
			const control = group.get(controlName)
			const matchingControl = group.get(matchingControlName)

			if(!control || !matchingControl) {
				return { controlNotFound: false }
			}
			return control.value === matchingControl.value ? null : { noMatch: true}
		}
		
	}
}
