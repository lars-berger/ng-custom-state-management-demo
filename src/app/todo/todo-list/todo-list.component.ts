import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Todo } from '../state/todo.model';

import { TodoService } from '../state/todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent {
  todos$ = this.todoService.todos$;

  todoTitleCtrl = this.fb.control('');

  constructor(private fb: FormBuilder, private todoService: TodoService) {}

  onCreate() {
    const todoTitle: string = this.todoTitleCtrl.value;
    this.todoService.create(todoTitle);
    this.todoTitleCtrl.reset();
  }

  onDelete(id: string): void {
    this.todoService.delete(id);
  }

  onComplete(todo: Todo): void {
    this.todoService.setComplete(todo.id, todo.completed);
  }
}
