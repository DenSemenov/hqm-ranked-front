// src/components/Ball.tsx
import React, { useState } from 'react';
import { useAudio } from './AudioManager';
import './Ball.css'; // Ensure this CSS file exists

interface BallProps {
  note: number;
}

const Ball: React.FC<BallProps> = ({ note }) => {
  const { playSound } = useAudio();
  const [bounceClass, setBounceClass] = useState<string>('');

  const handleMouseEnter = () => {
    playSound(note);
    toggleBounce();
  };

  const toggleBounce = () => {
    setBounceClass('bounce');
    setTimeout(() => setBounceClass('bounce1'), 300);
    setTimeout(() => setBounceClass('bounce2'), 600);
    setTimeout(() => setBounceClass('bounce3'), 900);
    setTimeout(() => setBounceClass(''), 1200);
  };

  return (
    <div
      className={`b-ball b-ball_n${(note % 9) + 1} b-ball_bounce ${bounceClass}`}
      data-note={note}
      onMouseEnter={handleMouseEnter}
    >
      <div className={`b-ball__right ${bounceClass}`}></div>
      <div className="b-ball__i"></div>
    </div>
  );
};

export default Ball;
