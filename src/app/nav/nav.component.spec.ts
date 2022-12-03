import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavComponent } from './nav.component';
import { of } from 'rxjs';

// component depends on auth.observable. 
// Unit tests are isolated.
// Dependencies have to be mocked
import { AuthService } from '../services/auth.service';
// hiden issue with routing. browser console. 
import { RouterTestingModule } from '@angular/router/testing';

describe('NavComponent', () => {
	let component: NavComponent;
	let fixture: ComponentFixture<NavComponent>;
	// will create an object insted of reating a regular object. Jasmin will spy on methods of object
	const mockedAuthService = jasmine.createSpyObj(
		'AuthService', 
		['createUser', 'logout'], 
		{
			isAuthenticated$: of(true)
		}
	); // creating fake dependency 

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ NavComponent ],
			// Injection mocked Dependency
			providers: [ 
				{ 
					provide: AuthService,
					useValue: mockedAuthService
				} 
			],
			// repair issue with routing
			imports: [ RouterTestingModule ]
		})
		.compileComponents();

		fixture = TestBed.createComponent(NavComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('Nav component should create', () => {
		expect(component).toBeTruthy();
	});
});
