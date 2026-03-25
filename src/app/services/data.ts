import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Messages } from '../messages';
import { MessageDetails } from '../message-details';
import { Senders } from '../senders';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getSenders(): Observable<Senders[]> {
    return this.http.get<Senders[]>(`${this.baseUrl}/senders`);
  }

  getMessages(): Observable<Messages[]> {
    return this.http.get<Messages[]>(`${this.baseUrl}/messages`);
  }

  getMessageDetails(): Observable<MessageDetails[]> {
    return this.http.get<MessageDetails[]>(`${this.baseUrl}/messageDetails`);
  }

  getMessagesBySender(senderId: number) {
    return this.http.get<Messages[]>(
      `${this.baseUrl}/messages?senderId=${senderId}`
    );
  }
}