import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';

export function Refund() {
    return (
        <div className="legal-container">
            <Navbar />

            <main className="legal-content">
                <h1>Refund Policy</h1>
                <p className="last-updated">Last Updated: April 29, 2026</p>

                <section>
                    <h2>1. Digital Goods Policy</h2>
                    <p>Due to the nature of digital goods and AI generation costs, all purchases of ReplyAI credits are final. We do not offer refunds once credits have been used or after 24 hours of purchase.</p>
                </section>

                <section>
                    <h2>2. Exceptional Circumstances</h2>
                    <p>We may consider refund requests in the following situations:</p>
                    <ul>
                        <li><b>Duplicate billing:</b> If you were erroneously charged twice for the same transaction.</li>
                        <li><b>Technical failure:</b> If the service was unavailable for more than 48 hours and you were unable to use your purchased credits.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. How to Request a Refund</h2>
                    <p>To request a refund, email <b>support@trueweb.tech</b> with your transaction reference from Paystack. Requests must be made within 7 days of the transaction.</p>
                </section>

                <section>
                    <h2>4. Processing</h2>
                    <p>Approved refunds will be processed via Paystack back to the original payment method. Processing times vary by bank but usually take 5-10 business days.</p>
                </section>

                <div style={{ marginTop: '40px' }}>
                    <Link to="/" className="btn-secondary btn-sm">← Back to Home</Link>
                </div>
            </main>
        </div>
    );
}
