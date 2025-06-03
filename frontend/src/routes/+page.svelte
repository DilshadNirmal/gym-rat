
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { isLoggedIn } from '$lib/stores.js';

  let loggedIn = false;
  let currentSection = 0;
  
  isLoggedIn.subscribe(value => loggedIn = value);

  const features = [
    {
      icon: '🏋️‍♂️',
      title: 'Member Management',
      description: 'Effortlessly manage your members with intuitive tools designed for modern fitness businesses.',
      detail: 'Track attendance, monitor progress, and maintain detailed member profiles with our comprehensive management system.'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Get real-time insights into your gym performance with beautiful, actionable analytics.',
      detail: 'Make data-driven decisions with detailed reports on membership trends, revenue, and facility usage.'
    },
    {
      icon: '💳',
      title: 'Payment System',
      description: 'Streamlined payment processing that works seamlessly with your existing workflow.',
      detail: 'Accept payments, manage subscriptions, and track revenue with our secure payment infrastructure.'
    },
    {
      icon: '🔒',
      title: 'Enterprise Security',
      description: 'Bank-level security with role-based access control and data encryption.',
      detail: 'Your data is protected with industry-leading security measures and compliance standards.'
    }
  ];

  onMount(() => {
    if (loggedIn) {
      goto('/dashboard');
    }

    const interval = setInterval(() => {
      currentSection = (currentSection + 1) % features.length;
    }, 4000);

    return () => clearInterval(interval);
  });

  function navigateToLogin() {
    goto('/login');
  }
</script>

<div class="landing-page">
  <!-- Hero Section -->
  <section class="hero-section">
    <div class="hero-container">
      <div class="hero-content">
        <h1 class="hero-title">
          The future of gym management.
        </h1>
        <p class="hero-subtitle">
          Transform your fitness business with intelligent tools designed for growth, efficiency, and member satisfaction.
        </p>
        <div class="hero-actions">
          <button class="cta-primary" on:click={navigateToLogin}>
            Get Started
          </button>
          <button class="cta-secondary">
            Learn More
          </button>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-card">
          <div class="card-header">
            <div class="card-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div class="card-content">
            <div class="demo-metric">
              <span class="metric-label">Active Members</span>
              <span class="metric-value">2,847</span>
              <span class="metric-change">+12%</span>
            </div>
            <div class="demo-chart">
              {#each Array(7) as _, i}
                <div class="chart-bar" style="height: {Math.random() * 60 + 20}%"></div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section class="features-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Designed for modern fitness businesses.</h2>
        <p class="section-subtitle">Every feature built with purpose, every detail crafted for performance.</p>
      </div>
      
      <div class="features-grid">
        {#each features as feature, index}
          <div 
            class="feature-card" 
            class:active={index === currentSection}
            style="--delay: {index * 0.1}s"
          >
            <div class="feature-icon">{feature.icon}</div>
            <h3 class="feature-title">{feature.title}</h3>
            <p class="feature-description">{feature.description}</p>
            <p class="feature-detail">{feature.detail}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Stats Section -->
  <section class="stats-section">
    <div class="container">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">500+</div>
          <div class="stat-label">Gyms Worldwide</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">50K+</div>
          <div class="stat-label">Active Members</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">99.9%</div>
          <div class="stat-label">Uptime Guaranteed</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">24/7</div>
          <div class="stat-label">Expert Support</div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta-section">
    <div class="container">
      <div class="cta-content">
        <h2 class="cta-title">Ready to transform your gym?</h2>
        <p class="cta-subtitle">Join hundreds of gym owners who've revolutionized their business with GymRat.</p>
        <button class="cta-button" on:click={navigateToLogin}>
          Start Your Journey
        </button>
      </div>
    </div>
  </section>
</div>

<style>
  .landing-page {
    background: #f5f5f7;
    color: #1d1d1f;
  }

  .container {
    max-width: 980px;
    margin: 0 auto;
    padding: 0 22px;
  }

  /* Hero Section */
  .hero-section {
    padding: 80px 0 120px;
    background: linear-gradient(135deg, #f5f5f7 0%, #ffffff 100%);
  }

  .hero-container {
    max-width: 980px;
    margin: 0 auto;
    padding: 0 22px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }

  .hero-content {
    max-width: 500px;
  }

  .hero-title {
    font-size: 56px;
    line-height: 1.07143;
    font-weight: 600;
    letter-spacing: -0.005em;
    margin: 0 0 24px;
    color: #1d1d1f;
  }

  .hero-subtitle {
    font-size: 21px;
    line-height: 1.381;
    font-weight: 400;
    letter-spacing: 0.011em;
    margin: 0 0 40px;
    color: #86868b;
  }

  .hero-actions {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .cta-primary,
  .cta-secondary {
    padding: 12px 24px;
    font-size: 17px;
    line-height: 1.23536;
    font-weight: 400;
    letter-spacing: -0.022em;
    border-radius: 980px;
    border: none;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    min-width: 120px;
  }

  .cta-primary {
    background: #0071e3;
    color: white;
  }

  .cta-primary:hover {
    background: #0077ed;
    transform: translateY(-1px);
  }

  .cta-secondary {
    background: transparent;
    color: #0071e3;
    border: 1px solid #0071e3;
  }

  .cta-secondary:hover {
    background: #0071e3;
    color: white;
  }

  .hero-visual {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hero-card {
    background: white;
    border-radius: 18px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
    max-width: 300px;
    width: 100%;
  }

  .card-header {
    margin-bottom: 20px;
  }

  .card-dots {
    display: flex;
    gap: 6px;
  }

  .card-dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #86868b;
  }

  .card-dots span:first-child {
    background: #ff5f57;
  }

  .card-dots span:nth-child(2) {
    background: #febc2e;
  }

  .card-dots span:last-child {
    background: #28ca42;
  }

  .demo-metric {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 16px;
    background: #f5f5f7;
    border-radius: 12px;
  }

  .metric-label {
    font-size: 14px;
    color: #86868b;
  }

  .metric-value {
    font-size: 24px;
    font-weight: 600;
    color: #1d1d1f;
  }

  .metric-change {
    font-size: 14px;
    color: #28ca42;
    font-weight: 500;
  }

  .demo-chart {
    display: flex;
    gap: 8px;
    align-items: end;
    height: 60px;
  }

  .chart-bar {
    flex: 1;
    background: linear-gradient(180deg, #0071e3, #005bb5);
    border-radius: 2px;
    animation: growBar 2s ease-in-out infinite;
  }

  @keyframes growBar {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(1.2); }
  }

  /* Features Section */
  .features-section {
    padding: 120px 0;
    background: white;
  }

  .section-header {
    text-align: center;
    margin-bottom: 80px;
  }

  .section-title {
    font-size: 48px;
    line-height: 1.08349;
    font-weight: 600;
    letter-spacing: -0.003em;
    margin: 0 0 24px;
    color: #1d1d1f;
  }

  .section-subtitle {
    font-size: 21px;
    line-height: 1.381;
    font-weight: 400;
    letter-spacing: 0.011em;
    margin: 0;
    color: #86868b;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }

  .feature-card {
    padding: 40px 32px;
    background: #f5f5f7;
    border-radius: 18px;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    animation: fadeInUp 0.8s ease var(--delay, 0s) both;
  }

  .feature-card:hover,
  .feature-card.active {
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
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

  .feature-icon {
    font-size: 40px;
    margin-bottom: 24px;
    display: block;
  }

  .feature-title {
    font-size: 24px;
    line-height: 1.16667;
    font-weight: 600;
    letter-spacing: 0.009em;
    margin: 0 0 16px;
    color: #1d1d1f;
  }

  .feature-description {
    font-size: 17px;
    line-height: 1.47059;
    font-weight: 400;
    letter-spacing: -0.022em;
    margin: 0 0 12px;
    color: #1d1d1f;
  }

  .feature-detail {
    font-size: 14px;
    line-height: 1.42857;
    font-weight: 400;
    letter-spacing: -0.016em;
    margin: 0;
    color: #86868b;
  }

  /* Stats Section */
  .stats-section {
    padding: 80px 0;
    background: #f5f5f7;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
  }

  .stat-card {
    text-align: center;
    padding: 32px 24px;
    background: white;
    border-radius: 18px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  .stat-number {
    font-size: 48px;
    line-height: 1.08349;
    font-weight: 600;
    letter-spacing: -0.003em;
    margin-bottom: 8px;
    color: #0071e3;
  }

  .stat-label {
    font-size: 17px;
    line-height: 1.47059;
    font-weight: 400;
    letter-spacing: -0.022em;
    color: #86868b;
  }

  /* CTA Section */
  .cta-section {
    padding: 120px 0;
    background: linear-gradient(135deg, #0071e3, #005bb5);
    color: white;
  }

  .cta-content {
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
  }

  .cta-title {
    font-size: 48px;
    line-height: 1.08349;
    font-weight: 600;
    letter-spacing: -0.003em;
    margin: 0 0 24px;
  }

  .cta-subtitle {
    font-size: 21px;
    line-height: 1.381;
    font-weight: 400;
    letter-spacing: 0.011em;
    margin: 0 0 40px;
    color: rgba(255, 255, 255, 0.8);
  }

  .cta-button {
    background: white;
    color: #0071e3;
    padding: 16px 32px;
    font-size: 17px;
    line-height: 1.23536;
    font-weight: 400;
    letter-spacing: -0.022em;
    border-radius: 980px;
    border: none;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  /* Responsive Design */
  @media (max-width: 1068px) {
    .container {
      max-width: 692px;
    }

    .hero-container {
      max-width: 692px;
      gap: 60px;
    }

    .hero-title {
      font-size: 48px;
    }

    .section-title {
      font-size: 40px;
    }

    .features-grid {
      gap: 32px;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 32px;
    }
  }

  @media (max-width: 734px) {
    .container {
      padding: 0 16px;
    }

    .hero-container {
      grid-template-columns: 1fr;
      gap: 40px;
      padding: 0 16px;
      text-align: center;
    }

    .hero-title {
      font-size: 32px;
    }

    .hero-subtitle {
      font-size: 19px;
    }

    .section-title {
      font-size: 32px;
    }

    .section-subtitle {
      font-size: 19px;
    }

    .features-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .stats-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .cta-title {
      font-size: 32px;
    }

    .cta-subtitle {
      font-size: 19px;
    }
  }
</style>
