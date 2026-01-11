<script setup lang="ts">
import { ref, onUnmounted, computed } from 'vue';
import { audioController } from './audio';
import { store } from './store';

interface Profile {
  id?: number;
  name: string;
  work: number;
  rest: number;
  reps: number;
}

const props = defineProps<{
  profile: Profile;
}>();

const emit = defineEmits<{
  (e: 'back'): void;
}>();

const PRE_START_TIME = computed(() => store.settings.countdownDuration);

type Phase = 'GET READY' | 'WORK' | 'REST' | 'FINISHED';

const phase = ref<Phase>('GET READY');
const timeRemaining = ref(PRE_START_TIME.value);
const currentRep = ref(1);
const isRunning = ref(false);
const totalReps = computed(() => props.profile.reps);

let intervalId: number | null = null;

const start = () => {
  if (isRunning.value) return;
  isRunning.value = true;
  audioController.initContext(); // Ensure audio context is ready
  
  if (phase.value === 'FINISHED') {
      reset(); // Restart if finished
      isRunning.value = true; // Was reset to false
  }

  intervalId = window.setInterval(() => {
    tick();
  }, 1000);
};

const pause = () => {
  isRunning.value = false;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

const reset = () => {
  pause();
  phase.value = 'GET READY';
  timeRemaining.value = PRE_START_TIME.value;
  currentRep.value = 1;
};

const tick = () => {
    // Audio Cues
    if (timeRemaining.value <= 4 && timeRemaining.value > 1) {
       audioController.playTick(); // 3, 2, 1
    }
    if (timeRemaining.value === 1) {
       // Just before 0, handled at transition
    }

  timeRemaining.value--;

  if (timeRemaining.value < 0) {
    transitionPhase();
  }
};

const transitionPhase = () => {
  if (phase.value === 'GET READY') {
    startWork();
  } else if (phase.value === 'WORK') {
    if (currentRep.value >= totalReps.value) {
        finish();
    } else {
        startRest();
    }
  } else if (phase.value === 'REST') {
    currentRep.value++;
    startWork();
  }
};

const startWork = () => {
  phase.value = 'WORK';
  timeRemaining.value = props.profile.work;
  audioController.playStart();
};

const startRest = () => {
  phase.value = 'REST';
  timeRemaining.value = props.profile.rest;
  audioController.playRest();
};

const finish = () => {
  phase.value = 'FINISHED';
  pause();
  audioController.playStart(); // Celebration beep?
};

// Cleanup
onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

// Format time mm:ss
const formattedTime = computed(() => {
    const min = Math.floor(timeRemaining.value / 60);
    const sec = timeRemaining.value % 60;
    // For timer display, 0 is shown as 0
    // Actually, we want to show 0 when it hits 0 before switching?
    // Current logic switches at < 0 which means it shows 0 for 1 sec.
    return `${min}:${sec.toString().padStart(2, '0')}`;
});

const progressPercent = computed(() => {
    let total = 1;
    if (phase.value === 'GET READY') total = PRE_START_TIME.value;
    else if (phase.value === 'WORK') total = props.profile.work;
    else if (phase.value === 'REST') total = props.profile.rest;
    
    // Inverted progress (draining bar)
    return (timeRemaining.value / total) * 100;
});

const phaseColor = computed(() => {
    switch(phase.value) {
        case 'WORK': return 'text-green-500';
        case 'REST': return 'text-orange-500';
        case 'GET READY': return 'text-blue-500';
        default: return 'text-white';
    }
});

const bgColor = computed(() => {
     switch(phase.value) {
        case 'WORK': return 'bg-green-500';
        case 'REST': return 'bg-orange-500';
        case 'GET READY': return 'bg-blue-500';
        default: return 'bg-gray-700';
    }
});
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[80vh] text-white space-y-8">
     <!-- Header -->
     <div class="w-full max-w-md flex justify-between items-center px-6">
        <button @click="emit('back')" class="text-gray-400 hover:text-white transition">← Back</button>
        <div class="text-xl font-bold">{{ profile.name }}</div>
        <div class="text-gray-400">Rep {{ currentRep }} / {{ totalReps }}</div>
     </div>

     <!-- Main Timer Circle -->
     <div class="relative w-72 h-72 flex items-center justify-center rounded-full border-8 border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <!-- Progress Ring (Simulated with absolute div for now, simple) -->
        <div 
            class="absolute inset-0 rounded-full opacity-20 transition-all duration-1000"
            :class="bgColor"
            :style="{ transform: `scale(${0.9 + (progressPercent/1000)})` }"
        ></div>
        
        <div class="z-10 text-center">
            <div class="text-2xl font-bold tracking-wider mb-2 opacity-80" :class="phaseColor">{{ phase }}</div>
            <div class="text-7xl font-mono font-bold text-white">{{ formattedTime }}</div>
        </div>
     </div>

     <!-- Controls -->
     <div class="flex gap-6">
        <button 
            v-if="!isRunning && phase !== 'FINISHED'" 
            @click="start" 
            class="w-20 h-20 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center shadow-lg transition transform hover:scale-105"
        >
            <span class="text-3xl">▶</span>
        </button>
        <button 
            v-else-if="isRunning" 
            @click="pause" 
            class="w-20 h-20 rounded-full bg-yellow-600 hover:bg-yellow-500 flex items-center justify-center shadow-lg transition transform hover:scale-105"
        >
            <span class="text-3xl">❚❚</span>
        </button>
        
        <button 
            @click="reset" 
            class="w-16 h-16 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center shadow-lg transition transform hover:scale-105"
        >
            <span class="text-2xl">↺</span>
        </button>
     </div>
  </div>
</template>
