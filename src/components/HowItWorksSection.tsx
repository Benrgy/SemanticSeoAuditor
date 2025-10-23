import React from 'react';
import { Globe, Search, TrendingUp } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: 1,
      icon: <Globe className="h-12 w-12" />,
      title: 'Enter Your URL',
      description: 'Simply paste your website URL into our audit tool. No signup required to get started.'
    },
    {
      step: 2,
      icon: <Search className="h-12 w-12" />,
      title: 'Get Instant Analysis',
      description: 'Our AI-powered engine analyzes your site in under 3 seconds, checking technical, on-page, and semantic SEO.'
    },
    {
      step: 3,
      icon: <TrendingUp className="h-12 w-12" />,
      title: 'Implement & Improve',
      description: 'Follow our actionable recommendations to boost your SEO. Call our experts anytime for guidance.'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800 anchor-target">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Get professional SEO insights in three simple steps
          </p>
        </div>

        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 transform -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                {/* Step Number */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white text-xl font-bold rounded-full mb-6 relative z-10">
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className="text-blue-400 mb-4 flex justify-center">
                  {step.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed max-w-sm mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-700 rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-400 mb-2">3s</div>
              <div className="text-sm text-gray-400">Average analysis time</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
              <div className="text-sm text-gray-400">SEO factors analyzed</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
              <div className="text-sm text-gray-400">Free to use</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;