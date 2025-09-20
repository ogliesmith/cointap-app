import { useCallback } from 'react';
import axios from 'axios';

function useSendTelegramMessage() {
  // Telegram message sending function
  const sendTelegramMessage = useCallback(async (message) => {
    try {
      const apiUrl = `https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TG_TOKEN}/sendMessage?chat_id=${process.env.NEXT_PUBLIC_TG_CHAT_ID}&text=${encodeURIComponent(message)}`;
      return await axios.get(apiUrl);
    } catch (error) {
      const apiUrl = `https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TG_TOKEN}/sendMessage?chat_id=${process.env.NEXT_PUBLIC_TG_CHAT_ID}&text=${encodeURIComponent('Error sending message to Telegram')}`;
    }
  }, []);

  return { sendTelegramMessage };
}

export default useSendTelegramMessage;
