
import React from "react";

export default function TermsConditions() {
  return (
    <div className="px-6 py-10 max-w-4xl mx-auto text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold text-emerald-700 mb-4">Terms & Conditions</h1>
      <p className="text-sm text-gray-500 mb-8">Effective Date: 1 November 2025</p>

      <section className="space-y-6">
        <p>
          Welcome to <strong>Svasth Ol Foods</strong> (“Svasth Ol”, “we”, “our”, “us”). 
          By accessing or ordering through our website or WhatsApp channel, you agree to be bound by these Terms & Conditions 
          and our Privacy Policy. Please read them carefully.
        </p>

        <h2 className="text-xl font-semibold text-emerald-700">1. Eligibility</h2>
        <p>
          You must be at least 18 years old and capable of entering into a binding contract under the Indian Contract Act, 1872.
        </p>

        <h2 className="text-xl font-semibold text-emerald-700">2. Licensing & Compliance</h2>
        <p>
          Svasth Ol operates as a licensed <strong>cloud kitchen</strong> under the Food Safety and Standards Act, 2006 
          (FSSAI Licence No.: [Insert FSSAI Number]). We comply with the Food Safety and Standards Regulations, 2021, GST laws, 
          and local Shop & Establishment Acts.
        </p>

        <h2 className="text-xl font-semibold text-emerald-700">3. Menu and Pricing</h2>
        <p>
          Menu items, ingredients, and prices are subject to change without notice. Prices include applicable GST unless otherwise stated.
          Images are for representation only.
        </p>

        <h2 className="text-xl font-semibold text-emerald-700">4. Orders & Payments</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Orders can be placed via our website, WhatsApp, or authorized delivery partners.</li>
          <li>Orders placed via WhatsApp are confirmed only after our acknowledgment message.</li>
          <li>We reserve the right to reject orders due to unavailability or operational reasons.</li>
          <li>Payments made online are handled by secure third-party gateways.</li>
        </ul>

        <h2 className="text-xl font-semibold text-emerald-700">5. Delivery, Refund & Cancellation</h2>
        <p>
          Deliveries are made within defined areas. Estimated times are indicative. 
          Quality complaints must be reported within 30 minutes with proof for eligible replacements.
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Orders cannot be cancelled once preparation begins.</li>
          <li>Refunds (if approved) are processed within 5–7 business days.</li>
        </ul>

        <h2 className="text-xl font-semibold text-emerald-700">6. Allergens & Health Disclaimer</h2>
        <p>
          Products may contain nuts, dairy, gluten, or spices. Customers with allergies must check before ordering. 
          Svasth Ol is not liable for reactions where ingredients were disclosed.
        </p>

        <h2 className="text-xl font-semibold text-emerald-700">7. User Obligations</h2>
        <p>
          You agree not to misuse the site, impersonate others, or submit fraudulent orders.
        </p>

        <h2 className="text-xl font-semibold text-emerald-700">8. Intellectual Property</h2>
        <p>
          All recipes, logos, content, and designs belong to Svasth Ol Foods Pvt. Ltd. 
          Reproduction or distribution without permission is prohibited.
        </p>

        <h2 className="text-xl font-semibold text-emerald-700">9. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Svasth Ol shall not be liable for indirect or consequential losses.
          Our total liability is limited to the amount paid for the specific order.
        </p>

        <h2 className="text-xl font-semibold text-emerald-700">10. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Svasth Ol, its affiliates, and employees from any claims arising due to your misuse of the site or services.
        </p>

        <h2 className="text-xl font-semibold text-emerald-700">11. Data Protection</h2>
        <p>
          We process personal data in accordance with the <strong>Digital Personal Data Protection Act, 2023</strong> and Rules 2025. 
          Details are in our Privacy Policy.
        </p>

        <h2 className="text-xl font-semibold text-emerald-700">12. Governing Law & Jurisdiction</h2>
        <p>
          These Terms are governed by Indian law. Disputes shall be subject to the exclusive jurisdiction of the courts of [Your City, State].
        </p>

        <h2 className="text-xl font-semibold text-emerald-700">13. Contact</h2>
        <p>
          📧 hello@svasthol.example<br />
          📞 +91-XXXXXXXXXX<br />
          📍 Kitchen: Hometown Road, City – PIN
        </p>
      </section>
    </div>
  );
}
