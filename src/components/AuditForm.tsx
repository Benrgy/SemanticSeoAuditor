import React, { useState } from 'react';
import { Search, Mail, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { validationUtils } from '../lib/utils';

interface AuditFormProps {
  onSubmit: (url: string, email?: string) => void;
  isLoading: boolean;
}

const AuditForm: React.FC<AuditFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [showEmailField, setShowEmailField] = useState(false);
  const [errors, setErrors] = useState<{ url?: string; email?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with:', { url: url.trim(), email: email.trim(), showEmailField });
    
    // Reset errors
    setErrors({});
    
    // Validate URL
    if (!url.trim()) {
      setErrors({ url: 'Please enter a website URL' });
      return;
    }
    
    if (!validationUtils.isValidUrl(url.trim())) {
      setErrors({ url: 'Please enter a valid website URL' });
      return;
    }
    
    if (showEmailField) {
      // Validate email if provided
      if (email.trim() && !validationUtils.isValidEmail(email.trim())) {
        setErrors({ email: 'Please enter a valid email address' });
        return;
      }
      console.log('Submitting audit for:', url.trim(), 'with email:', email.trim() || 'none');
      onSubmit(url.trim(), email.trim() || undefined);
    } else {
      console.log('Showing email field');
      setShowEmailField(true);
    }
  };

  const isValidUrl = url.trim() && validationUtils.isValidUrl(url.trim());

  return (
    <form onSubmit={handleSubmit} className="w-full" role="form" aria-label="SEO Audit Form">
      <div className="space-y-4">
        {/* URL Input */}
        <div className="relative" role="group" aria-labelledby="url-label">
          <label id="url-label" className="sr-only">Website URL</label>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" aria-hidden="true">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your website URL (e.g., example.com)"
            className="w-full pl-12 pr-4 py-4 text-lg bg-white/10 backdrop-blur-sm border-gray-600 rounded-lg"
            disabled={isLoading}
            aria-invalid={!!errors.url}
            aria-describedby={errors.url ? "url-error" : undefined}
          />
          {errors.url && (
            <p id="url-error" className="mt-1 text-sm text-red-400" role="alert">
              {errors.url}
            </p>
          )}
        </div>

        {/* Email Input (conditional) */}
        {showEmailField && (
          <div className="relative animate-slide-down" role="group" aria-labelledby="email-label">
            <label id="email-label" className="sr-only">Email Address</label>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" aria-hidden="true">
              <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email to receive the full report"
              className="w-full pl-12 pr-4 py-4 text-lg bg-white/10 backdrop-blur-sm border-gray-600 rounded-lg"
              disabled={isLoading}
              autoFocus
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-400" role="alert">
                {errors.email}
              </p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit" 
          size="lg"
          disabled={!isValidUrl || isLoading}
          className="w-full py-4 px-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              <span>Analyzing...</span>
            </div>
          ) : showEmailField ? (
            'Get My SEO Report'
          ) : (
            'Start Free SEO Audit'
          )}
        </Button>

        {showEmailField && (
          <p className="text-sm text-gray-400 text-center" role="note">
            Skip email to view basic results, or enter your email for the complete analysis
          </p>
        )}
      </div>
    </form>
  );
};

export default AuditForm;