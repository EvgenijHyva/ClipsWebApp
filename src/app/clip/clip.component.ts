import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import videojs from 'video.js';

@Component({
	selector: 'app-clip',
	templateUrl: './clip.component.html',
	styleUrls: ['./clip.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class ClipComponent implements OnInit {
	id: string = '';
	@ViewChild('videoPlayer', { static: true }) target?: ElementRef; // static: true, decorator will update property before ngOnInit
	player?: videojs.Player;

	constructor(
		public readonly route: ActivatedRoute
	) { }

	ngOnInit(): void {
		this.player = videojs(this.target?.nativeElement);

		this.route.params.subscribe((params:Params) => {
			this.id = params.id
		})
	}

}
