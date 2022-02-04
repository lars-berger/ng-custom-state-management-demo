import { Injectable } from '@angular/core';

import { Todo } from './todo.model';
import { Store } from '../../store/store';

export enum TODO_FILTER {
  COMPLETED,
  ACTIVE,
  ALL,
}

export interface TodosState {
  todos: Todo[];
  activeFilter: TODO_FILTER;
}

@Injectable({
  providedIn: 'root',
})
export class TodoStore extends Store<TodosState> {
  constructor() {
    super({ name: 'todos', initializerFn: TodoStore.createInitialState });
  }

  static createInitialState(): TodosState {
    return {
      todos: [],
      activeFilter: TODO_FILTER.ALL,
    };
  }
}
