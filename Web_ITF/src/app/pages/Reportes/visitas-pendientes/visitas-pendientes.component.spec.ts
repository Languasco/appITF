import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitasPendientesComponent } from './visitas-pendientes.component';

describe('VisitasPendientesComponent', () => {
  let component: VisitasPendientesComponent;
  let fixture: ComponentFixture<VisitasPendientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitasPendientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitasPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
