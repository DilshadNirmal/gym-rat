
<script>
  import { onMount } from 'svelte';
  import { user, isAuthenticated } from '$lib/stores.js';
  import 'open-props/style';
  import 'open-props/normalize';

  onMount(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      isAuthenticated.set(true);
      // You might want to decode and set user data here
    }
  });
</script>

<svelte:head>
  <title>GymRat - Gym Management</title>
</svelte:head>

<div class="app">
  <header class="header">
    <nav class="nav">
      <div class="nav-brand">
        <h1>GymRat 🏋️‍♂️</h1>
      </div>
      
      {#if $isAuthenticated}
        <div class="nav-links">
          <a href="/dashboard">Dashboard</a>
          <a href="/gyms">Gyms</a>
          <a href="/members">Members</a>
          <button class="btn-logout" on:click={() => {
            localStorage.removeItem('auth_token');
            isAuthenticated.set(false);
            window.location.href = '/login';
          }}>
            Logout
          </button>
        </div>
      {/if}
    </nav>
  </header>

  <main class="main">
    <slot />
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: var(--font-sans);
    background-color: var(--gray-1);
    color: var(--gray-9);
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .header {
    background-color: var(--blue-6);
    color: white;
    padding: var(--size-3);
    box-shadow: var(--shadow-2);
  }

  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .nav-brand h1 {
    margin: 0;
    font-size: var(--font-size-4);
    font-weight: var(--font-weight-7);
  }

  .nav-links {
    display: flex;
    gap: var(--size-4);
    align-items: center;
  }

  .nav-links a {
    color: white;
    text-decoration: none;
    padding: var(--size-2) var(--size-3);
    border-radius: var(--radius-2);
    transition: background-color 0.2s;
  }

  .nav-links a:hover {
    background-color: var(--blue-7);
  }

  .btn-logout {
    background-color: var(--red-6);
    color: white;
    border: none;
    padding: var(--size-2) var(--size-3);
    border-radius: var(--radius-2);
    cursor: pointer;
    font-size: var(--font-size-1);
    transition: background-color 0.2s;
  }

  .btn-logout:hover {
    background-color: var(--red-7);
  }

  .main {
    flex: 1;
    padding: var(--size-4);
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }
</style>
