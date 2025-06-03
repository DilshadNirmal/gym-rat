
<script>
  import { onMount } from 'svelte';
  import { gyms, members } from '$lib/api.js';
  import { user } from '$lib/stores.js';

  let userGyms = [];
  let totalMembers = 0;
  let loading = true;

  onMount(async () => {
    try {
      const gymsResponse = await gyms.list();
      userGyms = gymsResponse.gyms;
      
      // Calculate total members across all gyms
      for (const gym of userGyms) {
        const membersResponse = await members.list(gym._id);
        totalMembers += membersResponse.members?.length || 0;
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Dashboard - GymRat</title>
</svelte:head>

<div class="dashboard">
  <h1>Welcome to your Dashboard!</h1>
  
  {#if loading}
    <p>Loading...</p>
  {:else}
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Gyms</h3>
        <div class="stat-number">{userGyms.length}</div>
      </div>
      
      <div class="stat-card">
        <h3>Total Members</h3>
        <div class="stat-number">{totalMembers}</div>
      </div>
      
      <div class="stat-card">
        <h3>Active Subscriptions</h3>
        <div class="stat-number">
          {userGyms.filter(gym => gym.subscription.status === 'ACTIVE').length}
        </div>
      </div>
    </div>

    <div class="gyms-section">
      <h2>Your Gyms</h2>
      
      {#if userGyms.length === 0}
        <p>You haven't created any gyms yet. <a href="/gyms/create">Create your first gym</a></p>
      {:else}
        <div class="gyms-grid">
          {#each userGyms as gym}
            <div class="gym-card">
              <h3>{gym.name}</h3>
              <p>{gym.location.city}, {gym.location.state}</p>
              <div class="gym-status">
                <span class="status {gym.subscription.status.toLowerCase()}">
                  {gym.subscription.status}
                </span>
              </div>
              <a href="/gyms/{gym._id}" class="view-btn">View Details</a>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin: 2rem 0;
  }

  .stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: bold;
    color: #3498db;
    margin-top: 0.5rem;
  }

  .gyms-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }

  .gym-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .gym-status {
    margin: 1rem 0;
  }

  .status {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    text-transform: uppercase;
    font-weight: bold;
  }

  .status.active {
    background-color: #d4edda;
    color: #155724;
  }

  .status.expired {
    background-color: #f8d7da;
    color: #721c24;
  }

  .view-btn {
    display: inline-block;
    background-color: #3498db;
    color: white;
    padding: 0.5rem 1rem;
    text-decoration: none;
    border-radius: 4px;
    margin-top: 1rem;
  }
</style>
