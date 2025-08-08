import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CepModelComponent } from './cep.model.component';

describe('CepModelComponent', () => {
  let component: CepModelComponent;
  let fixture: ComponentFixture<CepModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CepModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CepModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
