import React from 'react';
import { Users, Target, Briefcase, Laptop, Store } from 'lucide-react';

const UserPersonas: React.FC = () => {
  const personas = [
    {
      icon: <Users className="h-8 w-8" />,
      name: "Solopreneur Sam",
      demographics: "30-45, owns small online business",
      goals: "Quick SEO audit, improve search rankings",
      painPoints: "Limited budget, little SEO knowledge",
      color: "text-blue-400"
    },
    {
      icon: <Target className="h-8 w-8" />,
      name: "Digital Marketer Dana",
      demographics: "25-40, agency or freelancer",
      goals: "Deliver fast actionable SEO reports to clients",
      painPoints: "Complex tools, time-consuming audits",
      color: "text-green-400"
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      name: "Startup Steve",
      demographics: "22-35, tech startup founder",
      goals: "Validate website SEO health during growth phases",
      painPoints: "Needs real-time, accurate data, minimal setup",
      color: "text-purple-400"
    },
    {
      icon: <Laptop className="h-8 w-8" />,
      name: "Freelancer Fiona",
      demographics: "28-50, remote SEO consultant",
      goals: "Use lightweight tools for multiple clients",
      painPoints: "Multiple logins, expensive SaaS subscriptions",
      color: "text-yellow-400"
    },
    {
      icon: <Store className="h-8 w-8" />,
      name: "Small Business Owner Olivia",
      demographics: "35-55, local services",
      goals: "Understand and fix SEO issues without expert help",
      painPoints: "Lack of technical skill, intimidation by complex UIs",
      color: "text-red-400"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Built for SEO Professionals & Business Owners
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our tool is designed specifically for the needs of different user types in the SEO ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {personas.map((persona, index) => (
            <div
              key={index}
              className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors duration-300"
            >
              <div className={`${persona.color} mb-4`}>
                {persona.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {persona.name}
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400 font-medium">Demographics:</span>
                  <p className="text-gray-300">{persona.demographics}</p>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">Goals:</span>
                  <p className="text-gray-300">{persona.goals}</p>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">Pain Points:</span>
                  <p className="text-gray-300">{persona.painPoints}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            No matter your background, our tool adapts to your needs
          </p>
          <div className="inline-flex items-center space-x-4 text-sm text-gray-500">
            <span>✓ No technical expertise required</span>
            <span>✓ Instant results</span>
            <span>✓ Expert support available</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserPersonas;