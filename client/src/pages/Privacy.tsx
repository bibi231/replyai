import React from 'react';
import { Link } from 'react-router-dom';

export function Privacy() {
    return (
        <div className="legal-container">
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link to="/" className="navbar-logo">✨ ReplyAI</Link>
                </div>
            </nav>

            <main className="legal-content">
                <h1>Privacy Policy</h1>
                <p className="last-updated">Last Updated: April 29, 2026</p>

                <section>
                    <h2>1. Information We Collect</h2>
                    <p>ReplyAI ("we", "us", or "our") collects information to provide better services to our users. This includes:</p>
                    <ul>
                        <li><b>Account Information:</b> Email address and name provided via Google Sign-In.</li>
                        <li><b>Extension Data:</b> The content of the emails you explicitly choose to generate replies for. We do not "read" your entire inbox.</li>
                        <li><b>Usage Data:</b> Credits used, generation counts, and selected tones.</li>
                    </ul>
                </section>

                <section>
                    <h2>2. How We Use Information</h2>
                    <p>We use your data strictly to:</p>
                    <ul>
                        <li>Generate AI drafts using secure API calls to providers (Google/Groq).</li>
                        <li>Manage your credit balance and subscription status.</li>
                        <li>Improve the relevance of our AI models.</li>
                    </ul>
                    <p><b>We do not sell your data to third parties.</b></p>
                </section>

                <section>
                    <h2>3. Data Retentions</h2>
                    <p>Generated drafts are stored in your private history until you delete them or your account is closed. You can request data deletion at any time via support.</p>
                </section>

                <section>
                    <h2>4. Security</h2>
                    <p>We use industry-standard encryption and Firebase Authentication to secure your data. However, no method of transmission over the internet is 100% secure.</p>
                </section>

                <section>
                    <h2>5. Contact Us</h2>
                    <p>For any privacy-related queries, contact support@trueweb.tech.</p>
                </section>

                <div style={{ marginTop: '40px' }}>
                    <Link to="/" className="btn-secondary btn-sm">← Back to Home</Link>
                </div>
            </main>
        </div>
    );
}
