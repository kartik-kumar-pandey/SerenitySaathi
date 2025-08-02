import React from 'react';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';

const PrivacyIndicator = ({ isEncrypted = true, encryptionLevel = 'AES-256' }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
          <Lock className="w-5 h-5 text-green-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-sm">Message Encryption</h3>
          <p className="text-white/70 text-xs">
            {isEncrypted 
              ? `Your messages are encrypted with ${encryptionLevel} before storage`
              : 'Messages are stored in plain text'
            }
          </p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          isEncrypted 
            ? 'bg-green-500/20 text-green-300 border border-green-400/30'
            : 'bg-red-500/20 text-red-300 border border-red-400/30'
        }`}>
          {isEncrypted ? 'Secure' : 'Unsecured'}
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>Data Storage</span>
          <span className="flex items-center space-x-1">
            <Shield className="w-3 h-3" />
            <span>Supabase (Encrypted)</span>
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-white/60 mt-1">
          <span>Access Control</span>
          <span className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>User-Only</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PrivacyIndicator; 