<template>
  <div class="q-pa-md form-container">
    <div class="q-gutter-md row items-start q-gutter-md justify-center">
      <img
        src="../assets/generic_logo.png"
        alt="Logo"
        width="200"
        height="200"
        class="q-mb-md flex-center"
      />
    </div>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input
        filled
        v-model="email"
        label="Your Email *"
        hint="Email"
        type="email"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        filled
        v-model="password"
        label="Password *"
        hint="Password"
        type="password"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />
      <div class="column">
        <router-link to="/signup">Don't have an account? Sign up</router-link>
        <router-link to="/forgot-password">Forgot Password?</router-link>
      </div>
      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { supabase } from 'src/boot/supabaseClient';
import { useUserStore } from 'src/stores/user';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
const router = useRouter();
const $q = useQuasar();
const password = ref('');
const email = ref('');
const userStore = useUserStore();

onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  const userData = userStore.user;
  const user = data.session?.user;

  if (user && userData) {
    router.push('/').catch((error) => {
      console.error('Error navigating to home:', error);
    });
  }
});

function onSubmit() {
  supabase.auth
    .signInWithPassword({ email: email.value, password: password.value })
    .then(async ({ error }) => {
      if (error) {
        $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: `Error: ${error.message}`,
        });
        return;
      }
      console.log(email.value);
      // ✅ Get user data from your 'users' table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .ilike('email', email.value)
        .single(); // assuming each email is unique

      if (userError) {
        $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: `Error: ${userError.message}`,
        });
        return;
      }

      userStore.setUser(userData);
      router.push('/').catch((error) => {
        console.error('Error navigating to home:', error);
      });

      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Login successful!',
      });
    })
    .catch((err) => {
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'error',
        message: `Unexpected error: ${err.message}`,
      });
    });
}
function onReset() {
  password.value = '';
  email.value = '';
}
</script>

<style scoped>
.form-container {
  margin: auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 50px;
  width: 400px;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.1);
}
</style>
