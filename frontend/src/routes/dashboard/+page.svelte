
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { user, isLoggedIn, gyms as gymsStore } from '$lib/stores.js';
  import { gyms, members } from '$lib/api.js';
  
  let currentUser = null;
  let loggedIn = false;
  let gymsList = [];
  let membersList = [];
  let loading = true;
  let error = '';
  let selectedGym = null;
  let showStats = false;
  
  user.subscribe(value => currentUser = value);
  isLoggedIn.subscribe(value => loggedIn = value);
  gymsStore.subscribe(value => gymsList = value);
  
  onMount(async () => {
    if (!loggedIn) {
      goto('/login');
      return;
    }
    
    try {
      const gymsResponse = await gyms.list();
      gymsStore.set(gymsResponse.gyms || []);
      
      if (gymsResponse.gyms?.length > 0) {
        selectedGym = gymsResponse.gyms[0];
        const membersResponse = await members.list(gymsResponse.gyms[0]._id);
        membersList = membersResponse.members || [];
      }
      
      setTimeout(() => showStats = true, 500);
    } catch (err) {
      error = 'Failed to load data';
      console.error(err);
    } finally {
      loading = false;
    }
  });

  function selectGym(gym) {
    selectedGym = gym;
    loadGymMembers(gym._id);
  }

  async function loadGymMembers(gymId) {
    try {
      const membersResponse = await members.list(gymId);
      membersList = membersResponse.members || [];
    } catch (err) {
      console.error('Failed to load members:', err);
    }
  }

  function getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case 'active': return '#4ecdc4';
      case 'expired': return '#ff6b6b';
      case 'cancelled': return '#ff9f43';
      default: return '#a8a8a8';
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
</script>

<div class="dashboard">
  <div class="container">
    <div class="dashboard-header">
      <div class="welcome-section">
        <h1 class="welcome-title">
          Welcome back, <span class="user-name">{currentUser?.name}</span>
        </h1>
        <p class="welcome-subtitle">
          Manage your gym operations with ease
        </p>
      </div>
      <div class="quick-actions">
        <button class="action-btn primary">
          <span class="btn-icon">➕</span>
          Add Member
        </button>
        <button class="action-btn secondary">
          <span class="btn-icon">🏢</span>
          New Gym
        </button>
      </div>
    </div>
    
    {#if loading}
      <div class="loading-container">
        <div class="loading-spinner-large"></div>
        <p>Loading your dashboard...</p>
      </div>
    {:else if error}
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button class="retry-btn" on:click={() => location.reload()}>
          🔄 Retry
        </button>
      </div>
    {:else}
      <!-- Stats Cards -->
      <div class="stats-grid" class:show={showStats}>
        <div class="stat-card" style="--delay: 0.1s">
          <div class="stat-icon">🏢</div>
          <div class="stat-content">
            <h3 class="stat-number">{gymsList.length}</h3>
            <p class="stat-label">Total Gyms</p>
          </div>
          <div class="stat-trend positive">↗️ +12%</div>
        </div>
        
        <div class="stat-card" style="--delay: 0.2s">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3 class="stat-number">{membersList.length}</h3>
            <p class="stat-label">Active Members</p>
          </div>
          <div class="stat-trend positive">↗️ +8%</div>
        </div>
        
        <div class="stat-card" style="--delay: 0.3s">
          <div class="stat-icon">💼</div>
          <div class="stat-content">
            <h3 class="stat-number">{currentUser?.role || 'N/A'}</h3>
            <p class="stat-label">Your Role</p>
          </div>
          <div class="stat-trend neutral">➡️ Active</div>
        </div>
        
        <div class="stat-card" style="--delay: 0.4s">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3 class="stat-number">98.5%</h3>
            <p class="stat-label">System Health</p>
          </div>
          <div class="stat-trend positive">↗️ +2%</div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="content-grid">
        <!-- Gyms Section -->
        <div class="content-card gyms-section">
          <div class="card-header">
            <h2>
              <span class="header-icon">🏢</span>
              Your Gyms
            </h2>
            <div class="card-actions">
              <button class="filter-btn active">All</button>
              <button class="filter-btn">Active</button>
            </div>
          </div>
          
          {#if gymsList.length > 0}
            <div class="gyms-list">
              {#each gymsList as gym, index}
                <div 
                  class="gym-item" 
                  class:selected={selectedGym?._id === gym._id}
                  style="--delay: {(index + 1) * 0.1}s"
                  on:click={() => selectGym(gym)}
                  role="button"
                  tabindex="0"
                >
                  <div class="gym-avatar">
                    {gym.name.charAt(0).toUpperCase()}
                  </div>
                  <div class="gym-info">
                    <h3 class="gym-name">{gym.name}</h3>
                    <p class="gym-location">📍 {gym.location?.city}, {gym.location?.state}</p>
                    <div class="gym-meta">
                      <span class="gym-status" style="color: {getStatusColor(gym.subscription?.status)}">
                        ● {gym.subscription?.status || 'Unknown'}
                      </span>
                      <span class="gym-members">👥 {membersList.length} members</span>
                    </div>
                  </div>
                  <div class="gym-actions">
                    <button class="action-dot">⚡</button>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="empty-state">
              <div class="empty-icon">🏗️</div>
              <h3>No gyms yet</h3>
              <p>Start by creating your first gym</p>
              <button class="create-gym-btn">
                <span>🚀</span>
                Create Gym
              </button>
            </div>
          {/if}
        </div>

        <!-- Members Section -->
        <div class="content-card members-section">
          <div class="card-header">
            <h2>
              <span class="header-icon">👥</span>
              {selectedGym ? `${selectedGym.name} Members` : 'Members'}
            </h2>
            <div class="card-actions">
              <button class="search-btn">🔍</button>
              <button class="filter-btn">Filter</button>
            </div>
          </div>
          
          {#if membersList.length > 0}
            <div class="members-list">
              {#each membersList as member, index}
                <div class="member-item" style="--delay: {(index + 1) * 0.05}s">
                  <div class="member-avatar">
                    {member.userId?.name?.charAt(0)?.toUpperCase() || 'M'}
                  </div>
                  <div class="member-info">
                    <h4 class="member-name">{member.userId?.name || 'Unknown'}</h4>
                    <p class="member-email">📧 {member.userId?.email || 'No email'}</p>
                    <div class="member-meta">
                      <span class="membership-type">{member.membershipType}</span>
                      <span class="member-status" style="color: {getStatusColor(member.status)}">
                        ● {member.status}
                      </span>
                    </div>
                  </div>
                  <div class="member-actions">
                    <button class="action-btn-small">👁️</button>
                    <button class="action-btn-small">✏️</button>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="empty-state">
              <div class="empty-icon">👋</div>
              <h3>No members yet</h3>
              <p>Add your first member to get started</p>
              <button class="add-member-btn">
                <span>➕</span>
                Add Member
              </button>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .dashboard {
    min-height: 100vh;
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 3rem;
    gap: 2rem;
  }

  .welcome-section {
    flex: 1;
  }

  .welcome-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0 0 0.5rem 0;
    color: #ffffff;
  }

  .user-name {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .welcome-subtitle {
    font-size: 1.1rem;
    opacity: 0.8;
    margin: 0;
  }

  .quick-actions {
    display: flex;
    gap: 1rem;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
  }

  .action-btn.primary {
    background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
    color: #ffffff;
  }

  .action-btn.secondary {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
    backdrop-filter: blur(10px);
  }

  .action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }

  .loading-container {
    text-align: center;
    padding: 4rem 2rem;
  }

  .loading-spinner-large {
    width: 60px;
    height: 60px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #ffffff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 2rem;
  }

  .error-container {
    text-align: center;
    padding: 4rem 2rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    backdrop-filter: blur(20px);
  }

  .error-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .retry-btn {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    color: #ffffff;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 15px;
    cursor: pointer;
    font-weight: 600;
    margin-top: 1rem;
    transition: all 0.3s ease;
  }

  .retry-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s ease;
  }

  .stats-grid.show {
    opacity: 1;
    transform: translateY(0);
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 2rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    position: relative;
    overflow: hidden;
    animation: slideInUp 0.6s ease var(--delay, 0s) both;
    transition: all 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.2);
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .stat-icon {
    font-size: 3rem;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
  }

  .stat-content {
    flex: 1;
  }

  .stat-number {
    font-size: 2rem;
    font-weight: bold;
    margin: 0 0 0.5rem 0;
    color: #ffffff;
  }

  .stat-label {
    margin: 0;
    opacity: 0.8;
    font-size: 0.9rem;
  }

  .stat-trend {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
    border-radius: 10px;
    font-weight: 600;
  }

  .stat-trend.positive {
    background: rgba(78, 205, 196, 0.2);
    color: #4ecdc4;
  }

  .stat-trend.neutral {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .content-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    overflow: hidden;
    animation: fadeInUp 0.8s ease;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .card-header {
    padding: 2rem 2rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .card-header h2 {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    color: #ffffff;
  }

  .header-icon {
    font-size: 1.5rem;
  }

  .card-actions {
    display: flex;
    gap: 0.5rem;
  }

  .filter-btn {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 10px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.3s ease;
  }

  .filter-btn:hover,
  .filter-btn.active {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }

  .search-btn {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .search-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }

  .gyms-list,
  .members-list {
    padding: 1rem 2rem 2rem;
    max-height: 600px;
    overflow-y: auto;
  }

  .gym-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    margin-bottom: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    animation: slideInRight 0.5s ease var(--delay, 0s) both;
  }

  .gym-item:hover,
  .gym-item.selected {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(5px);
    border-color: rgba(78, 205, 196, 0.5);
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .gym-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
    color: #ffffff;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  .gym-info {
    flex: 1;
  }

  .gym-name {
    margin: 0 0 0.25rem 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #ffffff;
  }

  .gym-location {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .gym-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.8rem;
  }

  .gym-status,
  .member-status {
    font-weight: 600;
  }

  .gym-members {
    opacity: 0.8;
  }

  .gym-actions {
    display: flex;
    gap: 0.5rem;
  }

  .action-dot {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
  }

  .action-dot:hover {
    background: rgba(78, 205, 196, 0.3);
    transform: scale(1.1);
  }

  .member-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    margin-bottom: 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    transition: all 0.3s ease;
    animation: fadeInLeft 0.4s ease var(--delay, 0s) both;
  }

  .member-item:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(3px);
  }

  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .member-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(45deg, #4ecdc4, #44a08d);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #ffffff;
    font-size: 0.9rem;
  }

  .member-info {
    flex: 1;
  }

  .member-name {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: #ffffff;
  }

  .member-email {
    margin: 0 0 0.5rem 0;
    font-size: 0.8rem;
    opacity: 0.8;
  }

  .member-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.7rem;
  }

  .membership-type {
    background: rgba(78, 205, 196, 0.2);
    color: #4ecdc4;
    padding: 0.2rem 0.5rem;
    border-radius: 8px;
    font-weight: 600;
  }

  .member-actions {
    display: flex;
    gap: 0.5rem;
  }

  .action-btn-small {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.8rem;
  }

  .action-btn-small:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
    transform: scale(1.1);
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .empty-state h3 {
    margin: 0 0 0.5rem 0;
    color: #ffffff;
  }

  .empty-state p {
    margin: 0 0 2rem 0;
    opacity: 0.8;
  }

  .create-gym-btn,
  .add-member-btn {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    color: #ffffff;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 15px;
    cursor: pointer;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
  }

  .create-gym-btn:hover,
  .add-member-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 1024px) {
    .content-grid {
      grid-template-columns: 1fr;
    }
    
    .dashboard-header {
      flex-direction: column;
      align-items: stretch;
      text-align: center;
    }
    
    .quick-actions {
      justify-content: center;
    }
  }

  @media (max-width: 768px) {
    .dashboard {
      padding: 1rem;
    }
    
    .welcome-title {
      font-size: 2rem;
    }
    
    .stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
    
    .gym-item,
    .member-item {
      padding: 1rem;
    }
    
    .card-header {
      padding: 1.5rem 1.5rem 1rem;
    }
    
    .gyms-list,
    .members-list {
      padding: 1rem 1.5rem 1.5rem;
    }
  }
</style>
