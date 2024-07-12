import { Component, ViewChild } from '@angular/core';
import { FormattedTextareaComponent } from '../shared/formatted-textarea/formatted-textarea.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeminiApiService } from '../services/gemini-api.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-db-script-creator',
  templateUrl: './db-script-creator.component.html',
  styleUrls: ['./db-script-creator.component.css']
})
export class DbScriptCreatorComponent {
  @ViewChild(FormattedTextareaComponent) textareaComponent!: FormattedTextareaComponent;

  scriptForm: FormGroup;
  isLoading: boolean = false;
  script: any;

  constructor(
    private fb: FormBuilder,
    private geminiApiService: GeminiApiService
  ) {
    this.scriptForm = this.fb.group({
      scriptType: ['', Validators.required],
      scriptName: [''],
      featureName: [''],
      ownerId: [''],
      featureValue: [''],
      freeStyleDescription: ['']
    });

    this.scriptForm.get('scriptType')?.valueChanges.subscribe(value => {
      if (value === 'featureFlag') {
        this.scriptForm.get('scriptName')?.setValidators(Validators.required);
        this.scriptForm.get('featureName')?.setValidators(Validators.required);
        this.scriptForm.get('ownerId')?.setValidators(Validators.required);
        this.scriptForm.get('featureValue')?.setValidators(Validators.required);
        this.scriptForm.get('freeStyleDescription')?.clearValidators();
      } else {
        this.scriptForm.get('scriptName')?.clearValidators();
        this.scriptForm.get('featureName')?.clearValidators();
        this.scriptForm.get('ownerId')?.clearValidators();
        this.scriptForm.get('featureValue')?.clearValidators();
        this.scriptForm.get('freeStyleDescription')?.setValidators(Validators.required);
      }
      this.scriptForm.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.scriptForm.valid) {
      this.isLoading = true;
      this.geminiApiService.createDbScript(this.scriptForm.value).subscribe(
        response => {
          this.isLoading = false;
          this.script = response.generatedScript;
          this.textareaComponent.setOutput(this.script);
        },
        error => {
          console.error('Error generating script:', error);
          this.textareaComponent.setOutput('An error occurred while generating the script.');
        }
      );
    }
  }

  copyScript() {
    navigator.clipboard.writeText(this.trimSqlCode(this.script)).then(
      () => {
        console.log('Script copied to clipboard');
        // You might want to show a snackbar or some other notification here
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  }

  trimSqlCode(text: string): string {
    const pattern = /```sql[\s\S]*?```/g;
    return text.replace(pattern, '');
}

  // createScript(event: any) {
  //   this.geminiApiService.createDbScript(this.existingScript, this.newParameters)     .pipe(
  //       finalize(() => 
  //       this.textareaComponent.isLoading = false)
  //     )
  //     .subscribe(
  //     response => { this.textareaComponent.setOutput(response.generatedScript);
  //   },
  //     error => console.error('Error Building script:', error)
  //   );
  // }
}