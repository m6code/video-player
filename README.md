# Web Video Player

This is a simple web-based video player that allows users to play local video files, load subtitles, and create a navigation menu from a timestamp file. It also includes a feature to convert raw timestamp text into a compatible JSON format.

## Features

*   Play local video files.
*   Load external subtitle files (`.vtt`, `.srt`).
*   Load a JSON timestamp file to create a chapter navigation menu.
*   A separate page to convert raw timestamp text (e.g., `hh:mm:ss Chapter Name`) into a downloadable `timestamps.json` file.
*   The page title dynamically updates to the name of the loaded video.

## How to Use

1.  Open `index.html` in your web browser.
2.  Click the "Choose File" button next to "video/*" to select a video from your computer.
3.  (Optional) Click the "Choose File" button next to ".vtt,.srt" to load a subtitle file.
4.  (Optional) To create a navigation menu:
    *   If you don't have a `timestamps.json` file, click the "Convert Timestamps" link.
    *   On the converter page, paste your timestamps (one per line, format: `hh:mm:ss Label`).
    *   Click "Convert and Download" to save the `timestamps.json` file.
    *   Go back to the main player page.
    *   Click the "Choose File" button next to ".json" and select your generated `timestamps.json` file.
5.  The navigation menu will appear below the video player. Click on any entry to jump to that timestamp in the video.

## Function Documentation

### `src/main.ts`

This file contains the core logic for the video player page.

*   **`videoFile` Event Listener:**
    *   **Trigger:** Fires when a user selects a video file.
    *   **Action:** It gets the selected file, creates a local URL for it using `URL.createObjectURL()`, and sets it as the `src` for the main video element. It also updates the browser's page title (`document.title`) to the name of the video file.

*   **`subtitleFile` Event Listener:**
    *   **Trigger:** Fires when a user selects a subtitle file.
    *   **Action:** It creates a `<track>` element, sets its `src` to a local URL of the selected file, and appends it to the video element, making the subtitles available.

*   **`timestampFile` Event Listener:**
    *   **Trigger:** Fires when a user selects a JSON timestamp file.
    *   **Action:** It uses a `FileReader` to read the content of the JSON file. Once read, it parses the JSON content and passes the resulting array of timestamps to the `createNavigation()` function.

*   **`createNavigation(timestamps: { label: string, time: number }[])`:**
    *   **Purpose:** To build and display the clickable navigation menu.
    *   **How it works:** It takes an array of timestamp objects. For each object, it creates a new list item (`<li>`). The `time` (in seconds) is converted into a human-readable `hh:mm:ss` format. The text of the list item is set to `hh:mm:ss - label`. An event listener is added to each list item, which, when clicked, sets the `videoPlayer.currentTime` to the corresponding timestamp's time in seconds, effectively seeking the video.

### `src/converter.ts`

This file contains the logic for the separate timestamp converter page (`converter.html`).

*   **`convertButton` Event Listener:**
    *   **Trigger:** Fires when the "Convert and Download" button is clicked.
    *   **Action:** It gets the raw text from the `timestampInput` textarea. If the textarea is not empty, it calls the `convertTimestamps()` function to process the text. The resulting JSON string is then converted into a `Blob`, a local URL is created for it, and a temporary `<a>` element is used to trigger a download of the `timestamps.json` file.

*   **`convertTimestamps(text: string): string`:**
    *   **Purpose:** To parse the raw timestamp text and convert it into a JSON string.
    *   **How it works:** The function splits the input text into individual lines. For each line, it splits the line into a time string and a label. It then parses the time string (which can be `hh:mm:ss`, `mm:ss`, or `ss`) and converts it into total seconds. It returns a formatted JSON string representing an array of `{ label, time }` objects.

## Technologies Used

*   **HTML5:** The core markup for the web pages. [Learn more](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
*   **CSS3:** Used for styling the video player and its components. [Learn more](https://developer.mozilla.org/en-US/docs/Web/CSS)
*   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript. Used for the application logic. [Learn more](https://www.typescriptlang.org/)
*   **Node.js:** Used for the `npm` package manager to install TypeScript. [Learn more](https://nodejs.org/)
