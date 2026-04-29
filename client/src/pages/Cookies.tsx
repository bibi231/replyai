import React from 'react';
import { Link } from 'react-router-dom';

export function Cookies() {
    return (
        <div className="legal-container">
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link to="/" className="navbar-logo">✨ ReplyAI</Link>
                </div>
            </nav>

            <main className="legal-content">
                <h1>Cookies Policy</h1>
                <p className="last-updated">Last Updated: April 29, 2026</p>

                <section>
                    <h2>1. What are Cookies?</h2>
                    <p>Cookies are small text files stored on your device when you browse websites. They help us remember your session and preferences.</p>
                </section>

                <section>
                    <h2>2. How We Use Cookies</h2>
                    <p>We use the following types of cookies:</p>
                    <ul>
                        <li><b>Essential Cookies:</b> Required for authentication (Firebase) and managing your logged-in state. Without these, you cannot use the generator.</li>
                        <li><b>Functional Cookies:</b> Used to remember your preferred language and tone settings.</li>
                        <li><b>Analytical Cookies:</b> Used by tools like Google Analytics to understand how users interact with our site, helping us improve performance.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Third-Party Cookies</h2>
                    <p>Some cookies are placed by third-party services we use, including:</p>
                    <ul>
                        <li><b>Firebase:</b> For authentication and session management.</li>
                        <li><b>Paystack:</b> For secure payment processing.</li>
                        <li><b>Google/Groq:</b> Session tokens for AI API integrity.</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Managing Cookies</h2>
                    <p>Most browsers allow you to block or delete cookies in their settings. Note that disabling essential cookies will prevent you from signing in to ReplyAI.</p>
                </section>

                <div style={{ marginTop: '40px' }}>
                    <Link to="/" className="btn-secondary btn-sm">← Back to Home</Link>
                </div>
            </main>
        </div>
    );
}
