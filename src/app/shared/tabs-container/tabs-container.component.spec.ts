import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsContainerComponent } from './tabs-container.component';
// Tabs-conteiner component uses content projection for inserting content
// For test need to create dummy host component
import { Component } from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { By } from '@angular/platform-browser';

@Component({
    template: `<app-tabs-container>
		<app-tab tabTitle="Tab1">Tab 1</app-tab>
		<app-tab tabTitle="Tab2">Tab 2</app-tab>
	</app-tabs-container>`
}) 
class DummyHostComponent {}


describe('TabsContainerComponent', () => {
	let component: DummyHostComponent;
	let fixture: ComponentFixture<DummyHostComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
		declarations: [ TabsContainerComponent, TabComponent, DummyHostComponent ]
		})
		.compileComponents();

		fixture = TestBed.createComponent(DummyHostComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('Should create dummy component for loading nested components with projected content', () => {
		expect(component).toBeTruthy();
	});

	// test content projection of component
	// component have a property tabs decorated @ContentChildren on projected content
	// template render list item elements
	it('Should have 2 tabs', () => {
		const tabs = fixture.debugElement.queryAll(By.css('li'));
		expect(tabs.length).toBe(2);
	});

	it('Should have 2 tabs, alternative test.', () => {
		// different source of tabs values. 
		const containerComponent = fixture.debugElement.query(
			By.directive(TabsContainerComponent
		));
		const tabsProp = containerComponent.componentInstance.tabs;
		expect(tabsProp.length).toBe(2);
	})
});
