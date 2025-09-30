# Semantic SEO Auditor

A comprehensive SaaS tool for analyzing websites' technical, on-page, and semantic SEO performance. Built with React, TypeScript, Vite, and Supabase.

## 🚀 Features

- **Instant SEO Audits** - No signup required for basic audits
- **Comprehensive Analysis** - Technical, on-page, and semantic SEO evaluation
- **AI-Powered Insights** - Semantic analysis using OpenAI GPT-4
- **User Dashboard** - Track audit history and improvements
- **File Management** - Upload sitemaps, robots.txt, and other SEO files
- **Click-to-Call Support** - Instant expert consultation
- **Real-time Notifications** - Email and in-app alerts
- **Professional UI** - Dark theme with responsive design

## 🎯 Target Users

- **Solopreneurs** - Quick SEO health checks for small businesses
- **Digital Marketers** - Fast client reporting and analysis
- **Startups** - Validate SEO during growth phases
- **Freelancers** - Lightweight tool for multiple clients
- **Small Business Owners** - Easy-to-understand SEO insights

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions)
- **AI Integration**: OpenAI GPT-4 for semantic analysis
- **Deployment**: Vercel/Netlify
- **Database**: PostgreSQL (via Supabase)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key (optional, for enhanced semantic analysis)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd semantic-seo-auditor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the migration file in `supabase/migrations/create_initial_schema.sql`
   - Enable Row Level Security (RLS) policies

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

### Core Tables

- **audits** - SEO audit requests and results
- **notifications** - User notification preferences and history  
- **usage_analytics** - User behavior and event tracking

### Key Features

- Row Level Security (RLS) for data protection
- Anonymous audit support (no user_id required)
- GDPR-compliant data handling
- Performance-optimized indexes

## 🔧 Configuration

### Supabase Setup

1. **Authentication**
   - Enable email/password authentication
   - Configure email templates (optional)

2. **Database**
   - Run migration scripts from `supabase/migrations/`
   - Verify RLS policies are active

3. **Edge Functions** (Optional)
   - Deploy semantic analysis function for AI-powered insights
   - Configure OpenAI API key in function environment

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `OPENAI_API_KEY` | OpenAI API key for semantic analysis | No |
| `ANTHROPIC_API_KEY` | Alternative AI provider | No |

## 📊 Analytics & Monitoring

The application tracks key user events:

- **User Actions**: Signups, logins, audits started/completed
- **Performance Metrics**: Audit completion times, error rates
- **Business Metrics**: Click-to-call events, email conversions

## 🔒 Security

- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: Row Level Security (RLS) policies
- **Data Protection**: HTTPS, secure headers, input validation
- **Privacy**: GDPR-compliant data handling

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on git push**

### Netlify

1. **Connect repository to Netlify**
2. **Configure build settings**: 
   - Build command: `npm run build:netlify`
   - Publish directory: `dist/`
3. **Set environment variables in Netlify dashboard**
4. **Edge Functions will automatically optimize SEO for crawlers**

## 📈 Performance Targets

- **Audit Speed**: < 3 seconds for standard websites
- **Uptime**: 99.9% availability
- **User Experience**: < 2 second page load times
- **Conversion**: > 10% signup rate from free audits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Link to docs]
- **Email**: support@seoauditor.com
- **Phone**: +1-555-SEO-HELP
- **Issues**: GitHub Issues tab

## 🗺️ Roadmap

- [ ] Advanced semantic analysis with multiple AI providers
- [ ] Competitor analysis features
- [ ] White-label solutions for agencies
- [ ] Mobile app for iOS/Android
- [ ] API access for developers
- [ ] Advanced reporting and exports

---

Built with ❤️ for the SEO community