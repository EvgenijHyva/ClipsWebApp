import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { v4 as uuid } from 'uuid';
import { AlertColorEnum } from 'src/app/shared/alert/alert.component';
import { ClipService } from 'src/app/services/clip.service';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import { switchMap } from 'rxjs/operators';
import { combineLatest, forkJoin } from 'rxjs';
import { IClip } from 'src/app/models/clip.model';

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
    percentage: number = 0;
    showPercentage: boolean = false;
    task?: AngularFireUploadTask;
    timeoutId: NodeJS.Timeout | null = null;
    screenshots: string[] = [];
    selectedScreenshot: string = '';
    screenshotTask?: AngularFireUploadTask;

    constructor(
        private readonly storage: AngularFireStorage,
        private readonly auth: AngularFireAuth,
        private readonly clipsService: ClipService,
        private readonly router: Router,
        public readonly ffmpegService: FfmpegService
    ) { 
        auth.user.subscribe(user => this.user = user);
        this.ffmpegService.init();
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

    async uploadFile(): Promise<void> {
        this.form.disable()
        this.showPercentage = true;
        this.inSubmission = true;
        this.alertMessageColor = AlertColorEnum.BLUE;
        this.alertMessage = "Please wait! Your clip i being uploaded";
        this.showAlertMessage = true;

        const clipFileName = `${this.title.value}_${uuid()}`;
        const clipPath = `clips/${clipFileName}.mp4`;

        const screenshotBlob = await this.ffmpegService.blobFromURL(this.selectedScreenshot);
        const screenshotPath = `screenshots/${clipFileName}.png`; // firebase storage
        this.screenshotTask = this.storage.upload(
            screenshotPath, 
            screenshotBlob
        );
        // observable for upload progress
        this.task = this.storage.upload(clipPath, this.file);
        // reference can't be created before upload is complete, firebase will create temporary placeholder
        const clipRef = this.storage.ref(clipPath);
        // for link to screenshots
        const screenshotRef  =this.storage.ref(screenshotPath);
        // clip and screenshots upload progresbar (combined observables)
        combineLatest([
            this.task.percentageChanges(),
            this.screenshotTask.percentageChanges()
        ]).subscribe((progress) => { // not a single value, it store a values from 2 observable
            const [clipProgress, screenshotProgress] = progress; 
            if(!clipProgress || !screenshotProgress) {
                return;
            }
            const total = clipProgress + screenshotProgress; 
            this.percentage = total as number / 200; 
        });

        // snapshot is similar as percentageChanges, difference is type of information
        forkJoin([ // forkJoin will wait untill observables finished
            this.task.snapshotChanges(),
            this.screenshotTask.snapshotChanges()
        ]).pipe(
            switchMap(() => forkJoin([
                clipRef.getDownloadURL(),
                screenshotRef.getDownloadURL()
            ])) // inner observable will replace snapshot by reference
        ).subscribe({
            next: async (urls) => { 
                const [ clipURL, screenshotURL] = urls;
                const clip: IClip = { 
                    uid: this.user!.uid as string,
                    displayName: this.user!.displayName as string,
                    title: this.title.value,
                    fileName: `${clipFileName}.mp4`,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(), // for consistency, used server timestamp
                    url: clipURL,
                    screenshotURL
                }
                
                const clipDocumentRef = await this.clipsService.createClip(clip);

                this.alertMessageColor = AlertColorEnum.GREEN;
                this.alertMessage = 'Success, your clip is uploaded.';
                this.showPercentage = false;

                this.timeoutId = setTimeout((): void => {
                    this.router.navigate([
                        'clip', clipDocumentRef.id
                    ])
                }, 1500)
            },
            error: (error) => {
                if (error.code == "storage/unknown" ) console.log("Upload canceled");
                if (error.code == "storage/unauthorized") console.log("Access denied, you can upload only mp4 files");
                this.form.enable();
                // https://firebase.google.com/docs/storage/web/handle-errors firebase error codes
                this.alertMessageColor = AlertColorEnum.RED;
                this.alertMessage = 'Upload failed! You can upload only mp4 files. Please try again later.';
                this.inSubmission = false;
                this.showPercentage = false;
            }
        })
    }

    async storeFile(event: Event): Promise<void> {
        if (this.ffmpegService.isRunning) return; // stop user of uploading file while service is runing

        this.isDragover = false;
        this.file = (event as DragEvent).dataTransfer ?
            (event as DragEvent).dataTransfer?.files.item(0) ?? null : 
            (event.target as HTMLInputElement).files?.item(0) ?? null;
        if (!this.file || this.file.type !== 'video/mp4') {
            return;
        }
        
        this.screenshots = await this.ffmpegService.getScreenshots(this.file as File);
        this.selectedScreenshot = this.screenshots[0];

        const { name } = this.file as File;

        this.title.setValue(name.replace(/\.[^/.]+$/, ''));
        this.nextStep = true;
    }

    selectNewScreenshot(event: Event) {
        this.selectedScreenshot = (event.target as HTMLImageElement).src;
    }

    ngOnDestroy(): void {
        this.task?.cancel();
        clearTimeout(this.timeoutId as NodeJS.Timeout);
    }

}
