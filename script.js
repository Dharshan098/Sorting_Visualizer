let array = [];
let speed = 200;
let arraySize = 50;

const arrayContainer = document.getElementById("array");
const sizeSlider = document.getElementById("sizeSlider");
const sizeValue = document.getElementById("sizeValue");
const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");

// Generate random array
function generateArray() {
  array = [];
  arrayContainer.innerHTML = "";
  for (let i = 0; i < arraySize; i++) {
    array.push(Math.floor(Math.random() * 300) + 10);
  }
  renderArray(true); // grow animation
}

// Render array
function renderArray(animate = false) {
  arrayContainer.innerHTML = "";
  const barWidth = Math.max(2, Math.floor(600 / arraySize)); // auto adjust width

  array.forEach((value) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.width = `${barWidth}px`;
    bar.style.background = "#00c6ff";

    if (animate) {
      bar.style.height = `0px`;
      arrayContainer.appendChild(bar);

      // animate to full height
      setTimeout(() => {
        bar.style.height = `${value}px`;
      }, 50);
    } else {
      bar.style.height = `${value}px`;
      arrayContainer.appendChild(bar);
    }
  });
}

// Delay utility
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Bubble Sort
async function bubbleSort() {
  const bars = document.getElementsByClassName("bar");
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      bars[j].style.background = "red";
      bars[j + 1].style.background = "red";

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        renderArray();
        await sleep(speed);
      }

      bars[j].style.background = "#00c6ff";
      bars[j + 1].style.background = "#00c6ff";
    }
  }
}

// Selection Sort
async function selectionSort() {
  const bars = document.getElementsByClassName("bar");
  for (let i = 0; i < array.length; i++) {
    let min = i;
    for (let j = i + 1; j < array.length; j++) {
      bars[j].style.background = "orange";
      if (array[j] < array[min]) {
        min = j;
      }
      await sleep(speed / 2);
      bars[j].style.background = "#00c6ff";
    }
    [array[i], array[min]] = [array[min], array[i]];
    renderArray();
    await sleep(speed);
  }
}

// Insertion Sort
async function insertionSort() {
  const bars = document.getElementsByClassName("bar");
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      j--;
      renderArray();
      await sleep(speed);
    }
    array[j + 1] = key;
    renderArray();
    await sleep(speed);
  }
}

// Merge Sort
async function mergeSort(start = 0, end = array.length - 1) {
  if (start >= end) return;
  const mid = Math.floor((start + end) / 2);
  await mergeSort(start, mid);
  await mergeSort(mid + 1, end);
  await merge(start, mid, end);
}

async function merge(start, mid, end) {
  let left = array.slice(start, mid + 1);
  let right = array.slice(mid + 1, end + 1);

  let i = 0, j = 0, k = start;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      array[k] = left[i];
      i++;
    } else {
      array[k] = right[j];
      j++;
    }
    renderArray();
    await sleep(speed);
    k++;
  }
  while (i < left.length) {
    array[k++] = left[i++];
    renderArray();
    await sleep(speed);
  }
  while (j < right.length) {
    array[k++] = right[j++];
    renderArray();
    await sleep(speed);
  }
}

// Quick Sort
async function quickSort(low = 0, high = array.length - 1) {
  if (low < high) {
    let pi = await partition(low, high);
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  }
}

async function partition(low, high) {
  let pivot = array[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      renderArray();
      await sleep(speed);
    }
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  renderArray();
  await sleep(speed);
  return i + 1;
}

// Button Listeners
document.getElementById("btn-generate").addEventListener("click", generateArray);
document.getElementById("btn-bubble").addEventListener("click", bubbleSort);
document.getElementById("btn-selection").addEventListener("click", selectionSort);
document.getElementById("btn-insertion").addEventListener("click", insertionSort);
document.getElementById("btn-merge").addEventListener("click", () => mergeSort());
document.getElementById("btn-quick").addEventListener("click", () => quickSort());

// Sliders
sizeSlider.addEventListener("input", (e) => {
  arraySize = e.target.value;
  sizeValue.textContent = arraySize;
  generateArray();
});

speedSlider.addEventListener("input", (e) => {
  speed = e.target.value;
  speedValue.textContent = `${speed} ms`;
});

// Initial
generateArray();
