import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InterviewerComponent } from './components/interviewer/interviewer.component';
import { SpeechInputComponent } from './components/speech-input/speech-input.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InterviewerComponent, SpeechInputComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppComponent {
  title = 'ai-interviewer';
}
