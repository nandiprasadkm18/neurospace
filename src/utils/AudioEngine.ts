import * as Tone from 'tone';

class AmbientEngine {
  private initiated = false;
  
  // Audio Nodes
  private masterVolume: Tone.Volume;
  
  // Space Player
  private spacePlayer: Tone.Player;
  private spaceVolume: Tone.Volume;
  
  // Rain Player
  private rainPlayer: Tone.Player;
  private rainVolume: Tone.Volume;

  // Forest Player
  private forestPlayer: Tone.Player;
  private forestVolume: Tone.Volume;

  // Tracks
  private tracks: { [key: string]: Tone.Player } = {};

  constructor() {
    this.masterVolume = new Tone.Volume(0).toDestination();

    // Deep Space setup (Uses real audio file)
    this.spaceVolume = new Tone.Volume(-60).connect(this.masterVolume);
    this.spacePlayer = new Tone.Player({
      url: '/space.mp3',
      loop: true
    }).connect(this.spaceVolume);

    // Rain setup (Uses a real audio file for photorealistic rain)
    this.rainVolume = new Tone.Volume(-60).connect(this.masterVolume);
    
    // 1. Real Rain Audio Player (Loads from public/rain.mp3)
    this.rainPlayer = new Tone.Player({
      url: '/rain.mp3',
      loop: true
    }).connect(this.rainVolume);

    // Forest setup (Uses real audio file)
    this.forestVolume = new Tone.Volume(-60).connect(this.masterVolume);
    this.forestPlayer = new Tone.Player({
      url: '/forest.mp3',
      loop: true
    }).connect(this.forestVolume);

    this.tracks['space'] = this.spacePlayer;
    this.tracks['rain'] = this.rainPlayer;
    this.tracks['forest'] = this.forestPlayer;
  }

  async start() {
    if (!this.initiated) {
      await Tone.start();
      this.initiated = true;
    }
  }

  setVolume(type: 'space' | 'rain' | 'forest', value: number) {
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
    }
  }

  toggleTrack(type: 'space' | 'rain' | 'forest', play: boolean) {
    const player = this.tracks[type];
    if (play) {
      if (player.loaded && player.state !== 'started') player.start();
    } else {
      if (player.state === 'started') player.stop();
    }
  }

  stop() {
    if (this.initiated) {
      this.rainPlayer.stop();
      this.forestPlayer.stop();
      this.spacePlayer.stop();
      this.initiated = false;
    }
  }
}

export const engine = new AmbientEngine();
