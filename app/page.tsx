'use client';

import { useEffect, useState } from 'react';
import styles from './Metronome.module.css';

const Metronome = () => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [firstAudio, setFirstAudio] = useState<HTMLAudioElement | null>(null); // Separate audio for the first ding
  const [bpm, setBpm] = useState(60); // Default BPM
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeDot, setActiveDot] = useState(-1); // Start with no dot active

  useEffect(() => {
    // Load the sound effects
    const dingAudio = new Audio('/ding.mp3');
    const firstDingAudio = new Audio('/first-ding.mp3'); // Load the first ding audio
    setAudio(dingAudio);
    setFirstAudio(firstDingAudio);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      setActiveDot(-1); // Reset to no active dot when stopped
      return;
    }

    // Calculate interval in milliseconds based on BPM
    const interval = 60000 / bpm;

    // Play the first ding after starting
    setTimeout(() => {
      playDing(0); // Play the first ding and light up the first dot
      setActiveDot(0); // Light up the first dot
    }, 0);

    const timer = setInterval(() => {
      setActiveDot((prevDot) => {
        const nextDot = (prevDot + 1) % 4; // Cycle through 0-3
        playDing(nextDot); // Pass the updated dot to playDing
        return nextDot;
      });
    }, interval);

    return () => clearInterval(timer); // Cleanup on stop
  }, [bpm, isPlaying]);

  const playDing = (dot: number) => {
    if (dot === 0 && firstAudio) {
      // Play the first ding audio for the first dot
      firstAudio.currentTime = 0; // Reset audio to start
      firstAudio.play();
    } else if (audio) {
      // Play the regular ding audio for other dots
      audio.currentTime = 0; // Reset audio to start
      audio.play();
    }
  };

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setBpm(value);
      setActiveDot(-1); // Reset to no active dot
    }
  };

  const incrementBpm = () => {
    if (bpm < 244) {
      setBpm((prevBpm) => prevBpm + 1);
      setActiveDot(-1); // Reset to no active dot
    }
  };

  const decrementBpm = () => {
    if (bpm > 30) {
      setBpm((prevBpm) => prevBpm - 1);
      setActiveDot(-1); // Reset to no active dot
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.bpmControl}>
          <button onClick={decrementBpm} className={styles.bpmButton}>
            -
          </button>
          <label htmlFor="bpm" className={styles.label}>
            BPM: {bpm}
          </label>
          <input
            id="bpm"
            type="range"
            min="30"
            max="244"
            value={bpm}
            onChange={handleBpmChange}
            className={styles.slider}
          />
          <button onClick={incrementBpm} className={styles.bpmButton}>
            +
          </button>
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={styles.button}
        >
          {isPlaying ? 'Stop' : 'Start'}
        </button>
      </div>
      <img src="/pusheen.png" alt="Pusheen" className={styles.image} />
      <div className={styles.dots}>
        {[0, 1, 2, 3].map((dot) => (
          <div
            key={dot}
            className={`${styles.dot} ${
              activeDot === dot ? (dot === 0 ? styles.green : styles.active) : ''
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Metronome;