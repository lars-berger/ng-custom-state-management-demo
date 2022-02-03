export interface StoreChange<T> {
  previousValue: T;
  incomingValue: T;
}
