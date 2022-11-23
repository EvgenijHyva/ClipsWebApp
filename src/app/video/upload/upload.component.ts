import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { AlertColorEnum } from 'src/app/shared/alert/alert.component';
import { last, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {
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
    task?: AngularFireUploadTask;

    constructor(
        private readonly storage: AngularFireStorage,
        private readonly auth: AngularFireAuth,
        private readonly clipsService: ClipService,
        private readonly router: Router
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
        this.form.disable()
        this.showPercentage = true;
        this.inSubmission = true;
        this.alertMessageColor = AlertColorEnum.BLUE;
        this.alertMessage = "Please wait! Your clip i being uploaded";
        this.showAlertMessage = true;

        const clipFileName = `${this.title.value}_${uuid()}`
        const clipPath = `clips/${clipFileName}.mp4`;
        // observable for upload progress
        this.task = this.storage.upload(clipPath, this.file)
        // reference can't be created before upload is complete, direbase will create temporary placeholder
        const clipRef = this.storage.ref(clipPath) 
        this.task.percentageChanges().subscribe(progress => {
            this.precentage = progress as number / 100;
        })
        // snapshot is similar as percentageChanges, difference is type of information
        this.task.snapshotChanges().pipe(
            last(),
            switchMap(() => clipRef.getDownloadURL()) // inner observable will replace snapshot by reference
        ).subscribe({
            next: async (url) => { 
                const clip = { 
                    uid: this.user!.uid as string,
                    displayName: this.user!.displayName as string,
                    title: this.title.value,
                    fileName: `${clipFileName}.mp4`,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(), // for consistency, used server timestamp
                    url
                }
                
                const clipDocumentRef = await this.clipsService.createClip(clip)

                this.alertMessageColor = AlertColorEnum.GREEN;
                this.alertMessage = 'Success, your clip is uploaded.';
                this.showPercentage = false;

                setTimeout((): void => {
                    this.router.navigate([
                        'clip', clipDocumentRef.id
                    ])
                }, 1500)
            },
            error: (error) => {
                if (error.code == "storage/unknown" ) console.log("Upload canceled")
                if (error.code == "storage/unauthorized") console.log("Access denied, you can upload only mp4 files")
                this.form.enable()
                // https://firebase.google.com/docs/storage/web/handle-errors firebase error codes
                this.alertMessageColor = AlertColorEnum.RED;
                this.alertMessage = 'Upload failed! You can upload only mp4 files. Please try again later.';
                this.inSubmission = false;
                this.showPercentage = false;
            }
        })
    }

    storeFile(event: Event): void {
        this.isDragover = false
        this.file = (event as DragEvent).dataTransfer ?
            (event as DragEvent).dataTransfer?.files.item(0) ?? null : 
            (event.target as HTMLInputElement).files?.item(0) ?? null
        const { name } = this.file!
        // if (!this.file || this.file.type !== 'video/mp4') {
        //     return
        // }
        this.title.setValue(name.replace(/\.[^/.]+$/, ''))
        this.nextStep = true;
    }

    resetToDefault() {
        // for future use
        this.inSubmission = false;
        this.alertMessage;
        this.alertMessageColor = AlertColorEnum.BLUE;
        this.showAlertMessage = false;
        this.file = null;
        this.title.setValue('');
        this.nextStep = false;
        this.task = undefined;
    }

    ngOnDestroy(): void {
        this.task?.cancel()
    }

}
