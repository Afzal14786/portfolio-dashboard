import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Mail, FileText, BookOpen } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How do I create a new blog post?",
    answer: "Navigate to the 'Blogs' tab in the sidebar. Click 'Create Post' to open the Rich Text Editor. You can auto-save drafts or publish them immediately. Cover images are mandatory for published posts."
  },
  {
    question: "Why aren't my projects showing up on the public portfolio?",
    answer: "Ensure that you have set the project status to 'Completed' or 'In Progress' and have provided a valid cover image. The public frontend automatically syncs with your dashboard data."
  },
  {
    question: "How does the analytics dashboard work?",
    answer: "The analytics page aggregates data from your public portfolio interactions. It tracks page views, blog reads, likes, and comments. This data updates in real-time as visitors interact with your content."
  },
  {
    question: "How do I update my profile picture?",
    // Matching the functionality we built earlier
    answer: "Go to the 'Profile' tab, click 'Edit Profile', and you can upload a new avatar directly. The system supports JPG, PNG, and WebP formats up to 5MB."
  },
  {
    question: "What is the 'Journey' timeline used for?",
    answer: "The Journey module is designed to map out your educational and professional timeline. It acts as an interactive resume on your public portfolio. Add your BCA enrollment, course completions, and job experiences here."
  }
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <HelpCircle className="w-8 h-8 mr-3 text-blue-600" /> Help & Documentation
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Learn how to manage your portfolio and utilize the dashboard features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900">User Manual</h3>
          <p className="text-xs text-gray-500 mt-1">Official IGNOU project guidelines.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900">API Documentation</h3>
          <p className="text-xs text-gray-500 mt-1">View Swagger REST endpoints.</p>
        </div>
        <a href="mailto:admin@terminalx.com" className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center hover:border-blue-300 transition-colors cursor-pointer group">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900">Contact Support</h3>
          <p className="text-xs text-gray-500 mt-1">Email system administrator.</p>
        </a>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {faqs.map((faq, index) => (
            <div key={index} className="p-2">
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-xl transition-colors outline-none focus:ring-2 focus:ring-blue-100"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 ml-4" />
                )}
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="p-4 pt-0 text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}