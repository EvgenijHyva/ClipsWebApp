import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClipService } from '../services/clip.service';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-clips-list',
	templateUrl: './clips-list.component.html',
	styleUrls: ['./clips-list.component.css'],
	providers: [ DatePipe ] // pipe will become injectable
})
export class ClipsListComponent implements OnInit, OnDestroy {

	constructor(
		public readonly clipService: ClipService
	) {
		this.clipService.getClips()
	}

	handleScroll = () => {
		const { scrollTop, offsetHeight } = document.documentElement;
		const { innerHeight } = window;
		const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight
		if (bottomOfWindow) {
			this.clipService.getClips();
		}
	}

	ngOnInit(): void {
		window.addEventListener('scroll', this.handleScroll);
	}

	ngOnDestroy(): void {
		window.removeEventListener('scroll', this.handleScroll);
	}
}
