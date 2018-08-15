import { defer } from 'rxjs';

export function fakeAsyncResponse<T>(data: T) {
  return defer(() => Promise.resolve(data));
}
