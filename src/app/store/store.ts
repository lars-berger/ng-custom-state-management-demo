import { BehaviorSubject, distinctUntilChanged, map, Observable, pluck, Subject } from 'rxjs';

import { StoreConfig } from './store-config';
import { StoreChange } from './store-change';

export abstract class Store<T> {
  private state!: BehaviorSubject<T>;
  private storeConfig!: StoreConfig<T>;

  private reduxDevToolRef =
    (window as any)['__REDUX_DEVTOOLS_EXTENSION__'] || (window as any)['devToolsExtension'];

  private reduxDevToolConnection = this.reduxDevToolRef.connect({
    name: 'Test123',
    instanceId: 'Test123',
  });

  /** Observable of changes to state. Includes previous and incoming value. */
  changes$: Observable<StoreChange<T>> = new Subject();

  constructor(storeConfig: StoreConfig<T>) {
    this.storeConfig = storeConfig;
    this.state = new BehaviorSubject(this.getFreshState());
    this.emitViaDevtool('@@INIT', this.getFreshState());
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

  patch(partialState: Partial<T>): void {
    const updatedState: T = {
      ...this.state.value,
      ...partialState,
    };
    this.state.next(updatedState);
    this.emitViaDevtool('Patch', updatedState);
  }

  update(stateOrCallback: T | ((currentState: Readonly<T>) => T)): void {
    if (typeof stateOrCallback === 'function') {
      //@ts-ignore
      const updatedState: T = stateOrCallback(this.state.value);
      this.state.next(updatedState);
      this.emitViaDevtool('Update', updatedState);
      return;
    }

    this.state.next(stateOrCallback);
    this.emitViaDevtool('Update', stateOrCallback);
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
    return this.storeConfig.initializerFn();
  }

  /** Emit updated state to Redux devtool. */
  private emitViaDevtool(actionName: string, state: T): void {
    this.reduxDevToolConnection.send(
      `[${this.storeConfig.name}] ${actionName}`,
      { [this.storeConfig.name]: state },
      false,
      'Test123'
    );
  }
}
