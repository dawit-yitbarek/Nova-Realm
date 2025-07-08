import React from "react";

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
            <div className="max-w-4xl mx-auto px-6 py-12 text-gray-100 bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl rounded-2xl">
                <h1 className="text-4xl font-extrabold text-white mb-6 border-b border-gray-700 pb-2">Terms of Service</h1>
                <p className="text-sm text-gray-400 mb-6 italic">Effective Date: May 25, 2025</p>

                {[
                    {
                        title: "1. Overview",
                        content: `Nova Realm is a platform that distributes tokens based on the points users collect through tasks. Users may optionally send Solana tokens to increase their point totals.`,
                    },
                    {
                        title: "2. Eligibility",
                        content: `To use this service, you must be at least 18 years old or the legal age of majority in your jurisdiction.`,
                    },
                    {
                        title: "3. Account Creation",
                        content: `Users must register via email or Google login to participate. You are responsible for keeping your login credentials secure.`,
                    },
                    {
                        title: "4. Token and Point System",
                        content: `Points are earned through tasks. Sending Solana tokens to increase points is optional and non-refundable.`,
                    },
                    {
                        title: "5. Intellectual Property",
                        content: `All content on Nova Realm is owned by the platform. Users do not upload or share content.`,
                    },
                ].map((section, i) => (
                    <div key={i} className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-2">{section.title}</h2>
                        <p className="text-gray-300 leading-relaxed">{section.content}</p>
                    </div>
                ))}

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-white mb-2">6. Prohibited Activities</h2>
                    <ul className="list-disc pl-6 space-y-1 text-gray-300">
                        <li>Using the platform for unlawful purposes</li>
                        <li>Attempting to hack or exploit the system</li>
                        <li>Automating tasks or manipulating the point system</li>
                    </ul>
                </div>

                {[
                    {
                        title: "7. Termination",
                        content: `We reserve the right to suspend or terminate accounts for violating these terms.`,
                    },
                    {
                        title: "8. Changes",
                        content: `Changes will be announced on our official Twitter or Telegram.`,
                    },
                    {
                        title: "9. Limitation of Liability",
                        content: `Nova Realm is provided "as is" without warranties of any kind. Use of the platform is at your own risk.`,
                    },
                    {
                        title: "10. Acceptance",
                        content: `By using Nova Realm, you agree to these terms and our Privacy Policy.`,
                    },
                ].map((section, i) => (
                    <div key={i + 10} className="mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-2">{section.title}</h2>
                        <p className="text-gray-300 leading-relaxed">{section.content}</p>
                    </div>
                ))}

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-white mb-2">11. Contact Us</h2>
                    <p className="text-gray-300 leading-relaxed">
                        If you have any questions about these terms, please contact us at{" "}
                        <a href="mailto:contact.novarealm@gmail.com" className="text-blue-400 underline">contact.novarealm@gmail.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
