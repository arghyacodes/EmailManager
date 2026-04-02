import { Component, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-viewer',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './message-viewer.component.html',
  styleUrl: './message-viewer.component.css',
})
export class MessageViewerComponent {
  topics: string[] = [];
  selectedTopic = '';
  messages$!: Observable<any[]>;
  selectedMessage: any;

  constructor(private api: ApiService) { }

  ngOnInit() {
    // Load dropdown topics
    this.api.getTopics().subscribe(res => {
      this.topics = [...res];
    });

    // Load ALL messages immediately
    this.loadAllMessages();
  }

  onTopicChange() {
    if (!this.selectedTopic) {
      this.messages$ = this.api.getAllMessages();
    } else {
      this.messages$ = this.api.getMessages(this.selectedTopic);
    }

    this.selectedMessage = null;
  }

  onMessageClick(msg: any) {
    this.selectedMessage = msg;   // directly assigned
  }

  loadAllMessages() {
    this.messages$ = this.api.getAllMessages();
  }
  trackById(index: number, item: any) {
    return item.id + (item.topic || '');
  }
}