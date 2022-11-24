import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { IClip } from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertColorEnum } from 'src/app/shared/alert/alert.component';
import { ClipService } from 'src/app/services/clip.service';

@Component({
	selector: 'app-edit-component',
	templateUrl: './edit-component.component.html',
	styleUrls: ['./edit-component.component.css']
})
export class EditComponentComponent implements OnInit, OnDestroy, OnChanges {
	modalId: 'editClip' = 'editClip';

	@Input('activeClip') activeClip: IClip | null = null;
	@Output() update = new EventEmitter();

	showAlertMessage: boolean = false;
	alertMessageColor!: AlertColorEnum;
	alertMessage: string = '';
	inSubmission: boolean = false;

	constructor(
		private readonly modal: ModalService,
		private readonly clipService: ClipService
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

	async submit() {
		if(!this.activeClip) return;

		this.inSubmission = true;
		this.showAlertMessage = true;
		this.alertMessageColor = AlertColorEnum.BLUE;
		this.alertMessage = 'Please wait, updating clip.'
		try {
			await this.clipService.updateClip(
				this.clipID.value, 
				this.title.value
			) 
		} catch(e) {
			this.inSubmission = false;
			this.alertMessageColor = AlertColorEnum.RED
			this.alertMessage = 'Error occured. Try again later'
			return
		}
		this.alertMessageColor = AlertColorEnum.GREEN;
		this.alertMessage = 'Success!'

		this.activeClip.title = this.title.value;
		this.update.emit(this.activeClip)
		
		setTimeout(() => {
			if(this.modal.isModalVisible(this.modalId))
				this.modal.toggleModal(this.modalId)
		}, 2000)
	}

	ngOnInit(): void {
		this.modal.register(this.modalId);
	}

	ngOnDestroy(): void {
		this.modal.unregister(this.modalId);
	}

	ngOnChanges(): void {
		if (!this.activeClip) return;
		this.inSubmission = false;
		this.alertMessage = 'Please wait, updating clip.';
		this.showAlertMessage = false;
		this.clipID.setValue(this.activeClip.docID as string);
		this.title.setValue(this.activeClip.title);
	}
}
