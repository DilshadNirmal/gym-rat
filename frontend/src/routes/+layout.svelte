
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
              Sign Out
            </button>
          </div>
        </div>

        <button class="mobile-menu-toggle mobile-only" on:click={toggleMobileMenu}>
          <span class="hamburger" class:open={mobileMenuOpen}></span>
        </button>

        {#if mobileMenuOpen}
          <div class="mobile-menu">
            <a href="/dashboard" class="mobile-nav-link" on:click={() => mobileMenuOpen = false}>
              Dashboard
            </a>
            <div class="mobile-user-info">
              <span class="user-name">{currentUser?.name}</span>
              <span class="user-role">{currentUser?.role}</span>
            </div>
            <button class="mobile-logout-btn" on:click={logout}>
              Sign Out
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
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    background: #f5f5f7;
    color: #1d1d1f;
    overflow-x: hidden;
    line-height: 1.47059;
    font-weight: 400;
    letter-spacing: -0.022em;
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
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: saturate(180%) blur(20px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 9999;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .nav-container {
    max-width: 980px;
    margin: 0 auto;
    padding: 0 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 44px;
  }

  .brand .logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 21px;
    font-weight: 600;
    color: #1d1d1f;
  }

  .logo-icon {
    font-size: 24px;
  }

  .logo-text {
    color: #1d1d1f;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 40px;
  }

  .nav-link {
    color: #1d1d1f;
    text-decoration: none;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: -0.01em;
    padding: 8px 0;
    position: relative;
    transition: color 0.3s ease;
  }

  .nav-link:hover,
  .nav-link.active {
    color: #0071e3;
  }

  .user-menu {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(255, 255, 255, 0.8);
    padding: 8px 16px;
    border-radius: 980px;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .user-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0071e3, #005bb5);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 12px;
    color: white;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .user-name {
    font-weight: 600;
    font-size: 12px;
    color: #1d1d1f;
    line-height: 1.2;
  }

  .user-role {
    font-size: 10px;
    color: #86868b;
    text-transform: lowercase;
    line-height: 1.2;
  }

  .logout-btn {
    background: #0071e3;
    color: white;
    border: none;
    padding: 6px 14px;
    border-radius: 980px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 400;
    transition: all 0.3s ease;
    letter-spacing: -0.01em;
  }

  .logout-btn:hover {
    background: #0077ed;
    transform: translateY(-1px);
  }

  .mobile-menu-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: background-color 0.3s ease;
  }

  .mobile-menu-toggle:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  .hamburger {
    display: block;
    width: 18px;
    height: 2px;
    background: #1d1d1f;
    position: relative;
    border-radius: 1px;
    transition: all 0.3s ease;
  }

  .hamburger::before,
  .hamburger::after {
    content: '';
    position: absolute;
    width: 18px;
    height: 2px;
    background: #1d1d1f;
    border-radius: 1px;
    transition: all 0.3s ease;
  }

  .hamburger::before {
    top: -6px;
  }

  .hamburger::after {
    bottom: -6px;
  }

  .hamburger.open {
    background: transparent;
  }

  .hamburger.open::before {
    transform: rotate(45deg);
    top: 0;
  }

  .hamburger.open::after {
    transform: rotate(-45deg);
    bottom: 0;
  }

  .mobile-menu {
    position: absolute;
    top: 100%;
    right: 22px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: saturate(180%) blur(20px);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    padding: 16px;
    min-width: 200px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    animation: slideDown 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .mobile-nav-link {
    display: flex;
    align-items: center;
    color: #1d1d1f;
    text-decoration: none;
    padding: 12px 0;
    font-size: 14px;
    font-weight: 400;
    transition: color 0.3s ease;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .mobile-nav-link:last-child {
    border-bottom: none;
  }

  .mobile-nav-link:hover {
    color: #0071e3;
  }

  .mobile-user-info {
    padding: 12px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 12px;
  }

  .mobile-logout-btn {
    width: 100%;
    background: #0071e3;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 400;
    transition: all 0.3s ease;
  }

  .mobile-logout-btn:hover {
    background: #0077ed;
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

  @media (max-width: 1068px) {
    .nav-container {
      max-width: 692px;
      padding: 0 22px;
    }
  }

  @media (max-width: 734px) {
    .desktop-only {
      display: none;
    }

    .mobile-only {
      display: block;
    }

    .nav-container {
      padding: 0 16px;
    }
  }
</style>
