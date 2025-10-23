import React from 'react';
import { Zap, Brain, Phone, Shield, BarChart, Clock } from 'lucide-react';

const FeatureSection: React.FC = () => {
  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Lightning Fast Analysis',
      description: 'Get comprehensive SEO reports in under 3 seconds with our optimized analysis engine.'
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'AI-Powered Semantic Analysis',
      description: 'Advanced semantic SEO analysis using cutting-edge AI to understand content context and relevance.'
    },
    {
      icon: <Phone className="h-8 w-8" />,
      title: 'Instant Expert Support',
      description: 'Click-to-call feature connects you instantly with SEO experts for personalized guidance.'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'No Signup Required',
      description: 'Start auditing immediately without creating an account. Your privacy is our priority.'
    },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: 'Comprehensive Reports',
      description: 'Technical, on-page, and semantic SEO analysis with actionable recommendations.'
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Real-time Monitoring',
      description: 'Track your SEO improvements over time with detailed historical data and trends.'
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800 anchor-target">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powerful Features for SEO Success
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to analyze, understand, and improve your website's SEO performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors duration-300 hover:transform hover:scale-105"
            >
              <div className="text-blue-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;