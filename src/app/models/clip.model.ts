import firebase from 'firebase/compat';

export interface IClip {
	docID?: string;
	uid: string;
	displayName: string;
	title: string;
	fileName: string;
	timestamp: firebase.firestore.FieldValue;
	url: string;
	screenshotURL: string;
}