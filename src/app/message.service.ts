import { Injectable, signal, computed } from '@angular/core';
import { Messages } from './messages';
import { MessageDetails } from './message-details';

@Injectable({ providedIn: 'root' })
export class MessageService {

  // 🔹 Selected sender
  selectedSender = signal<number>(0);

  // 🔹 Sorting state
  sortField = signal<'date' | 'messageId'>('date');
  sortDirection = signal<'asc' | 'desc'>('desc');

  // 🔹 Messages (with DATE + TIME)
  messages = signal<Messages[]>([
    { senderId: 1, date: "2026-03-18T10:30:00", messageId: 1003, message: "package delivered" },
    { senderId: 1, date: "2026-03-18T08:15:00", messageId: 1002, message: "out for delivery" },
    { senderId: 1, date: "2026-03-17T18:45:00", messageId: 1001, message: "package shipped" },
    { senderId: 1, date: "2026-03-16T12:10:00", messageId: 1000, message: "order placed" },
    { senderId: 2, date: "2026-03-22T09:00:00", messageId: 2000, message: "order placed" }
  ]);

  messageDetails: MessageDetails[] = [
    { messageId: 1001, details: "Package shipped..." },
    { messageId: 1000, details: "Order placed..." },
    { messageId: 2000, details: "Order placed..." },
    { messageId: 1002, details: "Out for delivery..." },
    { messageId: 1003, details: "Delivered..." }
  ];

  // 🔥 Computed: filtered + sorted messages
  filteredMessages = computed(() => {
    let data = this.messages().filter(
      m => m.senderId === this.selectedSender()
    );

    const field = this.sortField();
    const dir = this.sortDirection();

    return data.sort((a, b) => {
      let valueA = field === 'date'
        ? new Date(a.date).getTime()
        : a.messageId;

      let valueB = field === 'date'
        ? new Date(b.date).getTime()
        : b.messageId;

      return dir === 'asc' ? valueA - valueB : valueB - valueA;
    });
  });

  // 🔹 Toggle sorting
  sortBy(field: 'date' | 'messageId') {
    if (this.sortField() === field) {
      this.sortDirection.set(
        this.sortDirection() === 'asc' ? 'desc' : 'asc'
      );
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
  }

  // 🔹 Get message details
  getDetails(messageId: number): string {
    return this.messageDetails.find(d => d.messageId === messageId)?.details
      || 'Details not found';
  }
}