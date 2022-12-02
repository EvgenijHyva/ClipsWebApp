import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IClip } from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';
import { BehaviorSubject } from 'rxjs';

export type clipsSortingDirection = '1' | '2';

@Component({
	selector: 'app-manage',
	templateUrl: './manage.component.html',
	styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
	videoOrder: clipsSortingDirection = '1';
	clips: IClip[] = [];
	activeClip: IClip | null = null;
	sort$: BehaviorSubject<clipsSortingDirection>;
	showCopiedLinkInfoId: string = '';

	constructor(
		private readonly router: Router,
		private readonly route: ActivatedRoute,
		private readonly clipService: ClipService,
		private readonly modal: ModalService
	) { 
		this.sort$ = new BehaviorSubject(this.videoOrder)
	}

	sort(event: Event): void {
		const { value } = (event.target as HTMLSelectElement);

		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: {
				sort: value
			}
		})
	}

	openModal(event:Event, clip:IClip) {
		event.preventDefault();
		this.activeClip = clip;
		this.modal.toggleModal('editClip');
	}

	update(event: IClip) {
		this.clips.forEach((clip, index) => {
			if(clip.docID === event.docID)
				this.clips[index].title = event.title
		})
	}

	deleteUserClip(event: Event, clip: IClip) {
		event.preventDefault();
		this.clipService.deleteUserClip(clip);
		this.clips = this.clips.filter(userClip => userClip.docID !== clip.docID);
	}

	async copyToClipboard(event: MouseEvent, clipId: string | undefined) {
		event.preventDefault();
		if (!clipId) return;
		// location is defined by browser (current location)
		const url = `${location.origin}/clip/${clipId}`;
		await navigator.clipboard.writeText(url);
		this.showCopiedLinkInfoId = clipId;
		setTimeout(()=> {
			this.showCopiedLinkInfoId = '';
		}, 1000) 
	}

	ngOnInit(): void {
		this.route.queryParamMap.subscribe((paramsObj: Params): void => {
			const { params } = paramsObj;
			this.videoOrder = params.sort === '2' ? params.sort : '1';
			this.sort$.next(this.videoOrder);
		})

		this.clipService.getUserClips(this.sort$).subscribe(docs => {
			this.clips = []
			docs.forEach(doc => {
				this.clips.push({
					...doc.data(),
					docID: doc.id
				})
			})
		})
	}

}
