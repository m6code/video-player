"use strict";
const timestampInput = document.getElementById('timestampInput');
const convertButton = document.getElementById('convertButton');
convertButton.addEventListener('click', () => {
    const text = timestampInput.value;
    if (text) {
        const json = convertTimestamps(text);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'timestamps.json';
        a.click();
        URL.revokeObjectURL(url);
    }
});
function convertTimestamps(text) {
    const lines = text.trim().split('\n');
    const timestamps = lines.map(line => {
        const parts = line.trim().split(/\s+/);
        const timeStr = parts[0];
        const label = parts.slice(1).join(' ');
        const timeParts = timeStr.split(':').map(Number);
        let seconds = 0;
        if (timeParts.length === 3) {
            seconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
        }
        else if (timeParts.length === 2) {
            seconds = timeParts[0] * 60 + timeParts[1];
        }
        else {
            seconds = timeParts[0];
        }
        return { label, time: seconds };
    });
    return JSON.stringify(timestamps, null, 2);
}
