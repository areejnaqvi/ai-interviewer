import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowRefService } from '../../services/window-ref.service';
import axios from 'axios';

@Component({
  selector: 'app-speech-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './speech-input.component.html',
  styleUrl: './speech-input.component.css'
})
export class SpeechInputComponent {
  audioStream: MediaStream | null = null; // Initialize to null
  transcript: string = '';

  constructor() {}

  async startRecording() {
    try {
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(this.audioStream);
      const chunks: Blob[] = [];
  
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
  
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const reader = new FileReader();
  
        reader.onload = async () => {
          if (reader.result instanceof ArrayBuffer) {
            const audioData = reader.result;
            const buffer = new Uint8Array(audioData);
  
            let binary = '';
            buffer.forEach((byte) => {
              binary += String.fromCharCode(byte);
            });
  
            const base64Data = btoa(binary);
            console.log('Encoded base64:', base64Data);
  
            try {
              const response = await axios.post<{ transcript: string }>('http://127.0.0.1:5000/api/speech/transcribe', { audio: base64Data });
              this.transcript = response.data.transcript;
              console.log('response is', response)
              console.log('transcript is: ', this.transcript)
            } catch (error) {
              console.error('Error transcribing speech:', error);
            }
          }
        };
  
        reader.readAsArrayBuffer(blob);
      };
  
      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 5000); // Stop recording after 5 seconds
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }
  
}