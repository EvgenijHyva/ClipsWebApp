import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  constructor() { }
  errorClass = 'text-red-400';

  @Input() control: FormControl = new FormControl();
  @Input() type: 'text' | 'email' | 'number' | 'password' = 'text';
  @Input() placeholder: string = '';
  @Input() format: string = '';

  ngOnInit(): void {
  }

}
