import { PAST_ITEMS_OFFSET } from "./config.js"
import { startStream, consumeStream } from "./jetstream.js"

export const MAX_ITEMS = 250
const recordsElement = document.querySelector(".records")

// Start two minutes in the past. Timestamp has to be in microseconds.
const startTime = (Date.now() - PAST_ITEMS_OFFSET) * 1000

const subscription = startStream(startTime)
const stream = consumeStream(subscription)

for await (const record of stream) {
  // Remove initial text node from div.
  if (
    recordsElement.length === 1 &&
    recordsElement.firstChild.nodeType === Node.TEXT_NODE
  ) {
    recordsElement.firstChild.remove()
  }

  console.log(JSON.stringify(record))
  const recordElement = document
    .getElementById("record-template")
    .content.cloneNode(true)
  recordElement.querySelector("img").src = record.preview.url
  recordElement.querySelector("a").href = record.metadata
  recordElement.querySelector("a").textContent = record.metadata
  recordsElement.prepend(recordElement)

  if (recordsElement.children.length > MAX_ITEMS) {
    recordsElement.lastElementChild.remove()
  }
}
console.log("Stop streaming, enough items were streamed")
