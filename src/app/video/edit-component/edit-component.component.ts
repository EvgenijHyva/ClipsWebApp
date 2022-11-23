import { Component, OnInit, OnDestroy, OnChanges, Input, SimpleChanges } from '@angular/core';
import { IClip } from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-edit-component',
	templateUrl: './edit-component.component.html',
	styleUrls: ['./edit-component.component.css']
})
export class EditComponentComponent implements OnInit, OnDestroy, OnChanges {
	modalId: 'editClip' = 'editClip';

	@Input('activeClip') activeClip: IClip | null = null;
	
	constructor(
		private readonly modal: ModalService
	) { }
		
		
	clipID = new FormControl('', {
		nonNullable:true
	})
	title = new FormControl('', { 
        validators: [
            Validators.required,
            Validators.minLength(3)
        ], 
        nonNullable:true
    })

    editActiveClipForm: FormGroup = new FormGroup({
		id: this.clipID,
        title: this.title,
    })


	ngOnInit(): void {
		this.modal.register(this.modalId);
	}

	ngOnDestroy(): void {
		this.modal.unregister(this.modalId);
	}

	ngOnChanges(): void {
		if (!this.activeClip) return
		this.clipID.setValue(this.activeClip.docID as string)
		this.title.setValue(this.activeClip.title)
	}
}
