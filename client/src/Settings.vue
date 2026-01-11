<script setup lang="ts">
import { store } from './store';

const emit = defineEmits<{
  (e: 'back'): void;
}>();

const save = () => {
    store.saveSettings();
    emit('back');
};
</script>

<template>
  <div class="max-w-md mx-auto p-6 min-h-[500px]">
    <div class="flex items-center justify-between mb-8">
        <button @click="emit('back')" class="text-gray-400 hover:text-white transition">← Back</button>
        <h2 class="text-3xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">Settings</h2>
        <div class="w-10"></div> <!-- Spacer -->
    </div>

    <div class="space-y-8 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
        
        <!-- Audio -->
        <div>
           <h3 class="text-lg font-semibold mb-4 text-purple-400">Audio</h3>
           <div class="space-y-4">
                <div>
                    <div class="flex justify-between mb-1">
                        <label class="text-sm text-gray-400">Master Volume</label>
                        <span class="text-sm text-white">{{ store.settings.volume }}%</span>
                    </div>
                    <input type="range" v-model.number="store.settings.volume" min="0" max="100" class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500">
                </div>
                
                <div>
                     <div class="flex justify-between mb-1">
                        <label class="text-sm text-gray-400">Start Tone Frequency (Hz)</label>
                         <span class="text-sm text-white">{{ store.settings.startToneFreq }} Hz</span>
                    </div>
                    <input type="range" v-model.number="store.settings.startToneFreq" min="200" max="2000" step="50" class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500">
                </div>

                <div>
                     <div class="flex justify-between mb-1">
                        <label class="text-sm text-gray-400">Stop/Rest Tone Frequency (Hz)</label>
                         <span class="text-sm text-white">{{ store.settings.stopToneFreq }} Hz</span>
                    </div>
                    <input type="range" v-model.number="store.settings.stopToneFreq" min="200" max="2000" step="50" class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500">
                </div>
           </div>
        </div>

        <!-- Timer -->
        <div>
            <h3 class="text-lg font-semibold mb-4 text-green-400">Timer</h3>
             <div>
                <div class="flex justify-between mb-1">
                    <label class="text-sm text-gray-400">Countdown Duration (s)</label>
                        <span class="text-sm text-white">{{ store.settings.countdownDuration }}s</span>
                </div>
                <input type="range" v-model.number="store.settings.countdownDuration" min="0" max="10" step="1" class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500">
            </div>
        </div>

        <!-- Actions -->
        <div class="pt-4">
            <button @click="save" class="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold transition shadow-lg">Save Settings</button>
        </div>

    </div>
  </div>
</template>
