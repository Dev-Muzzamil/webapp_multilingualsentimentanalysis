import React from 'react';

const Page = ({ title, subtitle, actions, children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzlDOTJBQyIgZmlsbC1vcGFjaXR5PSIwLjAzIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiI+PC9jaXJjbGU+CjwvZz4KPC9nPgo8L3N2Zz4=')] opacity-40"></div>
      
      <div className="relative">
        {/* Header Section */}
        <section className="px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between">
              <div className="pr-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {title}
                  </span>
                </h1>
                {subtitle && (
                  <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">{subtitle}</p>
                )}
              </div>
              {actions && (
                <div className="flex-shrink-0 flex items-center gap-3">{actions}</div>
              )}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-7xl mx-auto">{children}</div>
        </section>
      </div>
    </div>
  );
};

export default Page;