import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsPage: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-white mb-8">Terms of Service</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300">
                By using our SEO Auditor tool, you agree to these terms of service. If you do not agree 
                with any part of these terms, please do not use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p className="text-gray-300 mb-4">
                Our SEO Auditor is a free web-based tool that provides:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Technical SEO analysis of websites</li>
                <li>On-page SEO recommendations</li>
                <li>Semantic SEO insights</li>
                <li>Performance and accessibility assessments</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. Free Service</h2>
              <p className="text-gray-300">
                This tool is provided completely free of charge. There are no hidden fees, subscriptions, 
                or premium features. We do not require account creation or personal information to use the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibent text-white mb-4">4. Acceptable Use</h2>
              <p className="text-gray-300 mb-4">
                You agree to use our service responsibly:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Only analyze websites you own or have permission to analyze</li>
                <li>Do not attempt to overload or abuse our systems</li>
                <li>Do not use the service for illegal or harmful purposes</li>
                <li>Respect rate limits and fair usage policies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Limitations and Disclaimers</h2>
              <p className="text-gray-300 mb-4">
                Please understand that:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>SEO recommendations are suggestions, not guarantees</li>
                <li>Results may vary based on many factors beyond our control</li>
                <li>We do not guarantee specific ranking improvements</li>
                <li>The service is provided "as-is" without warranties</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Intellectual Property</h2>
              <p className="text-gray-300">
                The SEO Auditor tool, its design, and underlying technology are our intellectual property. 
                You may use the service but may not copy, modify, or redistribute our code or algorithms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-300">
                We provide this tool free of charge and cannot be held liable for any damages, losses, 
                or issues arising from its use. Use the service at your own risk and discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">8. Service Availability</h2>
              <p className="text-gray-300">
                While we strive for high availability, we cannot guarantee uninterrupted service. 
                We may perform maintenance, updates, or temporarily suspend the service as needed.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">9. Changes to Terms</h2>
              <p className="text-gray-300">
                We may update these terms from time to time. Continued use of the service after 
                changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">10. Termination</h2>
              <p className="text-gray-300">
                We reserve the right to terminate or restrict access to our service for users who 
                violate these terms or abuse the system.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">11. Governing Law</h2>
              <p className="text-gray-300">
                These terms are governed by applicable laws. Any disputes will be resolved through 
                appropriate legal channels.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;