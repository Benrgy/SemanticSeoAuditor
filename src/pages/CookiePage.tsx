import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CookiePage: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-white mb-8">Cookie Policy</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. What Are Cookies</h2>
              <p className="text-gray-300">
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better experience and understand how our service is used.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Cookies</h2>
              <p className="text-gray-300 mb-4">
                Our SEO Auditor uses cookies for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand usage patterns (anonymized)</li>
                <li><strong>Performance Cookies:</strong> Optimize loading times and user experience</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. Types of Cookies We Use</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">Essential Cookies</h3>
                <p className="text-gray-300 mb-2">
                  These cookies are necessary for the website to function properly:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Session management</li>
                  <li>Security features</li>
                  <li>Basic functionality</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">Analytics Cookies</h3>
                <p className="text-gray-300 mb-2">
                  These help us understand how visitors use our site:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Page views and user interactions</li>
                  <li>Popular features and content</li>
                  <li>Error tracking and performance monitoring</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">Performance Cookies</h3>
                <p className="text-gray-300 mb-2">
                  These cookies help improve site performance:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Caching preferences</li>
                  <li>Load time optimization</li>
                  <li>Resource management</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Third-Party Cookies</h2>
              <p className="text-gray-300 mb-4">
                We may use third-party services that set their own cookies:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>Google Analytics:</strong> For anonymous usage statistics</li>
                <li><strong>CDN Services:</strong> For faster content delivery</li>
                <li><strong>Security Services:</strong> For protection against abuse</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Managing Cookies</h2>
              <p className="text-gray-300 mb-4">
                You have control over cookies:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>Browser Settings:</strong> Most browsers allow you to control cookies</li>
                <li><strong>Opt-Out:</strong> You can disable non-essential cookies</li>
                <li><strong>Clear Cookies:</strong> Delete existing cookies at any time</li>
              </ul>
              <p className="text-gray-300 mt-4">
                <strong>Note:</strong> Disabling essential cookies may affect website functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Cookie Retention</h2>
              <p className="text-gray-300 mb-4">
                Different cookies have different lifespans:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain for a set period (usually 1-2 years)</li>
                <li><strong>Analytics Cookies:</strong> Typically expire after 2 years</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">7. Updates to This Policy</h2>
              <p className="text-gray-300">
                We may update this cookie policy from time to time to reflect changes in our practices 
                or for legal reasons. Please check this page periodically for updates.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">8. More Information</h2>
              <p className="text-gray-300">
                For more information about cookies and how to manage them, visit:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-1 mt-2">
                <li><a href="https://www.allaboutcookies.org" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">All About Cookies</a></li>
                <li><a href="https://www.youronlinechoices.com" className="text-blue-400 hover:text-blue-300" target="_blank" rel="noopener noreferrer">Your Online Choices</a></li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePage;