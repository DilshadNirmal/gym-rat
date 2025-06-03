
<script>
  import { onMount } from 'svelte';
  import { user, isAuthenticated } from '$lib/stores.js';
  import { auth } from '$lib/api.js';

  let mounted = false;

  onMount(() => {
    mounted = true;
  });

  function handleLogout() {
    auth.logout();
    isAuthenticated.set(false);
    user.set(null);
    window.location.href = '/login';
  }
</script>

<nav class="navbar">
  <div class="nav-brand">
    <h1>GymRat 🏋️‍♂️</h1>
  </div>
  
  {#if $isAuthenticated}
    <div class="nav-links">
      <a href="/dashboard">Dashboard</a>
      <a href="/gyms">Gyms</a>
      <a href="/members">Members</a>
      <button on:click={handleLogout} class="logout-btn">Logout</button>
    </div>
  {/if}
</nav>

<main>
  <slot />
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #f5f5f5;
  }

  .navbar {
    background-color: #2c3e50;
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-brand h1 {
    margin: 0;
    font-size: 1.5rem;
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
    transition: background-color 0.2s;
  }

  .nav-links a:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .logout-btn {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }

  main {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
</style>
