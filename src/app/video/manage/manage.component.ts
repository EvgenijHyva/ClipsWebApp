import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IClip } from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';

@Component({
	selector: 'app-manage',
	templateUrl: './manage.component.html',
	styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
	videoOrder: string = '1';
	clips: IClip[] = [];

	constructor(
		private readonly router: Router,
		private readonly route: ActivatedRoute,
		private readonly clipService: ClipService
	) { }

	sort(event: Event): void {
		const { value } = (event.target as HTMLSelectElement)

		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: {
				sort: value
			}
		})
	}

	ngOnInit(): void {
		this.route.queryParamMap.subscribe((paramsObj: Params): void => {
			const { params } = paramsObj;
			this.videoOrder = params.sort === '2' ? params.sort : '1';
		})
		this.clipService.getUserClips().subscribe(docs => {
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
