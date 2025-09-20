import { atom } from 'jotai';
import { TransferPending } from '../types/transfer-success';

export const checkedTokensAtom = atom<
  Record<
    `0x${string}`,
    {
      status?: string;
      isChecked: boolean;
      pendingTxn?: TransferPending;
    }
  >
>({});
