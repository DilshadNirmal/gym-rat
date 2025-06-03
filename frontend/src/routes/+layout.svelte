<script>
  import { onMount } from 'svelte';
  import { user, isLoggedIn } from '$lib/stores.js';
  import { goto } from '$app/navigation';

  let currentUser = null;
  let loggedIn = false;

  user.subscribe(value => currentUser = value);
  isLoggedIn.subscribe(value => loggedIn = value);

  function logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    user.set(null);
    isLoggedIn.set(false);
    goto('/login');
  }
</script>

<nav>
  <div class="nav-container">
    <h1>GymRat 🏋️‍♂️</h1>
    {#if loggedIn}
      <div class="nav-links">
        <a href="/dashboard">Dashboard</a>
        <span>Welcome, {currentUser?.name}</span>
        <button on:click={logout}>Logout</button>
      </div>
    {/if}
  </div>
</nav>

<main>
  <slot />
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
  }

  nav {
    background-color: #2c3e50;
    color: white;
    padding: 1rem 0;
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
  }

  .nav-links {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .nav-links a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.3s;
  }

  .nav-links a:hover {
    background-color: #34495e;
  }

  button {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #c0392b;
  }

  main {
    min-height: calc(100vh - 80px);
  }
</style>