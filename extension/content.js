// ReplyAI Content Script — Gmail & Outlook Integration
// Injects ReplyAI buttons + handles email extraction + reply insertion

(function () {
    'use strict';

    const BUTTON_CLASS = 'replyai-inject-btn';
    let lastInjectedCount = 0;

    // ── Email Extraction ──────────────────────────────────────
    function extractEmailFromGmail() {
        // Method 1: Expanded email thread view
        const expandedMessages = document.querySelectorAll('.h7, .a3s.aiL, .ii.gt');
        if (expandedMessages.length > 0) {
            const lastMsg = expandedMessages[expandedMessages.length - 1];
            return cleanText(lastMsg.innerText);
        }

        // Method 2: Message body container
        const msgBody = document.querySelector('[data-message-id] .a3s');
        if (msgBody) return cleanText(msgBody.innerText);

        // Method 3: Generic main content
        const main = document.querySelector('[role="main"]');
        if (main) return cleanText(main.innerText);

        return '';
    }

    function extractEmailFromOutlook() {
        const readingPane = document.querySelector('[role="main"] [aria-label*="Message"]') ||
            document.querySelector('.ReadMsgBody') ||
            document.querySelector('[data-app-section="ReadingPane"]');

        if (readingPane) return cleanText(readingPane.innerText);

        return '';
    }

    function extractEmail() {
        const host = window.location.hostname;
        if (host.includes('mail.google.com')) {
            return extractEmailFromGmail();
        } else if (host.includes('outlook')) {
            return extractEmailFromOutlook();
        }
        return '';
    }

    function cleanText(text) {
        return text
            .replace(/\n{3,}/g, '\n\n')
            .trim()
            .substring(0, 3000);
    }

    // ── Gmail Subject Extraction ──────────────────────────────
    function extractSubject() {
        // Gmail
        const subjectEl = document.querySelector('h2[data-thread-perm-id]') ||
            document.querySelector('.hP') ||
            document.querySelector('[data-legacy-thread-id]');
        if (subjectEl) return subjectEl.innerText?.trim() || '';

        // Outlook
        const outlookSubject = document.querySelector('[aria-label*="Subject"]');
        if (outlookSubject) return outlookSubject.innerText?.trim() || '';

        return '';
    }

    // ── Reply Insertion ───────────────────────────────────────
    function insertReplyIntoGmail(body, subject) {
        // Find the active compose box
        const composeBoxes = document.querySelectorAll('[role="textbox"][aria-label*="Body"], div.Am.Al.editable, div[g_editable="true"]');
        const composeBox = composeBoxes[composeBoxes.length - 1]; // Get the most recent one

        if (composeBox) {
            // Set content
            composeBox.focus();
            composeBox.innerHTML = body.replace(/\n/g, '<br>');

            // Dispatch input event so Gmail registers the change
            composeBox.dispatchEvent(new Event('input', { bubbles: true }));

            // Try to set subject if available
            if (subject) {
                const subjectInput = document.querySelector('input[name="subjectbox"]');
                if (subjectInput && !subjectInput.value) {
                    subjectInput.value = subject;
                    subjectInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
            return true;
        }
        return false;
    }

    function insertReplyIntoOutlook(body, subject) {
        const composeBox = document.querySelector('[role="textbox"][aria-label*="Message body"]') ||
            document.querySelector('div[contenteditable="true"]');

        if (composeBox) {
            composeBox.focus();
            composeBox.innerHTML = body.replace(/\n/g, '<br>');
            composeBox.dispatchEvent(new Event('input', { bubbles: true }));
            return true;
        }
        return false;
    }

    // ── Button Injection ──────────────────────────────────────
    function injectButtons() {
        const host = window.location.hostname;

        if (host.includes('mail.google.com')) {
            injectGmailButtons();
        } else if (host.includes('outlook')) {
            injectOutlookButtons();
        }
    }

    function injectGmailButtons() {
        // Target: Gmail's reply/forward button row (the "Reply", "Reply All", "Forward" buttons)
        const replyBtnContainers = document.querySelectorAll('.ams.bkH, .btC');

        replyBtnContainers.forEach(container => {
            if (container.querySelector(`.${BUTTON_CLASS}`)) return;

            const btn = createReplyAIButton();
            container.appendChild(btn);
        });

        // Also inject into compose toolbar area
        const toolbars = document.querySelectorAll('.btC, .J-J5-Ji');
        toolbars.forEach(toolbar => {
            if (toolbar.querySelector(`.${BUTTON_CLASS}`)) return;
            // Only inject if this looks like a compose toolbar
            if (toolbar.querySelector('.T-I.J-J5-Ji.aoO')) {
                const btn = createReplyAIButton();
                toolbar.prepend(btn);
            }
        });
    }

    function injectOutlookButtons() {
        const actionBars = document.querySelectorAll('[role="toolbar"]');
        actionBars.forEach(bar => {
            if (bar.querySelector(`.${BUTTON_CLASS}`)) return;
            const btn = createReplyAIButton();
            bar.appendChild(btn);
        });
    }

    function createReplyAIButton() {
        const btn = document.createElement('button');
        btn.className = BUTTON_CLASS;
        btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
      <span>ReplyAI</span>
    `;
        btn.title = 'Generate AI reply with ReplyAI';
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleReplyAIClick();
        });
        return btn;
    }

    function handleReplyAIClick() {
        const emailContent = extractEmail();
        const subject = extractSubject();

        // Send to popup via background
        chrome.runtime.sendMessage({
            type: 'CONTENT_EXTRACTED',
            emailContent,
            subject
        });

        // Also open the popup programmatically (this might not work in all cases)
        // The user can click the extension icon instead
        showNotification('Email captured! Click the ReplyAI extension icon to generate replies.');
    }

    function showNotification(message) {
        // Remove existing
        const existing = document.querySelector('.replyai-notification');
        if (existing) existing.remove();

        const notif = document.createElement('div');
        notif.className = 'replyai-notification';
        notif.innerHTML = `
      <div class="replyai-notif-icon">✨</div>
      <div class="replyai-notif-text">${message}</div>
    `;
        document.body.appendChild(notif);

        setTimeout(() => {
            notif.classList.add('replyai-notif-hide');
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }

    // ── Message Listener ──────────────────────────────────────
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === 'EXTRACT_EMAIL') {
            const emailContent = extractEmail();
            const subject = extractSubject();
            sendResponse({ emailContent, subject });
        }

        if (request.type === 'INSERT_REPLY') {
            const host = window.location.hostname;
            let success = false;

            if (host.includes('mail.google.com')) {
                success = insertReplyIntoGmail(request.replyBody, request.replySubject);
            } else if (host.includes('outlook')) {
                success = insertReplyIntoOutlook(request.replyBody, request.replySubject);
            }

            if (success) {
                showNotification('Reply inserted! ✅');
            } else {
                showNotification('Please open a reply/compose window first.');
            }

            sendResponse({ success });
        }

        return true;
    });

    // ── Init ──────────────────────────────────────────────────
    // Observe DOM changes and re-inject buttons
    const observer = new MutationObserver(() => {
        injectButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial injection
    setTimeout(injectButtons, 2000);
    setTimeout(injectButtons, 5000);

    console.log('[ReplyAI] Content script loaded');
})();
