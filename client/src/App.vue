<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ProfileManager from './ProfileManager.vue';
import Timer from './Timer.vue';
import Settings from './Settings.vue';
import { store } from './store';

interface Profile {
  id?: number;
  name: string;
  work: number;
  rest: number;
  reps: number;
}

const currentProfile = ref<Profile | null>(null);
const showSettings = ref(false);

const onSelectProfile = (profile: Profile) => {
    currentProfile.value = profile;
};

const onBack = () => {
    currentProfile.value = null;
    showSettings.value = false;
};

onMounted(() => {
    store.loadSettings();
});
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white font-sans selection:bg-blue-500 selection:text-white">
    <header class="p-4 border-b border-gray-800 flex justify-between items-center max-w-4xl mx-auto w-full">
        <div class="w-10"></div> <!-- Spacer -->
        <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">INTERVAL TIMER</h1>
        <div class="flex items-center gap-2">
            <button @click="showSettings = true" class="text-gray-400 hover:text-white transition p-2">
                ⚙️
            </button>
        </div>
    </header>
    
    <main class="container mx-auto p-4">
        <transition name="fade" mode="out-in">
            <Settings v-if="showSettings" @back="showSettings = false" />
            <Timer v-else-if="currentProfile" :profile="currentProfile" @back="onBack" />
            <ProfileManager v-else @select-profile="onSelectProfile" />
        </transition>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
