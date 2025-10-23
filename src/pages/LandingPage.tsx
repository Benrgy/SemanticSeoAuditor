import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import AuditForm from '../components/AuditForm';
import FeatureSection from '../components/FeatureSection';
import BenefitsSection from '../components/BenefitsSection';
import HowItWorksSection from '../components/HowItWorksSection';
import FAQSection from '../components/FAQSection';
import UserPersonas from '../components/UserPersonas';
import Footer from '../components/Footer';
import { runSEOAudit } from '../services/auditService';

const LandingPage: React.FC = () => {
  const [isAuditing, setIsAuditing] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const { user } = useAuth();

  const handleAuditSubmit = async (url: string, email?: string) => {
    setIsAuditing(true);
    
    console.log('Starting audit for:', url, 'Email:', email || 'none', 'User:', user?.id || 'anonymous');
    
    try {
      const auditResult = await runSEOAudit(url, email, user?.id);
      console.log('Audit completed:', auditResult);
      addNotification('success', 'SEO audit completed successfully!');
      navigate(`/audit/${auditResult.id}`);
    } catch (error) {
      console.error('Audit failed:', error);
      addNotification('error', `Failed to run SEO audit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="hero" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 anchor-target">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Semantic SEO Auditor
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Fast, Free, No Signup Needed - Get instant SEO insights and actionable recommendations
          </p>
          
          <div className="max-w-2xl mx-auto">
            <AuditForm onSubmit={handleAuditSubmit} isLoading={isAuditing} />
          </div>

          <p className="text-sm text-gray-400 mt-4">
            ⚡ Results in under 3 seconds • 🎯 Technical, On-Page & Semantic Analysis • 📞 Click-to-call expert support
          </p>
        </div>
      </section>

      <FeatureSection />
      <BenefitsSection />
      <UserPersonas />
      <HowItWorksSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default LandingPage;