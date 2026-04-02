import { Component, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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
  messages: any[] = [];
  selectedMessage: any;

  constructor(private api: ApiService) { }

  ngOnInit() {
    // Load dropdown topics
    this.api.getTopics().subscribe(res => {
      this.topics = [...res];
    });

    // 🔥 Load ALL messages immediately
    this.loadAllMessages();
  }

  onTopicChange() {
    if (!this.selectedTopic) {
      this.loadAllMessages();   // 👈 fallback to all
    } else {
      this.api.getMessages(this.selectedTopic)
        .subscribe(res => {
          this.messages = (res || []).map((m: any) => ({
            ...m,
            time: new Date(m.time)
          }));
        });
    }

    this.selectedMessage = null;
  }

  onMessageClick(msg: any) {
    this.selectedMessage = { ...msg };   // ✅ instant update
  }

  loadAllMessages() {
    this.api.getAllMessages().subscribe(res => {
      console.log("Initial load:", res);

      this.messages = (res || []).map((m: any) => ({
        ...m,
        time: new Date(m.time)
      }));
    });
  }
}
