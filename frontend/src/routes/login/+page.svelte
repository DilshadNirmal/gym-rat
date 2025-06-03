
<script>
  import { auth } from '$lib/api.js';
  import { isAuthenticated, user } from '$lib/stores.js';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let error = '';
  let loading = false;

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
      isAuthenticated.set(true);
      user.set(response.user);
      goto('/dashboard');
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Login - GymRat</title>
</svelte:head>

<div class="login-container">
  <div class="login-card">
    <h2>Login to GymRat</h2>
    
    {#if error}
      <div class="error">{error}</div>
    {/if}

    <form on:submit|preventDefault={handleLogin}>
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          bind:value={email}
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          required
        />
      </div>

      <button type="submit" disabled={loading} class="login-btn">
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>

    <p>
      Don't have an account? 
      <a href="/register">Register here</a>
    </p>
  </div>
</div>

<style>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 70vh;
  }

  .login-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .login-btn {
    width: 100%;
    background-color: #3498db;
    color: white;
    border: none;
    padding: 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }

  .login-btn:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }

  .error {
    background-color: #ffeaea;
    color: #e74c3c;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  a {
    color: #3498db;
    text-decoration: none;
  }
</style>
