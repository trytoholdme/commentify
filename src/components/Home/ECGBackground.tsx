import { motion } from 'framer-motion';

interface ECGLineProps {
  index: number;
}

const ECGLine = ({ index }: ECGLineProps) => (
  <motion.div
    key={`ecg-line-${index}`}
    className="ecg-line"
    initial={{ y: '100vh', opacity: 0 }}
    animate={{ 
      y: '-100vh',
      opacity: [0, 1, 1, 0],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      delay: index * 0.4,
      ease: 'linear',
      times: [0, 0.2, 0.8, 1]
    }}
    style={{
      top: `${index * 10}%`
    }}
  />
);

export default function ECGBackground() {
  // Create a typed array of indices for the ECG lines
  const lines = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="ecg-background">
      {lines.map((index) => (
        <ECGLine key={index} index={index} />
      ))}
    </div>
  );
}