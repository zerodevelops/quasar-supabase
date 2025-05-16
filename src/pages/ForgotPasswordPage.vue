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

    <div>Provide your email to receive a Password reset link</div>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input
        filled
        v-model="email"
        label="Your Account Associated Email *"
        hint="Email"
        type="email"
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
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { supabase } from 'src/boot/supabaseClient';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter();
const $q = useQuasar();

const email = ref('');

onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;

  if (user) {
    router.push('/').catch((error) => {
      console.error('Error navigating to landing page:', error);
    });
  }
});

function onSubmit() {
  supabase.auth
    .resetPasswordForEmail(email.value, {
      redirectTo: 'https://zingy-kleicha-3857c8.netlify.app/reset-password',
    })
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
          message: 'Password reset Link sent to Email!',
        });

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
