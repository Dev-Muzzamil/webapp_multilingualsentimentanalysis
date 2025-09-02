import React from 'react';

interface PageProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ title, subtitle, actions, children }) => {
  return (
    <div className="min-h-screen bg-white">
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between py-10 border-b border-gray-200">
            <div className="pr-6">
              <h1 className="text-3xl md:text-5xl font-light text-gray-900 tracking-tight">{title}</h1>
              {subtitle && (
                <p className="mt-4 text-lg text-gray-600 max-w-3xl">{subtitle}</p>
              )}
            </div>
            {actions && (
              <div className="flex-shrink-0 flex items-center gap-3">{actions}</div>
            )}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-10">{children}</div>
      </section>
    </div>
  );
};

export default Page;
