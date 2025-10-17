export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-amber-50 to-yellow-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-emerald-800 mb-4">
          Privacy Policy — Svasth Ol
        </h1>
        <p className="text-gray-700 leading-relaxed mb-3">
          Svasth Ol respects your privacy. This Privacy Policy explains how we handle
          your information when you order via our website, WhatsApp, or delivery partners.
        </p>
        <ul className="list-disc ml-6 text-gray-700 space-y-2">
          <li>We collect only essential contact and order information.</li>
          <li>Your data is used exclusively for order fulfillment and feedback.</li>
          <li>We do not sell or share your data with third parties without consent.</li>
          <li>You may request data deletion by contacting hello@svasthol.example.</li>
          <li>We adhere to India’s Digital Personal Data Protection Act, 2023.</li>
        </ul>
        <p className="text-sm text-gray-500 mt-6">
          Last updated October 2025 · Compliant with Indian privacy laws.
        </p>
      </div>
    </div>
  );
}
