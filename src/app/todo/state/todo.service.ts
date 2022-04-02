import { Injectable } from '@angular/core';
import { combineLatest, map } from 'rxjs';

import { TodoStore, TODO_FILTER } from './todo.store';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  activeFilter$ = this.todoStore.select((state) => state.activeFilter);

  todos$ = this.todoStore.select((state) => state.todos);

  filteredTodos$ = combineLatest([this.todos$, this.activeFilter$]).pipe(
    map(([todos, activeFilter]) => {
      switch (activeFilter) {
        case TODO_FILTER.COMPLETED:
          return todos.filter((todo) => todo.completed);
        case TODO_FILTER.ACTIVE:
          return todos.filter((todo) => !todo.completed);
        default:
          return todos;
      }
    })
  );

  constructor(private todoStore: TodoStore) {}

  create(title: string): void {
    this.todoStore.update((state) => ({
      ...state,
      todos: [...state.todos, { title, completed: false, id: this.getUid() }],
    }));
  }

  delete(id: string): void {
    this.todoStore.update((state) => ({
      ...state,
      todos: state.todos.filter((item) => item.id !== id),
    }));
  }

  setComplete(id: string, completed: boolean = true): void {
    this.todoStore.update((state) => ({
      ...state,
      todos: state.todos.map((item) => (item.id === id ? { ...item, completed } : item)),
    }));
  }

  private getUid(): string {
    return Math.random().toString(36).slice(2);
  }
}
