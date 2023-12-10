import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseCalculatorComponent } from './expense-calculator/expense-calculator.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HelloAdventurerComponent } from './hello-adventurer/hello-adventurer.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [ExpenseCalculatorComponent, HelloAdventurerComponent],
  exports: [ExpenseCalculatorComponent, HelloAdventurerComponent],
})
export class SharedModule {}
