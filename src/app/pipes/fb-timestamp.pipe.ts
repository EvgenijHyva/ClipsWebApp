import { Pipe, PipeTransform } from '@angular/core';
import firebase from 'firebase/compat';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'fbTimestamp'
})
export class FbTimestampPipe implements PipeTransform {

	constructor(private readonly datePipe: DatePipe) { }

    transform(value: firebase.firestore.FieldValue | undefined) {
		if(!value) return '';
		const date = (value as firebase.firestore.Timestamp).toDate();
		return this.datePipe.transform(date, "mediumDate");
    }

}
