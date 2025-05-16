<template>
  <q-layout
    view="lHh lpR lFf"
    class="abstract-layout"
    :class="$q.dark.isActive ? 'bg-dark' : 'bg-light'"
  >
    <!-- Header -->
    <q-header elevated class="bg-transparent header-gradient">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="drawerRight = !drawerRight" class="q-mr-sm" />
        <q-toolbar-title class="text-bold text-white">
          Quasar + Supabase Boilerplate
        </q-toolbar-title>
        <q-space />
        <template v-if="!userStore.user">
          <q-btn flat label="Sign Up" to="/signup" class="text-white" />
          <q-btn flat label="Login" to="/login" class="text-white" />
        </template>
        <template v-else>
          <q-btn flat label="Logout" @click="logout" class="text-white" />
        </template>
        <q-btn
          flat
          label="Docs"
          href="https://github.com/your-repo/quasar-supabase-boilerplate"
          target="_blank"
          icon="open_in_new"
          class="text-white"
        />
      </q-toolbar>
    </q-header>

    <!-- Right Drawer -->
    <q-drawer
      side="right"
      v-model="drawerRight"
      bordered
      :width="250"
      :breakpoint="500"
      class="filter-drawer"
    >
      <q-scroll-area class="fit">
        <div class="q-pa-md">
          <h6 class="text-h6 q-mb-md text-white">Filters</h6>
          <q-select
            filled
            v-model="selectedCategory"
            label="Category"
            :options="['Tech']"
            class="q-mb-sm filter-input"
            dark
          />
          <q-select
            filled
            v-model="sortedBy"
            label="Sort by"
            :options="['Newest', 'Popular', 'Alphabetical']"
            class="q-mb-sm filter-input"
            dark
          />
          <q-toggle label="Favorites Only" v-model="filterFavourites" class="q-mb-sm text-white" />
          <q-btn
            label="Reset"
            flat
            icon="refresh"
            class="q-mt-md full-width reset-btn"
            @click="resetFilters"
          />
        </div>
      </q-scroll-area>
    </q-drawer>

    <!-- Main Page Content -->
    <q-page-container>
      <q-page class="q-pa-md content-area">
        <!-- Intro Section -->
        <div class="intro-section q-mb-xl text-center">
          <h1 class="text-h3 text-white q-mb-sm animate-title">
            Welcome to the Future of Web Apps
          </h1>
          <p class="text-subtitle1 text-grey-3 q-mb-md">
            Build modern, scalable applications with Quasar's responsive UI and Supabase's real-time
            backend.
          </p>
          <q-btn
            color="accent"
            label="Get Started"
            to="/signup"
            size="lg"
            class="glow-btn q-mt-sm"
          />
        </div>

        <!-- Card Grid -->
        <div class="card-grid">
          <q-card
            v-for="(item, index) in filteredItems"
            :key="index"
            class="abstract-card"
            :class="{ favorite: item.favorite }"
          >
            <div class="card-content">
              <div class="card-placeholder"></div>
              <div class="card-title text-h6 text-white">{{ item.title }}</div>
              <div class="card-description text-caption text-grey-4">
                {{ item.description }}
              </div>
              <q-btn
                flat
                dense
                :icon="item.favorite ? 'favorite' : 'favorite_border'"
                class="favorite-btn"
                @click="toggleFavorite(index)"
              />
            </div>
          </q-card>
        </div>

        <!-- Scroll to Top -->
        <q-page-scroller position="bottom-right">
          <q-btn fab icon="keyboard_arrow_up" color="accent" class="scroll-btn" />
        </q-page-scroller>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { supabase } from 'src/boot/supabaseClient';
import { useUserStore } from 'src/stores/user';
import { AuthError } from '@supabase/supabase-js';

const $q = useQuasar();
const router = useRouter();
const userStore = useUserStore();
const drawerRight = ref(false);
const selectedCategory = ref('');
const sortedBy = ref('Newest');
const filterFavourites = ref(false);

// Sample data for the card grid
const items = ref([
  {
    title: 'Real-Time Database',
    description: 'Sync data instantly with Supabase.',
    category: 'Tech',
    favorite: false,
  },
  {
    title: 'Responsive UI',
    description: 'Build for any device with Quasar.',
    category: 'Tech',
    favorite: true,
  },
  {
    title: 'User Auth',
    description: 'Secure login with Supabase Auth.',
    category: 'Tech',
    favorite: false,
  },
  {
    title: 'TypeScript Support',
    description: 'Type-safe coding out of the box.',
    category: 'Tech',
    favorite: false,
  },
]);

// Computed property for filtered and sorted items
const filteredItems = computed(() => {
  let result = [...items.value];

  // Filter by category
  if (selectedCategory.value) {
    result = result.filter((item) => item.category === selectedCategory.value);
  }

  // Filter by favorites
  if (filterFavourites.value) {
    result = result.filter((item) => item.favorite);
  }

  // Sort
  if (sortedBy.value === 'Alphabetical') {
    result.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortedBy.value === 'Popular') {
    result.sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));
  } else {
    // Newest (default order)
  }

  return result;
});

// Reset filters
const resetFilters = () => {
  selectedCategory.value = '';
  sortedBy.value = 'Newest';
  filterFavourites.value = false;
};

// Toggle favorite status
const toggleFavorite = (index: number) => {
  if (items.value[index]) {
    items.value[index].favorite = !items.value[index].favorite;
  }
};

// Logout function
const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    userStore.setUser(null); // Clear user state
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Logged out successfully',
    });
    await router.push('/login'); // Redirect to login page
  } catch (error: unknown) {
    console.error('Logout error:', error);
    const message = error instanceof AuthError ? error.message : 'An unexpected error occurred';
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: `Logout failed: ${message}`,
    });
  }
};
</script>

<style scoped>
.abstract-layout {
  background: linear-gradient(135deg, #1e1b4b 0%, #3b0764 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.header-gradient {
  background: linear-gradient(90deg, rgba(74, 144, 226, 0.8), rgba(80, 201, 195, 0.8));
  backdrop-filter: blur(5px);
}

.filter-drawer {
  background: rgba(30, 27, 75, 0.95);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.filter-input {
  background: rgba(255, 255, 255, 0.1);
}

.reset-btn {
  color: #f0c14b;
  transition: transform 0.3s;
}

.reset-btn:hover {
  transform: scale(1.05);
}

.content-area {
  padding-top: 80px;
}

.intro-section {
  max-width: 800px;
  margin: 0 auto;
}

.animate-title {
  animation: fadeInUp 1s ease-out;
}

.glow-btn {
  box-shadow: 0 0 10px rgba(240, 193, 75, 0.5);
  transition: box-shadow 0.3s;
}

.glow-btn:hover {
  box-shadow: 0 0 20px rgba(240, 193, 75, 0.8);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.abstract-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  position: relative;
}

.abstract-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-placeholder {
  width: 100%;
  height: 120px;
  background: linear-gradient(45deg, #f0c14b, #ff6f61);
  border-radius: 8px;
  animation: pulse 2s infinite;
}

.card-title {
  font-weight: 600;
}

.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #f0c14b;
}

.favorite .card-placeholder {
  background: linear-gradient(45deg, #ff6f61, #d81b60);
}

.scroll-btn {
  box-shadow: 0 0 10px rgba(240, 193, 75, 0.5);
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

@keyframes pulse {
  0% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.8;
  }
}
</style>
