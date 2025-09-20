import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { Tokens } from '../../../../src/fetch-tokens';
import { blacklistAddresses } from '../../../../src/token-lists';
import { TinyBig, tinyBig } from 'essential-eth';
import { Big, BigSource } from 'big.js';

const MORALIS_API_KEY = z.string().parse(process.env.MORALIS_API_KEY);

type ChainName =
  | 'eth'
  | 'polygon'
  | 'bsc'
  | 'avalanche'
  | 'fantom'
  | 'base'
  | 'arbitrum'
  | 'optimism'
  | 'sepolia'
  | 'gnosis';

function selectChainName(chainId: number): ChainName {
  switch (chainId) {
    case 1:
      return 'eth';
    case 56:
      return 'bsc';
    case 100:
      return 'gnosis';
    case 137:
      return 'polygon';
    case 8453:
      return 'base';
    case 11155111:
      return 'sepolia';
    case 42161:
      return 'arbitrum';
    case 43114:
      return 'avalanche';
    case 250:
      return 'fantom';
    case 10:
      return 'optimism';
    default:
      const errorMessage = `chainId "${chainId}" not supported`;
      alert(errorMessage);
      throw new Error(errorMessage);
  }
}

const fetchTokens = async (chainId: number, evmAddress: string) => {
  const chainName = selectChainName(chainId);

  // Fetch native token balance
  const nativeResponse = await fetch(
    `https://deep-index.moralis.io/api/v2/${evmAddress}/balance?chain=${chainName}`,
    {
      headers: { 'X-API-Key': MORALIS_API_KEY },
    },
  );
  const nativeData = await nativeResponse.json();
  const nativeBalance = nativeData.balance / 1e18; // Convert from wei to Ether (or equivalent)

  // Include native token only if balance is above zero
  const nativeToken =
    nativeBalance > 0
      ? {
          contract_name: chainName === 'sepolia' ? 'SepoliaETH' : 'Ethereum',
          contract_ticker_symbol:
            chainName === 'sepolia' ? 'SepoliaETH' : 'ETH',
          contract_address: 'native',
          logo_url: `https://cryptologos.cc/logos/ethereum-eth-logo.png?v=023`, // Adjusted placeholder logo
          type: 'native',
          balance: nativeBalance.toString(),
          quote: null, // Set to null if USD price data isn’t available for testnets
        }
      : null;

  // Fetch ERC-20 token balances
  const tokenResponse = await fetch(
    `https://deep-index.moralis.io/api/v2/${evmAddress}/erc20?chain=${chainName}`,
    {
      headers: { 'X-API-Key': MORALIS_API_KEY },
    },
  );
  const tokens = await tokenResponse.json();

  const erc20s = tokens
    .filter(
      (item: { balance: string; token_address: string }) =>
        item.balance !== '0' &&
        !blacklistAddresses.includes(item.token_address),
    ) // Filter by balance > 0 and blacklist
    .map(
      (item: {
        balance: string | number | TinyBig | Big;
        decimals: number;
        name: any;
        symbol: any;
        token_address: any;
        logo: any;
        usdPrice: BigSource;
      }) => {
        const adjustedBalance = tinyBig(item.balance)
          .div(tinyBig(10).pow(item.decimals))
          .toString();
        return {
          contract_decimals: item.decimals,
          contract_name: item.name,
          contract_ticker_symbol: item.symbol,
          contract_address: item.token_address,
          logo_url: item.logo,
          type: 'cryptocurrency',
          balance: adjustedBalance,
          quote: item.usdPrice
            ? tinyBig(adjustedBalance).times(item.usdPrice).toString()
            : null,
        };
      },
    ) as Tokens;

  // Fetch NFT balances
  const nftResponse = await fetch(
    `https://deep-index.moralis.io/api/v2/${evmAddress}/nft?chain=${chainName}`,
    {
      headers: { 'X-API-Key': MORALIS_API_KEY },
    },
  );
  const nfts = await nftResponse.json();

  const nftItems = nfts.result.map(
    (item: { name: any; token_address: any; image: any; amount: any }) => ({
      contract_name: item.name,
      contract_address: item.token_address,
      logo_url: item.image,
      type: 'nft',
      balance: item.amount,
    }),
  ) as Tokens;

  return {
    erc20s: nativeToken ? [nativeToken, ...erc20s] : erc20s,
    nftItems,
  };
};

const positiveIntFromString = (value: string): number => {
  const intValue = parseInt(value, 10);

  if (isNaN(intValue) || intValue <= 0) {
    throw new Error('Value must be a positive integer');
  }

  return intValue;
};

const requestQuerySchema = z.object({
  chainId: z.string().transform(positiveIntFromString),
  evmAddress: z.string(),
});

// Define the API route handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { chainId, evmAddress } = requestQuerySchema.parse(req.query);

    const response = await fetchTokens(chainId, evmAddress);

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error('Error processing the request:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
