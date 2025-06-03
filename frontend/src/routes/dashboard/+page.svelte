
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { user, isLoggedIn, gyms, members } from '$lib/stores.js';
  import { api } from '$lib/api.js';

  let currentUser = null;
  let userGyms = [];
  let gymMembers = [];
  let loading = true;
  let error = '';
  let activeTab = 'overview';

  user.subscribe(value => currentUser = value);

  onMount(async () => {
    if (!$isLoggedIn) {
      goto('/login');
      return;
    }

    try {
      if (currentUser?.role === 'GYM_OWNER' || currentUser?.role === 'ADMIN') {
        const gymsResponse = await api.get('/gyms');
        userGyms = gymsResponse.gyms || [];
        gyms.set(userGyms);

        const membersResponse = await api.get('/members');
        gymMembers = membersResponse.members || [];
        members.set(gymMembers);
      }
    } catch (err) {
      error = err.message || 'Failed to load data';
    } finally {
      loading = false;
    }
  });

  function setActiveTab(tab) {
    activeTab = tab;
  }

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  $: stats = {
    totalGyms: userGyms.length,
    totalMembers: gymMembers.length,
    activeMembers: gymMembers.filter(m => m.status === 'ACTIVE').length,
    revenue: gymMembers.length * 1500 // Mock calculation
  };
</script>

{#if loading}
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>Loading your dashboard...</p>
  </div>
{:else}
  <div class="dashboard">
    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="welcome-section">
            <h1 class="welcome-title">{getGreeting()}, {currentUser?.name}.</h1>
            <p class="welcome-subtitle">Here's what's happening with your fitness business today.</p>
          </div>
          <div class="header-actions">
            <button class="action-button secondary">
              <span class="button-icon">📊</span>
              Reports
            </button>
            <button class="action-button primary">
              <span class="button-icon">➕</span>
              Add Member
            </button>
          </div>
        </div>
      </header>

      <!-- Navigation Tabs -->
      <nav class="dashboard-nav">
        <div class="nav-tabs">
          <button 
            class="nav-tab" 
            class:active={activeTab === 'overview'}
            on:click={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            class="nav-tab" 
            class:active={activeTab === 'gyms'}
            on:click={() => setActiveTab('gyms')}
          >
            Gyms
          </button>
          <button 
            class="nav-tab" 
            class:active={activeTab === 'members'}
            on:click={() => setActiveTab('members')}
          >
            Members
          </button>
          <button 
            class="nav-tab" 
            class:active={activeTab === 'analytics'}
            on:click={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="dashboard-main">
        {#if activeTab === 'overview'}
          <!-- Stats Cards -->
          <section class="stats-section">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-header">
                  <span class="stat-icon">🏢</span>
                  <span class="stat-label">Total Gyms</span>
                </div>
                <div class="stat-value">{stats.totalGyms}</div>
                <div class="stat-change positive">+2 this month</div>
              </div>
              <div class="stat-card">
                <div class="stat-header">
                  <span class="stat-icon">👥</span>
                  <span class="stat-label">Total Members</span>
                </div>
                <div class="stat-value">{stats.totalMembers}</div>
                <div class="stat-change positive">+{Math.floor(stats.totalMembers * 0.12)} this month</div>
              </div>
              <div class="stat-card">
                <div class="stat-header">
                  <span class="stat-icon">✅</span>
                  <span class="stat-label">Active Members</span>
                </div>
                <div class="stat-value">{stats.activeMembers}</div>
                <div class="stat-change neutral">{Math.round((stats.activeMembers / stats.totalMembers) * 100)}% of total</div>
              </div>
              <div class="stat-card">
                <div class="stat-header">
                  <span class="stat-icon">💰</span>
                  <span class="stat-label">Monthly Revenue</span>
                </div>
                <div class="stat-value">₹{stats.revenue.toLocaleString()}</div>
                <div class="stat-change positive">+8.2% from last month</div>
              </div>
            </div>
          </section>

          <!-- Recent Activity -->
          <section class="activity-section">
            <div class="section-header">
              <h2 class="section-title">Recent Activity</h2>
              <button class="section-action">View All</button>
            </div>
            <div class="activity-list">
              <div class="activity-item">
                <div class="activity-avatar">👤</div>
                <div class="activity-content">
                  <div class="activity-title">New member registration</div>
                  <div class="activity-subtitle">John Doe joined CrossFit Downtown</div>
                </div>
                <div class="activity-time">2h ago</div>
              </div>
              <div class="activity-item">
                <div class="activity-avatar">💳</div>
                <div class="activity-content">
                  <div class="activity-title">Payment received</div>
                  <div class="activity-subtitle">₹1,500 from Sarah Wilson</div>
                </div>
                <div class="activity-time">4h ago</div>
              </div>
              <div class="activity-item">
                <div class="activity-avatar">📊</div>
                <div class="activity-content">
                  <div class="activity-title">Monthly report generated</div>
                  <div class="activity-subtitle">October performance summary</div>
                </div>
                <div class="activity-time">1d ago</div>
              </div>
            </div>
          </section>
        {/if}

        {#if activeTab === 'gyms'}
          <section class="content-section">
            <div class="section-header">
              <h2 class="section-title">Your Gyms</h2>
              <button class="section-action primary">Add New Gym</button>
            </div>
            <div class="gym-grid">
              {#each userGyms as gym}
                <div class="gym-card">
                  <div class="gym-header">
                    <h3 class="gym-name">{gym.name}</h3>
                    <span class="gym-status active">Active</span>
                  </div>
                  <div class="gym-details">
                    <div class="gym-location">
                      📍 {gym.location.city}, {gym.location.state}
                    </div>
                    <div class="gym-plan">
                      💎 {gym.subscription.plan} Plan
                    </div>
                    <div class="gym-members">
                      👥 {gym.members?.length || 0} Members
                    </div>
                  </div>
                  <div class="gym-actions">
                    <button class="gym-action">View Details</button>
                    <button class="gym-action secondary">Manage</button>
                  </div>
                </div>
              {/each}
            </div>
          </section>
        {/if}

        {#if activeTab === 'members'}
          <section class="content-section">
            <div class="section-header">
              <h2 class="section-title">Members</h2>
              <button class="section-action primary">Add Member</button>
            </div>
            <div class="members-table">
              <div class="table-header">
                <div class="table-cell">Name</div>
                <div class="table-cell">Gym</div>
                <div class="table-cell">Status</div>
                <div class="table-cell">Membership</div>
                <div class="table-cell">Actions</div>
              </div>
              {#each gymMembers.slice(0, 10) as member}
                <div class="table-row">
                  <div class="table-cell">
                    <div class="member-info">
                      <div class="member-avatar">
                        {member.userId?.name?.charAt(0)?.toUpperCase() || 'M'}
                      </div>
                      <div class="member-details">
                        <div class="member-name">{member.userId?.name || 'Unknown'}</div>
                        <div class="member-email">{member.contact?.email}</div>
                      </div>
                    </div>
                  </div>
                  <div class="table-cell">{member.gymId?.name || 'Unknown Gym'}</div>
                  <div class="table-cell">
                    <span class="status-badge {member.status.toLowerCase()}">{member.status}</span>
                  </div>
                  <div class="table-cell">{member.membershipType}</div>
                  <div class="table-cell">
                    <button class="table-action">View</button>
                  </div>
                </div>
              {/each}
            </div>
          </section>
        {/if}

        {#if activeTab === 'analytics'}
          <section class="content-section">
            <div class="section-header">
              <h2 class="section-title">Analytics</h2>
              <button class="section-action">Export Data</button>
            </div>
            <div class="analytics-grid">
              <div class="analytics-card">
                <h3 class="analytics-title">Member Growth</h3>
                <div class="analytics-chart">
                  <div class="chart-placeholder">
                    📈 Chart visualization would go here
                  </div>
                </div>
              </div>
              <div class="analytics-card">
                <h3 class="analytics-title">Revenue Trends</h3>
                <div class="analytics-chart">
                  <div class="chart-placeholder">
                    💰 Revenue chart would go here
                  </div>
                </div>
              </div>
            </div>
          </section>
        {/if}
      </main>
    </div>
  </div>
{/if}

<style>
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 20px;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f5f5f7;
    border-top: 3px solid #0071e3;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .dashboard {
    background: #f5f5f7;
    min-height: 100vh;
  }

  .dashboard-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 22px;
  }

  .dashboard-header {
    padding: 40px 0 32px;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 32px;
  }

  .welcome-title {
    font-size: 40px;
    line-height: 1.1;
    font-weight: 600;
    letter-spacing: -0.005em;
    margin: 0 0 8px;
    color: #1d1d1f;
  }

  .welcome-subtitle {
    font-size: 19px;
    line-height: 1.42105;
    font-weight: 400;
    letter-spacing: 0.012em;
    margin: 0;
    color: #86868b;
  }

  .header-actions {
    display: flex;
    gap: 12px;
    flex-shrink: 0;
  }

  .action-button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 980px;
    border: none;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.3s ease;
    letter-spacing: -0.016em;
  }

  .action-button.primary {
    background: #0071e3;
    color: white;
  }

  .action-button.secondary {
    background: white;
    color: #1d1d1f;
    border: 1px solid #d2d2d7;
  }

  .action-button:hover {
    transform: translateY(-1px);
  }

  .dashboard-nav {
    margin-bottom: 32px;
  }

  .nav-tabs {
    display: flex;
    background: white;
    border-radius: 12px;
    padding: 4px;
    gap: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .nav-tab {
    flex: 1;
    padding: 12px 24px;
    background: none;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 400;
    color: #86868b;
    cursor: pointer;
    transition: all 0.3s ease;
    letter-spacing: -0.016em;
  }

  .nav-tab.active {
    background: #0071e3;
    color: white;
  }

  .nav-tab:hover:not(.active) {
    background: #f5f5f7;
    color: #1d1d1f;
  }

  .stats-section {
    margin-bottom: 40px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .stat-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }

  .stat-icon {
    font-size: 20px;
  }

  .stat-label {
    font-size: 14px;
    color: #86868b;
    font-weight: 400;
  }

  .stat-value {
    font-size: 32px;
    font-weight: 600;
    color: #1d1d1f;
    margin-bottom: 8px;
    line-height: 1.125;
  }

  .stat-change {
    font-size: 12px;
    font-weight: 400;
  }

  .stat-change.positive {
    color: #28ca42;
  }

  .stat-change.neutral {
    color: #86868b;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .section-title {
    font-size: 24px;
    font-weight: 600;
    color: #1d1d1f;
    margin: 0;
  }

  .section-action {
    background: none;
    border: none;
    color: #0071e3;
    font-size: 14px;
    cursor: pointer;
    font-weight: 400;
  }

  .section-action.primary {
    background: #0071e3;
    color: white;
    padding: 8px 16px;
    border-radius: 980px;
  }

  .activity-section,
  .content-section {
    background: white;
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .activity-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: #f5f5f7;
    border-radius: 10px;
  }

  .activity-avatar {
    width: 40px;
    height: 40px;
    background: #0071e3;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .activity-content {
    flex: 1;
  }

  .activity-title {
    font-size: 14px;
    font-weight: 600;
    color: #1d1d1f;
    margin-bottom: 4px;
  }

  .activity-subtitle {
    font-size: 12px;
    color: #86868b;
  }

  .activity-time {
    font-size: 12px;
    color: #86868b;
    flex-shrink: 0;
  }

  .gym-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }

  .gym-card {
    background: #f5f5f7;
    border-radius: 12px;
    padding: 24px;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .gym-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .gym-name {
    font-size: 18px;
    font-weight: 600;
    color: #1d1d1f;
    margin: 0;
  }

  .gym-status {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
  }

  .gym-status.active {
    background: rgba(40, 202, 66, 0.1);
    color: #28ca42;
  }

  .gym-details {
    margin-bottom: 20px;
  }

  .gym-details > div {
    margin-bottom: 8px;
    font-size: 14px;
    color: #86868b;
  }

  .gym-actions {
    display: flex;
    gap: 8px;
  }

  .gym-action {
    flex: 1;
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    font-size: 14px;
    cursor: pointer;
    background: #0071e3;
    color: white;
  }

  .gym-action.secondary {
    background: white;
    color: #1d1d1f;
    border: 1px solid #d2d2d7;
  }

  .members-table {
    background: #f5f5f7;
    border-radius: 12px;
    overflow: hidden;
  }

  .table-header,
  .table-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    gap: 16px;
    padding: 16px 24px;
    align-items: center;
  }

  .table-header {
    background: white;
    font-weight: 600;
    font-size: 14px;
    color: #1d1d1f;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .table-row {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .table-row:last-child {
    border-bottom: none;
  }

  .member-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .member-avatar {
    width: 32px;
    height: 32px;
    background: #0071e3;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 14px;
    font-weight: 600;
  }

  .member-name {
    font-size: 14px;
    font-weight: 500;
    color: #1d1d1f;
  }

  .member-email {
    font-size: 12px;
    color: #86868b;
  }

  .status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
  }

  .status-badge.active {
    background: rgba(40, 202, 66, 0.1);
    color: #28ca42;
  }

  .status-badge.inactive {
    background: rgba(255, 59, 48, 0.1);
    color: #ff3b30;
  }

  .table-action {
    background: none;
    border: none;
    color: #0071e3;
    font-size: 14px;
    cursor: pointer;
  }

  .analytics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .analytics-card {
    background: #f5f5f7;
    border-radius: 12px;
    padding: 24px;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .analytics-title {
    font-size: 18px;
    font-weight: 600;
    color: #1d1d1f;
    margin: 0 0 20px;
  }

  .chart-placeholder {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 8px;
    color: #86868b;
    font-size: 14px;
  }

  @media (max-width: 1068px) {
    .dashboard-container {
      max-width: 692px;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .analytics-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 734px) {
    .dashboard-container {
      padding: 0 16px;
    }

    .header-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
    }

    .welcome-title {
      font-size: 28px;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .table-header,
    .table-row {
      grid-template-columns: 1fr;
      gap: 8px;
    }

    .nav-tabs {
      flex-direction: column;
    }
  }
</style>
