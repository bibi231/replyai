import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';

export function Privacy() {
    return (
        <div className="legal-container">
            <Navbar />

            <main className="legal-content">
                <h1>Privacy Policy</h1>
                <p className="last-updated">Last Updated: April 29, 2026</p>

                <section>
                    <h2>1. Information We Collect</h2>
                    <p>ReplyAI ("we", "us", or "our") collects information to provide better services to our users. This includes:</p>
                    <ul>
                        <li><b>Account Information:</b> Email address, name, and profile picture provided via Google Sign-In.</li>
                        <li><b>Extension Data:</b> The content of the emails you explicitly choose to generate replies for. We do not store your entire inbox or monitoring your email activity beyond the specific emails you interact with.</li>
                        <li><b>Usage Data:</b> Credits consumed, generation history, selected tones, and timestamp data for analytical purposes.</li>
                    </ul>
                </section>

                <section>
                    <h2>2. Consent and Data Processing</h2>
                    <p>By using the ReplyAI extension and web application, you explicitly consent to the processing of your email data for the sole purpose of generating AI reply drafts.</p>
                    <ul>
                        <li>You can withdraw your consent at any time by uninstalling the extension or deleting your account.</li>
                        <li>We process your data through secure third-party AI models (Google Gemini and Groq/Llama).</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Cookies and Tracking</h2>
                    <p>We use cookies to maintain your session and remember your preferences. Please refer to our <Link to="/cookies">Cookies Policy</Link> for detailed information on how we manage these technologies.</p>
                </section>

                <section>
                    <h2>4. How We Use Information</h2>
                    <p>We use your data strictly to:</p>
                    <ul>
                        <li>Generate AI drafts using secure API calls.</li>
                        <li>Manage your credit balance and subscription status via Paystack.</li>
                        <li>Improve the relevance of our AI models through anonymized aggregate data.</li>
                    </ul>
                    <p><b>We do not sell your personal data to advertisers or third parties.</b></p>
                </section>

                <section>
                    <h2>5. Data Retention</h2>
                    <p>Generated drafts are stored in your private history until you delete them. You can request a complete account deletion and data wipe by contacting our support team.</p>
                </section>

                <section>
                    <h2>6. Security</h2>
                    <p>We use AES-256 encryption for data at rest and TLS for data in transit. Your authentication is managed by Firebase's secure framework.</p>
                </section>

                <section>
                    <h2>7. Contact Us</h2>
                    <p>For any privacy-related queries or to exercise your data rights, contact <b>support@trueweb.tech</b>.</p>
                </section>

                <div style={{ marginTop: '40px' }}>
                    <Link to="/" className="btn-secondary btn-sm">← Back to Home</Link>
                </div>
            </main>
        </div>
    );
}
