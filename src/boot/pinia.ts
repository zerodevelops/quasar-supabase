import { boot } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import piniaPersistedstate from 'pinia-plugin-persistedstate';

export default boot(({ app }) => {
  const pinia = createPinia();
  pinia.use(piniaPersistedstate);
  app.use(pinia);
});
