export interface StoreConfig<T> {
  /** Unique identifier for the store. */
  name: string;

  /** Function for synchronously creating the initial state of the store. */
  initializerFn: () => T;

  /** Whether to persist state to `localStorage`. */
  persist?: boolean;
}
