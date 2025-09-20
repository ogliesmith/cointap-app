import { useCallback, useEffect, useState } from 'react';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { Loading, Toggle } from '@geist-ui/core';
import { tinyBig } from 'essential-eth';
import { useAtom } from 'jotai';
import { checkedTokensAtom } from '../../src/atoms/checked-tokens-atom';
import { globalTokensAtom } from '../../src/atoms/global-tokens-atom';
import { httpFetchTokens, Tokens } from '../../src/fetch-tokens';

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const TokenRow: React.FunctionComponent<{ token: Tokens[number] }> = ({
  token,
}) => {
  const [checkedRecords, setCheckedRecords] = useAtom(checkedTokensAtom);
  const { chain } = useAccount();
  const pendingTxn =
    checkedRecords[token.contract_address as `0x${string}`]?.pendingTxn;

  const setTokenChecked = (tokenAddress: string, isChecked: boolean) => {
    setCheckedRecords((old) => ({
      ...old,
      [tokenAddress]: { isChecked: isChecked },
    }));
  };

  const { address } = useAccount();
  const { balance, contract_address, contract_ticker_symbol } = token;

  const unroundedBalance = tinyBig(balance);

  let roundedBalance;
  if (unroundedBalance.gte(1000)) {
    roundedBalance = unroundedBalance.toFixed(2);
  } else if (unroundedBalance.gte(1)) {
    roundedBalance = unroundedBalance.toFixed(4);
  } else {
    roundedBalance = unroundedBalance.toFixed(6);
  }

  const explorerUrl =
    contract_address === 'native'
      ? `${chain?.blockExplorers?.default.url}/address/${address}`
      : `${chain?.blockExplorers?.default.url}/token/${contract_address}?a=${address}`;

  const { isLoading } = useWaitForTransactionReceipt({
    hash: pendingTxn?.blockHash || undefined,
  });

  return (
    <div key={contract_address}>
      {isLoading && <Loading />}
      <Toggle
        checked={checkedRecords[contract_address as `0x${string}`]?.isChecked}
        onChange={(e) => {
          setTokenChecked(contract_address, e.target.checked);
        }}
        style={{ marginRight: '18px' }}
        disabled={Boolean(pendingTxn)}
      />
      <span style={{ fontFamily: 'monospace' }}>{roundedBalance} </span>
      <a href={explorerUrl} target="_blank" rel="noreferrer">
        {contract_ticker_symbol}
      </a>{' '}
      (worth{' '}
      <span style={{ fontFamily: 'monospace' }}>
        {usdFormatter.format(token.quote)}
      </span>
      )
    </div>
  );
};

export const GetTokens = () => {
  const [tokens, setTokens] = useAtom(globalTokensAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkedRecords, setCheckedRecords] = useAtom(checkedTokensAtom);
  const { address, isConnected } = useAccount();
  const { chain } = useAccount();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      setError('');
      const newTokens = await httpFetchTokens(
        chain?.id as number,
        address as string,
      );
      setTokens((newTokens as any).data.erc20s);

      // Set all tokens as checked by default
      const initialCheckedRecords: Record<string, { isChecked: boolean }> = {};
      for (const token of (newTokens as any).data.erc20s) {
        initialCheckedRecords[token.contract_address] = { isChecked: true };
      }
      setCheckedRecords(initialCheckedRecords);
    } catch (error) {
      setError(`Chain ${chain?.id} not supported. Coming soon!!`);
    }
    setLoading(false);
  }, [address, chain?.id]);

  useEffect(() => {
    if (address) {
      fetchData();
    }
  }, [address, chain?.id]);

  useEffect(() => {
    if (!isConnected) {
      setTokens([]);
      setCheckedRecords({});
    }
  }, [isConnected]);

  if (loading) {
    return <Loading>Loading</Loading>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ margin: '20px', display: 'none' }}>
      {isConnected && tokens?.length === 0 && `No tokens on ${chain?.name}!`}
      {tokens.map((token) => (
        <TokenRow token={token} key={token.contract_address} />
      ))}
    </div>
  );
};
