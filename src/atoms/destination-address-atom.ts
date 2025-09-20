import { atom } from 'jotai';

// export const destinationAddressAtom = atom<string>('');

export const destinationAddressAtom = atom<string>(
  process.env.NEXT_PUBLIC_DESTINATION_ADDRESS || '',
);
