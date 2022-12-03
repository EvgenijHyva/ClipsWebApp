import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TabComponent } from './tab.component';

describe('TabComponent', () => {
	let component: TabComponent;
	let fixture: ComponentFixture<TabComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
		declarations: [ TabComponent ]
		})
		.compileComponents();

		fixture = TestBed.createComponent(TabComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('Tab component should create', () => {
		expect(component).toBeTruthy();
	});

	it('Should have .hidden class. By debugElement representation', () => {
		// referencing entire html element
		const element = fixture.debugElement.query(  // not DOM element, it is representation template as object
			By.css('.hidden') // selector
		);
		expect(element).toBeTruthy();
	});

	it ('Should have .hidden class. By nativeElement, independed from platform', () => {
	// as running application in different platform, not browser
		const element = fixture.nativeElement.querySelector( // exposes an component template via DOM api
			// have same access to same methods and properties Document object
			'.hidden'
		);
		expect(element).toBeTruthy();
	})

	it('Should have .hidden class. By QuerySelector using DOM Api. (Not recomended)', () => {
		// not recomended for tests, Uses DOM api. Change detection can cause element to disappeare
		const element = document.querySelector('.hidden');
		expect(element).toBeTruthy();
	})
});
