import React, { useEffect, useState } from 'react';
import { BaseComponentProps } from '../../lib/types';
import { Modal, Button } from '.';
import { useAuth } from '../../contexts/BetterAuthContext';

export interface SessionTimeoutProps extends BaseComponentProps {
  warningTime?: number; // Time in seconds before timeout to show warning (default: 60 seconds)
  timeoutDuration?: number; // Total timeout duration in seconds (default: 900 seconds = 15 minutes)
  onTimeout?: () => void;
  onExtendSession?: () => void;
}

const SessionTimeout: React.FC<SessionTimeoutProps> = ({
  warningTime = 60, // 1 minute before timeout
  timeoutDuration = 900, // 15 minutes in seconds
  onTimeout,
  onExtendSession,
}) => {
  const { logout } = useAuth();
  const [timeLeft, setTimeLeft] = useState(timeoutDuration);
  const [showWarning, setShowWarning] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Reset timer when component mounts or becomes active
  useEffect(() => {
    if (!isActive) return;

    const countdownTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Timeout reached
          clearInterval(countdownTimer);

          // Call the timeout callback if provided, otherwise logout
          if (onTimeout) {
            onTimeout();
          } else {
            logout();
          }
          return 0;
        }

        // Show warning when time is running out
        if (prev === warningTime + 1) {
          setShowWarning(true);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [isActive, onTimeout, logout, warningTime]);

  // Reset timer on user activity
  useEffect(() => {
    const resetTimer = () => {
      if (isActive) {
        setTimeLeft(timeoutDuration);
        setShowWarning(false);
      }
    };

    // Add event listeners for user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [isActive, timeoutDuration]);

  const handleExtendSession = () => {
    setTimeLeft(timeoutDuration);
    setShowWarning(false);
    setIsActive(true);

    if (onExtendSession) {
      onExtendSession();
    }
  };

  const handleLogout = () => {
    logout();
    setShowWarning(false);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {showWarning && (
        <Modal
          isOpen={showWarning}
          onClose={handleLogout} // Don't allow closing the warning modal
          title="Session Expiring Soon"
          size="md"
        >
          <div className="space-y-4">
            <p>Your session will expire in <strong>{formatTime(timeLeft)}</strong>.</p>
            <p>Please click Extend Session to continue working.</p>

            <div className="flex space-x-3 pt-4">
              <Button
                variant="primary"
                onClick={handleExtendSession}
              >
                Extend Session
              </Button>
              <Button
                variant="secondary"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default SessionTimeout;