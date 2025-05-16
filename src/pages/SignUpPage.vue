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
        v-model="firstname"
        label="Your First name *"
        hint="First Name"
        lazy-rules
        class="q-mt-sm"
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        filled
        v-model="lastname"
        label="Your Last name *"
        hint="Surname"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        filled
        v-model="username"
        label="Your Username *"
        hint="Username"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

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

      <q-input
        filled
        v-model="confirmPassword"
        label="Confirm Password *"
        hint="Retype Password"
        type="password"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-toggle v-model="accept" label="I accept the license and terms" />
      <div class="column">
        <router-link to="/login">Already have an account? Login</router-link>
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
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useUserStore } from 'src/stores/user';
const userStore = useUserStore();
const $q = useQuasar();
const firstname = ref(null);
const lastname = ref(null);
const username = ref(null);
const password = ref('');
const confirmPassword = ref('');
const accept = ref(false);
const email = ref('');
const router = useRouter();

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
  if (accept.value !== true) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'You need to accept the license and terms first',
    });
  } else {
    if (password.value !== confirmPassword.value) {
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: 'Passwords do not match',
      });
      return;
    }
    if (password.value.length < 8) {
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: 'Password must be at least 8 characters long',
      });
      return;
    }
    supabase.auth
      .signUp({ email: email.value, password: password.value })
      .then(({ error }) => {
        if (error) {
          $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: `Error: ${error.message}`,
          });
        } else {
          router.push('/login').catch((error) => {
            console.error('Error navigating to login:', error);
          });
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Submitted successfully!',
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

    supabase
      .from('users')
      .insert([
        {
          firstname: firstname.value,
          lastname: lastname.value,
          username: username.value,
          email: email.value.trim().toLowerCase(),
        },
      ])
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
            message: 'Submitted successfully!',
          });
        }
      });
  }
}
function onReset() {
  firstname.value = null;
  lastname.value = null;
  username.value = null;
  password.value = '';
  confirmPassword.value = '';
  email.value = '';
  accept.value = false;
}
</script>

<style scoped>
.form-container {
  margin: auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 50px;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.1);
  width: 500px;
}
</style>
