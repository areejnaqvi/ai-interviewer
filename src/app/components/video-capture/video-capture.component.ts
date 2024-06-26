import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-video-capture',
  templateUrl: './video-capture.component.html',
  styleUrls: ['./video-capture.component.css'],
  standalone: true,
})
export class VideoCaptureComponent implements OnInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  stream: MediaStream | undefined;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initCamera();
    }
  }

  initCamera() {
    if (
      navigator &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    ) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          this.stream = stream;
          const video: HTMLVideoElement = this.videoElement.nativeElement;
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          console.error('Error accessing the camera: ', err);
        });
    } else {
      console.error('Camera not supported.');
    }
  }

  stopCamera() {
    if (this.stream) {
      const tracks = this.stream.getTracks();
      tracks.forEach((track: MediaStreamTrack) => track.stop());
    }
  }
}
