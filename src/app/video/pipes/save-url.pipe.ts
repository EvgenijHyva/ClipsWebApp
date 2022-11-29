import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
	name: 'saveURL'
})
export class SaveURLPipe implements PipeTransform {

	constructor(private readonly sanitizer: DomSanitizer) {}

	transform(Url: string) {
		// Should be used carefully
		return this.sanitizer.bypassSecurityTrustUrl(Url);
	}

}
