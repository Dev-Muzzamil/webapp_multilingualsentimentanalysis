import React from 'react';
import Page from '../Common/Page';

const RealTimeMonitor: React.FC = () => {
  return (
    <Page
      title="Real-time Monitor"
      subtitle="Track live streams and social channels with instant multilingual sentiment analysis."
      actions={
        <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-black transition-colors">
          Start stream
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-gray-200 p-6 h-96">
          <div className="text-sm text-gray-500 mb-2">Live feed</div>
          <div className="w-full h-full bg-gray-50" />
        </div>
        <div className="border border-gray-200 p-6">
          <div className="text-sm text-gray-500 mb-2">Current sentiment</div>
          <div className="space-y-4">
            {[{label:'Positive', color:'bg-green-500', w:'w-2/3', v:'68%'}, {label:'Neutral', color:'bg-gray-400', w:'w-1/5', v:'22%'}, {label:'Negative', color:'bg-red-500', w:'w-1/6', v:'10%'}].map((r) => (
              <div key={r.label}>
                <div className="flex items-center justify-between text-sm text-gray-600"><span>{r.label}</span><span className="font-medium text-gray-900">{r.v}</span></div>
                <div className="w-full bg-gray-100 h-2"><div className={`${r.color} h-2 ${r.w}`}></div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
};

export default RealTimeMonitor;