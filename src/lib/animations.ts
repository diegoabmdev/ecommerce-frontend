// src/lib/animations.ts
import { HTMLMotionProps, Variants, Transition } from "framer-motion";

export const transitions: Record<string, Transition> = {
  spring: { type: "spring", stiffness: 300, damping: 30 },
  smooth: { duration: 0.2, ease: "easeInOut" },
};

export const mobileViewTransition: HTMLMotionProps<"div"> = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 },
  transition: { duration: 0.3, ease: "easeInOut" }
};

export const menuVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};
