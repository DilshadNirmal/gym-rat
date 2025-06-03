
<script>
  import { onMount } from 'svelte';
  import { user, isLoggedIn } from '$lib/stores.js';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let currentUser = null;
  let loggedIn = false;
  let mobileMenuOpen = false;

  user.subscribe(value => currentUser = value);
  isLoggedIn.subscribe(value => loggedIn = value);

  function logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    user.set(null);
    isLoggedIn.set(false);
    goto('/login');
  }

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  onMount(() => {
    // Close mobile menu when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.mobile-menu') && !event.target.closest('.mobile-menu-toggle')) {
        mobileMenuOpen = false;
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });
</script>

<div class="app-container">
  <nav class="navbar">
    <div class="nav-container">
      <div class="brand">
        <div class="logo">
          <span class="logo-icon">🏋️‍♂️</span>
          <span class="logo-text">GymRat</span>
        </div>
      </div>
      
      {#if loggedIn}
        <div class="nav-links desktop-only">
          <a href="/dashboard" class="nav-link" class:active={$page.url.pathname === '/dashboard'}>
            <span class="nav-icon">📊</span>
            Dashboard
          </a>
          <div class="user-menu">
            <div class="user-avatar">
              <span>{currentUser?.name?.charAt(0)?.toUpperCase()}</span>
            </div>
            <div class="user-info">
              <span class="user-name">{currentUser?.name}</span>
              <span class="user-role">{currentUser?.role}</span>
            </div>
            <button class="logout-btn" on:click={logout}>
              <span>🚪</span>
              Logout
            </button>
          </div>
        </div>

        <button class="mobile-menu-toggle mobile-only" on:click={toggleMobileMenu}>
          <span class="hamburger"></span>
        </button>

        {#if mobileMenuOpen}
          <div class="mobile-menu">
            <a href="/dashboard" class="mobile-nav-link" on:click={() => mobileMenuOpen = false}>
              <span class="nav-icon">📊</span>
              Dashboard
            </a>
            <div class="mobile-user-info">
              <span class="user-name">{currentUser?.name}</span>
              <span class="user-role">{currentUser?.role}</span>
            </div>
            <button class="mobile-logout-btn" on:click={logout}>
              <span>🚪</span>
              Logout
            </button>
          </div>
        {/if}
      {/if}
    </div>
  </nav>

  <main class="main-content">
    <slot />
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #ffffff;
    overflow-x: hidden;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .navbar {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  .nav-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .brand .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .logo-icon {
    font-size: 2rem;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
  }

  .logo-text {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 25px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .nav-link::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  .nav-link:hover::before {
    left: 100%;
  }

  .nav-link:hover,
  .nav-link.active {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  .user-menu {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.5rem 1rem;
    border-radius: 50px;
    backdrop-filter: blur(10px);
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  .user-info {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .user-name {
    font-weight: 600;
    font-size: 0.9rem;
  }

  .user-role {
    font-size: 0.8rem;
    opacity: 0.7;
    text-transform: capitalize;
  }

  .logout-btn {
    background: rgba(255, 107, 107, 0.2);
    color: #ffffff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 25px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    font-size: 0.9rem;
  }

  .logout-btn:hover {
    background: rgba(255, 107, 107, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  }

  .mobile-menu-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: background-color 0.3s ease;
  }

  .mobile-menu-toggle:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .hamburger {
    display: block;
    width: 25px;
    height: 3px;
    background: #ffffff;
    position: relative;
    border-radius: 3px;
    transition: all 0.3s ease;
  }

  .hamburger::before,
  .hamburger::after {
    content: '';
    position: absolute;
    width: 25px;
    height: 3px;
    background: #ffffff;
    border-radius: 3px;
    transition: all 0.3s ease;
  }

  .hamburger::before {
    top: -8px;
  }

  .hamburger::after {
    bottom: -8px;
  }

  .mobile-menu {
    position: absolute;
    top: 100%;
    right: 2rem;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    padding: 1rem;
    min-width: 200px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    animation: slideDown 0.3s ease;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .mobile-nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #ffffff;
    text-decoration: none;
    padding: 0.75rem;
    border-radius: 10px;
    transition: background-color 0.3s ease;
    margin-bottom: 0.5rem;
  }

  .mobile-nav-link:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .mobile-user-info {
    padding: 0.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    margin: 0.5rem 0;
  }

  .mobile-logout-btn {
    width: 100%;
    background: rgba(255, 107, 107, 0.2);
    color: #ffffff;
    border: none;
    padding: 0.75rem;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
  }

  .mobile-logout-btn:hover {
    background: rgba(255, 107, 107, 0.4);
  }

  .main-content {
    flex: 1;
    position: relative;
  }

  .desktop-only {
    display: flex;
  }

  .mobile-only {
    display: none;
  }

  @media (max-width: 768px) {
    .desktop-only {
      display: none;
    }

    .mobile-only {
      display: block;
    }

    .nav-container {
      padding: 1rem;
    }
  }
</style>
