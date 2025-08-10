import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import SpotifyPlayer from './SpotifyPlayer';
import './App.css';

const PokerTimer = () => {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentSmallBlind, setCurrentSmallBlind] = useState(25);
  const [currentBigBlind, setCurrentBigBlind] = useState(50);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef(null);

  const blindLevels = [
    { level: 1, smallBlind: 25, bigBlind: 50 },
    { level: 2, smallBlind: 50, bigBlind: 100 },
    { level: 3, smallBlind: 75, bigBlind: 150 },
    { level: 4, smallBlind: 100, bigBlind: 200 },
    { level: 5, smallBlind: "BREAK", bigBlind : "BREAK" },
    { level: 6, smallBlind: 150, bigBlind: 300 },
    { level: 7, smallBlind: 200, bigBlind: 400 },
    { level: 8, smallBlind: 300, bigBlind: 600 },
    { level: 9, smallBlind: 400, bigBlind: 800 },
    { level: 10, smallBlind: "BREAK", bigBlind : "BREAK" },
    { level: 11, smallBlind: 500, bigBlind: 1000 },
    { level: 12, smallBlind: 600, bigBlind: 1200 },
    { level: 13, smallBlind: 800, bigBlind: 1600 },
    { level: 14, smallBlind: 1000, bigBlind: 2000 },
    { level: 15, smallBlind: "BREAK", bigBlind : "BREAK" },
    { level: 16, smallBlind: 1500, bigBlind: 3000 },
    { level: 17, smallBlind: 2000, bigBlind: 4000 },
    { level: 18, smallBlind: 3000, bigBlind: 6000 },
    { level: 19, smallBlind: 4000, bigBlind: 8000 },
  ];

  const breakLevels = [4, 8]; // Break after these levels

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up - advance level
            advanceLevel();
            return 15 * 60; // Reset to 15 minutes
          }
          return prev - 1;
        });
        setTotalTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const advanceLevel = () => {
    
    if (currentLevel % 4 === 0) {
      setIsBreak(true);
      setTimeLeft(10 * 60); // 10 minute break
      setCurrentLevel(currentLevel + 1);
    } else {
      setIsBreak(false);
      setTimeLeft(15 * 60); // 15 minute level
      setCurrentSmallBlind(blindLevels[currentLevel].smallBlind);
      setCurrentBigBlind(blindLevels[currentLevel].bigBlind);
      setCurrentLevel(currentLevel + 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const skipLevel = () => {
    advanceLevel();
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(15 * 60);
    setTotalTime(0);
    setCurrentLevel(1);
    setIsBreak(false);
  };

  return (
    <div className="poker-container">
      {/* Header */}
      <div className="poker-header">
        <div className="poker-header-left">
          <div className="poker-freeroll-badge">Blind Tracker</div>
        </div>
      </div>

      <div className="poker-main-container">
        {/* Left Sidebar */}
        <div className="poker-sidebar">
          <div>
            <div className="poker-section-title">CURRENT LEVEL</div>
            <div className="poker-current-level-display">
              <div className="poker-current-blinds">
                {isBreak ? 'BREAK' : `${currentSmallBlind}/${currentBigBlind}`}
              </div>
            </div>
          </div>

          <div className="poker-sidebar-section">
            <div className="poker-section-title">BLIND STRUCTURE</div>
            <div className="upcoming-blinds-container">
              {blindLevels.map((level) => (
                <div key={level.level} className={`poker-blind-level ${
                  level.level === currentLevel ? 'poker-blind-level-current' : ''
                }`}>
                  <span>{level.level}</span>
                  <span>{level.smallBlind}/{level.bigBlind}</span>
                </div>
              ))}
            </div>
          </div>

          
        </div>

        {/* Main Timer Area */}
        <div className="poker-timer-area">
          {/* Timer Display */}
          <div>
            <div className="poker-main-timer">
              {formatTime(timeLeft)}
            </div>
            <div className="poker-level-info">
              {isBreak ? 'BREAK' : `Level ${currentLevel}`}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="poker-controls">
            <button onClick={skipLevel} className="poker-control-btn">
              <SkipForward size={24} />
            </button>
            
            <button onClick={toggleTimer} className="poker-play-btn">
              {isRunning ? <Pause size={32} /> : <Play size={32} />}
            </button>

            <button onClick={resetTimer} className="poker-control-btn">
              <RotateCcw size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokerTimer;
