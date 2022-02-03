import {
  BehaviorSubject,
  distinctUntilChanged,
  map,
  Observable,
  pluck,
  Subject,
} from 'rxjs';

import { StoreConfig } from './store-config';
import { StoreChange } from './store-change';

export abstract class Store<T> {
  private state!: BehaviorSubject<T>;

  private get name(): string {
    return this.storeConfig.name;
  }

  private get initializerFn(): Function {
    return this.storeConfig.initializerFn;
  }

  /** Observable of changes to state. Includes previous and incoming value. */
  changes$: Observable<StoreChange<T>> = new Subject();

  constructor(private storeConfig: StoreConfig<T>) {
    this.state = new BehaviorSubject(this.getFreshState());
  }

  get(): Observable<T> {
    return this.state.asObservable().pipe(distinctUntilChanged());
  }

  pluck<K extends keyof T>(key: K): Observable<T[K]> {
    return this.get().pipe(pluck(key), distinctUntilChanged());
  }

  select<S>(predicate: (state: T) => S): Observable<S> {
    return this.get().pipe(map(predicate), distinctUntilChanged());
  }

  patch(args: Partial<T>): void {
    return this.state.next({
      ...this.state.value,
      args,
    });
  }

  set(args: T): void {
    return this.state.next(args);
  }

  reset(): void {
    this.state.next(this.getFreshState());
  }

  resetKey(key: keyof T): void {
    const freshState = this.getFreshState();
    this.state.next({
      ...this.state.value,
      [key]: freshState[key],
    });
  }

  private getFreshState(): T {
    return this.initializerFn();
  }
}
