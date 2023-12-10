import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ExpenseCalculatorService } from '../shared/expense-calculator/expense-calculator.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
})
export class ResultComponent implements OnInit {
  @Input() input!: FormGroup;

  constructor(private calculateService: ExpenseCalculatorService) {}

  ngOnInit() {
    this.calculateService.getFormData.subscribe((data) => {
      this.input = data;
    });
  }

  get isShow() {
    if (!this.input) return false;

    let expenseForm = this.input.get('expenses') as FormArray;
    if (expenseForm.value.length < 1) {
      return false;
    }
    return true;
  }
}
