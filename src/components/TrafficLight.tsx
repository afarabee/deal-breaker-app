import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TrafficLightProps {
  grade: string;
}

const getActiveLight = (grade: string): "red" | "yellow" | "green" => {
  if (grade.startsWith("A") || grade.startsWith("B")) return "green";
  if (grade.startsWith("C")) return "yellow";
  return "red";
};

const TrafficLight = ({ grade }: TrafficLightProps) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, []);

  const active = getActiveLight(grade);

  const lights: { color: "red" | "yellow" | "green"; hsl: string; glow: string; dimHsl: string }[] = [
    { color: "red", hsl: "hsl(var(--destructive))", glow: "0 0 16px hsl(var(--destructive) / 0.6)", dimHsl: "hsl(var(--destructive) / 0.15)" },
    { color: "yellow", hsl: "hsl(var(--warning))", glow: "0 0 16px hsl(var(--warning) / 0.6)", dimHsl: "hsl(var(--warning) / 0.15)" },
    { color: "green", hsl: "hsl(var(--success))", glow: "0 0 16px hsl(var(--success) / 0.6)", dimHsl: "hsl(var(--success) / 0.15)" },
  ];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative bg-[hsl(0,0%,8%)] border-2 border-border rounded-xl px-3 py-3 flex flex-col items-center gap-2 shadow-lg">
        {lights.map((light, i) => {
          const isActive = light.color === active;
          return (
            <motion.div
              key={light.color}
              className="relative w-10 h-10 rounded-full border"
              style={{
                borderColor: isActive ? light.hsl : "hsl(var(--border))",
                background: isActive ? light.hsl : light.dimHsl,
              }}
              initial={{ opacity: 0.3, scale: 0.8 }}
              animate={show ? {
                opacity: 1,
                scale: isActive ? 1 : 0.95,
                boxShadow: isActive ? light.glow : "none",
              } : {}}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.4, type: "spring" }}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: light.hsl }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Grade text below */}
      <motion.span
        className="text-2xl font-heading font-bold"
        style={{
          color: "hsl(var(--foreground))",
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={show ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
      >
        {grade}
      </motion.span>
    </div>
  );
};

export default TrafficLight;
