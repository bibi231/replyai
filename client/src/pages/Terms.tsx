import React from 'react';
import { Link } from 'react-router-dom';

export function Terms() {
    return (
        <div className="legal-container">
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link to="/" className="navbar-logo">✨ ReplyAI</Link>
                </div>
            </nav>

            <main className="legal-content">
                <h1>Terms of Service</h1>
                <p className="last-updated">Last Updated: April 29, 2026</p>

                <section>
                    <h2>1. Acceptance of Terms</h2>
                    <p>By using ReplyAI, you agree to these Terms of Service. If you do not agree, do not use the service.</p>
                </section>

                <section>
                    <h2>2. Use of Service</h2>
                    <p>You agree to use ReplyAI only for lawful purposes. You are responsible for the content of the emails you send using our AI-generated drafts. We recommend reviewing every AI draft before sending.</p>
                </section>

                <section>
                    <h2>3. Credits and Payments</h2>
                    <ul>
                        <li>Free users receive a limited daily quota of credits.</li>
                        <li>Paid credits do not expire and are added to your account upon successful Paystack payment.</li>
                        <li>Refunds are handled on a case-by-case basis before credits are consumed.</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Limitation of Liability</h2>
                    <p>TrueWeb Technologies is not liable for any damages arising from the use of AI-generated content, including but not limited to business misunderstandings, errors in translation, or accidental tone mismatches.</p>
                </section>

                <section>
                    <h2>5. Modification of Service</h2>
                    <p>We reserve the right to modify or discontinue any part of the service with 30 days notice for paid users.</p>
                </section>

                <div style={{ marginTop: '40px' }}>
                    <Link to="/" className="btn-secondary btn-sm">← Back to Home</Link>
                </div>
            </main>
        </div>
    );
}
