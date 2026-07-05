Sounds are generated procedurally via the Web Audio API (see src/utils/sounds.js),
so no MP3 files are required. This keeps the project lightweight and avoids
missing-asset errors.

If you prefer file-based audio, drop success.mp3 and gesture_change.mp3 here
and update src/utils/sounds.js to use <audio> elements instead.
