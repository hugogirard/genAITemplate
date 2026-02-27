import { Component } from "@angular/core";
import { StateService } from '../../services/state.service';

@Component({
    selector: 'loading',
    standalone: true,
    templateUrl: './Loading.html',
    styleUrl: './Loading.css'
})
export class Loading {
    constructor(public stateService: StateService) { }
}