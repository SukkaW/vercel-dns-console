export interface BaseVercelErrorField {
  code: string,
  message: string
}

export interface VercelError<T extends BaseVercelErrorField> {
  error: T
}

function hasOwn<T extends object, K extends PropertyKey>(target: T,
  propertyKey: K): target is T & Record<K, unknown> {
  return Object.hasOwn(target, propertyKey);
}

export function isVercelError<T extends BaseVercelErrorField = BaseVercelErrorField>(value: unknown): value is VercelError<T> {
  return !!(
    value && typeof value === 'object'
    && hasOwn(value, 'error')
    && value.error
    && typeof value.error === 'object'
    && 'code' in value.error
    && 'message' in value.error
  );
}
