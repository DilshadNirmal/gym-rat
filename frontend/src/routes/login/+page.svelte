
<script>
  import { goto } from '$app/navigation';
  import { user, isLoggedIn } from '$lib/stores.js';
  import { api } from '$lib/api.js';
  import { onMount } from 'svelte';

  let email = '';
  let password = '';
  let name = '';
  let phone = '';
  let role = 'MEMBER';
  let isLogin = true;
  let loading = false;
  let error = '';

  onMount(() => {
    if ($isLoggedIn) {
      goto('/dashboard');
    }
  });

  async function handleSubmit() {
    if (loading) return;
    
    loading = true;
    error = '';

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const data = isLogin 
        ? { email, password }
        : { name, email, password, phone, role };

      const response = await api.post(endpoint, data);
      
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_data', JSON.stringify(response.user));
        user.set(response.user);
        isLoggedIn.set(true);
        goto('/dashboard');
      }
    } catch (err) {
      error = err.message || 'An error occurred';
    } finally {
      loading = false;
    }
  }

  function toggleMode() {
    isLogin = !isLogin;
    error = '';
    email = '';
    password = '';
    name = '';
    phone = '';
    role = 'MEMBER';
  }
</script>

<div class="auth-page">
  <div class="auth-container">
    <div class="auth-content">
      <div class="auth-header">
        <div class="logo">
          <span class="logo-icon">🏋️‍♂️</span>
          <span class="logo-text">GymRat</span>
        </div>
        <h1 class="auth-title">
          {isLogin ? 'Welcome back.' : 'Get started with GymRat.'}
        </h1>
        <p class="auth-subtitle">
          {isLogin 
            ? 'Sign in to access your gym management dashboard.' 
            : 'Create your account and transform your fitness business.'}
        </p>
      </div>

      <form class="auth-form" on:submit|preventDefault={handleSubmit}>
        {#if !isLogin}
          <div class="form-group">
            <label for="name" class="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              bind:value={name}
              required
              class="form-input"
              placeholder="Enter your full name"
            />
          </div>
        {/if}

        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input
            type="email"
            id="email"
            bind:value={email}
            required
            class="form-input"
            placeholder="Enter your email"
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            id="password"
            bind:value={password}
            required
            class="form-input"
            placeholder="Enter your password"
          />
        </div>

        {#if !isLogin}
          <div class="form-group">
            <label for="phone" class="form-label">Phone Number</label>
            <input
              type="tel"
              id="phone"
              bind:value={phone}
              required
              class="form-input"
              placeholder="Enter your phone number"
            />
          </div>

          <div class="form-group">
            <label for="role" class="form-label">Account Type</label>
            <select id="role" bind:value={role} class="form-select">
              <option value="MEMBER">Member</option>
              <option value="GYM_OWNER">Gym Owner</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>
        {/if}

        {#if error}
          <div class="error-message">
            {error}
          </div>
        {/if}

        <button type="submit" class="submit-button" disabled={loading}>
          {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
        </button>
      </form>

      <div class="auth-footer">
        <p class="switch-text">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button class="switch-button" on:click={toggleMode}>
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>

    <div class="auth-visual">
      <div class="visual-content">
        <div class="feature-highlight">
          <div class="highlight-icon">📊</div>
          <h3>Real-time Analytics</h3>
          <p>Get instant insights into your gym's performance with beautiful, actionable dashboards.</p>
        </div>
        <div class="feature-highlight">
          <div class="highlight-icon">🔒</div>
          <h3>Enterprise Security</h3>
          <p>Your data is protected with bank-level security and advanced encryption.</p>
        </div>
        <div class="feature-highlight">
          <div class="highlight-icon">🌍</div>
          <h3>Global Reach</h3>
          <p>Trusted by fitness businesses worldwide, from boutique studios to large chains.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .auth-page {
    min-height: 100vh;
    background: #f5f5f7;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .auth-container {
    max-width: 1200px;
    width: 100%;
    background: white;
    border-radius: 18px;
    box-shadow: 0 4px 40px rgba(0, 0, 0, 0.1);
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
    min-height: 600px;
  }

  .auth-content {
    padding: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .auth-header {
    margin-bottom: 40px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 32px;
  }

  .logo-icon {
    font-size: 32px;
  }

  .logo-text {
    font-size: 24px;
    font-weight: 600;
    color: #1d1d1f;
  }

  .auth-title {
    font-size: 32px;
    line-height: 1.125;
    font-weight: 600;
    letter-spacing: 0.004em;
    margin: 0 0 16px;
    color: #1d1d1f;
  }

  .auth-subtitle {
    font-size: 17px;
    line-height: 1.47059;
    font-weight: 400;
    letter-spacing: -0.022em;
    margin: 0;
    color: #86868b;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-label {
    font-size: 14px;
    font-weight: 400;
    color: #1d1d1f;
    letter-spacing: -0.016em;
  }

  .form-input,
  .form-select {
    padding: 16px;
    border: 1px solid #d2d2d7;
    border-radius: 12px;
    font-size: 17px;
    line-height: 1.23536;
    font-weight: 400;
    letter-spacing: -0.022em;
    background: white;
    transition: all 0.3s ease;
    color: #1d1d1f;
  }

  .form-input:focus,
  .form-select:focus {
    outline: none;
    border-color: #0071e3;
    box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
  }

  .form-input::placeholder {
    color: #86868b;
  }

  .error-message {
    background: #ff3b30;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    text-align: center;
  }

  .submit-button {
    background: #0071e3;
    color: white;
    border: none;
    padding: 16px;
    border-radius: 12px;
    font-size: 17px;
    line-height: 1.23536;
    font-weight: 400;
    letter-spacing: -0.022em;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 8px;
  }

  .submit-button:hover:not(:disabled) {
    background: #0077ed;
    transform: translateY(-1px);
  }

  .submit-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .auth-footer {
    margin-top: 32px;
    text-align: center;
  }

  .switch-text {
    font-size: 14px;
    color: #86868b;
    margin: 0;
  }

  .switch-button {
    background: none;
    border: none;
    color: #0071e3;
    font-size: 14px;
    cursor: pointer;
    text-decoration: none;
    padding: 0;
    margin-left: 4px;
  }

  .switch-button:hover {
    text-decoration: underline;
  }

  .auth-visual {
    background: linear-gradient(135deg, #0071e3, #005bb5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 40px;
    color: white;
  }

  .visual-content {
    display: flex;
    flex-direction: column;
    gap: 40px;
    max-width: 400px;
  }

  .feature-highlight {
    text-align: center;
  }

  .highlight-icon {
    font-size: 48px;
    margin-bottom: 16px;
    display: block;
  }

  .feature-highlight h3 {
    font-size: 21px;
    line-height: 1.381;
    font-weight: 600;
    letter-spacing: 0.011em;
    margin: 0 0 12px;
  }

  .feature-highlight p {
    font-size: 17px;
    line-height: 1.47059;
    font-weight: 400;
    letter-spacing: -0.022em;
    margin: 0;
    color: rgba(255, 255, 255, 0.8);
  }

  @media (max-width: 1068px) {
    .auth-container {
      grid-template-columns: 1fr;
      max-width: 500px;
    }

    .auth-visual {
      display: none;
    }

    .auth-content {
      padding: 40px;
    }
  }

  @media (max-width: 734px) {
    .auth-page {
      padding: 16px;
    }

    .auth-content {
      padding: 32px 24px;
    }

    .auth-title {
      font-size: 28px;
    }

    .auth-subtitle {
      font-size: 16px;
    }
  }
</style>
