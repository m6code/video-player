const videoPlayer = document.getElementById('videoPlayer') as HTMLVideoElement;
const videoFile = document.getElementById('videoFile') as HTMLInputElement;
const subtitleFile = document.getElementById('subtitleFile') as HTMLInputElement;
const timestampFile = document.getElementById('timestampFile') as HTMLInputElement;
const navigation = document.getElementById('navigation') as HTMLElement;
let pageHeading = document.getElementById('pageHeading') as HTMLHeadingElement;

videoFile.addEventListener('change', () => {
    const file = videoFile.files?.[0];
    if (file) {
        videoPlayer.src = URL.createObjectURL(file);
        document.title = file.name;
        pageHeading.innerText = file.name;
    }
});

subtitleFile.addEventListener('change', () => {
    const file = subtitleFile.files?.[0];
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
    const file = timestampFile.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const timestamps = JSON.parse(event.target?.result as string);
            createNavigation(timestamps);
        };
        reader.readAsText(file);
    }
});

function createNavigation(timestamps: { label: string, time: number }[]) {
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

