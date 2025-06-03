
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
    max-width: var(--size-content-3);
    margin: 0 auto;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--size-14), 1fr));
    gap: var(--size-4);
    margin: var(--size-6) 0;
  }

  .stat-card {
    background: var(--surface-1);
    padding: var(--size-5);
    border-radius: var(--radius-3);
    box-shadow: var(--shadow-2);
    text-align: center;
    border: var(--border-size-1) solid var(--surface-3);
  }

  .stat-card h3 {
    margin: 0 0 var(--size-2) 0;
    color: var(--text-2);
    font-size: var(--font-size-2);
    font-weight: var(--font-weight-6);
  }

  .stat-number {
    font-size: var(--font-size-7);
    font-weight: var(--font-weight-8);
    color: var(--blue-6);
    margin: 0;
  }

  .gyms-section h2 {
    margin: var(--size-6) 0 var(--size-4) 0;
    color: var(--text-1);
    font-size: var(--font-size-5);
  }

  .gyms-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--size-17), 1fr));
    gap: var(--size-4);
  }

  .gym-card {
    background: var(--surface-1);
    padding: var(--size-5);
    border-radius: var(--radius-3);
    box-shadow: var(--shadow-2);
    border: var(--border-size-1) solid var(--surface-3);
  }

  .gym-card h3 {
    margin: 0 0 var(--size-2) 0;
    color: var(--text-1);
    font-size: var(--font-size-3);
  }

  .gym-card p {
    margin: 0 0 var(--size-3) 0;
    color: var(--text-2);
  }

  .gym-status {
    margin: var(--size-3) 0;
  }

  .status {
    padding: var(--size-1) var(--size-3);
    border-radius: var(--radius-pill);
    font-size: var(--font-size-0);
    text-transform: uppercase;
    font-weight: var(--font-weight-6);
    display: inline-block;
  }

  .status.active {
    background-color: var(--green-2);
    color: var(--green-9);
  }

  .status.expired {
    background-color: var(--red-2);
    color: var(--red-9);
  }

  .view-btn {
    display: inline-block;
    background-color: var(--blue-6);
    color: white;
    padding: var(--size-2) var(--size-4);
    text-decoration: none;
    border-radius: var(--radius-2);
    margin-top: var(--size-3);
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-5);
    transition: background-color 0.2s;
  }

  .view-btn:hover {
    background-color: var(--blue-7);
  }
</style>
