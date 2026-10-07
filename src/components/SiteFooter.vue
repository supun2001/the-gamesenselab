<script setup lang="ts">
import Brand from './Brand.vue'
</script>
<template>
  <footer class="site-footer">
    <div class="shell footer-grid">
      <div>
        <RouterLink to="/" aria-label="Altheia home"><Brand /></RouterLink>
        <p>Read the game.<br />Rise together.</p>
        <span class="tiny">A new perspective on play.</span>
      </div>
      <div>
        <h2>Explore</h2>
        <RouterLink to="/freya">Freya</RouterLink
        ><RouterLink to="/team-coaching">Team Coaching</RouterLink
        ><RouterLink to="/pricing">Pricing</RouterLink
        ><RouterLink to="/roadmap">Roadmap</RouterLink>
      </div>
      <div>
        <h2>Altheia</h2>
        <RouterLink to="/about">About</RouterLink><RouterLink to="/faq">FAQ</RouterLink
        ><RouterLink to="/contact">Contact</RouterLink>
      </div>
      <div class="footer-note">
        <span class="status-dot"></span> Prototype built.<br /><span
          >Early access coming soon.</span
        >
        <p>Learning from decisions.<br />Building for people.</p>
      </div>
    </div>
    <div class="shell footer-bottom">
      <span>© {{ new Date().getFullYear() }} Altheia</span
      ><span>Independent of game publishers. Game names belong to their respective owners.</span>
      <nav aria-label="Legal">
        <RouterLink to="/privacy">Privacy · draft</RouterLink
        ><RouterLink to="/terms">Terms · draft</RouterLink>
      </nav>
    </div>
  </footer>
</template>
