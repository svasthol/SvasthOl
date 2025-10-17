export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-emerald-50 to-yellow-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-emerald-800 mb-4">
          Terms & Conditions — Svasth Ol
        </h1>
        <p className="text-gray-700 leading-relaxed mb-3">
          Welcome to <strong>Svasth Ol</strong>. These Terms & Conditions outline the rules and
          regulations for using our cloud kitchen services and website.
        </p>
        <ul className="list-disc ml-6 text-gray-700 space-y-2">
          <li>All food products are freshly prepared in a licensed cloud kitchen.</li>
          <li>Orders placed via WhatsApp are confirmed only after our team responds.</li>
          <li>Payments are handled via secure UPI links or partner platforms.</li>
          <li>We comply with all FSSAI, DPDP (2023), and Indian consumer protection guidelines.</li>
          <li>In case of disputes, jurisdiction lies in our registered business city.</li>
        </ul>
        <p className="text-sm text-gray-500 mt-6">
          Updated as per Indian e-commerce & food safety standards, 2025.
        </p>
      </div>
    </div>
  );
}
