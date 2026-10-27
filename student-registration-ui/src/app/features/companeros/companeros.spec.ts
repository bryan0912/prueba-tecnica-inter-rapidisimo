import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Companeros } from './companeros';

describe('Companeros', () => {
  let component: Companeros;
  let fixture: ComponentFixture<Companeros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Companeros],
    }).compileComponents();

    fixture = TestBed.createComponent(Companeros);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
