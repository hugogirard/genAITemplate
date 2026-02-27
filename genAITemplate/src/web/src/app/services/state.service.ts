import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StateService {
    isLoading: Boolean = false
    modelIsAnswering: Boolean = false
}
