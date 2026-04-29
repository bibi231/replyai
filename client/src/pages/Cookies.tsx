import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';

export function Cookies() {
    return (
        <div className="legal-container">
            <Navbar />

            <main className="legal-content">
                <h1>Cookies Policy</h1>
                <p className="last-updated">Last Updated: April 29, 2026</p>

                <section>
                    <h2>1. What are Cookies?</h2>
                    <p>Cookies are small text files stored on your device when you visit our website. They help us provide a seamless experience and analyze how our service is used.</p>
                </section>

                <section>
                    <h2>2. Types of Cookies We Use</h2>
                    <ul>
                        <li><b>Essential Cookies:</b> Required for authentication and core functionality (e.g., maintaining your Firebase session).</li>
                        <li><b>Preference Cookies:</b> Used to remember your settings, such as your selected output language in the generator.</li>
                        <li><b>Analytics Cookies:</b> Help us understand user behavior to improve the platform (we use anonymized tracking).</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Managing Your Preferences</h2>
                    <p>You can manage your cookie consent through the banner that appears on your first visit. Additionally, you can disable cookies in your browser settings, though this will likely break the authentication features of ReplyAI.</p>
                </section>

                <section>
                    <h2>4. Third-Party Cookies</h2>
                    <p>We use third-party services like Firebase (Auth) and Paystack (Payments) which may set their own cookies to ensure security and prevent fraud.</p>
                </section>

                <div style={{ marginTop: '40px' }}>
                    <Link to="/" className="btn-secondary btn-sm">← Back to Home</Link>
                </div>
            </main>
        </div>
    );
}
