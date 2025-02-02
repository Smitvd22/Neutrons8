"use client"

class SoundManager {
  constructor() {
    this.sounds = {
      click: new Audio("/sounds/click.wav"),
      popup: new Audio("/sounds/popup.wav"),
      switch: new Audio("/sounds/switch.wav"),
    }

    // Initialize all sounds with low volume
    Object.values(this.sounds).forEach((sound) => {
      sound.volume = 0.3
    })
  }

  play(soundName) {
    const sound = this.sounds[soundName]
    if (sound) {
      sound.currentTime = 0 // Reset sound to start
      sound.play().catch((e) => console.log("Audio play failed:", e))
    }
  }
}

// Create a singleton instance
const soundManager = typeof window !== "undefined" ? new SoundManager() : null

export const playSound = (soundName) => {
  if (soundManager) {
    soundManager.play(soundName)
  }
}

