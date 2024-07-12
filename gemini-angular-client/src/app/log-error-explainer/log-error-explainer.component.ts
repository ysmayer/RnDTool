import { Component, ViewChild } from '@angular/core';
import { GeminiApiService } from '../services/gemini-api.service';
import { FormattedTextareaComponent } from '../shared/formatted-textarea/formatted-textarea.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-log-error-explainer',
  templateUrl: './log-error-explainer.component.html',
  styleUrls: ['./log-error-explainer.component.css']
})
export class LogErrorExplainerComponent {
  @ViewChild(FormattedTextareaComponent) textareaComponent!: FormattedTextareaComponent;

  logError: string = '';
  explanation: string = '';

  constructor(private geminiApiService: GeminiApiService) { }

  explainError(log: any) {
    this.geminiApiService.explainLogError(log)     .pipe(
        finalize(() => this.textareaComponent.isLoading = false)
      )
      .subscribe(
      response => { this.textareaComponent.setOutput(response.explanation);
    },
      error => console.error('Error explaining log error:', error)
    );;
  }
}