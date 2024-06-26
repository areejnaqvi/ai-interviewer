import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { SpeechInputComponent } from '../speech-input/speech-input.component';

@Component({
  selector: 'app-interviewer',
  templateUrl: './interviewer.component.html',
  imports: [CommonModule, FormsModule, SpeechInputComponent],
  styleUrls: ['./interviewer.component.css'],
  standalone: true,
})
export class InterviewerComponent {
  jobListing: string = '';
  generatedQuestions: string[] = [];
  currentQuestionIndex: number = 0;
  userResponses: any = {};
  currentQuestion: string | null = null;
  interviewComplete: boolean = false;
  showFeedback: boolean = false;
  feedback: string | null = null;
  feedbackLoaded: boolean = false;

  @ViewChild(SpeechInputComponent) speechInputComponent!: SpeechInputComponent;

  constructor(private http: HttpClient) {}

  generateQuestions() {
    this.http
      .post<{ questions: string[] }>(
        'http://127.0.0.1:5000/generate_questions',
        { job_listing: this.jobListing }
      )
      .pipe(
        tap((response) => {
          this.generatedQuestions = response.questions
            .map(
              (question) => question.replace(/^\d+\.\s*/, '') // Remove leading numbers and dot
            )
            .slice(0, 5); // Limit to 5 questions
          this.currentQuestionIndex = 0;
          this.askNextQuestion();
        }),
        catchError((error) => {
          console.error('Error generating questions:', error);
          return of([]);
        })
      )
      .subscribe();
  }

  askNextQuestion() {
    if (this.currentQuestionIndex < this.generatedQuestions.length) {
      this.currentQuestion = this.generatedQuestions[this.currentQuestionIndex];
      this.speak(this.currentQuestion);
    } else {
      console.log('interview complete');
      this.interviewComplete = true;
      this.evaluateResponses();
    }
  }

  speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      // Notify interviewer component that the question has been read
      this.speechInputComponent.startSpeechRecognition();
    };
    window.speechSynthesis.speak(utterance);
  }

  handleTranscription(transcript: any) {
    this.userResponses[this.currentQuestion!] = transcript.trim();
    console.log('Transcript:', transcript);
    this.currentQuestionIndex++;
    this.askFollowup(transcript);
  }

  askFollowup(transcript: any) {
    this.http
      .post<{ questions: string }>('http://127.0.0.1:5000/ask_followup', {
        transcript: transcript,
        question: this.currentQuestion,
      })
      .pipe(
        tap((response) => {
          if (
            response.questions &&
            response.questions.toLowerCase() !== 'no followups'
          ) {
            console.log('response question is', response.questions);
            this.currentQuestion = response.questions;
            console.log(
              'followup question assigned is: ',
              this.currentQuestion
            );
            this.currentQuestionIndex++;
            this.speak(this.currentQuestion);
          } else {
            this.askNextQuestion();
          }
        }),
        catchError((error) => {
          console.error('Error evaluating responses:', error);
          return of({ score: 0 });
        })
      )
      .subscribe();
  }

  evaluateResponses() {
    this.http
      .post<{ feedback: string }>('http://127.0.0.1:5000/analyze_responses', {
        responses: this.userResponses,
      })
      .pipe(
        tap((response) => {
          this.feedback = response.feedback;
          this.feedbackLoaded = true;
        }),
        catchError((error) => {
          console.error('Error evaluating responses:', error);
          return of({ score: 0 });
        })
      )
      .subscribe();
  }

  toggleShowFeedback() {
    this.showFeedback = !this.showFeedback;
  }
}
