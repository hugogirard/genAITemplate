import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Thread } from "../../models/thread";


@Component({
    selector: 'conversation',
    standalone: true,
    templateUrl: './Conversation.html',
    styleUrl: './Conversation.css'
})
export class Conversation {

    @Input()
    thread!: Thread;

    @Input()
    isActive: boolean = false;

    @Output() onSelect = new EventEmitter<string>();
    @Output() onDelete = new EventEmitter<string>();

    delete(id: string) {
        this.onDelete.emit(id);
    }
}