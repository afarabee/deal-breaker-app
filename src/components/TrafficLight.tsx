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

  const lights: { color: "red" | "yellow" | "green"; hsl: string; glow: string }[] = [
    { color: "red", hsl: "hsl(var(--destructive))", glow: "0 0 20px hsl(var(--destructive) / 0.6)" },
    { color: "yellow", hsl: "hsl(var(--warning))", glow: "0 0 20px hsl(var(--warning) / 0.6)" },
    { color: "green", hsl: "hsl(var(--success))", glow: "0 0 20px hsl(var(--success) / 0.6)" },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Traffic light housing */}
      <div className="relative bg-[hsl(0,0%,8%)] border-2 border-border rounded-2xl px-4 py-5 flex flex-col items-center gap-3 shadow-lg">
        {/* Visor tops */}
        {lights.map((light, i) => {
          const isActive = light.color === active;
          return (
            <motion.div
              key={light.color}
              className="relative w-14 h-14 rounded-full border-2"
              style={{
                borderColor: isActive ? light.hsl : "hsl(var(--border))",
                background: isActive ? light.hsl : "hsl(var(--muted) / 0.15)",
              }}
              initial={{ opacity: 0.3, scale: 0.8 }}
              animate={show ? {
                opacity: isActive ? 1 : 0.2,
                scale: isActive ? 1 : 0.9,
                boxShadow: isActive ? light.glow : "none",
              } : {}}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.4, type: "spring" }}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: light.hsl }}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </motion.div>
          );
        })}

        {/* Grade overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={show ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
        >
          <span
            className="text-3xl font-heading font-bold drop-shadow-lg"
            style={{
              color: active === "green" ? "hsl(var(--success))" : active === "yellow" ? "hsl(var(--warning))" : "hsl(var(--destructive))",
              textShadow: `0 0 12px ${active === "green" ? "hsl(var(--success) / 0.5)" : active === "yellow" ? "hsl(var(--warning) / 0.5)" : "hsl(var(--destructive) / 0.5)"}`,
            }}
          >
            {grade}
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default TrafficLight;
