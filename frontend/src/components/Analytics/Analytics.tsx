import React from 'react';
import Page from '../Common/Page';

const Analytics: React.FC = () => {
  return (
    <Page
      title="Analytics"
      subtitle="Explore performance metrics, trends, and insights from your sentiment pipelines."
      actions={
        <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-black transition-colors">
          Export report
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Stat cards */}
        {[{ label: 'Total Analyses', value: '124,582' }, { label: 'Avg. Confidence', value: '92.4%' }, { label: 'Processing Time', value: '480ms' }].map((s) => (
          <div key={s.label} className="border border-gray-200 p-6 hover:border-gray-300 transition-colors">
            <div className="text-sm text-gray-500">{s.label}</div>
            <div className="mt-2 text-3xl font-light text-gray-900">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Placeholder chart areas */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-gray-200 p-6 h-80">
          <div className="text-sm text-gray-500 mb-2">Sentiment over time</div>
          <div className="w-full h-full bg-gray-50" />
        </div>
        <div className="border border-gray-200 p-6 h-80">
          <div className="text-sm text-gray-500 mb-2">Sources distribution</div>
          <div className="w-full h-full bg-gray-50" />
        </div>
      </div>
    </Page>
  );
};

export default Analytics;