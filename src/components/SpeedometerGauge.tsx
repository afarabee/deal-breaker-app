import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SpeedometerGaugeProps {
  grade: string;
}

const gradeToAngle = (grade: string): number => {
  // Map grades to positions on the gauge (0 = left/red, 180 = right/green)
  const map: Record<string, number> = {
    "A+": 170, A: 160, "A-": 148,
    "B+": 130, B: 115, "B-": 100,
    "C+": 85, C: 70, "C-": 55,
    "D+": 40, D: 30, "D-": 20,
    F: 10,
  };
  return map[grade] ?? 90;
};

const gradeColor = (grade: string) => {
  if (grade.startsWith("A")) return "hsl(142, 71%, 45%)";
  if (grade.startsWith("B")) return "hsl(48, 96%, 53%)";
  return "hsl(0, 72%, 51%)";
};

const SpeedometerGauge = ({ grade }: SpeedometerGaugeProps) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, []);

  const cx = 120;
  const cy = 110;
  const r = 90;
  const startAngle = Math.PI; // 180°
  const endAngle = 2 * Math.PI; // 360°

  const needleTargetAngle = startAngle + (gradeToAngle(grade) / 180) * Math.PI;
  const needleLength = r - 15;

  // Arc helper
  const describeArc = (start: number, end: number, radius: number) => {
    const x1 = cx + radius * Math.cos(start);
    const y1 = cy + radius * Math.sin(start);
    const x2 = cx + radius * Math.cos(end);
    const y2 = cy + radius * Math.sin(end);
    const largeArc = end - start > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  // Color segments: red, yellow, green
  const segments = [
    { start: 0, end: 0.33, color: "hsl(0, 72%, 51%)" },
    { start: 0.33, end: 0.66, color: "hsl(48, 96%, 53%)" },
    { start: 0.66, end: 1, color: "hsl(142, 71%, 45%)" },
  ];

  // Tick marks
  const tickCount = 11;
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const frac = i / (tickCount - 1);
    const angle = startAngle + frac * Math.PI;
    const innerR = r - 8;
    const outerR = r + 2;
    return {
      x1: cx + innerR * Math.cos(angle),
      y1: cy + innerR * Math.sin(angle),
      x2: cx + outerR * Math.cos(angle),
      y2: cy + outerR * Math.sin(angle),
    };
  });

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 5 240 130" className="w-64 h-auto">
        {/* Colored arc segments */}
        {segments.map((seg, i) => (
          <path
            key={i}
            d={describeArc(
              startAngle + seg.start * Math.PI,
              startAngle + seg.end * Math.PI,
              r
            )}
            fill="none"
            stroke={seg.color}
            strokeWidth="8"
            strokeLinecap="round"
            opacity={0.3}
          />
        ))}

        {/* Tick marks */}
        {ticks.map((tick, i) => (
          <line
            key={i}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke="hsl(var(--muted-foreground) / 0.3)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}

        {/* Animated needle */}
        <motion.line
          x1={cx}
          y1={cy}
          x2={cx + needleLength * Math.cos(startAngle)}
          y2={cy + needleLength * Math.sin(startAngle)}
          stroke={gradeColor(grade)}
          strokeWidth="3"
          strokeLinecap="round"
          animate={show ? {
            x2: cx + needleLength * Math.cos(needleTargetAngle),
            y2: cy + needleLength * Math.sin(needleTargetAngle),
          } : undefined}
          transition={{ type: "spring", stiffness: 60, damping: 10, delay: 0.2 }}
          style={{ filter: `drop-shadow(0 0 6px ${gradeColor(grade)})` }}
        />

        {/* Hub */}
        <circle cx={cx} cy={cy} r="6" fill="hsl(var(--foreground))" />
        <circle cx={cx} cy={cy} r="3" fill="hsl(var(--card))" />

        {/* Grade text */}
        <motion.text
          x={cx}
          y={cy - 20}
          textAnchor="middle"
          className="font-instrument"
          fill={gradeColor(grade)}
          fontSize="28"
          fontWeight="700"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={show ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          style={{ filter: `drop-shadow(0 0 8px ${gradeColor(grade)})` }}
        >
          {grade}
        </motion.text>
      </svg>
    </div>
  );
};

export default SpeedometerGauge;
