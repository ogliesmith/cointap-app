import { ShieldCheckIcon, LockClosedIcon, EyeIcon, DocumentCheckIcon } from '@heroicons/react/20/solid';

const securityFeatures = [
  {
    name: 'End-to-End Encryption',
    description: 'All wallet connections and transactions are encrypted using industry-standard protocols.',
    icon: LockClosedIcon,
  },
  {
    name: 'Non-Custodial',
    description: 'Your private keys never leave your device. We never have access to your funds.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Transparent Process',
    description: 'All transactions are publicly verifiable on the blockchain. No hidden fees or charges.',
    icon: EyeIcon,
  },
  {
    name: 'Smart Contract Audited',
    description: 'Our smart contracts have been audited by leading security firms for maximum safety.',
    icon: DocumentCheckIcon,
  },
];

export default function SecurityFeatures() {
  return (
    <div className="bg-gray-900 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Security First
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Your security and privacy are our top priorities. We use industry-leading 
            security measures to protect your assets and data.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {securityFeatures.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <feature.icon className="h-5 w-5 flex-none text-blue-400" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-16 border-t border-gray-800 pt-16">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-8">Trusted & Verified</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm">SSL Certificate Valid</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm">Smart Contract Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm">Security Audited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-sm">Open Source</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
