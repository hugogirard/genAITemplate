import { Component, Input } from "@angular/core";
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

}