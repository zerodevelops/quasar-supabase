<template>
  <q-layout view="hHh lpR fFf">
    <q-toolbar class="bg-transparent text-black shadow-2">
      <q-btn flat label="Mohammed Sohail Mahalti" />
      <q-space />
      <q-tabs v-model="tab" shrink>
        <q-tab name="tab1" label="Home" />
        <q-tab name="tab2" label="Projects" />
        <q-tab name="tab3" label="Contact" />
      </q-tabs>
    </q-toolbar>
    <q-page-container class="flex column" style="min-height: 100vh">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const tab = ref('');
</script>
