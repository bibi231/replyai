import React from 'react';
import { Link } from 'react-router-dom';

export function Refund() {
    return (
        <div className="legal-container">
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link to="/" className="navbar-logo">✨ ReplyAI</Link>
                </div>
            </nav>

            <main className="legal-content">
                <h1>Refund Policy</h1>
                <p className="last-updated">Last Updated: April 29, 2026</p>

                <section>
                    <h2>1. Credit Usage</h2>
                    <p>ReplyAI operates on a credit-based system. Once a credit has been consumed to generate a reply draft, it cannot be refunded. We provide sample generations and free daily credits so you can evaluate the quality of the service before purchasing.</p>
                </section>

                <section>
                    <h2>2. Eligibility for Refunds</h2>
                    <p>Refunds are only eligible for:</p>
                    <ul>
                        <li>Technical failures where credits were deducted but no reply was generated.</li>
                        <li>Duplicate transactions caused by payment gateway errors (Paystack).</li>
                        <li>Purchased credit bundles where <b>zero (0) credits</b> from the bundle have been used.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Subscription Cancellations</h2>
                    <p>If you are on a recurring billing plan, you may cancel at any time. Your access will continue until the end of the current billing cycle. We do not provide prorated refunds for partial months of service.</p>
                </section>

                <section>
                   <h2>4. How to Request</h2>
                   <p>To request a refund, email <b>billing@trueweb.tech</b> with your transaction ID and the reason for the request. Requests must be made within 7 days of the transaction.</p>
                </section>

                <div style={{ marginTop: '40px' }}>
                    <Link to="/" className="btn-secondary btn-sm">← Back to Home</Link>
                </div>
            </main>
        </div>
    );
}
