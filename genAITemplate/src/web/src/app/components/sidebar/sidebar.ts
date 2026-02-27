import { Component } from "@angular/core";
import { ChatService } from '../../services/chat.service';
import { StateService } from "../../services/state.service";
import { Thread } from "../../models/thread";
import { Conversation } from "../conversation/conversation";

@Component({
    selector: 'chat-sidebar',
    imports: [Conversation],
    standalone: true,
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.css'
})
export class Sidebar {

    threads: Thread[] = [];

    constructor(private chatService: ChatService, private stateService: StateService) {
        this.getThreadsUser();
    }

    getThreadsUser() {
        this.stateService.isLoading = true;
        this.chatService.getThreads().subscribe(threads => {
            this.stateService.isLoading = false;
            this.threads = threads;
        });
    }
}