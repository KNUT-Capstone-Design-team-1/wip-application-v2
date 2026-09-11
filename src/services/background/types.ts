export interface IBackgroundTaskHandler {
  name: string;
  execute: () => Promise<void>;
}
