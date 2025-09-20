import Image from 'next/image';
import { SendTokens } from './contract';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function About() {
  return (
    <div className="mx-auto max-w-7xl pt-24 sm:px-6 sm:pt-32 lg:px-8">
      <div className="relative isolate overflow-hidden bg-gray-900 px-6 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-8 lg:flex lg:gap-x-20 lg:px-24">
        <svg
          viewBox="0 0 1024 1024"
          className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
          aria-hidden="true"
        >
          <circle
            cx={512}
            cy={512}
            r={512}
            fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
            fillOpacity="0.7"
          />
          <defs>
            <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
              <stop stopColor="#7775D6" />
              <stop offset={1} stopColor="#E935C1" />
            </radialGradient>
          </defs>
        </svg>
        <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-5 lg:text-left">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="text-sm text-blue-400 ">Multi‑chain Rewards</span>
            <br />
            Claim your verified spend across Bitcoin, Ethereum, BNB, Solana, and more
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Connect your wallet to claim verified rewards across Bitcoin, Ethereum, BNB Chain, Solana, Polygon, Arbitrum, Base, and more.
            Simple, secure, and transparent - your gateway to effortless crypto rewards.
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Welcome to{' '}
            <span className="inline-flex items-center rounded-md bg-transparent px-2 py-1 text-xs font-medium text-yellow-400 ring-1 ring-inset ring-yellow-200/50 shadow-md">
              CoinTap
            </span>
            , connect your wallet and start earning free coins instantly across supported networks.
          </p>{' '}
          <div className="mt-8 flex items-center lg:items-start">
            <ConnectButton />
          </div>
          <div className="flex items-center justify-center gap-x-6 lg:justify-start">
            <SendTokens />
          </div>
        </div>
        <div className="relative mt-16 h-80 lg:mt-8">
          <Image
            src="/bg.jpg"
            alt="App screenshot"
            priority={true}
            width={1824}
            height={1080}
            className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
          />
        </div>
      </div>
    </div>
  );
}

export default About;
