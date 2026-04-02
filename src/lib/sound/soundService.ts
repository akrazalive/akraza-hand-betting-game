class SimpleSoundService {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  private async initAudio() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      await this.audioContext.resume();
      console.log('✅ AudioContext initialized and resumed');
    }
    return this.audioContext;
  }

  private playTone(frequency: number, duration: number, volume: number = 0.3, type: OscillatorType = 'sine', startTime?: number) {
    if (!this.enabled) return;
    
    const playAt = startTime || 0;
    
    this.initAudio().then(ctx => {
      if (!ctx) return;
      
      const now = ctx.currentTime;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      
      gainNode.gain.setValueAtTime(volume, now + playAt);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, now + playAt + duration);
      
      oscillator.start(now + playAt);
      oscillator.stop(now + playAt + duration);
    }).catch(err => console.error('Audio error:', err));
  }

  // WIN SOUND - Cheerful fanfare with harmonies
  playWin() {
    console.log('🎉 Playing WIN sound - Celebration!');
    
    // Quick rising arpeggio
    this.playTone(523.25, 0.12, 0.5); // C5
    setTimeout(() => this.playTone(659.25, 0.12, 0.5), 80); // E5
    setTimeout(() => this.playTone(783.99, 0.12, 0.5), 160); // G5
    setTimeout(() => this.playTone(1046.50, 0.3, 0.6), 240); // C6
    
    // Add a cheerful chord at the end
    setTimeout(() => {
      this.playTone(523.25, 0.6, 0.4, 'sine', 0);
      this.playTone(659.25, 0.6, 0.4, 'sine', 0);
      this.playTone(783.99, 0.6, 0.4, 'sine', 0);
    }, 280);
    
    // Small sparkle effect
    setTimeout(() => {
      this.playTone(1567.98, 0.08, 0.2, 'sine');
    }, 500);
  }

  // LOSE SOUND - Dramatic, grieving descending melody
  playLose() {
    console.log('😢 Playing LOSE sound - Heartbreaking...');
    
    // Deep descending bass notes
    this.playTone(349.23, 0.3, 0.45, 'sawtooth'); // F4
    setTimeout(() => this.playTone(293.66, 0.3, 0.45, 'sawtooth'), 250); // D4
    setTimeout(() => this.playTone(246.94, 0.4, 0.45, 'sawtooth'), 500); // B3
    setTimeout(() => this.playTone(196.00, 0.8, 0.5, 'sawtooth'), 800); // G3
    
    // Sad vibrato effect
    setTimeout(() => {
      const ctx = this.audioContext;
      if (ctx) {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 174.61; // F3
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
        
        // Add vibrato
        const vibrato = ctx.createOscillator();
        const vibratoGain = ctx.createGain();
        vibrato.connect(vibratoGain);
        vibratoGain.connect(oscillator.frequency);
        vibrato.frequency.value = 5;
        vibratoGain.gain.value = 5;
        
        oscillator.start();
        vibrato.start();
        oscillator.stop(ctx.currentTime + 1.2);
        vibrato.stop(ctx.currentTime + 1.2);
      }
    }, 1100);
  }

  // BET HIGH - Exciting, confident ascending sound
  playBetHigh() {
    console.log('⬆️ Playing BET HIGH sound - Exciting!');
    
    // Rising rocket-like sound
    this.playTone(440, 0.08, 0.3, 'square');
    setTimeout(() => this.playTone(554.37, 0.08, 0.35, 'square'), 50);
    setTimeout(() => this.playTone(698.46, 0.08, 0.4, 'square'), 100);
    setTimeout(() => this.playTone(880, 0.08, 0.45, 'square'), 150);
    setTimeout(() => this.playTone(1108.73, 0.2, 0.5, 'square'), 200);
    
    // Add a triumphant ending
    setTimeout(() => {
      this.playTone(1318.51, 0.3, 0.4, 'sine');
    }, 280);
  }

  // BET LOW - Cautious, descending sound
  playBetLow() {
    console.log('⬇️ Playing BET LOW sound - Careful...');
    
    // Descending cautious tone
    this.playTone(880, 0.1, 0.35, 'triangle');
    setTimeout(() => this.playTone(698.46, 0.1, 0.35, 'triangle'), 100);
    setTimeout(() => this.playTone(554.37, 0.1, 0.35, 'triangle'), 200);
    setTimeout(() => this.playTone(440, 0.25, 0.4, 'triangle'), 300);
    
    // Gentle tap sound
    setTimeout(() => {
      this.playTone(220, 0.05, 0.2, 'sine');
    }, 450);
  }

  // RESOLVE SOUND - Mysterious, revealing sound
  playResolve() {
    console.log('✨ Playing RESOLVE sound - Revealing!');
    
    // Mysterious sweeping sound
    this.playTone(392, 0.2, 0.3, 'sine');
    setTimeout(() => this.playTone(523.25, 0.2, 0.35, 'sine'), 150);
    setTimeout(() => this.playTone(659.25, 0.25, 0.4, 'sine'), 300);
    
    // Add shimmer effect
    setTimeout(() => {
      this.playTone(987.77, 0.1, 0.25, 'sine');
      this.playTone(1318.51, 0.1, 0.25, 'sine');
    }, 450);
    
    // Final chime
    setTimeout(() => {
      this.playTone(1046.50, 0.3, 0.35, 'sine');
    }, 550);
  }

  // Additional: Draw new hand sound
  playDrawHand() {
    console.log('🎴 Playing DRAW HAND sound');
    
    // Swishing, shuffling sound
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.playTone(300 + i * 100, 0.05, 0.15, 'triangle');
      }, i * 50);
    }
    
    // Final placement thud
    setTimeout(() => {
      this.playTone(150, 0.1, 0.2, 'sine');
    }, 180);
  }

  // Keep original methods for backward compatibility
  playBet() {
    this.playBetHigh(); // Default to bet high for existing code
  }

  toggleSound() {
    this.enabled = !this.enabled;
    console.log(`🔊 Sound ${this.enabled ? 'enabled' : 'disabled'}`);
    return this.enabled;
  }
  
   // Add this method to your SimpleSoundService class
    playWarning() {
    console.log('⚠️ Playing WARNING sound');
    
    // Quick, sharp warning beep
    this.playTone(880, 0.1, 0.4, 'square');
    
    // Double beep for urgency
    setTimeout(() => {
        this.playTone(880, 0.12, 0.45, 'square');
    }, 150);
    
    // Descending warning tone
    setTimeout(() => {
        this.playTone(660, 0.15, 0.35, 'sawtooth');
        setTimeout(() => {
        this.playTone(440, 0.2, 0.3, 'sawtooth');
        }, 100);
    }, 350);
    
    // Add a subtle buzzing effect
    setTimeout(() => {
        for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            this.playTone(220, 0.05, 0.15, 'sine');
        }, i * 50);
        }
    }, 500);
    }

}

export const soundService = new SimpleSoundService();