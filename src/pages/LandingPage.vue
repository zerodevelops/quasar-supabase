<template>
  <!-- Hero Section -->
  <div class="hero-section">
    <div class="hero-layer">Quasar + Supabase Boilerplate</div>
  </div>

  <!-- Main Content Section -->
  <div class="main-content q-pa-md">
    <div class="welcome-section text-center">
      <h1 class="text-h5 q-mb-sm">Build Fast with Quasar & Supabase</h1>
      <p class="text-body2 q-mb-md">
        A minimal boilerplate for modern web apps with Quasar's responsive UI and Supabase's
        powerful backend.
      </p>
      <div class="q-mt-md">
        <q-btn
          color="primary"
          label="Get Started"
          to="/signup"
          size="md"
          class="q-mr-sm"
          unelevated
        />
        <q-btn
          color="secondary"
          label="Docs"
          href="https://github.com/your-repo/quasar-supabase-boilerplate"
          target="_blank"
          size="md"
          outline
        />
      </div>
    </div>
  </div>

  <!-- Footer -->
  <q-footer class="bg-grey-9 text-white">
    <q-toolbar>
      <q-toolbar-title class="text-caption"> Quasar + Supabase Boilerplate </q-toolbar-title>
      <q-btn
        flat
        dense
        label="GitHub"
        href="https://github.com/your-repo/quasar-supabase-boilerplate"
        target="_blank"
        icon="fab fa-github"
        size="sm"
      />
    </q-toolbar>
  </q-footer>
</template>

<script setup lang="ts">
// No script logic needed
</script>

<style scoped>
.hero-section {
  width: 100%;
  height: 25vh; /* Compact height */
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4a90e2 0%, #50c9c3 100%); /* Abstract gradient */
}

.hero-layer {
  color: white;
  font-size: clamp(1.2rem, 2.5vw, 1.8rem);
  font-weight: 600;
  padding: 0.5rem 1.5rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  animation: fadeIn 1s ease-in;
}

.main-content {
  max-width: 600px;
  margin: 1rem auto;
}

.welcome-section {
  padding: 1rem;
  background: #f9fafb; /* Light background for contrast */
  border-radius: 8px;
}

.q-footer {
  padding: 0.5rem 1rem;
}

.q-footer .q-toolbar {
  min-height: 40px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
