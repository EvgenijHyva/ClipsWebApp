import { Injectable } from '@angular/core';
import { createFFmpeg, FFmpeg, fetchFile } from '@ffmpeg/ffmpeg';


@Injectable({
	providedIn: 'root'
})
export class FfmpegService {
	isRunning: boolean = false;
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
		this.isRunning = true;
		const data = await fetchFile(file); // convert to binary data
		this.ffmpeg.FS('writeFile', file.name, data); //File system: read and write files
		// series of random screenshots
		const videoDuration = await getVideoDuration(file);
		const maxDuration = videoDuration < 60 ? videoDuration : 60;
		const timeArray: string[] = [];
		for(let i:number = 0; i < 3; i++) {
			const secondSnapshot = Math.floor(Math.random() * maxDuration)
			const time = new Date(secondSnapshot * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)![0];
			timeArray.push(time)
		}

		const commands: string[] = [];

		// documentation for ffmpeg use:
		// https://www.ffmpeg.org/
		for (let time of timeArray) {
			commands.push(
				'-i', file.name, // input feed
				'-ss', time, // output options: screenshot position 'hh:mm:ss' 
				'-frames:v', '1', // screenshots counter (single frame)
				'-filter:v', 'scale=510:-1', // output size 'width:height' -> aspect ratio (-1) will be calculated by ffmpeg
				`output_${time}.png` // output file name and type
			)
		}
		await this.ffmpeg.run(...commands);

		const screenshots: string[] = [];
		timeArray.forEach(time => {
			const screenshotFile = this.ffmpeg.FS('readFile', `output_${time}.png`)
			const screenshotBlob = new Blob(
				[screenshotFile.buffer], {
					type: 'image/png'
				}
			);
			const screenshotURL = URL.createObjectURL(screenshotBlob);
			screenshots.push(screenshotURL);
		})
		this.isRunning = false;
		return screenshots;
	}

	async blobFromURL(url:string) {
		const response = await fetch(url); // fetch file from url
		const blob = await response.blob();
		return blob;
	}
}

export const getVideoDuration = (file:File):Promise<number> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const media = new Audio(reader.result as string);
			media.onloadedmetadata = () => resolve(media.duration);
		};
		reader.readAsDataURL(file);
		reader.onerror = error => reject(error);
	});

