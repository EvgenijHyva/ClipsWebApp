import { Component, ContentChildren, AfterContentInit, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css']
})
export class TabsContainerComponent implements AfterContentInit {

  constructor() { }

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> = new QueryList(); // type safety
  
  selectTab(tab: TabComponent): boolean {
    this.tabs?.forEach(tab => {
      tab.active = false
    })
    tab.active = true
    return false; // prevent default behaviour for ancor <a></a>
  }

  ngAfterContentInit(): void {
    const activeTabs = this.tabs.filter((tab: TabComponent) => tab.active)
    if (!activeTabs || activeTabs.length === 0) {
      this.selectTab(this.tabs!.first)
    } 
  }

}
