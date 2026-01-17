import { useState, useEffect, useCallback, ReactNode } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";

interface StackProps {
  cards?: ReactNode[];
  randomRotation?: boolean;
  sensitivity?: number;
  sendToBackOnClick?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  animationConfig?: {
    stiffness?: number;
    damping?: number;
  };
}

const Stack = ({
  cards = [],
  randomRotation = true,
  sensitivity = 200,
  sendToBackOnClick = false,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  animationConfig = { stiffness: 260, damping: 20 },
}: StackProps) => {
  const [stack, setStack] = useState<number[]>(cards.map((_, i) => i));
  const [isPaused, setIsPaused] = useState(false);

  const sendToBack = useCallback((id: number) => {
    setStack((prev) => {
      const newStack = prev.filter((i) => i !== id);
      newStack.unshift(id);
      return newStack;
    });
  }, []);

  useEffect(() => {
    if (!autoplay || isPaused || cards.length === 0) return;
    const id = setInterval(() => {
      const topCard = stack[stack.length - 1];
      sendToBack(topCard);
    }, autoplayDelay);
    return () => clearInterval(id);
  }, [autoplay, isPaused, cards.length, autoplayDelay, stack, sendToBack]);

  const handleMouseEnter = () => {
    if (pauseOnHover) setIsPaused(true);
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) setIsPaused(false);
  };

  return (
    <div
      className="relative w-60 h-60 md:w-80 md:h-80"
      style={{ perspective: 600 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {stack.map((cardIndex, i) => {
        const isTop = i === stack.length - 1;
        const randomDeg = randomRotation
          ? Math.random() * 10 - 5
          : 0;

        return (
          <CardWrapper
            key={cardIndex}
            isTop={isTop}
            sendToBack={() => sendToBack(cardIndex)}
            sensitivity={sensitivity}
            sendToBackOnClick={sendToBackOnClick}
            animationConfig={animationConfig}
            zIndex={i}
            randomDeg={randomDeg}
          >
            {cards[cardIndex]}
          </CardWrapper>
        );
      })}
    </div>
  );
};

interface CardWrapperProps {
  children: ReactNode;
  isTop: boolean;
  sendToBack: () => void;
  sensitivity: number;
  sendToBackOnClick: boolean;
  animationConfig: {
    stiffness?: number;
    damping?: number;
  };
  zIndex: number;
  randomDeg: number;
}

const CardWrapper = ({
  children,
  isTop,
  sendToBack,
  sensitivity,
  sendToBackOnClick,
  animationConfig,
  zIndex,
  randomDeg,
}: CardWrapperProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number; y: number } }) => {
    if (
      Math.abs(info.offset.x) > sensitivity ||
      Math.abs(info.offset.y) > sensitivity
    ) {
      sendToBack();
    }
  };

  return (
    <motion.div
      className="absolute w-full h-full cursor-grab active:cursor-grabbing rounded-xl overflow-hidden shadow-lg"
      style={{
        x,
        y,
        rotateX,
        rotateY,
        rotate: `${randomDeg}deg`,
        zIndex,
      }}
      drag={isTop}
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      onClick={sendToBackOnClick && isTop ? sendToBack : undefined}
      whileTap={isTop ? { scale: 1.02 } : undefined}
      transition={{
        type: "spring",
        stiffness: animationConfig.stiffness,
        damping: animationConfig.damping,
      }}
    >
      {children}
    </motion.div>
  );
};

export default Stack;
