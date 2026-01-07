export interface IClient<T> {
  request(...args: any[]): Promise<T>;
}
