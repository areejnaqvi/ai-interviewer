import { Component, ElementRef, ViewChild, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-interviewer',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './interviewer.component.html',
  styleUrl: './interviewer.component.css',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class InterviewerComponent {
  speaking: boolean = false;

  startTalking() {
    console.log('start talking')
    this.speaking = true;
  }

  stopTalking() {
    console.log('stop talking')
    this.speaking = false;
  }

  speak(text: string) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.onstart = () => this.startTalking();
    speech.onend = () => this.stopTalking();
    window.speechSynthesis.speak(speech);
  }
}
