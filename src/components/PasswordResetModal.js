import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Lock, Shield, CheckCircle } from 'lucide-react';
import { useSupabaseAuthContext } from '../contexts/SupabaseAuthContext';

const PasswordResetModal = ({ isOpen, onClose }) => {
  const { updatePassword, isLoading, error } = useSupabaseAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await updatePassword(formData.password);
      setSuccess(true);
      
      // Close the modal immediately after successful password update
      setTimeout(() => {
        handleClose();
      }, 1000); // Just a brief moment to show success
    } catch (error) {
      console.error('Password update error:', error);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setFormData({ password: '', confirmPassword: '' });
      setErrors({});
      setSuccess(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
                 <motion.div
           initial={{ scale: 0.9, opacity: 0, y: 20 }}
           animate={{ scale: 1, opacity: 1, y: 0 }}
           exit={{ scale: 0.9, opacity: 0, y: 20 }}
           className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200"
         >
                     {/* Header */}
           <div className="flex items-center justify-between p-6 border-b border-gray-200">
             <div className="flex items-center space-x-3">
               <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-amber-500 rounded-full flex items-center justify-center">
                 <Shield className="w-5 h-5 text-white" />
               </div>
               <h2 className="text-xl font-bold text-gray-800">Reset Your Password</h2>
             </div>
                         <motion.button
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
               onClick={handleClose}
               disabled={isLoading}
               className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors disabled:opacity-50"
             >
               <X className="w-5 h-5" />
             </motion.button>
          </div>

          {/* Content */}
          <div className="p-6">
            {!success ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                                     <h3 className="text-lg font-semibold text-gray-800 mb-2">
                     Set New Password
                   </h3>
                   <p className="text-gray-600 text-sm">
                     Please enter your new password below. Make sure it's secure and easy to remember.
                   </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                                         <label className="block text-sm font-medium text-gray-700 mb-2">
                       New Password
                     </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                             <input
                         type={showPassword ? 'text' : 'password'}
                         name="password"
                         value={formData.password}
                         onChange={handleInputChange}
                         className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                           errors.password ? 'border-red-500' : 'border-gray-300'
                         } bg-white text-gray-900 placeholder-gray-500`}
                         placeholder="Enter new password"
                         style={{ 
                           WebkitTextSecurity: showPassword ? 'none' : 'disc'
                         }}
                       />
                                             <button
                         type="button"
                         onClick={() => setShowPassword(!showPassword)}
                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                       >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                  </div>

                  <div>
                                         <label className="block text-sm font-medium text-gray-700 mb-2">
                       Confirm New Password
                     </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                             <input
                         type={showConfirmPassword ? 'text' : 'password'}
                         name="confirmPassword"
                         value={formData.confirmPassword}
                         onChange={handleInputChange}
                         className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                           errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                         } bg-white text-gray-900 placeholder-gray-500`}
                         placeholder="Confirm new password"
                         style={{ 
                           WebkitTextSecurity: showConfirmPassword ? 'none' : 'disc'
                         }}
                       />
                                             <button
                         type="button"
                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                       >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                                     {error && (
                     <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                       <p className="text-red-600 text-sm">{error}</p>
                     </div>
                   )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-amber-500 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        <span>Update Password</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                                 <h3 className="text-lg font-semibold text-gray-800 mb-2">
                   Password Updated!
                 </h3>
                 <p className="text-gray-600 text-sm mb-6">
                   Your password has been successfully updated. You can now sign in with your new password.
                 </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="w-full bg-gradient-to-r from-blue-500 to-amber-500 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Continue
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PasswordResetModal; 