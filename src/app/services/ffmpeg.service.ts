import { Injectable } from '@angular/core';
import { createFFmpeg, FFmpeg, fetchFile } from '@ffmpeg/ffmpeg';


@Injectable({
	providedIn: 'root'
})
export class FfmpegService {
	isReady: boolean = false;
	private ffmpeg: FFmpeg;

	constructor() { 
		this.ffmpeg = createFFmpeg({ log: true }) // debugging commands
	}

	async init(): Promise<void> {
		if (this.isReady) {
			return;
		}

		await this.ffmpeg.load();
		this.isReady = true;
	}

	async getScreenshots(file: File) {
		const data = await fetchFile(file); // convert to binary data
		this.ffmpeg.FS('writeFile', file.name, data); //File system: read and write files
		return;
	}
}
