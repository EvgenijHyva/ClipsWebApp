import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

    isDragover: boolean = false;

    constructor() { }

    storeFile(event: Event): void {
        this.isDragover = false
    }

    ngOnInit(): void {
    }

}
