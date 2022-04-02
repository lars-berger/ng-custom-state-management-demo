import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoCardComponent } from './todo-card/todo-card.component';

@NgModule({
  declarations: [TodoListComponent, TodoCardComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [TodoListComponent],
})
export class TodoModule {}
