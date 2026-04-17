import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaFiscalCadastro } from './nota-fiscal-cadastro';

describe('NotaFiscalCadastro', () => {
  let component: NotaFiscalCadastro;
  let fixture: ComponentFixture<NotaFiscalCadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotaFiscalCadastro],
    }).compileComponents();

    fixture = TestBed.createComponent(NotaFiscalCadastro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
