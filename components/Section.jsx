import Image from 'next/image';
import { GiftIcon, CogIcon, CircleStackIcon } from '@heroicons/react/20/solid';

const features = [
  {
    name: 'Purpose of CoinTap:',
    description:
      'CoinTap rewards users across supported chains, helping you tap into effortless crypto rewards.',
    icon: GiftIcon,
  },
  {
    name: 'Why Choose CoinTap:',
    description:
      'Simple, secure, and rewarding — CoinTap helps you earn free coins instantly after connecting your wallet.',
    icon: CogIcon,
  },
  {
    name: 'Architecture of CoinTap:',
    description:
      'CoinTap aggregates claim logic and token transfers to streamline rewards across multiple networks.',
    icon: CircleStackIcon,
  },
];

export default function Section() {
  return (
    <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-blue-400">
                Understanding CoinTap
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Your Multi‑chain Rewards Hub
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                CoinTap connects to your wallet, discovers eligible balances across networks, and
                helps you claim and transfer rewards with minimal friction.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-white lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-bold text-white">
                      <feature.icon
                        className="absolute left-1 top-1 h-5 w-5 text-blue-400"
                        aria-hidden="true"
                      />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline text-gray-300">
                      {feature.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <Image
            src="/bg2.png"
            alt="Product screenshot"
            className="w-[100%] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 md:-ml-4 lg:-ml-0"
            width={200}
            height={100}
          />
        </div>
      </div>
    </div>
  );
}
