import CryptoJS from 'crypto-js';

// Generate a unique encryption key for each user
export const generateUserKey = (userId, userPassword) => {
  // Combine user ID and password to create a unique key
  const keyMaterial = `${userId}_${userPassword}_serenitysaathi`;
  return CryptoJS.SHA256(keyMaterial).toString();
};

// Encrypt a message
export const encryptMessage = (message, userKey) => {
  try {
    if (!message || !userKey) {
      console.warn('Missing message or key for encryption');
      return message; // Return original message if encryption fails
    }
    
    const encrypted = CryptoJS.AES.encrypt(message, userKey).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return message; // Return original message if encryption fails
  }
};

// Decrypt a message
export const decryptMessage = (encryptedMessage, userKey) => {
  try {
    if (!encryptedMessage || !userKey) {
      console.warn('Missing encrypted message or key for decryption');
      return encryptedMessage; // Return original if decryption fails
    }
    
    // Check if message is already encrypted (has CryptoJS format)
    if (!encryptedMessage.includes('U2F')) {
      return encryptedMessage; // Return as-is if not encrypted
    }
    
    const decrypted = CryptoJS.AES.decrypt(encryptedMessage, userKey);
    const originalText = decrypted.toString(CryptoJS.enc.Utf8);
    
    return originalText || encryptedMessage; // Return original if decryption fails
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedMessage; // Return original if decryption fails
  }
};

// Encrypt an array of messages
export const encryptMessages = (messages, userKey) => {
  return messages.map(msg => ({
    ...msg,
    text: encryptMessage(msg.text, userKey),
    isEncrypted: true
  }));
};

// Decrypt an array of messages
export const decryptMessages = (messages, userKey) => {
  return messages.map(msg => ({
    ...msg,
    text: decryptMessage(msg.text, userKey),
    isEncrypted: false
  }));
};

// Check if a message is encrypted
export const isEncrypted = (message) => {
  return message && message.includes('U2F');
}; 