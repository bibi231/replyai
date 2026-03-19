// ReplyAI Popup — Full Logic
// Auth, auto-extract, generate, copy/insert, history, settings

(function () {
    'use strict';

    // ── State ─────────────────────────────────────
    let currentTone = 'professional';
    let currentReplies = [];
    let currentCredits = null;
    let currentUser = null;

    // ── DOM Refs ──────────────────────────────────
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const authScreen = $('#authScreen');
    const appContainer = $('#appContainer');
    const btnGoogleSignIn = $('#btnGoogleSignIn');
    const openWebapp = $('#openWebapp');
    const userEmail = $('#userEmail');
    const userAvatar = $('#userAvatar');
    const creditsBadge = $('#creditsBadge');
    const btnExtract = $('#btnExtract');
    const emailInput = $('#emailInput');
    const toneChips = $$('.tone-chip');
    const customToneGroup = $('#customToneGroup');
    const customToneInput = $('#customToneInput');
    const contextInput = $('#contextInput');
    const btnGenerate = $('#btnGenerate');
    const errorMsg = $('#errorMsg');
    const spinner = $('#spinner');
    const repliesContainer = $('#repliesContainer');
    const historyList = $('#historyList');
    const userMenu = $('#userMenu');

    // ── Init ──────────────────────────────────────
    async function init() {
        // Check stored auth
        const auth = await sendMessage({ type: 'GET_AUTH' });

        if (auth?.authToken && auth?.user) {
            currentUser = auth.user;
            showApp();
            refreshCredits();
            loadHistory();
        } else {
            showAuth();
        }

        bindEvents();

        // Check for extracted email from content script
        chrome.storage.local.get(['extractedEmail'], (result) => {
            if (result.extractedEmail) {
                emailInput.value = result.extractedEmail;
                chrome.storage.local.remove('extractedEmail');
                updateGenerateButton();
            }
        });
    }

    // ── Auth ───────────────────────────────────────
    function showAuth() {
        authScreen.style.display = 'flex';
        appContainer.classList.remove('active');
    }

    function showApp() {
        authScreen.style.display = 'none';
        appContainer.classList.add('active');

        if (currentUser) {
            userEmail.textContent = currentUser.email || '';
            userAvatar.src = currentUser.photoURL || generateAvatar(currentUser.email);
            $('#settingsEmail').textContent = currentUser.email || '—';
        }
    }

    function generateAvatar(email) {
        const name = (email || 'U').charAt(0).toUpperCase();
        return `https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff&size=64`;
    }

    async function handleGoogleSignIn() {
        btnGoogleSignIn.disabled = true;
        btnGoogleSignIn.textContent = 'Signing in...';

        try {
            // Use chrome.identity to get Google auth token
            const token = await new Promise((resolve, reject) => {
                chrome.identity.getAuthToken({ interactive: true }, (token) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve(token);
                    }
                });
            });

            // Get user info from Google
            const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userInfo = await userInfoRes.json();

            // Exchange Google token for Firebase ID token via our server
            // For now, we'll use the Google token directly as a bearer token
            // The server's verifyFirebaseToken middleware needs to handle this
            const user = {
                uid: userInfo.id,
                email: userInfo.email,
                displayName: userInfo.name,
                photoURL: userInfo.picture
            };

            // Store auth — We use the Google access token as our bearer
            const result = await sendMessage({
                type: 'LOGIN',
                token: token,
                user: user
            });

            currentUser = user;
            if (result.credits) {
                currentCredits = result.credits;
                updateCreditsUI();
            }

            showApp();
            refreshCredits();
            loadHistory();

        } catch (err) {
            showError('Sign-in failed: ' + err.message);
        } finally {
            btnGoogleSignIn.disabled = false;
            btnGoogleSignIn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> Sign in with Google`;
        }
    }

    async function handleSignOut() {
        await sendMessage({ type: 'LOGOUT' });

        // Revoke Google token
        chrome.identity.getAuthToken({ interactive: false }, (token) => {
            if (token) {
                chrome.identity.removeCachedAuthToken({ token });
                fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`);
            }
        });

        currentUser = null;
        currentCredits = null;
        currentReplies = [];
        repliesContainer.innerHTML = '';
        emailInput.value = '';
        showAuth();
    }

    // ── Credits ───────────────────────────────────
    async function refreshCredits() {
        try {
            const result = await sendMessage({ type: 'GET_CREDITS' });
            if (result?.credits) {
                currentCredits = result.credits;
                updateCreditsUI();
            }
        } catch (err) {
            console.error('Failed to refresh credits:', err);
        }
    }

    function updateCreditsUI() {
        if (!currentCredits) return;
        const total = (currentCredits.freeRemaining || 0) + (currentCredits.paidCredits || 0);
        creditsBadge.textContent = `${total} credit${total !== 1 ? 's' : ''}`;
        $('#settingsFree').textContent = currentCredits.freeRemaining ?? '—';
        $('#settingsPaid').textContent = currentCredits.paidCredits ?? '—';
        $('#settingsReset').textContent = currentCredits.resetDate
            ? new Date(currentCredits.resetDate).toLocaleDateString()
            : '—';
    }

    // ── Email Extraction ──────────────────────────
    async function handleExtract() {
        btnExtract.textContent = '⏳ Extracting...';
        btnExtract.disabled = true;

        try {
            const result = await sendMessage({ type: 'EXTRACT_EMAIL' });
            if (result?.emailContent) {
                emailInput.value = result.emailContent;
                updateGenerateButton();
                btnExtract.textContent = '✅ Email extracted!';
                setTimeout(() => {
                    btnExtract.textContent = '📧 Auto-extract email from current tab';
                    btnExtract.disabled = false;
                }, 2000);
            } else {
                btnExtract.textContent = '❌ No email found — paste manually';
                setTimeout(() => {
                    btnExtract.textContent = '📧 Auto-extract email from current tab';
                    btnExtract.disabled = false;
                }, 2000);
            }
        } catch (err) {
            btnExtract.textContent = '❌ Extraction failed';
            setTimeout(() => {
                btnExtract.textContent = '📧 Auto-extract email from current tab';
                btnExtract.disabled = false;
            }, 2000);
        }
    }

    // ── Reply Generation ──────────────────────────
    async function handleGenerate() {
        const emailContent = emailInput.value.trim();
        if (!emailContent) return;

        const tone = currentTone;
        const context = tone === 'custom'
            ? customToneInput.value.trim()
            : contextInput.value.trim();

        btnGenerate.disabled = true;
        spinner.classList.add('active');
        repliesContainer.innerHTML = '';
        hideError();

        try {
            const result = await sendMessage({
                type: 'GENERATE_REPLIES',
                emailContent,
                tone,
                context
            });

            if (result.error) {
                showError(result.error);
                return;
            }

            currentReplies = result.replies || [];
            renderReplies(currentReplies);

            // Update credits
            if (result.creditsRemaining) {
                currentCredits = {
                    freeRemaining: result.creditsRemaining.free,
                    paidCredits: result.creditsRemaining.paid,
                    resetDate: currentCredits?.resetDate
                };
                updateCreditsUI();
            }

        } catch (err) {
            showError(err.message || 'Failed to generate replies. Check your connection.');
        } finally {
            btnGenerate.disabled = false;
            spinner.classList.remove('active');
            updateGenerateButton();
        }
    }

    function renderReplies(replies) {
        repliesContainer.innerHTML = '';

        replies.forEach((reply, idx) => {
            const labels = ['Concise', 'Balanced', 'Thorough'];
            const icons = ['⚡', '✦', '📝'];
            const card = document.createElement('div');
            card.className = 'reply-card';
            card.innerHTML = `
        <div class="reply-header">
          <span class="reply-label">${icons[idx] || '✨'} ${reply.label || labels[idx] || `Draft ${idx + 1}`}</span>
          <span class="reply-meta">${reply.wordCount || '—'} words</span>
        </div>
        <div class="reply-subject">${escapeHtml(reply.subject || '')}</div>
        <div class="reply-body">${escapeHtml(reply.body || '')}</div>
        <div class="reply-actions">
          <button class="btn-copy" data-idx="${idx}">📋 Copy</button>
          <button class="btn-insert" data-idx="${idx}">📤 Insert into Email</button>
        </div>
      `;
            repliesContainer.appendChild(card);
        });

        // Bind copy/insert buttons
        repliesContainer.querySelectorAll('.btn-copy').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx);
                const reply = currentReplies[idx];
                if (reply) {
                    navigator.clipboard.writeText(reply.body).then(() => {
                        btn.textContent = '✅ Copied!';
                        setTimeout(() => btn.textContent = '📋 Copy', 1500);
                    });
                }
            });
        });

        repliesContainer.querySelectorAll('.btn-insert').forEach(btn => {
            btn.addEventListener('click', async () => {
                const idx = parseInt(btn.dataset.idx);
                const reply = currentReplies[idx];
                if (reply) {
                    btn.textContent = '⏳ Inserting...';
                    try {
                        await sendMessage({
                            type: 'INSERT_REPLY',
                            replyBody: reply.body,
                            replySubject: reply.subject
                        });
                        btn.textContent = '✅ Inserted!';
                        setTimeout(() => btn.textContent = '📤 Insert into Email', 2000);
                    } catch (err) {
                        btn.textContent = '❌ Open a compose window first';
                        setTimeout(() => btn.textContent = '📤 Insert into Email', 2000);
                    }
                }
            });
        });
    }

    // ── History ───────────────────────────────────
    async function loadHistory() {
        historyList.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⏳</div><div>Loading...</div></div>';

        try {
            const result = await sendMessage({ type: 'GET_HISTORY' });
            const history = Array.isArray(result) ? result : [];

            if (history.length === 0) {
                historyList.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><div>No history yet. Generate your first reply!</div></div>';
                return;
            }

            historyList.innerHTML = '';
            history.forEach(item => {
                const el = document.createElement('div');
                el.className = 'history-item';
                const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                }) : '';
                el.innerHTML = `
          <div class="history-snippet">"${escapeHtml((item.emailSnippet || '').substring(0, 100))}..."</div>
          <div class="history-meta">
            <span class="history-tone">${item.tone || '?'}</span>
            <span style="margin-left:8px;">${date}</span>
            <span style="margin-left:8px;color:${item.creditType === 'free' ? '#22c55e' : '#eab308'};">${item.creditType || ''}</span>
          </div>
        `;
                historyList.appendChild(el);
            });
        } catch (err) {
            historyList.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⚠️</div><div>Failed to load history</div></div>';
        }
    }

    // ── Event Binding ─────────────────────────────
    function bindEvents() {
        // Auth
        btnGoogleSignIn.addEventListener('click', handleGoogleSignIn);
        openWebapp.addEventListener('click', () => chrome.tabs.create({ url: 'http://localhost:5173' }));

        // Extract
        btnExtract.addEventListener('click', handleExtract);

        // Tone chips
        toneChips.forEach(chip => {
            chip.addEventListener('click', () => {
                toneChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                currentTone = chip.dataset.tone;
                customToneGroup.style.display = currentTone === 'custom' ? 'block' : 'none';
            });
        });

        // Generate
        btnGenerate.addEventListener('click', handleGenerate);
        emailInput.addEventListener('input', updateGenerateButton);

        // Tabs
        $$('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                $$('.tab').forEach(t => t.classList.remove('active'));
                $$('.tab-content').forEach(tc => tc.classList.remove('active'));
                tab.classList.add('active');
                $(`#tab${capitalize(tab.dataset.tab)}`).classList.add('active');

                if (tab.dataset.tab === 'history') loadHistory();
            });
        });

        // User avatar menu
        userAvatar.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenu.classList.toggle('active');
        });
        document.addEventListener('click', () => userMenu.classList.remove('active'));

        // Menu actions
        $('#menuWebapp').addEventListener('click', () => chrome.tabs.create({ url: 'http://localhost:5173' }));
        $('#menuLogout').addEventListener('click', handleSignOut);
        $('#btnSignOut').addEventListener('click', handleSignOut);
        $('#btnBuyCredits').addEventListener('click', () => chrome.tabs.create({ url: 'http://localhost:5173/pricing' }));

        // Listen for content script messages
        chrome.runtime.onMessage.addListener((msg) => {
            if (msg.type === 'CONTENT_EXTRACTED' && msg.emailContent) {
                emailInput.value = msg.emailContent;
                updateGenerateButton();
                // Switch to generate tab
                $$('.tab').forEach(t => t.classList.remove('active'));
                $$('.tab-content').forEach(tc => tc.classList.remove('active'));
                $$('.tab')[0].classList.add('active');
                $('#tabGenerate').classList.add('active');
            }
        });
    }

    // ── Helpers ───────────────────────────────────
    function updateGenerateButton() {
        btnGenerate.disabled = emailInput.value.trim().length === 0;
    }

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.classList.add('active');
    }

    function hideError() {
        errorMsg.classList.remove('active');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function capitalize(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    function sendMessage(msg) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(msg, (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else if (response?.error) {
                    reject(new Error(response.error));
                } else {
                    resolve(response);
                }
            });
        });
    }

    // ── Go ────────────────────────────────────────
    init();
})();
