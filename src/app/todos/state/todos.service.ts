import { Injectable } from '@angular/core';
import { combineLatest, map } from 'rxjs';

import { TodosStore, TODO_FILTER } from './todos.store';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  activeFilter$ = this.todosStore.select((state) => state.activeFilter);

  todos$ = this.todosStore.select((state) => state.todos);

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

  constructor(private todosStore: TodosStore) {}
}
