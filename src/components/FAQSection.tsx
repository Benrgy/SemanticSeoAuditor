import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Is the SEO audit really free?',
      answer: 'Yes! Our basic SEO audit is completely free with no hidden costs. You can analyze any website without creating an account. For advanced features and detailed reports, we offer premium plans.'
    },
    {
      question: 'How accurate are the audit results?',
      answer: 'Our audit engine uses the latest SEO best practices and analyzes over 50 factors. The results are highly accurate and align with Google\'s ranking factors. However, SEO is complex and results should be combined with professional judgment.'
    },
    {
      question: 'Do I need to create an account?',
      answer: 'No account required for basic audits! Simply enter your URL and get instant results. Creating an account allows you to save audit history, upload files, and access advanced features.'
    },
    {
      question: 'What types of SEO issues do you detect?',
      answer: 'We analyze technical SEO (page speed, mobile-friendliness, crawlability), on-page SEO (titles, meta descriptions, headers), and semantic SEO (content quality, keyword optimization). Each issue comes with specific recommendations.'
    },
    {
      question: 'How does the click-to-call feature work?',
      answer: 'After your audit, you\'ll see a "Call Expert" button. Click it to instantly connect with certified SEO professionals who can provide personalized guidance based on your audit results.'
    },
    {
      question: 'Can I audit multiple websites?',
      answer: 'Yes! There\'s no limit on the number of websites you can audit. With a free account, you can track multiple sites and compare their performance over time.'
    },
    {
      question: 'How often should I run SEO audits?',
      answer: 'We recommend monthly audits for active websites or after making significant changes. Our dashboard makes it easy to track improvements and monitor SEO health over time.'
    },
    {
      question: 'What file types can I upload?',
      answer: 'You can upload XML sitemaps, robots.txt files, and JSON configuration files. These help us provide more comprehensive analysis of your website\'s SEO setup.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 anchor-target">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to know about our SEO auditor
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors focus:outline-none focus:bg-gray-700"
              >
                <span className="text-lg font-medium text-white">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <div className="text-gray-400 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            Still have questions?
          </p>
          <button className="text-blue-400 hover:text-blue-300 font-medium">
            Contact our support team
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;