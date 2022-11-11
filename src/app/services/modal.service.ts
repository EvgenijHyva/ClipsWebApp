import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({ // injected in global scope
  providedIn: 'root'
})
export class ModalService {
  constructor() { }

  private modals: IModal[] = []


  isModalVisible(id: string): boolean {
    return Boolean(this.modals.find( modal => modal.id === id)?.visible);
  }
  toggleModal(id: string): void {
    const modal = this.modals.find(modal => modal.id === id);
    if (modal) {
      modal.visible = !modal.visible
    }
  }

  register(id: string): void {
    this.modals.push({
      id,
      visible: false
    });
  }

  unregister(id: string): void {
    this.modals = this.modals.filter((modal: IModal) => modal.id !== id)
  }
}
