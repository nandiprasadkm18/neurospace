import * as Tone from 'tone';

const synth = new Tone.PolySynth(Tone.Synth).toDestination();
synth.set({
  oscillator: { type: 'sine' },
  envelope: { attack: 0.05, decay: 0.1, sustain: 0.3, release: 1 }
});

export const playSound = (type: 'hover' | 'click' | 'complete' | 'unlock') => {
  if (Tone.context.state !== 'running') {
    Tone.start();
  }

  switch (type) {
    case 'hover':
      synth.triggerAttackRelease('C5', '16n', undefined, 0.1);
      break;
    case 'click':
      synth.triggerAttackRelease('G4', '32n', undefined, 0.3);
      break;
    case 'complete':
      synth.triggerAttackRelease(['C4', 'E4', 'G4', 'C5'], '8n');
      break;
    case 'unlock':
      const now = Tone.now();
      synth.triggerAttackRelease('C4', '8n', now);
      synth.triggerAttackRelease('G4', '8n', now + 0.1);
      synth.triggerAttackRelease('C5', '4n', now + 0.2);
      break;
  }
};
