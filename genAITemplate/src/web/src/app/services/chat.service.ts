import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Thread } from "../models/thread";


@Injectable({
    providedIn: 'root'
})
export class ChatService {

    constructor(private http: HttpClient) { }

    getThreads(): Observable<Thread[]> {
        const fakeThreads: Thread[] = [
            { id: '1', title: 'How to deploy an Angular app?' },
            { id: '2', title: 'Explain Azure Functions' },
            { id: '3', title: 'Best practices for REST APIs' }
        ];
        return of(fakeThreads);
    }

    newThread(): Observable<Thread> {
        const thread: Thread = {
            id: '10',
            title: 'How to use Agent Framework'
        }
        return of(thread);
    }

    deleteThread(id: string): Observable<boolean> {
        return of(true);
    }

}