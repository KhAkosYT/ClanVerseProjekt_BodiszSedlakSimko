import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

interface Message {
  sender: string;
  message: string;
  time: string;
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './message.html',
  styleUrl: './message.css'
})
export class Messages implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  clanId: string = ''; 
  clanName: string = '';
  
  messages: Message[] = [];
  newMessage: string = '';
  private shouldScroll = false;
  private apiUrl = 'http://localhost:3000/api/messages';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.clanId = params.get('clanId') || '';
      this.loadMessages();
    });
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  loadMessages() {
    this.http.get<any>(`${this.apiUrl}/${this.clanId}`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => {
          this.clanName = data.clanName;
          this.messages = data.messages;
          this.shouldScroll = true;
        },
        error: (err) => console.error('Hiba az üzenetek lekérésekor', err)
      });
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const payload = { message: this.newMessage };

    this.http.post(`${this.apiUrl}/${this.clanId}`, payload, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          this.loadMessages();
          this.newMessage = '';
        },
        error: (err) => alert(err.error?.message || 'Hiba az üzenet küldése során')
      });
  }
}
