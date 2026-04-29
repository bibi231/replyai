// ReplyAI Background Service Worker
// Manages auth state, proxies API calls, handles messages from popup + content scripts

const API_BASE = 'http://localhost:4000';

// ── Auth State ──────────────────────────────────────────────
async function getStoredAuth() {
    const result = await chrome.storage.local.get(['authToken', 'user']);
    return result;
}

async function setStoredAuth(token, user) {
    await chrome.storage.local.set({ authToken: token, user });
}

async function clearAuth() {
    await chrome.storage.local.remove(['authToken', 'user']);
}

// ── API Helpers ─────────────────────────────────────────────
async function apiRequest(path, options = {}) {
    const { authToken } = await getStoredAuth();
    const url = `${API_BASE}${path}`;

    const headers = {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...options.headers
    };

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
}

// ── Message Handler ─────────────────────────────────────────
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    handleMessage(request, sender).then(sendResponse).catch(err => {
        sendResponse({ error: err.message });
    });
    return true; // Keep channel open for async
});

async function handleMessage(request, sender) {
    switch (request.type) {
        case 'LOGIN':
            return handleLogin(request);

        case 'LOGOUT':
            await clearAuth();
            return { success: true };

        case 'GET_AUTH':
            return getStoredAuth();

        case 'GENERATE_REPLIES':
            return apiRequest('/api/reply/generate', {
                method: 'POST',
                body: JSON.stringify({
                    emailContent: request.emailContent,
                    tone: request.tone,
                    context: request.context,
                    outputLanguage: request.outputLanguage
                })
            });

        case 'GET_CREDITS':
            return apiRequest('/api/auth/sync', {
                method: 'POST',
                body: JSON.stringify({})
            });

        case 'GET_HISTORY':
            return apiRequest('/api/reply/history');

        case 'EXTRACT_EMAIL':
            // Forward to content script in the active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab?.id) {
                return chrome.tabs.sendMessage(tab.id, { type: 'EXTRACT_EMAIL' });
            }
            return { emailContent: '' };

        case 'INSERT_REPLY':
            // Forward to content script to insert into compose
            const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (activeTab?.id) {
                return chrome.tabs.sendMessage(activeTab.id, {
                    type: 'INSERT_REPLY',
                    replyBody: request.replyBody,
                    replySubject: request.replySubject
                });
            }
            return { success: false };

        default:
            return { error: 'Unknown message type' };
    }
}

async function handleLogin(request) {
    // We receive the Firebase ID token from the popup (which uses Firebase Auth JS SDK via identity)
    // Store it and sync with server
    const { token, user } = request;
    await setStoredAuth(token, user);

    try {
        const syncResult = await apiRequest('/api/auth/sync', {
            method: 'POST',
            body: JSON.stringify({
                displayName: user.displayName,
                photoUrl: user.photoURL
            })
        });

        return { success: true, credits: syncResult.credits };
    } catch (err) {
        return { success: true, credits: null, warning: err.message };
    }
}

// Open webapp when extension icon is clicked and popup is not available
chrome.action.onClicked?.addListener(() => {
    chrome.tabs.create({ url: 'http://localhost:5173' });
});
