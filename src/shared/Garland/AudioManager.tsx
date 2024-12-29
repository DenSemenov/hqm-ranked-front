import React, { createContext, useContext, useEffect, useState } from 'react';
import './Ball.css';

interface AudioContextType {
  playSound: (index: number) => Promise<void>;
}

const AudioContextProvider = createContext<AudioContextType | undefined>(undefined);

const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [buffers, setBuffers] = useState<AudioBuffer[]>([]);

  // Generate sound URLs pointing to the public folder
  const soundUrls: string[] = React.useMemo(() => {
    return Array.from({ length: 36 }, (_, i) => `/audio/sound${i + 1}.mp3`);
  }, []);

  // Function to initialize AudioContext and load audio buffers
  const initializeAudio = async () => {
    if (audioCtx) return; // Already initialized

    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    setAudioCtx(context);

    try {
      // Load all sounds in parallel using Promise.all
      const bufferPromises = soundUrls.map(async (url) => {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to load sound: ${url}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await context.decodeAudioData(arrayBuffer);
        return audioBuffer;
      });

      const fetchedBuffers = await Promise.all(bufferPromises);
      setBuffers(fetchedBuffers);
    } 
    catch (error) {
      //console.error('Error loading sounds:', error);
    }
  };

  // Function to play a sound by index
  const playSound = async (index: number) => {
    // Initialize AudioContext if not already done
    if (!audioCtx) {
      await initializeAudio();
    }

    // Type guard to ensure audioCtx is not null
    if (audioCtx) {
      if (audioCtx.state === 'suspended') {
        try {
          await audioCtx.resume();
        } catch (err) {
          console.error('Error resuming AudioContext:', err);
          return;
        }
      }

      if (!buffers[index]) {
        //console.warn(`Buffer for index ${index} is not loaded yet.`);
        return;
      }

      const gainNode = audioCtx.createGain();
      const source = audioCtx.createBufferSource();
      source.buffer = buffers[index];
      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
      source.start(audioCtx.currentTime);
    } else {
      //console.error('AudioContext is not initialized.');
    }
  };

  // Handle user interactions to resume AudioContext if needed
  useEffect(() => {
    const resumeAudioContext = () => {
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch((err) => console.error('Error resuming AudioContext:', err));
      }
    };

    // List of user events that can resume AudioContext
    const userEvents = ['click', 'keydown', 'touchstart'];

    userEvents.forEach((event) => {
      window.addEventListener(event, resumeAudioContext);
    });

    return () => {
      userEvents.forEach((event) => {
        window.removeEventListener(event, resumeAudioContext);
      });
    };
  }, [audioCtx]);

  // Optional: Clean up AudioContext when component unmounts
  useEffect(() => {
    return () => {
      if (audioCtx) {
        audioCtx.close().catch((err) => console.error('Error closing AudioContext:', err));
      }
    };
  }, [audioCtx]);

  return (
    <AudioContextProvider.Provider value={{ playSound }}>
      {children}
      {/* {isLoaded || isLoading ? children : <div>Loading sounds...</div>} */}
    </AudioContextProvider.Provider>
  );
};

const useAudio = () => {
  const context = useContext(AudioContextProvider);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export { AudioProvider, useAudio };
