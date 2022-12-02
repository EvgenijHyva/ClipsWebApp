import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AboutComponent } from './about.component';

// https://angular.io/api/core/testing/TestBed

describe('About Component', () => {
	let fixture: ComponentFixture<AboutComponent>; // wrapper on component instance
	let testingComponent: AboutComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({ // create module
			declarations: [AboutComponent],
		}).compileComponents(); 
	});

	beforeEach( () => {
		fixture = TestBed.createComponent(AboutComponent);
		testingComponent = fixture.componentInstance;
		fixture.detectChanges();
	});


	it('Shoul create About component', () => {
		expect(testingComponent).toBeTruthy();
	})
});