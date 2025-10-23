import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-gray-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
              <p className="text-gray-300 mb-4">
                Our SEO Auditor tool is designed to be privacy-first. We collect minimal information:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Website URLs you submit for analysis (temporarily processed, not stored)</li>
                <li>Basic analytics data (page views, usage patterns) - anonymized</li>
                <li>Technical data necessary for the audit (publicly available website information)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-300 mb-4">
                We use the collected information solely to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Provide SEO analysis and recommendations</li>
                <li>Improve our service quality and performance</li>
                <li>Generate anonymous usage statistics</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. Data Storage and Security</h2>
              <p className="text-gray-300 mb-4">
                We prioritize your privacy and security:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Website URLs are processed in real-time and not permanently stored</li>
                <li>All data transmission is encrypted using HTTPS</li>
                <li>We use industry-standard security measures to protect any temporary data</li>
                <li>No personal information is required to use our service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Third-Party Services</h2>
              <p className="text-gray-300 mb-4">
                Our service may use third-party tools for:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Website analysis and SEO scoring</li>
                <li>Anonymous analytics (Google Analytics with IP anonymization)</li>
                <li>Content delivery and performance optimization</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Cookies and Tracking</h2>
              <p className="text-gray-300 mb-4">
                We use minimal cookies for:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Essential website functionality</li>
                <li>Anonymous usage analytics</li>
                <li>Performance optimization</li>
              </ul>
              <p className="text-gray-300">
                You can disable cookies in your browser settings, though this may affect functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights</h2>
              <p className="text-gray-300 mb-4">
                Since we don't store personal data, there's minimal data to manage. However, you have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Use our service without providing personal information</li>
                <li>Clear your browser data at any time</li>
                <li>Opt out of analytics tracking</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">7. Changes to This Policy</h2>
              <p className="text-gray-300">
                We may update this privacy policy from time to time. Any changes will be posted on this page 
                with an updated revision date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">8. Contact</h2>
              <p className="text-gray-300">
                This is a free tool provided as-is. For technical issues, please check our FAQ section 
                or submit feedback through the tool interface.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;