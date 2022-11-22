import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { AlertColorEnum } from 'src/app/shared/alert/alert.component';


@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

    isDragover: boolean = false;
    file: File | null = null;
    nextStep: boolean = false;
    alertMessage!: string;
    showAlertMessage: boolean = false;
    alertMessageColor: AlertColorEnum = AlertColorEnum.BLUE;
    inSubmission: boolean = false;
    precentage: number = 0;

    constructor(
        private readonly storage: AngularFireStorage
    ) { }

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
        this.inSubmission = true;
        this.alertMessageColor = AlertColorEnum.BLUE;
        this.alertMessage = "Please wait! Your clip i being uploaded";
        this.showAlertMessage = true;

        const clipFileName = `${this.title.value}_${uuid()}`
        const clipPath = `clips/${clipFileName}.mp4`;
        // observable for upload progress
        const task = this.storage.upload(clipPath, this.file)
        task.percentageChanges().subscribe(progress => {
            this.precentage = progress as number / 100;
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
