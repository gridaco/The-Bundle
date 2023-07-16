import React, { useEffect, useRef } from 'react';
import { createScene } from './scene'; // Assuming BabylonScene.js is in the same directory

export function Canvas(){
  const reactCanvas = useRef(null);

  useEffect(() => {
    if (reactCanvas.current) {
      const cleanup = createScene(reactCanvas.current);
      return () => cleanup();
    }
  }, [reactCanvas]);

  return (
    <canvas ref={reactCanvas} style={{ width: '100%', height: '100vh' }}/>
  );
};

