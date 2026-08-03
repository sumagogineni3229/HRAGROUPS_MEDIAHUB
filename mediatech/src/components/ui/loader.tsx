import React from "react";

export function VectorLoader() {
  return (
    <div className="vector-loader">
      <svg className="vector-loader__svg" viewBox="0 0 100 100" width="80" height="80">
        {/* Outer Orbiting Path */}
        <circle className="vector-loader__orbit" cx="50" cy="50" r="40" fill="none" stroke="#eef0fd" strokeWidth="2" />
        
        {/* Inner Dotted Orbit */}
        <circle className="vector-loader__orbit-dotted" cx="50" cy="50" r="30" fill="none" stroke="#677f9b" strokeWidth="1.5" strokeDasharray="4,6" />
        
        {/* Animated Orbiting Node 1 (Advertiser to Platform connection) */}
        <circle className="vector-loader__node-1" cx="50" cy="10" r="5" fill="#3E4FEA" />
        
        {/* Animated Orbiting Node 2 (Platform to Influencer connection) */}
        <circle className="vector-loader__node-2" cx="50" cy="90" r="4" fill="#8CF08A" />
        
        {/* Center Node (Hub) */}
        <circle className="vector-loader__center" cx="50" cy="50" r="12" fill="#112C3E" />
        <circle className="vector-loader__center-pulse" cx="50" cy="50" r="12" fill="#3E4FEA" opacity="0.3" />
        
        {/* Little connecting lines that rotate */}
        <line className="vector-loader__line" x1="50" y1="50" x2="50" y2="10" stroke="#3E4FEA" strokeWidth="1" opacity="0.5" />
        <line className="vector-loader__line-2" x1="50" y1="50" x2="50" y2="90" stroke="#8CF08A" strokeWidth="1" opacity="0.5" />
      </svg>
      <span className="vector-loader__text">Connecting media partners...</span>

      <style>{`
        .vector-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 40px 20px;
          width: 100%;
        }
        .vector-loader__svg {
          transform-origin: center;
        }
        
        @keyframes rotate-clockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes rotate-counter {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        
        @keyframes pulse-node {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.6); opacity: 0.1; }
        }

        .vector-loader__node-1,
        .vector-loader__line {
          transform-origin: 50px 50px;
          animation: rotate-clockwise 4s linear infinite;
        }
        
        .vector-loader__node-2,
        .vector-loader__line-2 {
          transform-origin: 50px 50px;
          animation: rotate-clockwise 6s linear infinite;
        }
        
        .vector-loader__orbit-dotted {
          transform-origin: 50px 50px;
          animation: rotate-counter 12s linear infinite;
        }
        
        .vector-loader__center-pulse {
          transform-origin: 50px 50px;
          animation: pulse-node 2s ease-in-out infinite;
        }
        
        .vector-loader__text {
          font-size: 13px;
          font-family: var(--font-inter);
          color: var(--color-grey-blue);
          font-weight: 500;
          letter-spacing: 0.02em;
        }
      `}</style>
    </div>
  );
}
