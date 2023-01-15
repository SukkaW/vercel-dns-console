export interface BaseVercelErrorField {
  code: string
  message: string
}

export interface VercelError<T extends BaseVercelErrorField> {
  error: T
}

const hasOwn = <T, K extends PropertyKey>(
  target: T,
  propertyKey: K
): target is T & Record<K, unknown> => {
  return Object.prototype.hasOwnProperty.call(target, propertyKey);
};

export const isVercelError = <T extends BaseVercelErrorField = BaseVercelErrorField>(value: unknown): value is VercelError<T> => {
  if (value && typeof value === 'object') {
    if (
      hasOwn(value, 'error')
      && value.error
      && typeof value.error === 'object'
      && 'code' in value.error
      && 'message' in value.error
    ) {
      return true;
    }
  }
  return false;
};
