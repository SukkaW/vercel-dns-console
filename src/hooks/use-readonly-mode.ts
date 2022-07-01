import { atom, useAtom } from 'jotai';

const modeAtom = atom(false);

export const useReadonlyMode = () => useAtom(modeAtom);
