import React from 'react';
import { Mail, Shield, Scale, AlertTriangle, MessageSquare, Info } from 'lucide-react';

export function LegalContent({ type }) {
  const content = {
    about: {
      title: 'About FinEye',
      icon: Info,
      lastUpdated: 'December 31, 2025',
      sections: [
        {
          heading: 'Our Mission',
          text: 'FinEye is an educational platform dedicated to bringing transparency to mutual fund investing in India. We help investors observe where "Smart Money" is moving by analyzing public portfolio disclosures.'
        },
        {
          heading: 'What We Do',
          text: 'We process complex regulatory disclosures from various Asset Management Companies (AMCs) and present them in simple, easy-to-understand visualizations. Our tools help you track stock entries, exits, and favorites across the mutual fund industry.'
        },
        {
          heading: 'Why FinEye?',
          text: 'Investing shouldn\'t be a black box. By observing the collective actions of professional fund managers, individual investors can gain valuable insights into market trends and institutional sentiment.'
        }
      ]
    },
    privacy: {
      title: 'Privacy Policy',
      icon: Shield,
      lastUpdated: 'December 30, 2025',
      sections: [
        {
          heading: 'Data Collection',
          text: 'FinEye is built with privacy in mind. We do not require user accounts, nor do we collect personal information like names, addresses, or phone numbers. We use local browser storage only to save your preferences (like hiding the intro banner).'
        },
        {
          heading: 'Google AdSense & Cookies',
          text: 'We use Google AdSense to serve ads. Google uses cookies to serve ads based on a user\'s prior visits to our website or other websites. Google\'s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.'
        },
        {
          heading: 'Third-Party Analytics',
          text: 'We may use basic analytics tools to understand site traffic. These tools may collect non-identifiable information such as browser type, device type, and pages visited to help us improve the user experience.'
        }
      ]
    },
    terms: {
      title: 'Terms & Conditions',
      icon: Scale,
      lastUpdated: 'December 30, 2025',
      sections: [
        {
          heading: 'Usage of Service',
          text: 'FinEye provides data visualization tools for mutual fund portfolios. By using this site, you agree that the information provided is for educational purposes only.'
        },
        {
          heading: 'No Warranties',
          text: 'While we strive for 100% accuracy, the data is sourced from public disclosures which may contain errors. We provide this data "as is" without any express or implied warranties.'
        },
        {
          heading: 'Intellectual Property',
          text: 'The design, code, and custom visualizations of FinEye are protected by copyright. You may use the insights for personal learning but may not scrape or redistribute our processed data for commercial purposes.'
        }
      ]
    },
    disclaimer: {
      title: 'Disclaimer',
      icon: AlertTriangle,
      lastUpdated: 'December 30, 2025',
      sections: [
        {
          heading: 'Educational Purpose Only',
          text: 'FinEye is NOT a financial advisory service. We are not SEBI-registered investment advisors. All content on this website is for informational and educational purposes only.'
        },
        {
          heading: 'Not Investment Advice',
          text: 'The stock holdings, overlaps, and trends shown here should not be taken as a recommendation to buy or sell any security. Mutual fund investments are subject to market risks.'
        },
        {
          heading: 'Do Your Own Research',
          text: 'Always consult with a qualified financial professional before making any investment decisions. We do not guarantee any financial outcomes based on the use of our tools.'
        }
      ]
    },
    contact: {
      title: 'Contact Us',
      icon: MessageSquare,
      lastUpdated: 'December 30, 2025',
      sections: [
        {
          heading: 'Get in Touch',
          text: 'We value your feedback and questions. Whether you found a data discrepancy or have a feature suggestion, we\'d love to hear from you.'
        },
        {
          heading: 'Email Support',
          text: 'You can reach us directly at:',
          isEmail: true,
          email: 'fineyeinfo@gmail.com'
        },
        {
          heading: 'Response Time',
          text: 'We are a small team, but we aim to respond to all inquiries within 24 to 48 hours.'
        }
      ]
    }
  };

  const activeContent = content[type] || content.privacy;
  const Icon = activeContent.icon;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mx-1 sm:mx-0">
      <div className="bg-slate-50 border-b border-slate-200 p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-primary/10 p-3 rounded-xl text-primary">
            <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{activeContent.title}</h1>
            <p className="text-sm text-slate-500 font-medium">Last Updated: {activeContent.lastUpdated}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6 sm:p-8 space-y-8">
        {activeContent.sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary/20 rounded-full inline-block"></span>
              {section.heading}
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {section.text}
            </p>
            {section.isEmail && (
              <a 
                href={`mailto:${section.email}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors mt-2"
              >
                <Mail className="w-4 h-4" />
                {section.email}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
