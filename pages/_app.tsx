import type { AppProps } from 'next/app';
import NextHead from 'next/head';
import '../styles/globals.css';
import 'boxicons/css/boxicons.min.css';
import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  connectorsForWallets,
  Theme,
} from '@rainbow-me/rainbowkit';

import { WagmiProvider, createConfig, http } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  bsc,
  gnosis,
  sepolia,
} from 'wagmi/chains';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import {
  trustWallet,
  binanceWallet,
  bybitWallet,
  argentWallet,
  ledgerWallet,
  bitgetWallet,
  metaMaskWallet,
  coinbaseWallet,
  rainbowWallet,
  braveWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

import { z } from 'zod';
import { useIsMounted } from '../hooks';

const projectId =
  z.string().parse(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) || '';

const chains = [
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  bsc,
  gnosis,
  sepolia,
] as const;

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Popular',
      wallets: [
        trustWallet,
        binanceWallet,
        bybitWallet,
        metaMaskWallet,
        coinbaseWallet,
        bitgetWallet,
        walletConnectWallet,
      ],
    },
    {
      groupName: 'Others',
      wallets: [rainbowWallet, braveWallet, argentWallet, ledgerWallet],
    },
  ],
  {
    appName: 'CoinTap',
    projectId: projectId,
  },
);

const config = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [bsc.id]: http(),
    [gnosis.id]: http(),
    [sepolia.id]: http(),
  },
  connectors,
  ssr: true,
});

const customDarkTheme: Theme = {
  blurs: {
    modalOverlay: '10px',
  },
  colors: {
    accentColor: '#CBB3F3', // Brand color purple
    accentColorForeground: '#011222',
    actionButtonBorder: '#CBB3F3',
    actionButtonBorderMobile: '#CBB3F3',
    actionButtonSecondaryBackground: 'rgba(203, 179, 243, 0.1)',
    closeButton: '#FFFFFF',
    closeButtonBackground: 'rgba(203, 179, 243, 0.1)',
    connectButtonBackground: 'hsl(0, 0%, 10%)',
    connectButtonBackgroundError: '#FF0000',
    connectButtonInnerBackground: '#011222',
    connectButtonText: '#FFFFFF',
    connectButtonTextError: '#FFFFFF',
    connectionIndicator: '#8BACF3', // Brand color blue
    downloadBottomCardBackground: '#1A1A1A',
    downloadTopCardBackground: '#011222',
    error: '#FF0000',
    generalBorder: 'hsl(0, 0%, 20%)',
    generalBorderDim: 'hsl(0, 0%, 10%)',
    menuItemBackground: 'hsl(0, 0%, 10%)',
    modalBackdrop: 'rgba(0, 0, 0, 0.8)',
    modalBackground: '#011222',
    modalBorder: 'hsl(0, 0%, 20%)',
    modalText: '#FFFFFF',
    modalTextDim: 'hsl(0, 0%, 60%)',
    modalTextSecondary: 'hsl(0, 0%, 60%)',
    profileAction: 'hsl(0, 0%, 10%)',
    profileActionHover: 'hsl(0, 0%, 20%)',
    profileForeground: 'hsl(0, 0%, 10%)',
    selectedOptionBorder: '#CBB3F3',
    standby: '#FFD700', // Gold
  },
  radii: {
    actionButton: '4px',
    connectButton: '4px',
    menuButton: '4px',
    modal: '8px',
    modalMobile: '8px',
  },
  shadows: {
    connectButton: '0 0 15px rgba(203, 179, 243, 0.5)', // Brand purple glow
    dialog: '0 0 30px rgba(203, 179, 243, 0.3)',
    profileDetailsAction: '0 0 12px rgba(203, 179, 243, 0.4)',
    selectedOption: '0 0 15px rgba(203, 179, 243, 0.4)',
    selectedWallet: '0 0 15px rgba(203, 179, 243, 0.4)',
    walletLogo: '0 0 12px rgba(203, 179, 243, 0.4)',
  },
  fonts: {
    body: 'Avenir Next, Manrope, sans-serif',
  },
};

const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppProps) => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;
  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={customDarkTheme}>
            <NextHead>
              <title>CoinTap – Tap In, Get Free Coins</title>
              <meta
                name="description"
                content="Connect your wallet and start earning free coins instantly with CoinTap. Simple, secure, and rewarding — your gateway to effortless crypto rewards."
              />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
              <meta property="og:title" content="CoinTap – Tap In, Get Free Coins" />
              <meta
                property="og:description"
                content="Connect your wallet and start earning free coins instantly with CoinTap. Simple, secure, and rewarding — your gateway to effortless crypto rewards."
              />
              <meta property="og:type" content="website" />
              <meta
                property="og:url"
                content="https://cointap-app.vercel.app"
              />
              <meta
                property="og:image"
                content="https://cointap-app.vercel.app/banner.jpg"
              />
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content="CoinTap – Tap In, Get Free Coins" />

              <meta
                name="twitter:image"
                content="https://cointap-app.vercel.app/banner.jpg"
              />
              <meta name="author" content="CoinTap" />
              <meta
                name="keywords"
                content="crypto, rewards, free coins, wallet, CoinTap, airdrop"
              />
              <link rel="icon" href="/favicon.ico" />
            </NextHead>
            <Component {...pageProps} />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
};

export default App;
