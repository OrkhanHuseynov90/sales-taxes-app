import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ReceiptComponent } from './receipt.component';

describe('ReceiptComponent', () => {
  let component: ReceiptComponent;
  let fixture: ComponentFixture<ReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [ReceiptComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.ngOnInit();
  });

  it('should create the Receipt Component', () => {
    expect(component).toBeTruthy();
  });

  it('customRound method calculation', () => {
    expect(component.customRound(14.99 + 6.75)).toContain('21.75');
  });

  it('clearAll method calculation', () => {
    component.clearAll();

    expect(component.items).toHaveSize(0);
    expect(component.receipt).toHaveSize(0);
    expect(component.receiptPrinted).toBe(false);
    expect(component.totalTaxAmount).toBe(0);
    expect(component.totalAmount).toBe(0);
  });

  it('invalid form when empty', () => {
    expect(component.itemForm.valid).toBeFalsy();
  });

  it('quantity field validity', () => {
    let quantity = component.itemForm.controls['quantity'];

    // empty field is not allowed
    expect(quantity.valid).toBeFalsy();

    // minimum number should be 1
    quantity.setValue(0);
    expect(quantity.valid).toBeFalsy();

    // floating number is not allowed
    quantity.setValue(2.4);
    expect(quantity.valid).toBeFalsy();

    // string is not allowed
    quantity.setValue('q');
    expect(quantity.valid).toBeFalsy();
  });

  it('description field validity', () => {
    let description = component.itemForm.controls['desc'];

    // empty field is not allowed
    expect(description.valid).toBeFalsy();
  });

  it('price field validity', () => {
    let price = component.itemForm.controls['price'];

    // empty field is not allowed
    expect(price.valid).toBeFalsy();

    // price should be more than 0.001
    price.setValue(0);
    expect(price.valid).toBeFalsy();
  });

  it('type field validity', () => {
    let type = component.itemForm.controls['type'];

    // empty field is not allowed
    expect(type.valid).toBeFalsy();
  });

  it('adding a created item to a basket', () => {
    // initial form is not valid
    expect(component.itemForm.valid).toBeFalsy();

    // list of items is empty
    expect(component.items).toHaveSize(0);

    component.itemForm.controls['quantity'].setValue(1);
    component.itemForm.controls['desc'].setValue('music CD');
    component.itemForm.controls['price'].setValue(14.99);
    component.itemForm.controls['type'].setValue('other');

    component.onAdd();

    // list contains an item after creating and adding to basket
    expect(component.items).toHaveSize(1);
  });

  it('calculate tax and total amount', () => {
    // initial form is not valid
    expect(component.itemForm.valid).toBeFalsy();

    // list of items is empty
    expect(component.items).toHaveSize(0);

    // receipt list is empty
    expect(component.receipt).toHaveSize(0);

    component.itemForm.controls['quantity'].setValue(1);
    component.itemForm.controls['desc'].setValue('music CD');
    component.itemForm.controls['price'].setValue(14.99);
    component.itemForm.controls['type'].setValue('other');

    component.onAdd();
    component.calculateReceipt();

    // list contains an item after creating and adding to basket
    expect(component.items).toHaveSize(1);

    // receipt list contains an item after printing receipt
    expect(component.receipt).toHaveSize(1);

    // total tax calculation
    expect(component.totalTaxAmount).toBe(1.5);

    // total amount calculation
    expect(component.totalAmount).toBe(16.49);
  });
});
