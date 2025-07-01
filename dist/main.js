"use strict";
const videoPlayer = document.getElementById('videoPlayer');
const videoFile = document.getElementById('videoFile');
const subtitleFile = document.getElementById('subtitleFile');
const timestampFile = document.getElementById('timestampFile');
const navigation = document.getElementById('navigation');
let pageHeading = document.getElementById('pageHeading');
videoFile.addEventListener('change', () => {
    var _a;
    const file = (_a = videoFile.files) === null || _a === void 0 ? void 0 : _a[0];
    if (file) {
        videoPlayer.src = URL.createObjectURL(file);
        document.title = file.name;
        pageHeading.innerText = file.name;
    }
});
subtitleFile.addEventListener('change', () => {
    var _a;
    const file = (_a = subtitleFile.files) === null || _a === void 0 ? void 0 : _a[0];
    if (file) {
        const track = document.createElement('track');
        track.src = URL.createObjectURL(file);
        track.kind = 'subtitles';
        track.srclang = 'en';
        track.label = 'English';
        track.default = true;
        videoPlayer.appendChild(track);
    }
});
timestampFile.addEventListener('change', () => {
    var _a;
    const file = (_a = timestampFile.files) === null || _a === void 0 ? void 0 : _a[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            var _a;
            const timestamps = JSON.parse((_a = event.target) === null || _a === void 0 ? void 0 : _a.result);
            createNavigation(timestamps);
        };
        reader.readAsText(file);
    }
});
function createNavigation(timestamps) {
    const ul = document.createElement('ul');
    timestamps.forEach(timestamp => {
        const li = document.createElement('li');
        const hours = Math.floor(timestamp.time / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((timestamp.time % 3600) / 60).toString().padStart(2, '0');
        const seconds = Math.floor(timestamp.time % 60).toString().padStart(2, '0');
        li.textContent = `${hours}:${minutes}:${seconds} - ${timestamp.label}`;
        li.addEventListener('click', () => {
            videoPlayer.currentTime = timestamp.time;
        });
        ul.appendChild(li);
    });
    navigation.innerHTML = '';
    navigation.appendChild(ul);
}
