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
      <div>Provide new Password</div>
      <q-input
        filled
        v-model="password"
        label="Password *"
        hint="Password"
        type="password"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        filled
        v-model="confirmPassword"
        label="Confirm Password *"
        hint="Retype Password"
        type="password"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { supabase } from 'src/boot/supabaseClient';
import { useRouter } from 'vue-router';
const router = useRouter();
const $q = useQuasar();
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

onMounted(async () => {
  const url = new URL(window.location.href);
  const accessToken = url.searchParams.get('access_token');
  const type = url.searchParams.get('type');

  if (accessToken && type === 'recovery') {
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: accessToken,
    });

    if (error) {
      $q.notify({
        color: 'red-5',
        icon: 'error',
        message: `Failed to restore session: ${error.message}`,
      });
    } else {
      console.log('Session restored for password reset:', data.session);
    }
  }
});

function onSubmit() {
  if (password.value !== confirmPassword.value) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'Passwords do not match!',
    });
    return;
  }
  supabase.auth
    .updateUser({ password: password.value })
    .then(({ error }) => {
      if (error) {
        $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: `Error: ${error.message}`,
        });
      } else {
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Password reset successfully!',
        });
        // Redirect to login page or home page
        router.push('/login').catch((error) => {
          console.error('Error navigating to login:', error);
        });
      }
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
  email.value = '';
  password.value = '';
  confirmPassword.value = '';
}
</script>

<style scoped>
.form-container {
  margin: auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 100px;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.1);
}
</style>
