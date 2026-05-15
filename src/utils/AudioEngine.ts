import * as Tone from 'tone';

class AmbientEngine {
  private initiated = false;
  
  // Audio Nodes
  private masterVolume: Tone.Volume;
  
  // Space Synth
  private spaceDrone: Tone.PolySynth;
  private spaceVolume: Tone.Volume;
  
  // Rain Noise
  private rainNoise: Tone.Noise;
  private rainFilter: Tone.AutoFilter;
  private rainVolume: Tone.Volume;

  // Forest Noise
  private forestNoise: Tone.Noise;
  private forestFilter: Tone.Filter;
  private forestVolume: Tone.Volume;

  // Cafe Chatter (Abstracted via noise and random LFO)
  private cafeNoise: Tone.Noise;
  private cafeLFO: Tone.LFO;
  private cafeVolume: Tone.Volume;

  constructor() {
    this.masterVolume = new Tone.Volume(0).toDestination();

    // Deep Space setup
    this.spaceVolume = new Tone.Volume(-60).connect(this.masterVolume);
    const spaceReverb = new Tone.Reverb({ decay: 10, preDelay: 0.1, wet: 0.8 }).connect(this.spaceVolume);
    this.spaceDrone = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 4, decay: 0.5, sustain: 1, release: 4 }
    }).connect(spaceReverb);

    // Rain setup
    this.rainVolume = new Tone.Volume(-60).connect(this.masterVolume);
    this.rainFilter = new Tone.AutoFilter({ frequency: 0.1, baseFrequency: 200, octaves: 2, type: 'sine' }).connect(this.rainVolume);
    this.rainNoise = new Tone.Noise('pink').connect(this.rainFilter);
    this.rainFilter.start();

    // Forest setup (High pitched wind/leaves abstraction)
    this.forestVolume = new Tone.Volume(-60).connect(this.masterVolume);
    this.forestFilter = new Tone.Filter({ type: 'bandpass', frequency: 1200, Q: 1 }).connect(this.forestVolume);
    this.forestNoise = new Tone.Noise('brown').connect(this.forestFilter);

    // Cafe setup (Low rumbly noise with erratic LFO simulating chatter)
    this.cafeVolume = new Tone.Volume(-60).connect(this.masterVolume);
    const cafeFilter = new Tone.Filter({ type: 'lowpass', frequency: 500 }).connect(this.cafeVolume);
    this.cafeNoise = new Tone.Noise('white').connect(cafeFilter);
    this.cafeLFO = new Tone.LFO({ type: 'sine', min: 200, max: 600, frequency: 0.5 }).connect(cafeFilter.frequency);
    this.cafeLFO.start();
  }

  async start() {
    if (!this.initiated) {
      await Tone.start();
      this.rainNoise.start();
      this.forestNoise.start();
      this.cafeNoise.start();
      this.spaceDrone.triggerAttack(['C2', 'G2', 'C3'], Tone.now());
      this.initiated = true;
    }
  }

  setVolume(type: 'space' | 'rain' | 'forest' | 'cafe', value: number) {
    // value is 0 to 100
    // Convert to decibels: 0 is -60dB (mute), 100 is 0dB
    const db = value <= 0 ? -100 : 20 * Math.log10(value / 100);
    
    switch (type) {
      case 'space':
        this.spaceVolume.volume.rampTo(db, 0.1);
        break;
      case 'rain':
        this.rainVolume.volume.rampTo(db, 0.1);
        break;
      case 'forest':
        this.forestVolume.volume.rampTo(db, 0.1);
        break;
      case 'cafe':
        this.cafeVolume.volume.rampTo(db, 0.1);
        break;
    }
  }

  stop() {
    if (this.initiated) {
      this.rainNoise.stop();
      this.forestNoise.stop();
      this.cafeNoise.stop();
      this.spaceDrone.releaseAll();
      this.initiated = false;
    }
  }
}

export const engine = new AmbientEngine();
