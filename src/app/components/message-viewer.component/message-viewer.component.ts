import { Component, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';

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

  // sorting and searching
  searchText = '';
  sortField: 'time' | 'id' = 'time';
  sortAsc = false;

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
    const source$ = !this.selectedTopic
      ? this.api.getAllMessages()
      : this.api.getMessages(this.selectedTopic);

    this.messages$ = source$.pipe(
      map(res => this.processMessages(res))
    );

    this.selectedMessage = null;
  }

  onMessageClick(msg: any) {
    this.selectedMessage = msg;   // directly assigned
  }

  loadAllMessages() {
    this.messages$ = this.api.getAllMessages().pipe(
      map(res => this.processMessages(res))
    );
  }
  trackById(index: number, item: any) {
    return item.id + (item.topic || '');
  }

  // process manager
  processMessages(res: any[]) {
    let data = (res || []).map(m => ({
      ...m,
      time: new Date(m.time)
    }));

    // SEARCH
    if (this.searchText) {
      const search = this.searchText.toLowerCase();

      data = data.filter(m =>
        m.message?.toLowerCase().includes(search) ||
        m.details?.toLowerCase().includes(search)
      );
    }

    // SORT
    data.sort((a, b) => {
      let valA = a[this.sortField];
      let valB = b[this.sortField];

      if (this.sortField === 'time') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      return this.sortAsc ? valA - valB : valB - valA;
    });

    return data;
  }

  // sort toggle
  toggleSort(field: 'time' | 'id') {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = false;
    }

    this.refreshData();
  }

  refreshData() {
    this.onTopicChange();   // reuse logic
  }

  onSearchChange() {
    this.refreshData();
  }
}