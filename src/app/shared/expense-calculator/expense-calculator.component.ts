import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Expense } from '../types';
import { ExpenseCalculatorService } from './expense-calculator.service';

@Component({
  selector: 'app-expense-calculator',
  templateUrl: './expense-calculator.component.html',
  styleUrls: ['./expense-calculator.component.css'],
})
export class ExpenseCalculatorComponent implements OnInit {
  @Input() input!: FormGroup;

  expenseSummary: number = 0;
  balance: number = 0;

  constructor(private calculateService: ExpenseCalculatorService) {}

  ngOnInit() {
    this.calculateService.getFormData.subscribe((data) => {
      this.input = data;
    });

    this.calculateService.calculateTrigger.subscribe(() => {
      this.calculate();
    });
  }

  calculate() {
    if (this.input) {
      const data = this.input.value;
      this.expenseSummary = data['expenses'].reduce(
        (accumulator: number, value: any) =>
          accumulator + this.calculateExpense(value),
        0
      );
      this.balance = data['income'] - this.expenseSummary || 0;
    }
  }

  calculateExpense(expense: Expense) {
    let sum = 0;
    switch (expense.period) {
      case 'daily':
        sum = expense.amount * 30;
        break;
      case 'weekly':
        sum = expense.amount * 4;
        break;
      case 'monthly':
        sum = expense.amount;
        break;
      case 'custom':
        sum = expense.amount * (expense.periodDay ?? 0);
        break;
      default:
        break;
    }
    return sum;
  }
  get expenseForm(){
    return this.input.get('expenses') as FormArray;
  }
}
