import React from 'react';
import { Zap, Brain, Phone, Shield, BarChart, Clock } from 'lucide-react';

const FeatureSection: React.FC = () => {
  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Advanced SEO Intelligence',
      description: 'AI-powered analysis covering 50+ SEO factors including Core Web Vitals, semantic optimization, and competitive insights.'
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'Geographic & International SEO',
      description: 'Comprehensive geo-targeting analysis, hreflang implementation, and local SEO optimization recommendations.'
    },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: 'AI Overview Optimization',
      description: 'Optimize for Google AI Overviews, featured snippets, voice search, and knowledge graph presence.'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Competitive Intelligence',
      description: 'Market position analysis, competitor comparison, backlink profiles, and keyword opportunity identification.'
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Advanced Technical Metrics',
      description: 'PageSpeed Insights, image optimization, crawlability analysis, security assessment, and performance monitoring.'
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'Content Quality Analysis',
      description: 'E-A-T assessment, content uniqueness, keyword cannibalization detection, and semantic keyword analysis.'
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