import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-formatted-textarea',
  templateUrl: './formatted-textarea.component.html',
  styleUrls: ['./formatted-textarea.component.css']
})
export class FormattedTextareaComponent {
  @Input() placeholder: string = 'Enter text...';
  @Input() buttonText: string = 'Submit';
  @Input() outputTitle: string = 'Output';
  @Input() isAreaNeeded: boolean = true;
  @Input() isLoaderNeeded: boolean = true;
  @Output() submit = new EventEmitter<string>();

  inputText: string = '';
  outputText: string = '';
  formattedOutput: string = '';
  isLoading: boolean = false;

  onInputChange(value: string) {
    this.inputText = value;
  }

  onSubmit() {
    this.isLoading = true;
    this.submit.emit(this.inputText);
  }

  setOutput(text: string) {
    this.outputText = text;
    this.formattedOutput = this.formatText(text);
    this.isLoading = false;
  }

  private formatText(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^\* (.*$)/gm, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/\n/g, '<br>');
  }
}