<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="navbar">
      <q-toolbar class="bg-black text-white">
        <q-toolbar-title class="cursor-pointer" @click="landingPage">
          Quasar + Supabase Boilerplate
        </q-toolbar-title>

        <q-btn
          class="bg-black text-white"
          :label="
            userStore.user ? userStore.user.firstname + ' ' + userStore.user.lastname : 'Guest'
          "
        >
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section @click="signOut">Sign Out</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section>Settings</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section>Help &amp; Feedback</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container class="q-pa-none">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { supabase } from 'src/boot/supabaseClient';
import { useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/user';
const userStore = useUserStore();
const router = useRouter();

function signOut() {
  supabase.auth
    .signOut()
    .then(() => {
      router.push('/login').catch((error) => {
        console.error('Error navigating to login:', error);
      });
      userStore.setUser(null);
      console.log('Signed out successfully');
    })
    .catch((error) => {
      console.error('Error signing out:', error);
    });
}

function landingPage() {
  router.push('/landing').catch((error) => {
    console.error('Error navigating to landing page:', error);
  });
}
</script>

<style>
.navbar {
  color: black;
  box-shadow: none;
}
.my-custom-toggle {
  border: 1px solid #027be3;
}
</style>
