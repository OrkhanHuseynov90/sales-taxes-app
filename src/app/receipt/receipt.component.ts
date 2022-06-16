import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Item } from '../model/item.model';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css'],
})
export class ReceiptComponent implements OnInit {
  items: Item[] = [];
  itemForm: FormGroup;
  totalTaxAmount = 0;
  totalAmount = 0;
  receipt: string[] = [];
  receiptPrinted = false;
  imported = '';

  constructor() {
    this.itemForm = new FormGroup({
      quantity: new FormControl(null, [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/),
      ]),
      desc: new FormControl(null, Validators.required),
      price: new FormControl(null, [
        Validators.required,
        Validators.min(0.001),
      ]),
      type: new FormControl(null, Validators.required),
      imported: new FormControl(false),
    });
  }

  ngOnInit(): void {}

  onAdd() {
    if (this.receiptPrinted) this.clearAll();

    const item = new Item(
      this.itemForm.get('quantity')?.value,
      this.itemForm.get('desc')?.value,
      this.itemForm.get('price')?.value,
      this.itemForm.get('type')?.value,
      this.itemForm.get('imported')?.value
    );

    this.items.push(item);

    this.itemForm.reset({
      imported: false,
    });

    this.receiptPrinted = false;
  }

  calculateReceipt() {
    this.totalAmount = 0;
    this.totalTaxAmount = 0;
    this.receipt = [];
    let basicTax = 0.1;
    let importTax = 0.05;
    let itemTotal = '';

    for (const item of this.items) {
      let itemPrice = 0;
      let taxAmount = 0;
      let itemImported = '';

      if (item.type === 'other' && !item.imported) {
        taxAmount = +this.customRound(item.price * basicTax) * item.quantity;
      }
      if (item.type !== 'other' && item.imported) {
        taxAmount = +this.customRound(item.price * importTax) * item.quantity;
      }
      if (item.type === 'other' && item.imported) {
        taxAmount =
          +this.customRound(item.price * (basicTax + importTax)) *
          item.quantity;
      }

      itemPrice = +(item.price * item.quantity + taxAmount).toFixed(2);
      itemImported = item.imported ? 'imported ' : '';
      itemTotal =
        item.quantity + ' ' + itemImported + item.desc + ' ' + itemPrice;

      this.totalTaxAmount = +(this.totalTaxAmount + taxAmount).toFixed(2);
      this.totalAmount = +(this.totalAmount + itemPrice).toFixed(2);
      this.receipt.push(itemTotal);
    }
    this.receiptPrinted = true;
  }

  customRound(number: number) {
    return (Math.ceil(number * 20) / 20).toFixed(2);
  }

  clearAll() {
    this.items = [];
    this.receipt = [];
    this.totalTaxAmount = 0;
    this.totalAmount = 0;
    this.receiptPrinted = false;
  }
}
