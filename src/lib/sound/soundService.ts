class SimpleSoundService {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  private async initAudio() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      // Resume is important - AudioContext starts suspended
      await this.audioContext.resume();
      console.log('✅ AudioContext initialized and resumed');
    }
    return this.audioContext;
  }

  private playTone(frequency: number, duration: number, volume: number = 0.3, type: OscillatorType = 'sine') {
    if (!this.enabled) return;
    
    this.initAudio().then(ctx => {
      if (!ctx) return;
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
      
      oscillator.start();
      oscillator.stop(ctx.currentTime + duration);
    }).catch(err => console.error('Audio error:', err));
  }

  playWin() {
    console.log('🔊 Playing win sound');
    // Happy ascending arpeggio
    this.playTone(523.25, 0.15, 0.4); // C5
    setTimeout(() => this.playTone(659.25, 0.15, 0.4), 150); // E5
    setTimeout(() => this.playTone(783.99, 0.3, 0.4), 300); // G5
  }

  playLose() {
    console.log('🔊 Playing lose sound');
    // Sad descending sound
    this.playTone(440, 0.25, 0.4, 'sawtooth');
    setTimeout(() => this.playTone(349.23, 0.25, 0.4, 'sawtooth'), 200);
    setTimeout(() => this.playTone(293.66, 0.4, 0.3, 'sawtooth'), 400);
  }

  playBet() {
    console.log('🔊 Playing bet sound');
    // Simple click/chime
    this.playTone(800, 0.05, 0.15, 'square');
  }

  toggleSound() {
    this.enabled = !this.enabled;
    console.log(`Sound ${this.enabled ? 'enabled' : 'disabled'}`);
    return this.enabled;
  }
}

export const soundService = new SimpleSoundService();