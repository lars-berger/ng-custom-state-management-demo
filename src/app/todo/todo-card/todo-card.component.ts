import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { Todo } from '../state/todo.model';

@Component({
  selector: 'app-todo-card',
  templateUrl: './todo-card.component.html',
  styleUrls: ['./todo-card.component.scss'],
})
export class TodoCardComponent implements OnInit {
  @Input() todo!: Todo;

  @Output() complete = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<string>();

  isCompleteCtrl!: FormControl;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.isCompleteCtrl = this.fb.control(this.todo.completed);

    this.isCompleteCtrl.valueChanges.subscribe((completed: boolean) => {
      this.complete.emit({ ...this.todo, completed });
    });
  }
}
