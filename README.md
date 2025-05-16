# Quasar + Supabase Auth Boilerplate Starter
---

**User Sign up and Sign in Authentication** for easy integration into any app using **Supabase** and **Quasar Framework**.

- 🧩 **Pinia** is used for user data storage.
- 🛢️ **Supabase** manages user authentication and data in **PostgreSQL**.
- ⚡ Built for fast, modern app development with **hot reload**, **linting**, and **production build** workflows.

---

## Getting Started 🚀

Update Supabase Client Details 🔧

Before running the app, update your Supabase Project URL and Anon Key inside the src/boot/supabaseCreateClient.js (or wherever you want to initialize Supabase):

```
const supabaseUrl = ''
const supabaseKey = ''
```
Make sure to replace 'supabaseUrl' and 'supabaseKey' with your actual credentials from your Supabase located in Project Settings > Data API.

Initialise user data table by running this sql query
Else will cause error on login and sign up but the redirect email auth will login.
```
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```


### 1. Install the dependencies
```bash
yarn
# or
npm install

```


### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Lint the files
```bash
yarn lint
# or
npm run lint
```


### Format the files
```bash
yarn format
# or
npm run format
```


### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
