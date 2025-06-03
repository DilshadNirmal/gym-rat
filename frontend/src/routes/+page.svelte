
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { isLoggedIn } from '$lib/stores.js';

  let loggedIn = false;
  let currentFeature = 0;
  
  isLoggedIn.subscribe(value => loggedIn = value);

  const features = [
    {
      icon: '🏋️‍♂️',
      title: 'Member Management',
      description: 'Track members, attendance, and progress with ease'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Real-time insights into your gym performance'
    },
    {
      icon: '💳',
      title: 'Payment Tracking',
      description: 'Manage subscriptions and payments seamlessly'
    },
    {
      icon: '🔒',
      title: 'Secure Access',
      description: 'Role-based permissions and data security'
    }
  ];

  onMount(() => {
    if (loggedIn) {
      goto('/dashboard');
    }

    // Auto-rotate features
    const interval = setInterval(() => {
      currentFeature = (currentFeature + 1) % features.length;
    }, 3000);

    return () => clearInterval(interval);
  });

  function navigateToLogin() {
    goto('/login');
  }
</script>

<div class="landing-page">
  <div class="hero-section">
    <div class="hero-background">
      <div class="floating-shapes">
        {#each Array(20) as _, i}
          <div class="shape" style="--delay: {i * 0.5}s; --duration: {10 + i * 2}s"></div>
        {/each}
      </div>
    </div>
    
    <div class="hero-content">
      <div class="logo-section">
        <div class="hero-logo">🏋️‍♂️</div>
        <h1 class="hero-title">
          <span class="title-part">Gym</span><span class="title-accent">Rat</span>
        </h1>
        <p class="hero-subtitle">
          The future of gym management is here
        </p>
      </div>
      
      <div class="hero-description">
        <p>
          Revolutionize your fitness business with our cutting-edge management platform.
          From member tracking to payment processing, we've got you covered.
        </p>
      </div>
      
      <div class="hero-actions">
        <button class="cta-primary" on:click={navigateToLogin}>
          <span class="btn-text">Get Started</span>
          <span class="btn-icon">🚀</span>
        </button>
        <button class="cta-secondary">
          <span class="btn-text">Learn More</span>
          <span class="btn-icon">📖</span>
        </button>
      </div>
    </div>
  </div>

  <div class="features-section">
    <div class="container">
      <h2 class="section-title">Powerful Features</h2>
      <div class="features-grid">
        {#each features as feature, index}
          <div 
            class="feature-card" 
            class:active={index === currentFeature}
            style="--delay: {index * 0.2}s"
          >
            <div class="feature-icon">{feature.icon}</div>
            <h3 class="feature-title">{feature.title}</h3>
            <p class="feature-description">{feature.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <div class="stats-section">
    <div class="container">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">500+</div>
          <div class="stat-label">Gyms Managed</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">10K+</div>
          <div class="stat-label">Active Members</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">99.9%</div>
          <div class="stat-label">Uptime</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">24/7</div>
          <div class="stat-label">Support</div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .landing-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #ffffff;
    overflow-x: hidden;
  }

  .hero-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    text-align: center;
    padding: 2rem;
  }

  .hero-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    z-index: 0;
  }

  .floating-shapes {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .shape {
    position: absolute;
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    animation: float linear infinite var(--duration, 15s);
    animation-delay: var(--delay, 0s);
  }

  .shape:nth-child(odd) {
    border-radius: 0;
    transform: rotate(45deg);
  }

  .shape:nth-child(1) { left: 10%; top: 80%; }
  .shape:nth-child(2) { left: 20%; top: 20%; }
  .shape:nth-child(3) { left: 30%; top: 60%; }
  .shape:nth-child(4) { left: 40%; top: 10%; }
  .shape:nth-child(5) { left: 50%; top: 90%; }
  .shape:nth-child(6) { left: 60%; top: 30%; }
  .shape:nth-child(7) { left: 70%; top: 70%; }
  .shape:nth-child(8) { left: 80%; top: 40%; }
  .shape:nth-child(9) { left: 90%; top: 80%; }
  .shape:nth-child(10) { left: 5%; top: 50%; }

  @keyframes float {
    0% {
      transform: translateY(100vh) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-10vh) rotate(360deg);
      opacity: 0;
    }
  }

  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 800px;
    animation: fadeInUp 1s ease;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .logo-section {
    margin-bottom: 3rem;
  }

  .hero-logo {
    font-size: 6rem;
    margin-bottom: 1rem;
    filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.5));
    animation: pulse 3s infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  .hero-title {
    font-size: 4rem;
    font-weight: bold;
    margin: 0 0 1rem 0;
    line-height: 1.1;
  }

  .title-part {
    color: #ffffff;
  }

  .title-accent {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-subtitle {
    font-size: 1.5rem;
    margin: 0;
    opacity: 0.9;
    font-weight: 300;
  }

  .hero-description {
    margin-bottom: 3rem;
  }

  .hero-description p {
    font-size: 1.2rem;
    line-height: 1.6;
    margin: 0;
    opacity: 0.8;
    max-width: 600px;
    margin: 0 auto;
  }

  .hero-actions {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .cta-primary,
  .cta-secondary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .cta-primary {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    color: #ffffff;
  }

  .cta-secondary {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
    backdrop-filter: blur(10px);
  }

  .cta-primary::before,
  .cta-secondary::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  .cta-primary:hover::before,
  .cta-secondary:hover::before {
    left: 100%;
  }

  .cta-primary:hover,
  .cta-secondary:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  }

  .features-section {
    padding: 6rem 2rem;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-title {
    text-align: center;
    font-size: 3rem;
    font-weight: bold;
    margin: 0 0 4rem 0;
    color: #ffffff;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }

  .feature-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 2.5rem;
    text-align: center;
    transition: all 0.3s ease;
    animation: slideInUp 0.8s ease var(--delay, 0s) both;
  }

  .feature-card:hover,
  .feature-card.active {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.15);
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

  .feature-icon {
    font-size: 3.5rem;
    margin-bottom: 1.5rem;
    filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.3));
  }

  .feature-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0 0 1rem 0;
    color: #ffffff;
  }

  .feature-description {
    margin: 0;
    opacity: 0.8;
    line-height: 1.6;
  }

  .stats-section {
    padding: 4rem 2rem;
    background: rgba(0, 0, 0, 0.2);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    text-align: center;
  }

  .stat-item {
    padding: 2rem;
  }

  .stat-number {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .stat-label {
    font-size: 1.1rem;
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem;
    }

    .hero-logo {
      font-size: 4rem;
    }

    .hero-subtitle {
      font-size: 1.2rem;
    }

    .hero-description p {
      font-size: 1rem;
    }

    .hero-actions {
      flex-direction: column;
      align-items: center;
    }

    .cta-primary,
    .cta-secondary {
      width: 100%;
      max-width: 300px;
      justify-content: center;
    }

    .section-title {
      font-size: 2rem;
    }

    .features-grid {
      grid-template-columns: 1fr;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
