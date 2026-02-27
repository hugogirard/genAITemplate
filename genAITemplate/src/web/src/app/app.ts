import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Sidebar } from './components/sidebar/sidebar';
import { Chat } from './components/chat/chat';
import { Loading } from './components/loading/loading';
import { Conversation } from './components/conversation/conversation';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidebar, Chat, Conversation, Loading],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('web');
}
