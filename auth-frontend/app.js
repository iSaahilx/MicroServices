const API_BASE = 'http://localhost:3000/user';

const logPanel = document.getElementById('log');
const sessionStatus = document.getElementById('session-status');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const verifyBtn = document.getElementById('verify-btn');
const logoutBtn = document.getElementById('logout-btn');

const log = (message) => {
  const time = new Date().toLocaleTimeString();
  logPanel.textContent = `[${time}] ${message}\n` + logPanel.textContent;
};

async function request(path, options = {}) {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    ...options
  };

  const response = await fetch(`${API_BASE}${path}`, config);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

async function refreshSession() {
  sessionStatus.textContent = 'Checking...';
  try {
    const data = await request('/verify');
    sessionStatus.textContent = `Logged in as ${data.user.name} (${data.user.email})`;
    log('Session verified');
  } catch (error) {
    sessionStatus.textContent = 'Not authenticated';
    log(`Session check failed: ${error.message}`);
  }
}

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(registerForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    await request('/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    log('Registration successful');
    registerForm.reset();
    refreshSession();
  } catch (error) {
    log(`Registration failed: ${error.message}`);
  }
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const data = await request('/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const token = data?.token;
    log('Login successful');
    loginForm.reset();
    refreshSession();
    if (token) {
      const redirectUrl = `http://localhost:3003?token=${encodeURIComponent(token)}`;
      window.location.href = redirectUrl;
    } else {
      window.location.href = 'http://localhost:3003';
    }
  } catch (error) {
    log(`Login failed: ${error.message}`);
  }
});

verifyBtn.addEventListener('click', refreshSession);

logoutBtn.addEventListener('click', async () => {
  try {
    await request('/logout', { method: 'POST' });
    log('Logged out');
    refreshSession();
  } catch (error) {
    log(`Logout failed: ${error.message}`);
  }
});

refreshSession();

