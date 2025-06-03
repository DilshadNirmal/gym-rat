
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { auth } from '$lib/api.js';
  import { user, isLoggedIn } from '$lib/stores.js';
  
  let email = '';
  let password = '';
  let error = '';
  let loading = false;
  let showPassword = false;
  
  let formElement;
  
  async function handleLogin() {
    if (!email || !password) {
      error = 'Please fill in all fields';
      return;
    }
    
    loading = true;
    error = '';
    
    try {
      const response = await auth.login({ email, password });
      
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      
      user.set(response.user);
      isLoggedIn.set(true);
      
      goto('/dashboard');
    } catch (err) {
      error = err.message || 'Login failed';
      formElement.classList.add('shake');
      setTimeout(() => formElement.classList.remove('shake'), 500);
    } finally {
      loading = false;
    }
  }

  function togglePassword() {
    showPassword = !showPassword;
  }

  onMount(() => {
    // Create floating particles
    const container = document.querySelector('.login-container');
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 20 + 's';
      particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
      container.appendChild(particle);
    }
  });
</script>

<div class="login-container">
  <div class="login-form" bind:this={formElement}>
    <div class="form-header">
      <div class="logo-container">
        <div class="logo-icon">🏋️‍♂️</div>
        <h2>Welcome to GymRat</h2>
        <p class="subtitle">Enter your credentials to access your dashboard</p>
      </div>
    </div>
    
    {#if error}
      <div class="error-message">{error}</div>
    {/if}
    
    <form on:submit|preventDefault={handleLogin}>
      <div class="input-group">
        <div class="input-container">
          <input 
            type="email" 
            id="email" 
            bind:value={email}
            placeholder=" "
            required
            disabled={loading}
            class="form-input"
          />
          <label for="email" class="form-label">📧 Email Address</label>
          <div class="input-line"></div>
        </div>
      </div>
      
      <div class="input-group">
        <div class="input-container">
          <input 
            type={showPassword ? 'text' : 'password'}
            id="password" 
            bind:value={password}
            placeholder=" "
            required
            disabled={loading}
            class="form-input"
          />
          <label for="password" class="form-label">🔒 Password</label>
          <button type="button" class="password-toggle" on:click={togglePassword}>
            {showPassword ? '👁️' : '🙈'}
          </button>
          <div class="input-line"></div>
        </div>
      </div>
      
      <button type="submit" class="submit-btn" disabled={loading}>
        {#if loading}
          <div class="loading-spinner"></div>
          <span>Logging in...</span>
        {:else}
          <span>🚀 Launch Dashboard</span>
        {/if}
      </button>
    </form>

    <div class="form-footer">
      <p>Don't have an account? <a href="#" class="signup-link">Contact Admin</a></p>
    </div>
  </div>
</div>

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }

  .particle {
    position: absolute;
    width: 2px;
    height: 2px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    animation: float linear infinite;
  }

  @keyframes float {
    0% {
      transform: translateY(100vh) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-10vh) rotate(360deg);
      opacity: 0;
    }
  }

  .login-form {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 25px;
    padding: 3rem;
    width: 100%;
    max-width: 450px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow: hidden;
    animation: slideUp 0.8s ease;
  }

  .login-form::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.8s;
  }

  .login-form:hover::before {
    left: 100%;
  }

  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .shake {
    animation: shake 0.5s ease-in-out;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }

  .form-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .logo-container .logo-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    display: block;
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  .logo-container h2 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    font-weight: bold;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    margin: 0;
    opacity: 0.8;
    font-size: 0.9rem;
  }

  .input-group {
    margin-bottom: 2rem;
  }

  .input-container {
    position: relative;
  }

  .form-input {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    color: #ffffff;
    font-size: 1rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .form-input:focus {
    outline: none;
    border-color: rgba(78, 205, 196, 0.6);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 20px rgba(78, 205, 196, 0.3);
  }

  .form-input:focus + .form-label,
  .form-input:not(:placeholder-shown) + .form-label {
    transform: translateY(-2.5rem) scale(0.8);
    color: #4ecdc4;
  }

  .form-label {
    position: absolute;
    left: 1rem;
    top: 1rem;
    color: rgba(255, 255, 255, 0.7);
    transition: all 0.3s ease;
    pointer-events: none;
    font-size: 0.9rem;
  }

  .input-line {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    transition: width 0.3s ease;
  }

  .form-input:focus ~ .input-line {
    width: 100%;
  }

  .password-toggle {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.3s ease;
  }

  .password-toggle:hover {
    color: #ffffff;
    transform: translateY(-50%) scale(1.1);
  }

  .submit-btn {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    color: #ffffff;
    border: none;
    border-radius: 15px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .submit-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  .submit-btn:hover::before {
    left: 100%;
  }

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }

  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid #ffffff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-message {
    background: rgba(255, 107, 107, 0.2);
    color: #ff6b6b;
    padding: 1rem;
    border-radius: 15px;
    margin-bottom: 1.5rem;
    border: 1px solid rgba(255, 107, 107, 0.3);
    backdrop-filter: blur(10px);
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .form-footer {
    text-align: center;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .form-footer p {
    margin: 0;
    opacity: 0.8;
    font-size: 0.9rem;
  }

  .signup-link {
    color: #4ecdc4;
    text-decoration: none;
    font-weight: bold;
    transition: all 0.3s ease;
  }

  .signup-link:hover {
    color: #ff6b6b;
    text-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
  }

  @media (max-width: 480px) {
    .login-form {
      padding: 2rem;
      margin: 1rem;
    }
    
    .logo-container .logo-icon {
      font-size: 3rem;
    }
    
    .logo-container h2 {
      font-size: 1.5rem;
    }
  }
</style>
