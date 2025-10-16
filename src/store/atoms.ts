import { atom } from 'jotai';

// 🎯 Navigation atoms
export const initialRouteAtom = atom<string | null>(null);
export const hasNavigatedAtom = atom<boolean>(false);
