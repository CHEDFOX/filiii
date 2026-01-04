import * as Speech from 'expo-speech';
import { VoiceSettings } from '@/types';

const defaultSettings: VoiceSettings = {
  enabled: true,
  rate: 0.9,
  pitch: 1.0,
  volume: 1.0,
};

let currentSettings: VoiceSettings = { ...defaultSettings };
let isSpeaking = false;

export const voiceService = {
  updateSettings(settings: Partial<VoiceSettings>) {
    currentSettings = { ...currentSettings, ...settings };
  },

  getSettings(): VoiceSettings {
    return { ...currentSettings };
  },

  async speak(text: string): Promise<void> {
    if (!currentSettings.enabled) {
      return;
    }

    if (isSpeaking) {
      await this.stop();
    }

    return new Promise((resolve, reject) => {
      isSpeaking = true;

      Speech.speak(text, {
        rate: currentSettings.rate,
        pitch: currentSettings.pitch,
        volume: currentSettings.volume,
        onDone: () => {
          isSpeaking = false;
          resolve();
        },
        onError: (error) => {
          isSpeaking = false;
          reject(error);
        },
        onStopped: () => {
          isSpeaking = false;
          resolve();
        },
      });
    });
  },

  async stop(): Promise<void> {
    if (isSpeaking) {
      await Speech.stop();
      isSpeaking = false;
    }
  },

  async pause(): Promise<void> {
    if (isSpeaking) {
      await Speech.pause();
    }
  },

  async resume(): Promise<void> {
    await Speech.resume();
  },

  isSpeaking(): boolean {
    return isSpeaking;
  },

  isAvailable(): boolean {
    return Speech.isSpeakingAsync !== undefined;
  },
};
