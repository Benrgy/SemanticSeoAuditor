import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What makes this SEO audit tool different?',
      answer: 'Our tool provides enterprise-grade analysis covering 200+ SEO factors including AI optimization, geo-targeting, competitive intelligence, and advanced technical metrics - all completely free without signup requirements.'
    },
    {
      question: 'Does it analyze for AI Overviews and voice search?',
      answer: 'Yes! We provide comprehensive AI optimization analysis including featured snippet potential, voice search readiness, entity optimization, and knowledge graph presence to help you rank in Google AI Overviews.'
    },
    {
      question: 'What geographic and international SEO features are included?',
      answer: 'We analyze hreflang implementation, local SEO optimization, target country identification, and provide recommendations for international SEO strategy and geo-targeting improvements.'
    },
    {
      question: 'How comprehensive is the competitive analysis?',
      answer: 'Our competitive analysis includes market position assessment, estimated traffic analysis, domain authority scoring, backlink profile evaluation, content gap identification, and keyword opportunity discovery.'
    },
    {
      question: 'What advanced technical metrics do you analyze?',
      answer: 'We provide PageSpeed Insights for desktop and mobile, Core Web Vitals analysis, image optimization assessment, crawlability analysis, security evaluation, and comprehensive technical issue detection.'
    },
    {
      question: 'How does the content quality analysis work?',
      answer: 'Our AI analyzes content for E-A-T factors (Expertise, Authoritativeness, Trustworthiness), uniqueness, keyword density, semantic relevance, and identifies keyword cannibalization issues.'
    },
    {
      question: 'Is there really no signup required?',
      answer: 'Absolutely! No registration, no email required, no hidden costs. Simply enter your URL and get instant, comprehensive SEO analysis. This tool is completely free to use forever.'
    },
    {
      question: 'How accurate and up-to-date is the analysis?',
      answer: 'Our analysis engine uses the latest SEO best practices and Google ranking factors. We continuously update our algorithms to reflect current SEO standards and search engine algorithm changes.'
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