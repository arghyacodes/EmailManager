import { Component, EventEmitter, Output, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data';

@Component({
  selector: 'app-navigation',
  imports: [FormsModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})
export class Navigation implements OnInit {

  @Output() senderSelected = new EventEmitter<number>();

  senders: any[] = [];

  constructor(private dataService: DataService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.dataService.getSenders().subscribe(data => {
      console.log('senders:', data);
      this.senders = data;
      this.cdr.detectChanges();
    });
  }

  selectSender(event: any) {
    const senderId = +event.target.value;
    this.senderSelected.emit(senderId);
  }
}