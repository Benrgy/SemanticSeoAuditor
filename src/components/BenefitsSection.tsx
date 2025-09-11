import React from 'react';
import { DollarSign, TrendingUp, Users, Award } from 'lucide-react';

const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: <DollarSign className="h-12 w-12" />,
      title: 'Save Money',
      description: 'Free SEO audits save you hundreds compared to hiring agencies or expensive tools.',
      stat: '90% Cost Savings'
    },
    {
      icon: <TrendingUp className="h-12 w-12" />,
      title: 'Boost Rankings',
      description: 'Actionable insights help improve your search rankings and organic traffic.',
      stat: '150% Traffic Increase'
    },
    {
      icon: <Users className="h-12 w-12" />,
      title: 'Expert Support',
      description: 'Access to real SEO experts whenever you need guidance or consultation.',
      stat: '24/7 Support'
    },
    {
      icon: <Award className="h-12 w-12" />,
      title: 'Proven Results',
      description: 'Trusted by thousands of businesses to improve their online presence.',
      stat: '10,000+ Audits'
    }
  ];

  return (
    <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose Our SEO Auditor?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Join thousands of businesses that have improved their SEO performance with our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full text-white mb-6 group-hover:bg-blue-500 transition-colors">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                {benefit.description}
              </p>
              <div className="text-2xl font-bold text-blue-400">
                {benefit.stat}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Boost Your SEO?
            </h3>
            <p className="text-blue-100 mb-6 text-lg">
              Get your free SEO audit now and start improving your search rankings today
            </p>
            <a
              href="#"
              className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors transform hover:scale-105"
            >
              Start Free Audit Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;