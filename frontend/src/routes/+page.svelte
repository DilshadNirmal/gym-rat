
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  onMount(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      goto('/dashboard');
    } else {
      goto('/login');
    }
  });
</script>

<main>
  <div class="container">
    <h1>Welcome to GymRat</h1>
    <p>Complete gym management solution for gym owners</p>
    <div class="loading">Loading...</div>
  </div>
</main>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
  }
  
  .loading {
    margin-top: 2rem;
    font-style: italic;
    color: #666;
  }
</style>
