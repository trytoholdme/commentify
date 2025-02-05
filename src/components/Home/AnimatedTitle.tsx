import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnimatedTitleProps {
  text: string;
}

export default function AnimatedTitle({ text }: AnimatedTitleProps) {
  const [displayedText, setDisplayedText] = useState('');
  const words = text.split(' ');

  useEffect(() => {
    let currentText = '';
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        currentText += text[currentIndex];
        setDisplayedText(currentText);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-normal">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block gradient-text mr-[0.3em]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5,
            delay: i * 0.1,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}