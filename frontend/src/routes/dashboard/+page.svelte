
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
        const membersResponse = await members.list(gymsResponse.gyms[0]._id);
        membersList = membersResponse.members || [];
      }
    } catch (err) {
      error = 'Failed to load data';
      console.error(err);
    } finally {
      loading = false;
    }
  });
</script>

<div class="dashboard">
  <div class="container">
    <h1>Dashboard</h1>
    
    {#if loading}
      <div class="loading">Loading...</div>
    {:else if error}
      <div class="error">{error}</div>
    {:else}
      <div class="stats">
        <div class="stat-card">
          <h3>Total Gyms</h3>
          <p class="stat-number">{gymsList.length}</p>
        </div>
        
        <div class="stat-card">
          <h3>Total Members</h3>
          <p class="stat-number">{membersList.length}</p>
        </div>
        
        <div class="stat-card">
          <h3>User Role</h3>
          <p class="stat-text">{currentUser?.role || 'N/A'}</p>
        </div>
      </div>
      
      {#if gymsList.length > 0}
        <div class="section">
          <h2>Your Gyms</h2>
          <div class="gyms-grid">
            {#each gymsList as gym}
              <div class="gym-card">
                <h3>{gym.name}</h3>
                <p>{gym.location?.city}, {gym.location?.state}</p>
                <p class="status">Status: {gym.subscription?.status}</p>
              </div>
            {/each}
          </div>
        </div>
      {:else}
        <div class="empty-state">
          <h2>No gyms found</h2>
          <p>You don't have any gyms registered yet.</p>
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  .dashboard {
    padding: 2rem;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .loading {
    text-align: center;
    padding: 2rem;
    font-style: italic;
  }
  
  .error {
    background-color: #f8d7da;
    color: #721c24;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
  
  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    text-align: center;
  }
  
  .stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: #2c3e50;
    margin: 0;
  }
  
  .stat-text {
    font-size: 1.2rem;
    color: #2c3e50;
    margin: 0;
    text-transform: capitalize;
  }
  
  .section {
    margin-bottom: 2rem;
  }
  
  .gyms-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }
  
  .gym-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .gym-card h3 {
    margin-top: 0;
    color: #2c3e50;
  }
  
  .status {
    color: #27ae60;
    font-weight: bold;
  }
  
  .empty-state {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
</style>
