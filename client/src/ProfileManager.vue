<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Profile {
  id?: number;
  name: string;
  work: number;
  rest: number;
  reps: number;
}

const emit = defineEmits<{
  (e: 'select-profile', profile: Profile): void;
}>();

const profiles = ref<Profile[]>([]);
const isCreating = ref(false);
const newProfile = ref<Profile>({ name: '', work: 30, rest: 10, reps: 5 });
const loading = ref(false);

const loadProfiles = async () => {
  loading.value = true;
  try {
    const res = await fetch('/api/profiles');
    if (res.ok) {
      profiles.value = await res.json();
    }
  } catch (e) {
    console.error("Failed to load profiles", e);
  } finally {
    loading.value = false;
  }
};

const saveProfile = async () => {
  const profileToSave = { ...newProfile.value, id: Date.now() };
  const updatedProfiles = [...profiles.value, profileToSave];
  
  try {
    await fetch('/api/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProfiles)
    });
    profiles.value = updatedProfiles;
    newProfile.value = { name: '', work: 30, rest: 10, reps: 5 };
    isCreating.value = false;
  } catch (e) {
    console.error("Failed to save profile", e);
  }
};

const deleteProfile = async (id: number, event: Event) => {
  event.stopPropagation(); // Prevent selection
  if (!confirm('Are you sure you want to delete this profile?')) return;

  try {
    const res = await fetch(`/api/profiles/${id}`, { method: 'DELETE' });
    if (res.ok) {
        profiles.value = profiles.value.filter(p => p.id !== id);
    }
  } catch (e) {
    console.error("Failed to delete profile", e);
  }
};


onMounted(() => {
  loadProfiles();
});
</script>

<template>
  <div class="max-w-md mx-auto p-6 text-white">
    <h2 class="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Workouts</h2>

    <!-- List -->
    <div v-if="!isCreating" class="space-y-4">
      <div v-if="loading" class="text-center text-gray-400">Loading...</div>
      
      <div 
        v-for="profile in profiles" 
        :key="profile.id"
        @click="emit('select-profile', profile)"
        class="bg-gray-800 p-4 rounded-xl cursor-pointer hover:bg-gray-700 transition duration-300 border border-gray-700 hover:border-blue-500 group shadow-lg"
      >
        <div class="flex justify-between items-center">
            <h3 class="text-xl font-semibold text-white group-hover:text-blue-400 transition">{{ profile.name }}</h3>
            <div class="flex items-center gap-4">
                <span class="text-sm text-gray-400">{{ profile.reps }} x ({{ profile.work }}s / {{ profile.rest }}s)</span>
                <button 
                    @click="(e) => deleteProfile(profile.id!, e)"
                    class="p-2 text-gray-400 hover:text-red-500 transition rounded-full hover:bg-gray-600"
                    title="Delete Profile"
                >
                    🗑️
                </button>
            </div>
        </div>
      </div>

      <div 
        @click="isCreating = true"
        class="bg-gray-800 p-4 rounded-xl cursor-pointer hover:bg-gray-700 transition duration-300 border border-gray-700 border-dashed flex justify-center items-center text-gray-400 hover:text-white"
      >
        <span class="text-lg">+ Create New Profile</span>
      </div>
    </div>

    <!-- Form -->
    <div v-else class="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-2xl">
      <h3 class="text-xl font-bold mb-4 text-white">New Profile</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm text-gray-400 mb-1">Name</label>
          <input v-model="newProfile.name" type="text" class="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none text-white" placeholder="e.g. Tabata">
        </div>
        <div class="grid grid-cols-3 gap-4">
           <div>
            <label class="block text-sm text-gray-400 mb-1">Work (s)</label>
            <input v-model.number="newProfile.work" type="number" class="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none text-white">
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-1">Rest (s)</label>
            <input v-model.number="newProfile.rest" type="number" class="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none text-white">
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-1">Reps</label>
            <input v-model.number="newProfile.reps" type="number" class="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none text-white">
          </div>
        </div>
        
        <div class="flex gap-4 pt-4">
          <button @click="isCreating = false" class="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition">Cancel</button>
          <button @click="saveProfile" class="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>
