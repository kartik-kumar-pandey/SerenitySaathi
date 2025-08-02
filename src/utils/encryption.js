import CryptoJS from 'crypto-js';

export const generateUserKey = (userId, userPassword) => {
  const keyMaterial = `${userId}_${userPassword}_serenitysaathi`;
  return CryptoJS.SHA256(keyMaterial).toString();
};

export const encryptMessage = (message, userKey) => {
  try {
    if (!message || !userKey) {
      return message;
    }
    
    const encrypted = CryptoJS.AES.encrypt(message, userKey).toString();
    return encrypted;
  } catch (error) {
    return message;
  }
};

export const decryptMessage = (encryptedMessage, userKey) => {
  try {
    if (!encryptedMessage || !userKey) {
      return encryptedMessage;
    }
    
    if (!encryptedMessage.includes('U2F')) {
      return encryptedMessage;
    }
    
    const decrypted = CryptoJS.AES.decrypt(encryptedMessage, userKey);
    const originalText = decrypted.toString(CryptoJS.enc.Utf8);
    
    return originalText || encryptedMessage;
  } catch (error) {
    return encryptedMessage;
  }
};

export const encryptMessages = (messages, userKey) => {
  return messages.map(msg => ({
    ...msg,
    text: encryptMessage(msg.text, userKey),
    isEncrypted: true
  }));
};

export const decryptMessages = (messages, userKey) => {
  return messages.map(msg => ({
    ...msg,
    text: decryptMessage(msg.text, userKey),
    isEncrypted: false
  }));
};

export const isEncrypted = (message) => {
  return message && message.includes('U2F');
}; 