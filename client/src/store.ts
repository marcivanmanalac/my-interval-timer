import { reactive } from 'vue';

export interface Settings {
    volume: number; // 0-100
    startToneFreq: number;
    stopToneFreq: number;
    countdownDuration: number;
}

const defaultSettings: Settings = {
    volume: 50,
    startToneFreq: 1200,
    stopToneFreq: 880,
    countdownDuration: 3,
};

export const store = reactive({
    settings: { ...defaultSettings },
    async loadSettings() {
        try {
            const res = await fetch('/api/settings');
            if (res.ok) {
                const data = await res.json();
                this.settings = { ...defaultSettings, ...data };
            }
        } catch (e) {
            console.error("Failed to load settings", e);
        }
    },
    async saveSettings() {
        try {
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.settings)
            });
        } catch (e) {
            console.error("Failed to save settings", e);
        }
    },
});
