import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  combineLatest,
  debounceTime,
  of,
  skip,
  startWith,
  switchMap,
} from 'rxjs';
import Swal from 'sweetalert2';
import { ExpenseCalculatorService } from '../shared/expense-calculator/expense-calculator.service';
import { LocalService } from '../shared/local.service';
import { Expense } from '../shared/types';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  form!: FormGroup;
  periodOptions: any[] = [
    {
      display: 'Daily',
      value: 'daily',
    },
    {
      display: 'Weekly',
      value: 'weekly',
    },
    {
      display: 'Monthly',
      value: 'monthly',
    },
    {
      display: 'Custom',
      value: 'custom',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private calculateService: ExpenseCalculatorService,
    private localService: LocalService
  ) {}

  ngOnInit() {
    this.buildForm();
    this.getLocal();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      income: [null, Validators.required],
      expenses: this.formBuilder.array([]),
    });

    this.form.get('income')?.valueChanges.subscribe((val: any) => {
      this.triggerCalculate();
    });
  }

  private async valueChanges(item: FormGroup): Promise<void> {
    let detail = item.get('detail') as FormControl;
    let period = item.get('period') as FormControl;
    let periodDay = item.get('periodDay') as FormControl;
    let amount = item.get('amount') as FormControl;

    const valueChanges = combineLatest({
      detailValue: detail.valueChanges.pipe(
        startWith(detail.value),
        switchMap((value) => of(value))
      ),
      periodValue: period.valueChanges.pipe(
        startWith(period.value),
        switchMap((value) => of(value))
      ),
      periodDayValue: periodDay.valueChanges.pipe(
        startWith(periodDay.value),
        switchMap((value) => of(value))
      ),
      amountImageValue: amount.valueChanges.pipe(
        startWith(amount.value),
        switchMap((value) => of(value))
      ),
    });

    valueChanges.pipe(skip(1), debounceTime(1500)).subscribe((value: any) => {
      this.triggerCalculate();
    });
  }

  protected async addExpense(item?: Expense) {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    let newForm = this.formBuilder.group({
      detail: [item?.detail || '', Validators.required],
      period: [item?.period || '', Validators.required],
      periodDay: [item?.periodDay || null],
      amount: [item?.amount || null, Validators.required],
    });

    await this.valueChanges(newForm);
    this.expenseForms.push(newForm);
  }

  protected getLocal() {
    const localData = this.localService.getExpenseData();
    if (localData == null) return;

    this.form?.get('income')?.setValue(localData['income']);
    const expenses = localData['expenses'];
    expenses.forEach((item: any) => {
      this.addExpense(item);
    });
  }

  protected clearLocal() {
    Swal.fire({
      title: 'Clear Form',
      text: 'Are your data will be erased.',
      width: 600,
      padding: '3em',
      color: '#716add',
      background: '#fff',
      backdrop: `
        rgba(0,0,123,0.4)
        url("assets/images/nyan-cat.gif")
        left top
        no-repeat
      `,
      showCancelButton: true,
      confirmButtonText: 'Yes, Go on!',
    });
    this.localService.clearData();
    this.form.reset();
    this.expenseForms.clear();
  }

  protected get expenseForms() {
    return this.form?.get('expenses') as FormArray;
  }

  protected triggerCalculate() {
    this.localService.setExpenseData(this.form.value);
    this.calculateService.setFormData = this.form;
    this.calculateService.search();
  }

  protected removeExpense(index: number) {
    this.expenseForms.removeAt(index);
  }

  protected isInvalid(form: any, field: string) {
    const control = form.get(field);
    return control.touched && !control?.valid;
  }
}
