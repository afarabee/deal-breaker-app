

## Plan: Add Voice Entry Mode to Deal Numbers Screen

### New Files

**1. `src/hooks/useSpeechRecognition.ts`** — Custom hook wrapping the Web Speech API
- Manages `SpeechRecognition` instance lifecycle (start/stop/abort)
- Returns `{ isListening, transcript, startListening, stopListening, isSupported }`
- Resets transcript on each new listen session
- Handles browser compatibility (webkit prefix)

**2. `src/lib/numberParser.ts`** — Converts spoken number words to digits
- Handles word-to-number mapping: "one" through "nineteen", tens ("twenty", "thirty"…), magnitudes ("hundred", "thousand", "million")
- Composites: "twenty-five thousand" → 25000, "five point nine" → 5.9
- Strips non-numeric words like "dollars", "percent"
- Falls back to raw digits if already numeric in transcript

### Modified Files

**3. `src/components/screens/DealNumbersScreen.tsx`**
- Add a **"Voice Entry"** mode button alongside the existing "Quick Entry" toggle
- Voice Entry mode: sequential field flow (like Quick Entry) but with a microphone UI instead of keypad
  - Shows current field label, a large mic button (pulsing animation while listening), and the parsed result
  - Displays raw transcript underneath so user sees what was heard
  - "Confirm & Next" / "Re-listen" / "Type Instead" actions
  - Previous/Next field navigation, field counter
  - "Back to form" link
- In Standard Entry mode: add a small `Mic` icon button next to each `CurrencyInput` and the interest rate field for inline voice capture per field

**4. `src/components/CurrencyInput.tsx`**
- Add optional `onMicClick` prop
- When provided, render a `Mic` icon button to the right of the input (replacing or alongside the Pencil icon)

### UX Details
- Mic button pulses with a red ring animation while actively listening
- After speech ends, show: "I heard: [transcript]" → "Parsed: $25,000" with confirm/retry
- If `SpeechRecognition` is not supported, hide voice buttons and show no voice mode option
- No external API keys needed — pure browser API

### Technical Notes
- `webkitSpeechRecognition` is well-supported on Chrome/Edge; Safari has partial support. We'll feature-detect and gracefully hide on unsupported browsers.
- The `numberParser` handles edge cases: "five nine" for APR → "5.9" (percentage context), "ninety seven thousand seventy four" → 97074

