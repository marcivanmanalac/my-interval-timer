import { store } from './store';

export class AudioController {
    private context: AudioContext | null = null;

    constructor() {
        // Init on first interaction usually, but here we can prepare
    }

    public initContext() {
        if (!this.context) {
            this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    playBeep(frequency: number = 440, duration: number = 0.1, type: OscillatorType = 'sine') {
        this.initContext();
        if (!this.context) return;

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        const volume = store.settings.volume / 100;
        const gainValue = volume * 0.1; // Max 0.1 to avoid clipping/loudness

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.context.currentTime);

        gain.gain.setValueAtTime(gainValue, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.context.destination);

        osc.start();
        osc.stop(this.context.currentTime + duration);
    }

    playTick() {
        this.playBeep(880, 0.1, 'sine');
    }

    playStart() {
        this.playBeep(store.settings.startToneFreq, 0.8, 'sine');
    }

    playRest() {
        this.playBeep(store.settings.stopToneFreq, 0.5, 'square');
    }
}

export const audioController = new AudioController();
