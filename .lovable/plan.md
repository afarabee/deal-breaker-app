

## Plan: Add Voice Entry Mode to Fee Breakdown Screen

Mirror the voice entry pattern from `DealNumbersScreen` into `FeeBreakdownScreen`.

### Changes to `src/components/screens/FeeBreakdownScreen.tsx`

**New imports:** `useSpeechRecognition`, `parseSpokenNumber`, `playConfirmSound`, `Mic`, `MicOff`, `Check`, `RotateCcw`

**New state:** `voiceMode`, `parsedValue`, `inlineListeningField`

**New `useEffect`s:** Parse transcript when it changes (voice mode or inline), clear inline field when listening stops.

**New UI modes (rendered before existing rapid/standard modes):**

1. **Voice active field view** (`voiceMode && activeFieldIndex !== null`) — Large mic button with pulse animation, transcript display ("I heard: …"), parsed result preview ($X,XXX), Confirm & Next / Re-listen buttons, Previous/Skip/Back navigation. Plays confirm chime on accept. Uses `ALL_FEES` array for sequential fields.

2. **Voice field list view** (`voiceMode && activeFieldIndex === null`) — Lists all standard + add-on fees with mic icons and current values. "Start Voice Entry" button. Back/Submit buttons.

**Standard mode enhancement:** Pass `onMicClick` and `isListening` props to each `CurrencyInput` for inline per-field voice capture (same pattern as DealNumbersScreen).

**Add Voice Entry toggle button** next to the existing "Quick Entry" button in the standard form header.

### No other files need changes
`CurrencyInput` already supports `onMicClick`/`isListening` props. All voice infrastructure (`useSpeechRecognition`, `numberParser`, `audioFeedback`) already exists.

