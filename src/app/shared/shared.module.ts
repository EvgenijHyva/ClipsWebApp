import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';
import { TabComponent } from './tab/tab.component';
import { InputComponent } from './input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from "ngx-mask";


@NgModule({
  declarations: [
    ModalComponent,
    TabsContainerComponent,
    TabComponent,
    InputComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // forRoot used for preventing dublicating service
    NgxMaskModule.forRoot() // form masking for formating phone number field
  ],
  exports: [
    ModalComponent,
    TabComponent,
    TabsContainerComponent,
    InputComponent
  ]
})
export class SharedModule { }
