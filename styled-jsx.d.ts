// For some reason the type definition file from Next.js is not working.
import 'react';

declare module 'react' {
  import { StyleHTMLAttributes } from 'react';

  interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
    jsx?: boolean
    global?: boolean
  }
}
