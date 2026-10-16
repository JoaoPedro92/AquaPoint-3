

<template>
  <!-- <HelloWorld msg="Vite + Vue" /> -->

  <div class="d-flex flex-column min-vh-100">
    <NavBar/>
    <main class="flex-grow-1">
      <router-view/>
      <LoginModal></LoginModal>

    </main>

    <Footer></Footer>
  </div>

  
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import Footer from './components/Footer.vue';
import NavBar from './components/NavBar.vue';
import LoginModal from './components/LoginModal.vue';

const route = useRoute()
const router = useRouter()
const toast = useToast()

watch(() => route.query.error, (error) => {
    if (error === 'acesso-negado') {
        toast.error('Acesso negado.')
        router.replace({ query: {} })
    }
}, { immediate: true })
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
