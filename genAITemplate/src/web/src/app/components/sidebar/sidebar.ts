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
    selectedThreadId: string | null = null;

    constructor(private chatService: ChatService, private stateService: StateService) {
        this.getThreadsUser();
    }

    getThreadsUser() {
        this.stateService.isLoading = true;
        this.chatService.getThreads().subscribe(threads => {
            this.stateService.isLoading = false;
            this.threads = threads;
            if (threads.length > 0) {
                this.selectThread(this.threads[0].id)
            }
        });
    }

    selectThread(id: string) {
        this.selectedThreadId = id;
    }

    newThread() {
        this.stateService.isLoading = true;
        this.chatService.newThread().subscribe(thread => {
            this.stateService.isLoading = false;
            this.threads.push(thread);
            this.selectedThreadId = thread.id;
        });
    }

    deleteThread(id: string) {

        this.stateService.isLoading = true;
        this.chatService.deleteThread(id).subscribe(success => {
            this.stateService.isLoading = false;
            if (success) {
                const index = this.threads.findIndex(t => t.id === id);
                if (index !== -1) {
                    this.threads.splice(index, 1);
                }
            }
        });
    }
}