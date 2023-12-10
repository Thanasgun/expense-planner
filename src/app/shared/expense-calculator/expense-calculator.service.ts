import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ExpenseCalculatorService implements OnDestroy {
  protected _formData = new BehaviorSubject<any>(null);
  protected _calculateTrigger = new BehaviorSubject<any>(null);

  get config(): Observable<any> {
    return this._formData.asObservable();
  }

  get calculateTrigger(): Observable<any> {
    return this._calculateTrigger.asObservable();
  }

  get getFormData(): Observable<any> {
    return this._formData.asObservable();
  }

  set setFormData(v: any) {
    this._formData.next(v);
  }

  search(): void {
    this._calculateTrigger.next(null);
  }

  constructor() {}

  ngOnDestroy(): void {
    this._formData.complete();
    this._calculateTrigger.complete();
  }
}
