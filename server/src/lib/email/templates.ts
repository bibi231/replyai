// HTML email templates — ReplyAI brand (violet/indigo #6c63ff)

const B = {
  name: 'ReplyAI',
  color1: '#6c63ff',
  color2: '#4f46e5',
  site: 'replyai.com.ng',
  dash: 'https://replyai.com.ng',
  support: 'support@replyai.com.ng',
};

function wrap(preview: string, title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f5f3ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${esc(preview)}&nbsp;&#8204;&nbsp;&#8204;&nbsp;&#8204;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f3ff;min-height:100vh;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 20px rgba(108,99,255,.08);">
  <tr><td style="background:linear-gradient(135deg,${B.color1} 0%,${B.color2} 100%);padding:28px 36px 24px;">
    <span style="display:inline-block;background:rgba(255,255,255,.18);border-radius:9px;padding:6px 11px;font-size:16px;font-weight:800;color:#fff;letter-spacing:-.2px;">R</span>
    <span style="margin-left:8px;font-size:16px;font-weight:700;color:#fff;">${B.name}</span>
  </td></tr>
  <tr><td style="padding:36px 36px 28px;">${body}</td></tr>
  <tr><td style="padding:20px 36px 28px;border-top:1px solid #ede9fe;">
    <p style="margin:0 0 6px;font-size:11.5px;color:#6b7280;line-height:1.6;">You have an account with ${B.name}. Questions? <a href="mailto:${B.support}" style="color:${B.color1};text-decoration:none;">${B.support}</a></p>
    <p style="margin:0;font-size:11px;color:#9ca3af;">© 2026 TrueWeb Solutions Ltd · ${B.name} · Lagos, Nigeria</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function h1(t: string) { return `<h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#111827;letter-spacing:-.4px;line-height:1.3;">${t}</h1>`; }
function p(t: string, muted?: boolean) { return `<p style="margin:0 0 16px;font-size:15px;color:${muted ? '#6b7280' : '#374151'};line-height:1.7;">${t}</p>`; }
function btn(href: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;"><tr><td style="border-radius:9px;background:linear-gradient(135deg,${B.color1},${B.color2});"><a href="${href}" style="display:inline-block;padding:13px 28px;font-size:15px;font-weight:600;color:#fff;text-decoration:none;border-radius:9px;">${label}</a></td></tr></table>`;
}
function divider() { return `<hr style="border:none;border-top:1px solid #ede9fe;margin:24px 0;">`; }

export function welcomeTemplate(name: string | undefined, dashboardUrl: string): string {
  return wrap(`Welcome to ReplyAI${name ? `, ${name}` : ''}!`, 'Welcome to ReplyAI',
    h1(`Welcome${name ? `, ${name}` : ''}! 🎉`) +
    p(`Your ReplyAI account is live. Connect your inbox and let AI draft replies in under 60 seconds — English, Pidgin, formal or casual.`) +
    btn(dashboardUrl, 'Open my inbox →') +
    p(`Questions? Reply to this email or visit <a href="https://${B.site}" style="color:${B.color1};">${B.site}</a>.`, true)
  );
}

export function verifyEmailTemplate(name: string | undefined, otp: string): string {
  return wrap(`Your ReplyAI code: ${otp}`, 'Verify your email',
    h1('Verify your email') +
    p(`${name ? `Hi ${name}. ` : ''}Your verification code — expires in 10 minutes:`) +
    `<div style="margin:24px 0;text-align:center;"><span style="display:inline-block;background:#f5f3ff;border:2px solid ${B.color1};border-radius:12px;padding:18px 36px;font-size:34px;font-weight:800;letter-spacing:10px;color:${B.color1};">${esc(otp)}</span></div>` +
    p(`Didn't create an account? Ignore this email.`, true)
  );
}

export function passwordResetTemplate(name: string | undefined, resetUrl: string): string {
  return wrap('Reset your ReplyAI password', 'Password reset',
    h1('Reset your password') +
    p(`${name ? `Hi ${name}. ` : ''}Click below to reset your password. This link expires in 30 minutes.`) +
    btn(resetUrl, 'Reset password →') +
    divider() +
    p(`Didn't request a reset? No action needed.`, true)
  );
}

export function paymentSuccessTemplate(opts: { name?: string; credits?: number; pack?: string; amountNgn: number; txRef: string }): string {
  const amount = (opts.amountNgn / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 });
  return wrap(`Payment confirmed — ₦${amount}`, 'Payment confirmed',
    h1('Payment confirmed ✅') +
    p(`${opts.name ? `Hi ${opts.name}. ` : ''}Your payment of <strong>₦${amount}</strong> was successful${opts.credits ? ` and <strong>${opts.credits} AI replies</strong> have been added to your account` : ''}.`) +
    `<div style="margin:20px 0;padding:14px 18px;background:#f5f3ff;border-radius:10px;border-left:3px solid ${B.color1};"><p style="margin:0 0 3px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:.5px;">Transaction ref</p><p style="margin:0;font-size:13px;font-weight:600;color:#111827;font-family:monospace;">${esc(opts.txRef)}</p></div>` +
    btn(B.dash, 'Start writing replies →') +
    p(`Keep this email as your receipt. <a href="mailto:${B.support}" style="color:${B.color1};">Contact us</a> for billing queries.`, true)
  );
}

export function paymentFailedTemplate(opts: { name?: string; retryUrl: string }): string {
  return wrap('Payment failed — action needed', 'Payment failed',
    h1('Payment failed ⚠️') +
    p(`${opts.name ? `Hi ${opts.name}. ` : ''}We couldn't process your payment. This usually happens when a card is declined or has insufficient funds.`) +
    btn(opts.retryUrl, 'Try again →') +
    p(`Try a different card or contact your bank. Reply to this email if you need help.`, true)
  );
}

export function subscriptionRenewedTemplate(opts: { name?: string; pack: string; amountNgn: number; nextDate: string }): string {
  const amount = (opts.amountNgn / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 });
  return wrap('Your ReplyAI plan renewed', 'Plan renewed',
    h1('Plan renewed ✅') +
    p(`Your <strong>${esc(opts.pack)}</strong> pack has been renewed for ₦${amount}. Next renewal: <strong>${esc(opts.nextDate)}</strong>.`) +
    btn(B.dash, 'View my account →')
  );
}

export function subscriptionCancelledTemplate(opts: { name?: string; accessUntil: string; reactivateUrl: string }): string {
  return wrap('Your ReplyAI subscription cancelled', 'Subscription cancelled',
    h1('Subscription cancelled') +
    p(`Your subscription has been cancelled. You'll keep access until <strong>${esc(opts.accessUntil)}</strong>.`) +
    btn(opts.reactivateUrl, 'Reactivate →') +
    p(`Reply to this email if this was a mistake.`, true)
  );
}

export function refundIssuedTemplate(opts: { name?: string; amountNgn: number; txRef: string; arrivalDays?: number }): string {
  const amount = (opts.amountNgn / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 });
  const days = opts.arrivalDays ?? 7;
  return wrap(`Refund of ₦${amount} on its way`, 'Refund issued',
    h1('Refund issued 💜') +
    p(`A refund of <strong>₦${amount}</strong> has been processed. Expect it within ${days} business days.`) +
    `<div style="margin:16px 0;padding:14px 18px;background:#f5f3ff;border-radius:10px;border-left:3px solid ${B.color1};"><p style="margin:0 0 3px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:.5px;">Original transaction ref</p><p style="margin:0;font-size:13px;font-weight:600;font-family:monospace;color:#111827;">${esc(opts.txRef)}</p></div>` +
    p(`Contact <a href="mailto:${B.support}" style="color:${B.color1};">${B.support}</a> if you don't receive it after ${days} days.`, true)
  );
}

export function accountDeletedTemplate(opts: { name?: string; graceDays?: number }): string {
  const days = opts.graceDays ?? 30;
  return wrap('Your ReplyAI account has been deleted', 'Account deleted',
    h1('Account deleted') +
    p(`Your account and data are scheduled for deletion. We'll permanently remove everything in <strong>${days} days</strong>.`) +
    p(`Made a mistake? Email <a href="mailto:${B.support}" style="color:${B.color1};">${B.support}</a> within ${days} days to recover your account.`, true)
  );
}

export function weeklyDigestTemplate(opts: { name?: string; stats: { replies: number; timeSavedMin: number; topTone: string }; weekEnding: string }): string {
  return wrap(`ReplyAI weekly summary — ${opts.weekEnding}`, 'Weekly digest',
    h1(`Week of ${esc(opts.weekEnding)}`) +
    p(`${opts.name ? `Hi ${opts.name}. ` : ''}Your AI reply stats for the week:`) +
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:20px 0;">
      <tr>
        <td style="width:32%;padding:12px 16px;background:#f5f3ff;border-radius:8px;text-align:center;">
          <div style="font-size:22px;font-weight:700;color:${B.color1};">${opts.stats.replies}</div>
          <div style="font-size:11.5px;color:#6b7280;margin-top:3px;">Replies generated</div>
        </td>
        <td style="width:4%;"></td>
        <td style="width:32%;padding:12px 16px;background:#f5f3ff;border-radius:8px;text-align:center;">
          <div style="font-size:22px;font-weight:700;color:${B.color1};">${opts.stats.timeSavedMin}m</div>
          <div style="font-size:11.5px;color:#6b7280;margin-top:3px;">Time saved</div>
        </td>
        <td style="width:4%;"></td>
        <td style="width:28%;padding:12px 16px;background:#f5f3ff;border-radius:8px;text-align:center;">
          <div style="font-size:14px;font-weight:700;color:${B.color1};">${esc(opts.stats.topTone)}</div>
          <div style="font-size:11.5px;color:#6b7280;margin-top:3px;">Top tone</div>
        </td>
      </tr>
    </table>` +
    btn(B.dash, 'Write more replies →')
  );
}

export function lowCreditTemplate(opts: { name?: string; remaining: number; upgradeUrl: string }): string {
  return wrap('Your ReplyAI credits are running low', 'Low credits',
    h1('Credits running low ⚠️') +
    p(`${opts.name ? `Hi ${opts.name}. ` : ''}You have <strong>${opts.remaining} AI replies</strong> remaining. Top up before they run out.`) +
    btn(opts.upgradeUrl, 'Top up now →') +
    p(`Starter pack: 30 replies for ₦2,500. Pro: 100 for ₦6,500.`, true)
  );
}

export function onboardingDay1Template(name: string | undefined): string {
  return wrap('Connect your inbox to ReplyAI', 'Connect your inbox',
    h1('Step 1: Connect your inbox') +
    p(`${name ? `Hi ${name}. ` : ''}ReplyAI works with Gmail and Outlook. Connect your inbox in under 2 minutes to start getting AI-drafted replies.`) +
    btn(`${B.dash}/connect`, 'Connect my inbox →') +
    p(`Once connected, open any email and click "Draft with AI". Your first reply is on us.`, true)
  );
}

export function onboardingDay3Template(name: string | undefined): string {
  return wrap('Did you know? ReplyAI learns your tone', 'ReplyAI learns your voice',
    h1('ReplyAI learns how you write') +
    p(`${name ? `Hi ${name}. ` : ''}The more you use ReplyAI, the better it matches your tone. Formal, casual, direct, warm — it adapts.`) +
    p(`Tip: After each reply, rate it with 👍 or 👎. That's the fastest way to teach the AI your style.`) +
    btn(B.dash, 'Try it now →')
  );
}

export function onboardingDay5Template(name: string | undefined): string {
  return wrap('How Kemi saves 3 hours every week', 'Customer story',
    h1('"I save 3 hours every single week"') +
    p(`${name ? `Hi ${name}. ` : ''}Kemi runs a fast-growing Shopify store and was drowning in customer emails. Here's what she told us:`) +
    divider() +
    p(`<em>"I used to spend my mornings just on email. Now I open ReplyAI, approve drafts in 5 minutes, and get on with my day."</em>`) +
    p(`— Kemi A., Lagos`, true) +
    divider() +
    btn(B.dash, 'See your time savings →')
  );
}

export function onboardingDay7Template(name: string | undefined): string {
  return wrap("Let's chat — 15 minutes", 'Quick call?',
    h1('Want to get more from ReplyAI?') +
    p(`${name ? `Hi ${name}. ` : ''}Book a quick 15-minute call. We'll look at your inbox together and set up any custom tones or templates you need.`) +
    btn('https://calendly.com/trueweb-solutions/replyai-onboarding', 'Book 15 minutes →') +
    p(`Can't find a slot? Reply to this email.`, true)
  );
}

export function reengageDay14Template(name: string | undefined, lastFeature?: string): string {
  return wrap('We miss you — come back to ReplyAI', 'Miss you',
    h1(`${name ? `${name}, we` : 'We'} miss you 👋`) +
    p(`It's been 2 weeks. Your inbox is probably building up.`) +
    (lastFeature ? p(`You were last using: <strong>${esc(lastFeature)}</strong>`) : '') +
    btn(B.dash, 'Come back →')
  );
}

export function reengageDay21Template(name: string | undefined): string {
  return wrap("Here's what's new in ReplyAI", "What's new",
    h1("Here's what we've shipped") +
    p(`${name ? `Hi ${name}. ` : ''}Recent updates:`) +
    `<ul style="margin:0 0 20px;padding-left:20px;color:#374151;font-size:15px;line-height:2;">
      <li><strong>Batch reply</strong> — draft replies to 10 emails at once</li>
      <li><strong>Yoruba + Hausa support</strong> — now in beta</li>
      <li><strong>Custom templates</strong> — save your best replies for reuse</li>
    </ul>` +
    btn(B.dash, 'Try the new features →')
  );
}

export function reengageDay28Template(name: string | undefined, unsubUrl: string): string {
  return wrap('Stay or go — your call', 'Stay connected?',
    h1('No pressure') +
    p(`${name ? `Hi ${name}. ` : ''}If ReplyAI isn't right for you right now, that's totally okay.`) +
    btn(B.dash, "I'm still here →") +
    p(`Or <a href="${unsubUrl}" style="color:#9ca3af;">unsubscribe from marketing emails</a>.`, true)
  );
}

export function newsletterConfirmTemplate(confirmUrl: string): string {
  return wrap('Confirm your ReplyAI newsletter', 'Confirm subscription',
    h1('One click to confirm') +
    p(`You asked to subscribe to the ReplyAI newsletter — AI productivity tips and Nigerian business insights.`) +
    btn(confirmUrl, 'Confirm subscription →') +
    p(`Didn't sign up? Ignore this email.`, true)
  );
}

export function newsletterWelcomeTemplate(): string {
  return wrap("You're subscribed to ReplyAI updates", 'Newsletter welcome',
    h1("You're in! 📬") +
    p(`You'll get weekly AI productivity tips, product updates, and stories from Nigerian entrepreneurs who are saving hours every week.`)
  );
}
