import { PAST_ITEMS_OFFSET } from "./config.js"
import { startStream, consumeStream } from "./jetstream.js"

export const MAX_ITEMS = 250
const recordsElement = document.querySelector(".records")
const statusDot = document.getElementById("status-dot")
const statusText = document.getElementById("status-text")
const statusMessage = document.getElementById("status-message")
const recordCount = document.getElementById("record-count")

let recordsReceived = 0

// Update status indicator
function updateStatus(status, message = "") {
  switch (status) {
    case "connecting":
      statusDot.className = "w-2 h-2 rounded-full bg-yellow-400 pulse-dot"
      statusText.textContent = "Connecting..."
      statusText.className = "text-sm font-medium text-yellow-600"
      break
    case "connected":
      statusDot.className = "w-2 h-2 rounded-full bg-green-500 pulse-dot"
      statusText.textContent = "Connected"
      statusText.className = "text-sm font-medium text-green-600"
      break
    case "waiting":
      statusDot.className = "w-2 h-2 rounded-full bg-blue-500 pulse-dot"
      statusText.textContent = "Listening"
      statusText.className = "text-sm font-medium text-blue-600"
      break
  }
  statusMessage.textContent = message
}

// Start two minutes in the past. Timestamp has to be in microseconds.
const startTime = (Date.now() - PAST_ITEMS_OFFSET) * 1000

updateStatus("connecting")
const subscription = startStream(startTime)
updateStatus("connected", "Fetching recent records...")
const stream = consumeStream(subscription)

for await (const record of stream) {
  console.log(JSON.stringify(record))

  // Update status to listening after first record
  if (recordsReceived === 0) {
    updateStatus(
      "waiting",
      "Waiting for new records (may take a few minutes depending on time of day)",
    )
  }

  recordsReceived++
  recordCount.textContent = `${recordsReceived} ${recordsReceived === 1 ? "record" : "records"}`

  const recordElement = document
    .getElementById("record-template")
    .content.cloneNode(true)

  const previewElement = recordElement.querySelector("div.preview")

  // Each record contains a link to the metadata
  recordElement.querySelector("a").href = record.metadata
  recordElement.querySelector("a").textContent = record.metadata

  // If the there is a preview and it's an image, show it.
  if (
    record.preview !== undefined &&
    record.preview.mimeType.startsWith("image/")
  ) {
    const imageElement = document
      .getElementById("record-template-preview-image")
      .content.querySelector("img")
      .cloneNode(true)
    imageElement.src = record.preview.url
    previewElement.prepend(imageElement)
  }

  recordsElement.prepend(recordElement)

  if (recordsElement.children.length > MAX_ITEMS) {
    recordsElement.lastElementChild.remove()
  }
}
