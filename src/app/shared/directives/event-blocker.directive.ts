import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[app-event-blocker]'
})
export class EventBlockerDirective {

	@HostListener('drop', ['$event'])
	@HostListener('dragover', ['$event'])
	public handleDropEvent(event: Event) {
		event.preventDefault();
		event.stopPropagation();
	}

}
