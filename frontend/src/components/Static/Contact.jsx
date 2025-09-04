import React from 'react';

const Contact = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">Get in touch</h1>
      <p className="text-lg text-gray-600 mb-12">
        Interested in collaborations, integrations, or have questions about our platform? Drop us a line and we'll get back to you.
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4 text-gray-800">
          <div>
            <div className="text-sm text-gray-500">Email</div>
            <a className="text-gray-900 underline" href="mailto:hello@example.com">hello@example.com</a>
          </div>
          <div>
            <div className="text-sm text-gray-500">LinkedIn</div>
            <a className="text-gray-900 underline" href="#">Company Profile</a>
          </div>
          <div>
            <div className="text-sm text-gray-500">Address</div>
            <div>Remote-first • Worldwide</div>
          </div>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Name</label>
            <input className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Email</label>
            <input type="email" className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Message</label>
            <textarea rows={4} className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="Tell us about your project" />
          </div>
          <button type="button" className="px-6 py-3 bg-gray-900 text-white rounded-none hover:bg-gray-800 transition-colors">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;