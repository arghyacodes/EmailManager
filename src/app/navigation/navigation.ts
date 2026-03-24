import { Component, EventEmitter, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Senders } from '../senders';


@Component({
  selector: 'app-navigation',
  imports: [FormsModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})
export class Navigation {
  @Output() senderSelected = new EventEmitter<number>();
  senders: Senders[] = [
    { "id": 1, "email": "user1@gmail.com" },
    { "id": 2, "email": "user2@gmail.com" }
  ];


  selectSender(event: any){
    const senderId = +event.target.value;
    this.senderSelected.emit(senderId);
  }
}
