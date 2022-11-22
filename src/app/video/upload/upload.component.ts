import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { AlertColorEnum } from 'src/app/shared/alert/alert.component';
import { last, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
    user: firebase.User | null = null;
    isDragover: boolean = false;
    file: File | null = null;
    nextStep: boolean = false;
    alertMessage!: string;
    showAlertMessage: boolean = false;
    alertMessageColor: AlertColorEnum = AlertColorEnum.BLUE;
    inSubmission: boolean = false;
    precentage: number = 0;
    showPercentage: boolean = false;

    constructor(
        private readonly storage: AngularFireStorage,
        private readonly auth: AngularFireAuth,
        private readonly clipsService: ClipService
    ) { 
        auth.user.subscribe(user => this.user = user)
    }

    title = new FormControl('', { 
        validators: [
            Validators.required,
            Validators.minLength(3)
        ], 
        nonNullable:true
    })

    // thumbnail = new FormControl(null, [
    //     Validators.required,
    // ])

    form: FormGroup = new FormGroup({
        title: this.title,
        // thumbnail: this.thumbnail
    })

    uploadFile(): void {
        this.showPercentage = true;
        this.inSubmission = true;
        this.alertMessageColor = AlertColorEnum.BLUE;
        this.alertMessage = "Please wait! Your clip i being uploaded";
        this.showAlertMessage = true;

        const clipFileName = `${this.title.value}_${uuid()}`
        const clipPath = `clips/${clipFileName}.mp4`;
        // observable for upload progress
        const task = this.storage.upload(clipPath, this.file)
        // reference can't be created before upload is complete, direbase will create temporary placeholder
        const clipRef = this.storage.ref(clipPath) 
        task.percentageChanges().subscribe(progress => {
            this.precentage = progress as number / 100;
        })
        // snapshot is similar as percentageChanges, difference is type of information
        task.snapshotChanges().pipe(
            last(),
            switchMap(() => clipRef.getDownloadURL()) // inner observable will replace snapshot by reference
        ).subscribe({
            next: (url) => { 
                const clip = { 
                    uid: this.user!.uid as string,
                    displayName: this.user!.displayName as string,
                    title: this.title.value,
                    fileName: `${clipFileName}.mp4`,
                    url
                }
                
                this.clipsService.createClip(clip)
                console.log("created", clip)

                this.alertMessageColor = AlertColorEnum.GREEN;
                this.alertMessage = 'Success, your clip is uploaded.';
                this.showPercentage = false;
                setTimeout(() => {
                    this.resetToDefault()
                }, 3000)
            },
            error: (error) => {
                // https://firebase.google.com/docs/storage/web/handle-errors firebase error codes
                this.alertMessageColor = AlertColorEnum.RED;
                this.alertMessage = 'Upload failed! Please try again later.';
                this.inSubmission = true;
                this.showPercentage = false;
                console.error(error)
            }
        })
    }

    storeFile(event: Event): void {
        this.isDragover = false
        this.file = (event as DragEvent).dataTransfer?.files.item(0) ?? null
        const { name } = this.file!
        // if (!this.file || this.file.type !== 'video/mp4') {
        //     return
        // }
        this.title.setValue(name.replace(/\.[^/.]+$/, ''))
        this.nextStep = true;
    }

    resetToDefault() {
        this.inSubmission = false;
        this.alertMessage;
        this.alertMessageColor = AlertColorEnum.BLUE;
        this.showAlertMessage = false;
        this.file = null;
        this.title.setValue('');
        this.nextStep = false;
    }

    ngOnInit(): void {
    }

}
