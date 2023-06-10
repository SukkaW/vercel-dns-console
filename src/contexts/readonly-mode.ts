import { createContextState } from 'foxact/context-state';

const [ReadonlyModeProvider, useIsReadonly, useSetIsReadOnly] = createContextState(false);

export { ReadonlyModeProvider, useIsReadonly, useSetIsReadOnly };
