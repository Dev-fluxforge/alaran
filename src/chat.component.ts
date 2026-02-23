
import { Component, ChangeDetectionStrategy, signal, ElementRef, viewChild, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Message {
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
  messages = signal<Message[]>([]);
  userInput = signal('');
  isLoading = signal(false);

  chatContainer = viewChild<ElementRef>('chatContainer');

  constructor() {
    this.messages.set([
      {
        text: 'Hello! Welcome to Alaran Geo-Service. How can I help you today?',
        sender: 'agent',
        timestamp: new Date(),
      },
    ]);

    effect(() => {
      // Scroll to bottom when new messages are added
      if (this.messages() && this.chatContainer()) {
        setTimeout(() => {
          const container = this.chatContainer()!.nativeElement;
          container.scrollTop = container.scrollHeight;
        }, 0);
      }
    });
  }

  sendMessage(): void {
    const text = this.userInput().trim();
    if (!text) return;

    // Add user message
    this.messages.update(msgs => [
      ...msgs,
      { text, sender: 'user', timestamp: new Date() },
    ]);
    this.userInput.set('');

    // Simulate agent response
    this.isLoading.set(true);
    setTimeout(() => {
      this.addAgentResponse(text);
      this.isLoading.set(false);
    }, 1500);
  }

  private addAgentResponse(userText: string): void {
    let agentText = "I'm sorry, I'm just a demo bot. For a real inquiry, please visit our contact page. How else can I assist you?";

    const lowerCaseText = userText.toLowerCase();

    if (lowerCaseText.includes('quote') || lowerCaseText.includes('price')) {
      agentText = "For a detailed quote, please fill out the form on our Contact Us page. An expert will get back to you shortly. Can I help with anything else?";
    } else if (lowerCaseText.includes('service') || lowerCaseText.includes('what you do')) {
      agentText = "We offer Engineering, Cadastral, Hydrographic, and Aerial Mapping services. You can find detailed information on our Services page. Do you have a specific question about one of them?";
    } else if (lowerCaseText.includes('hello') || lowerCaseText.includes('hi')) {
       agentText = "Hello there! How can I assist you with your geospatial needs today?";
    }

    this.messages.update(msgs => [
      ...msgs,
      { text: agentText, sender: 'agent', timestamp: new Date() },
    ]);
  }
}
