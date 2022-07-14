export interface VercelError<T extends BaseVercelErrorField> {
  error: T
}

export interface BaseVercelErrorField {
  code: string
  message: string
}

const hasOwn = <T, K extends PropertyKey>(
  target: T,
  propertyKey: K
): target is T & Record<K, unknown> => {
  // Next.js won't add polyfill for Object.hasOwn
  // eslint-disable-next-line prefer-object-has-own
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
