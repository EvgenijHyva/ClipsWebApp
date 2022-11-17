import { Component, Input, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {

    constructor(
        public modal: ModalService,
        public el: ElementRef
    ) { }

    @Input() modalID: string = ''  

    closeModal(): void {
        this.modal.toggleModal(this.modalID)
    }

    ngOnInit(): void {
        // Teleportation need to handle destroing element -> bellow
        //document.body.appendChild(this.el.nativeElement)
    }

    ngOnDestroy(): void {
        // Teleportation need to handle destroy
        //document.body.removeChild(this.el.nativeElement)
    }

}
