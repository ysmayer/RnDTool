import { Component, ViewChild } from '@angular/core';
import { GeminiApiService } from '../services/gemini-api.service';
import { FormattedTextareaComponent } from '../shared/formatted-textarea/formatted-textarea.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-build-failure-explainer',
  templateUrl: './build-failure-explainer.component.html',
  styleUrls: ['./build-failure-explainer.component.css'],
})
export class BuildFailureExplainerComponent {
  @ViewChild(FormattedTextareaComponent) textareaComponent!: FormattedTextareaComponent;

  buildLog: string = '';
  explanation: string = '';

  constructor(private geminiApiService: GeminiApiService) { }

  explainFailure(buildLog: string) {
    this.geminiApiService.explainBuildFailure(buildLog).pipe(
        finalize(() => this.textareaComponent.isLoading = false)
      )
      .subscribe(
      response => { this.textareaComponent.setOutput(response.explanation);
    },
      error => console.error('Error explaining build failure:', error)
    );
  }
}