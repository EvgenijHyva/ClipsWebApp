import { Injectable } from '@angular/core';

@Injectable({ // injected in global scope
  providedIn: 'root'
})
export class ModalService {
  
  private visible: boolean = false;

  isModalVisible(): boolean {
    return this.visible;
  }
  toggleModal():void {
    this.visible = !this.visible;
  }

  constructor() { }
}
