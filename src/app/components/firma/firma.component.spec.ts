import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmaComponent } from './firma.component';

describe('FirmaComponent', () => {
  let component: FirmaComponent;
  let fixture: ComponentFixture<FirmaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FirmaComponent]
    });
    fixture = TestBed.createComponent(FirmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
