
import React, { useState, useRef, useEffect } from 'react';

interface PositionJoystickProps {
  x: number;
  y: number;
  onChange: (x: number, y: number) => void;
  className?: string;
}

const PositionJoystick: React.FC<PositionJoystickProps> = ({
  x,
  y,
  onChange,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 120, height: 120 });

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMove(e);
  };

  const handleMove = (e: React.MouseEvent | MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const relativeX = e.clientX - rect.left - centerX;
    const relativeY = e.clientY - rect.top - centerY;
    
    // Constrain to circle
    const distance = Math.sqrt(relativeX * relativeX + relativeY * relativeY);
    const maxDistance = Math.min(centerX, centerY) - 10;
    
    let constrainedX = relativeX;
    let constrainedY = relativeY;
    
    if (distance > maxDistance) {
      constrainedX = (relativeX / distance) * maxDistance;
      constrainedY = (relativeY / distance) * maxDistance;
    }
    
    // Convert to -200 to 200 range
    const normalizedX = (constrainedX / maxDistance) * 200;
    const normalizedY = (constrainedY / maxDistance) * 200;
    
    onChange(Math.round(normalizedX), Math.round(normalizedY));
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Convert x, y back to position within the joystick
  const maxDistance = Math.min(containerSize.width, containerSize.height) / 2 - 10;
  const knobX = (x / 200) * maxDistance;
  const knobY = (y / 200) * maxDistance;

  return (
    <div className={`relative ${className}`}>
      <div
        ref={containerRef}
        className="w-24 h-24 bg-gray-800 rounded-full border-2 border-gray-600 cursor-pointer relative"
        style={{ userSelect: 'none' }}
      >
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-gray-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        
        {/* Knob */}
        <div
          className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-grab active:cursor-grabbing"
          style={{
            left: `calc(50% + ${knobX}px - 8px)`,
            top: `calc(50% + ${knobY}px - 8px)`,
          }}
          onMouseDown={handleMouseDown}
        />
      </div>
      <div className="text-center text-xs text-gray-400 mt-2">
        X: {x}, Y: {y}
      </div>
    </div>
  );
};

export default PositionJoystick;
