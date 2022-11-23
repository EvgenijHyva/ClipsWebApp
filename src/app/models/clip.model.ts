import firebase from 'firebase/compat';

export interface IClip {
	uid: string;
	displayName: string;
	title: string;
	fileName: string;
	timestamp: firebase.firestore.FieldValue;
	url: string
}