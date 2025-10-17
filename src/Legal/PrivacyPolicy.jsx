import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="px-6 py-10 max-w-4xl mx-auto text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold text-emerald-700 mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Effective Date: 1 November 2025</p>

      <section className="space-y-6">
        <p>
          Svasth Ol (“Svasth Ol”, “we”, “our”, “us”) respects your privacy and 
          handles your personal data in compliance with the <strong>Digital Personal Data Protection Act, 2023</strong> 
          and relevant Indian regulations.
        </p>

        <h2 className="text-xl font-semibold text-emerald-700">1. Data We Collect</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Identity details: name, phone number, email address.</li>
          <li>Order information: items, delivery address, payment confirmation.</li>
          <li>Device data: IP address, browser, cookies.</li>
          <li>Messages or feedback submitted via WhatsApp or website.</li>
        </ul>

        <h2 className="text-xl font-semibold text-emerald-700">2. Purpose of Processing</h2>
        <p>
          We process data to confirm and deliver orders, provide support, comply with GST/FSSAI regulations, 
          improve our products, and send promotional messages (with your consent).
        </p>

        <h2 className="text-xl font-semibold text-emerald-700">3. Consent</h2>
        <p>
          By submitting your information or placing an order, you provide explicit, informed consent for us to 
          process your data. You may withdraw consent by emailing <strong>hello@svasthol.example</strong>.
        </p>

        <h2 className="text-xl font-semibold text-emerald-700">4. Data Sharing</h2>
        <p>
          We share data only with trusted service providers for delivery, payment processing, analytics, or 
          legal compliance. We do not sell or rent your personal data.
        </p>

        <h2 className="text-xl font-semibold text-emerald-700">5. Cross-Border Data Transfers</h2>
        <p>
          If data is processed outside India, we ensure contractual safeguards per DPDP Rules 2025.
        </p>

        <h2 className="text-xl font-semibold text-emerald-700">6. Data Retention</h2>
        <p>
          Personal data is retained only as long as necessary for order processing, record-keeping, or as 
          required by law, then securely deleted or anonymized.
        </p>

        <h2 className="text-xl font-semibold text-emerald-700">7. Your Rights</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Access and correct your data.</li>
          <li>Request deletion or withdraw consent.</li>
          <li>Receive a summary of your personal data.</li>
          <li>File a complaint with the Data Protection Board of India.</li>
        </ul>

        <h2 className="text-xl font-semibold text-emerald-700">8. Security</h2>
        <p>
          We employ encryption, limited access, and secure servers. In case of a breach, we notify affected 
          individuals and authorities as required by law.
        </p>

        <h2 className="text-xl font-semibold text-emerald-700">9. Children’s Data</h2>
        <p>
          We do not knowingly collect data from minors under 18. Any such data will be deleted promptly.
        </p>

        <h2 className="text-xl font-semibold text-emerald-700">10. Cookies & Analytics</h2>
        <p>
          We use minimal cookies for website functionality and anonymous analytics. You may disable cookies 
          in your browser.
        </p>

        <h2 className="text-xl font-semibold text-emerald-700">11. Grievance Officer</h2>
        <p>
          <strong>Name:</strong> [Appointed Contact Person]<br />
          <strong>Email:</strong> privacy@svasthol.example<br />
          <strong>Address:</strong> Svasth Ol Foods, Hometown Road, City – PIN<br />
          <strong>Response Time:</strong> Within 15 working days (as per DPDP Rules 2025)
        </p>

        <h2 className="text-xl font-semibold text-emerald-700">12. Updates</h2>
        <p>
          We may update this policy periodically. Continued use of our site indicates acceptance of any changes.
        </p>
      </section>
    </div>
  );
}
