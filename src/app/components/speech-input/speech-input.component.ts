import {
  Component,
  EventEmitter,
  Inject,
  PLATFORM_ID,
  Output,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-speech-input',
  templateUrl: './speech-input.component.html',
  styleUrls: ['./speech-input.component.css'],
  standalone: true,
})
export class SpeechInputComponent {
  recognition: any;
  isStoppedSpeechRecog = false;
  transcript: string = '';

  @Output() transcriptEvent = new EventEmitter<string>();

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    if (isPlatformBrowser(this.platformId)) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.init();
      } else {
        console.error('Speech recognition API not supported in this browser.');
      }
    }
  }

  init() {
    if (!this.recognition) return;

    this.recognition.interimResults = false; // Ensure interim results are not used
    this.recognition.continuous = true; // Enable continuous recognition
    this.recognition.lang = 'en-US';

    this.recognition.addEventListener('start', () => {
      console.log('Speech recognition started');
    });

    this.recognition.addEventListener('end', () => {
      console.log(
        'Speech recognition ended. this.isStoppedSpeechRecog is ',
        this.isStoppedSpeechRecog
      );
      if (!this.isStoppedSpeechRecog) {
        // Emit transcript when recognition ends
        this.recognition.start();
        // this.transcriptEvent.emit(this.transcript.trim());
      }
    });

    this.recognition.addEventListener('error', (event: any) => {
      console.error('Speech recognition error', event);
    });

    this.recognition.addEventListener('result', (e: any) => {
      console.log('Speech recognition result event fired');
      const transcript = Array.from(e.results)
        .map((result: any) => result[0].transcript)
        .join('');
      this.transcript += ' ' + transcript;
    });
  }

  startSpeechRecognition() {
    if (!this.recognition) return;
    this.isStoppedSpeechRecog = false;
    this.transcript = ''; // Clear previous text before starting new recognition
    this.recognition.start();
  }

  stopSpeechRecognition() {
    if (!this.recognition) return;
    this.isStoppedSpeechRecog = true;
    this.recognition.stop();
    this.transcriptEvent.emit(this.transcript.trim());
  }
}
