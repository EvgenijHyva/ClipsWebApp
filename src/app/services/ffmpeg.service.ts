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
		// series of screenshots
		const seconds = [1,2,3];
		const commands: string[] = [];
		// documentation for ffmpeg use:
		// https://www.ffmpeg.org/
		for (let second of seconds) {
			commands.push(
				'-i', file.name, // input feed
				'-ss', `00:00:0${second}`, // output options: screenshot position 'hh:mm:ss' 
				'-frames:v', '1', // screenshots counter (single frame)
				'-filter:v', 'scale=510:-1', // output size 'width:height' -> aspect ratio (-1) will be calculated by ffmpeg
				`output_0${second}.png` // output file name and type
			)
		}

		await this.ffmpeg.run(...commands)
		return;
	}
}
