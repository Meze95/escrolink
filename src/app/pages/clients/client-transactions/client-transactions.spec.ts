import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTransactions } from './client-transactions';

describe('ClientTransactions', () => {
  let component: ClientTransactions;
  let fixture: ComponentFixture<ClientTransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientTransactions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientTransactions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
