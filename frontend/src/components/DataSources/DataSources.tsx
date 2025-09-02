import React from 'react';
import Page from '../Common/Page';

const DataSources: React.FC = () => {
  const sources = [
    { name: 'YouTube', desc: 'Live chat & comments', status: 'Connected' },
    { name: 'Twitter/X', desc: 'Tweets & threads', status: 'Not connected' },
    { name: 'Reddit', desc: 'Posts & comments', status: 'Connected' },
    { name: 'Twitch', desc: 'Chat stream', status: 'Not connected' },
    { name: 'Discord', desc: 'Server messages', status: 'Connected' },
  ];

  return (
    <Page
      title="Data Sources"
      subtitle="Connect platforms to start collecting multilingual data for real-time sentiment analysis."
      actions={
        <button className="px-4 py-2 border border-gray-900 text-gray-900 text-sm font-medium rounded-md hover:bg-gray-900 hover:text-white transition-colors">
          Add source
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sources.map((s) => (
          <div key={s.name} className="border border-gray-200 p-6 hover:border-gray-300 transition-colors cursor-pointer">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-xl font-light text-gray-900">{s.name}</div>
                <div className="text-sm text-gray-600">{s.desc}</div>
              </div>
              <span className={`text-xs px-2 py-1 border ${s.status === 'Connected' ? 'text-green-700 border-green-300 bg-green-50' : 'text-gray-700 border-gray-300 bg-gray-50'}`}>
                {s.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
};

export default DataSources;