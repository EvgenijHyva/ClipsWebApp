import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  constructor() { }

  @Input() color: AlertColorEnum = AlertColorEnum.BLUE;

  get bgColor() { // access the value as a property
    return `bg-${this.color}-400`
  }

  ngOnInit(): void {
  }

}

export enum AlertColorEnum  {
  BLUE = 'blue', 
  GREEN = 'green', 
  RED = 'red'
}