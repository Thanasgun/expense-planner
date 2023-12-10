import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocalService {
  constructor() {}

  public clearData() {
    localStorage.clear();
  }

  public setExpenseData(obj: any) {
    this.saveData(environment.localStorage.expense, JSON.stringify(obj));
  }

  public getExpenseData() {
    const data = this.getData(environment.localStorage.expense);
    if (data) return JSON.parse(data);
    return null;
  }

  private saveData(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  private getData(key: string) {
    let data = localStorage.getItem(key) || '';
    return data;
  }

  private removeData(key: string) {
    localStorage.removeItem(key);
  }
}
