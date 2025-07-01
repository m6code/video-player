# Learning Guide: Building the Web Video Player

This document breaks down the step-by-step process of creating the video player, explaining the core concepts and Web APIs used. The goal is to provide a clear path for you to understand how each feature was implemented so you can build a similar project from scratch.

## Core Concept: No Backend Required

First, it's important to understand that this entire application runs in the user's web browser. It doesn't need a server to host the video files or process the logic. All the files (video, subtitles, timestamps) are read directly from the user's computer by the browser, and all the code runs on the "client-side."

---

### Step 1: The Basic HTML Structure

The foundation of the application is a standard HTML file. The most important elements we started with are:

1.  **`<video>` Element:** This is the heart of the player. The `controls` attribute gives us the default browser play/pause button, seek bar, and volume control. We give it an `id` (`videoPlayer`) so our JavaScript code can easily find and manipulate it.
    *   [Learn about the `<video>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)

2.  **`<input type="file">` Elements:** These are crucial for letting the user select local files. We created three: one for the video, one for subtitles, and one for the timestamp JSON file. The `accept` attribute is a user-friendly hint to the browser to filter the types of files shown in the file selection dialog.
    *   [Learn about `<input type="file">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file)

---

### Step 2: Playing a Local Video

This is the first major piece of functionality. You can't directly set the `src` of a video to a local file path like `C:\Users\Me\video.mp4` for security reasons. Browsers prevent web pages from accessing your local file system arbitrarily.

The solution is to let the user *give* us the file, and then we create a temporary, secure URL for it.

**How it works:**

1.  **Event Listener:** We attach a `'change'` event listener to the video file input. This event fires the moment a user selects a file.
2.  **Accessing the File:** Inside the listener, `videoFile.files` gives us a `FileList` object. We grab the first file with `videoFile.files[0]`.
3.  **`URL.createObjectURL()`:** This is the key API. It takes a file object and creates a special, temporary URL that points to the file's data in the browser's memory. This URL is safe to use and doesn't expose your file system.
4.  **Setting the Source:** We set `videoPlayer.src` to this newly created object URL, and the browser can now play the video.

*   [Learn about `URL.createObjectURL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)
*   [Learn about the `change` event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event)

---

### Step 3: Loading Subtitles

Loading subtitles is similar. The `<video>` element has a built-in system for handling timed text tracks.

**How it works:**

1.  **Get the File:** Just like with the video, we listen for a `'change'` event on the subtitle file input and get the selected file.
2.  **Create a `<track>` Element:** We dynamically create an HTML `<track>` element using `document.createElement('track')`.
3.  **Set Attributes:** We set the necessary attributes for the track:
    *   `src`: We use `URL.createObjectURL()` again to create a temporary URL for the subtitle file.
    *   `kind`: Set to `'subtitles'`.
    *   `srclang` and `label`: Provide language and label information.
    *   `default`: Set to `true` to make the subtitles appear by default.
4.  **Append to Video:** Finally, we append this newly created `<track>` element as a child of the `<video>` element. The browser automatically handles the rest.

*   [Learn about the `<track>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track)

---

### Step 4: Creating Timestamp-Based Navigation

This is the most complex feature and involves a few different concepts.

**Part A: Reading the JSON File**

1.  **`FileReader` API:** When the user selects the `timestamps.json` file, we need to read its text content. The `FileReader` API is designed for this.
2.  **Listen for Load:** We create a new `FileReader` and add an `onload` event listener. This event fires when the file has been successfully read.
3.  **Read the File:** We call `reader.readAsText(file)` to start the reading process.
4.  **Get the Result:** Inside the `onload` listener, `event.target.result` contains the entire text content of the file.

*   [Learn about the `FileReader` API](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)

**Part B: Parsing and Building the Menu**

1.  **`JSON.parse()`:** The text we read from the file is just a string. `JSON.parse()` is a built-in JavaScript function that converts a JSON string into a live JavaScript object or array.
2.  **Looping and Creating Elements:** We now have an array of timestamp objects. We loop through this array (`forEach`). For each object, we:
    *   Create a new `<li>` element (`document.createElement('li')`).
    *   Set its `textContent` to the timestamp's label and formatted time.
    *   Add a `'click'` event listener to this `<li>`.
3.  **Seeking the Video:** The magic happens in the click listener. We set the `videoPlayer.currentTime` property to the `time` (in seconds) from our timestamp object. This immediately jumps the video to that point.

*   [Learn about `JSON.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
*   [Learn about `video.currentTime`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime)

**Part C: Formatting the Time**

To display `hh:mm:ss`, we had to convert the total seconds from the JSON file.

*   **Math:** We use `Math.floor()` and the modulo operator (`%`) to calculate the hours, minutes, and remaining seconds.
*   **`padStart()`:** This string method is perfect for ensuring a number has leading zeros (e.g., `5` becomes `05`). This was the reason we had to update the `tsconfig.json` target to `es2017`, as `padStart` is a more modern JavaScript feature.
    *   [Learn about `padStart()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart)

---

### Step 5: The Timestamp Converter Tool

This feature is pure JavaScript logic for string manipulation and file creation.

**How it works:**

1.  **Get Text:** We grab the raw text from the `<textarea>`.
2.  **String Manipulation:**
    *   `trim()`: Removes any leading/trailing whitespace.
    *   `split('\n')`: Splits the entire text block into an array of lines.
    *   We then loop through each line, splitting it again by spaces to separate the time from the label.
3.  **Time Conversion:** The logic here is the reverse of the formatting step. We split the `hh:mm:ss` string by the colon (`:`) and do the math to convert it back into total seconds.
4.  **Creating a Downloadable File:** You can't directly write a file to the user's disk. Instead, we create a file *in memory* and trigger a download.
    *   **`JSON.stringify()`:** We convert our JavaScript array of timestamp objects back into a formatted JSON string.
    *   **`Blob`:** We create a "Binary Large Object" (Blob) from our JSON string. A Blob is essentially a file-like object.
    *   **`URL.createObjectURL()`:** We use this again to create a temporary URL for our Blob.
    *   **Trigger Download:** We create a temporary `<a>` (link) element, set its `href` to the Blob's URL, set the `download` attribute to the desired filename (`timestamps.json`), and then programmatically "click" it with `a.click()`. This prompts the user to save the file.

*   [Learn about Blobs](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
*   [Learn about the `download` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-download)

---

### Why TypeScript?

We used TypeScript to write the code. For a small project like this, it might seem like overkill, but it provides a huge benefit: **type safety**. By declaring what type of object we expect (e.g., `timestamps: { label: string, time: number }[]`), the editor and compiler can catch errors *before* you even run the code. For example, if you accidentally typed `timestamp.labe` instead of `timestamp.label`, TypeScript would immediately warn you. This makes code much easier to maintain and debug as it grows.
