// script.js - Sorting Visualizer with animations

let array = [];
let arraySize = 50;      // initial
let speed = 200;         // initial delay in ms
let isSorting = false;

let el = {};
document.addEventListener('DOMContentLoaded', init);

function init() {
  // cache DOM
  el.arrayContainer = document.getElementById('array');
  el.btnGenerate = document.getElementById('btn-generate');
  el.btnBubble = document.getElementById('btn-bubble');
  el.btnSelection = document.getElementById('btn-selection');
  el.btnInsertion = document.getElementById('btn-insertion');
  el.btnMerge = document.getElementById('btn-merge');
  el.btnQuick = document.getElementById('btn-quick');
  el.sizeSlider = document.getElementById('sizeSlider');
  el.sizeValue = document.getElementById('sizeValue');
  el.speedSlider = document.getElementById('speedSlider');
  el.speedValue = document.getElementById('speedValue');

  // attach events
  el.btnGenerate.addEventListener('click', () => {
    cancelSortingAndGenerate();
  });
  el.btnBubble.addEventListener('click', () => runSort(bubbleSort));
  el.btnSelection.addEventListener('click', () => runSort(selectionSort));
  el.btnInsertion.addEventListener('click', () => runSort(insertionSort));
  el.btnMerge.addEventListener('click', () => runSort(mergeSort));
  el.btnQuick.addEventListener('click', () => runSort(quickSort));

  el.sizeSlider.addEventListener('input', (e) => {
    arraySize = Number(e.target.value);
    el.sizeValue.textContent = arraySize;
    generateArray(); // animate resize
  });

  el.speedSlider.addEventListener('input', (e) => {
    speed = Number(e.target.value);
    el.speedValue.textContent = `${speed} ms`;
  });

  // initialize values shown
  el.sizeValue.textContent = el.sizeSlider.value;
  el.speedValue.textContent = `${el.speedSlider.value} ms`;
  arraySize = Number(el.sizeSlider.value);
  speed = Number(el.speedSlider.value);

  // initial array
  generateArray();

  // handle window resize to re-render widths nicely
  window.addEventListener('resize', renderArray);
}

function cancelSortingAndGenerate() {
  if (isSorting) {
    isSorting = false;
    setTimeout(generateArray, 50);
  } else {
    generateArray();
  }
}

function generateArray() {
  if (isSorting) return;
  array = [];
  for (let i = 0; i < arraySize; i++) {
    array.push(rand(20, Math.max(60, Math.floor(window.innerHeight * 0.45))));
  }
  renderArray(true);
}

function renderArray(animate = false) {
  el.arrayContainer.innerHTML = '';
  const n = array.length;
  const containerWidth = el.arrayContainer.clientWidth || window.innerWidth;
  const baseGap = 2;
  const barWidth = Math.max(2, Math.floor((containerWidth - n * baseGap) / n));

  for (let i = 0; i < n; i++) {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${array[i]}px`;
    bar.style.width = `${barWidth}px`;

    if (animate) {
      bar.style.transform = 'scaleY(0.2)';
      setTimeout(() => {
        bar.style.transition = 'transform 0.3s';
        bar.style.transform = 'scaleY(1)';
      }, 10);
    }
    el.arrayContainer.appendChild(bar);
  }
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function setControlsDisabled(disabled) {
  el.btnGenerate.disabled = disabled;
  el.btnBubble.disabled = disabled;
  el.btnSelection.disabled = disabled;
  el.btnInsertion.disabled = disabled;
  el.btnMerge.disabled = disabled;
  el.btnQuick.disabled = disabled;
  el.sizeSlider.disabled = disabled;
  el.speedSlider.disabled = disabled;
}

async function runSort(sortFn) {
  if (isSorting) return;
  isSorting = true;
  setControlsDisabled(true);

  document.querySelectorAll('.bar').forEach(b =>
    b.classList.remove('sorted', 'comparing', 'selected')
  );

  try {
    await sortFn();
    if (isSorting) await markSortedGradually();
  } catch (err) {
    console.error('Sort interrupted:', err);
  } finally {
    isSorting = false;
    setControlsDisabled(false);
  }
}

async function markSortedGradually() {
  const bars = document.querySelectorAll('.bar');
  for (let i = 0; i < bars.length; i++) {
    if (!isSorting) return;
    bars[i].classList.add('sorted');
    await sleep(15);
  }
}

// ---------------- Sorting Algorithms ----------------

async function bubbleSort() {
  const bars = () => document.getElementsByClassName('bar');
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (!isSorting) return;
      const bs = bars();
      bs[j].classList.add('comparing');
      bs[j + 1].classList.add('comparing');
      await sleep(speed);

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        bs[j].style.height = `${array[j]}px`;
        bs[j + 1].style.height = `${array[j + 1]}px`;
      }
      bs[j].classList.remove('comparing');
      bs[j + 1].classList.remove('comparing');
    }
    bars()[n - i - 1].classList.add('sorted');
  }
}

async function selectionSort() {
  const n = array.length;
  for (let i = 0; i < n; i++) {
    if (!isSorting) return;
    let minIdx = i;
    const bars = () => document.getElementsByClassName('bar');

    bars()[minIdx].classList.add('selected');
    for (let j = i + 1; j < n; j++) {
      if (!isSorting) return;
      bars()[j].classList.add('comparing');
      await sleep(speed);

      if (array[j] < array[minIdx]) {
        bars()[minIdx].classList.remove('selected');
        minIdx = j;
        bars()[minIdx].classList.add('selected');
      }
      bars()[j].classList.remove('comparing');
    }

    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      const bs = document.getElementsByClassName('bar');
      bs[i].style.height = `${array[i]}px`;
      bs[minIdx].style.height = `${array[minIdx]}px`;
      await sleep(speed);
    }

    document.getElementsByClassName('bar')[i].classList.add('sorted');
    document.getElementsByClassName('bar')[minIdx].classList.remove('selected');
  }
}

async function insertionSort() {
  const n = array.length;
  for (let i = 1; i < n; i++) {
    if (!isSorting) return;
    let key = array[i];
    let j = i - 1;
    const bars = () => document.getElementsByClassName('bar');
    bars()[i].classList.add('selected');
    await sleep(speed);

    while (j >= 0 && array[j] > key) {
      if (!isSorting) return;
      array[j + 1] = array[j];
      const bs = document.getElementsByClassName('bar');
      bs[j + 1].style.height = `${array[j + 1]}px`;
      bs[j].classList.add('comparing');
      await sleep(speed);
      bs[j].classList.remove('comparing');
      j--;
    }
    array[j + 1] = key;
    document.getElementsByClassName('bar')[j + 1].style.height = `${key}px`;
    for (let k = 0; k <= i; k++) {
      document.getElementsByClassName('bar')[k].classList.add('sorted');
    }
    await sleep(Math.max(12, speed / 2));
  }
}

// Merge Sort
async function mergeSort(start = 0, end = array.length - 1) {
  if (start >= end) return;
  const mid = Math.floor((start + end) / 2);
  await mergeSort(start, mid);
  await mergeSort(mid + 1, end);
  await merge(start, mid, end);

  if (end - start === array.length - 1) {
    await markSortedGradually();
  }
}

async function merge(start, mid, end) {
  const bars = document.getElementsByClassName("bar");
  let left = array.slice(start, mid + 1);
  let right = array.slice(mid + 1, end + 1);

  let i = 0, j = 0, k = start;
  while (i < left.length && j < right.length) {
    bars[k].classList.add("comparing");
    await sleep(speed);
    if (left[i] <= right[j]) {
      array[k] = left[i++];
    } else {
      array[k] = right[j++];
    }
    bars[k].style.height = `${array[k]}px`;
    bars[k].classList.remove("comparing");
    k++;
  }
  while (i < left.length) {
    array[k] = left[i++];
    bars[k].style.height = `${array[k]}px`;
    await sleep(speed);
    k++;
  }
  while (j < right.length) {
    array[k] = right[j++];
    bars[k].style.height = `${array[k]}px`;
    await sleep(speed);
    k++;
  }
}

// Quick Sort
async function quickSort(low = 0, high = array.length - 1) {
  if (low < high) {
    let pi = await partition(low, high);
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  }
  if (high - low === array.length - 1) {
    await markSortedGradually();
  }
}

async function partition(low, high) {
  const bars = document.getElementsByClassName("bar");
  let pivot = array[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    bars[j].classList.add("comparing");
    await sleep(speed);
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      bars[i].style.height = `${array[i]}px`;
      bars[j].style.height = `${array[j]}px`;
    }
    bars[j].classList.remove("comparing");
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  bars[i + 1].style.height = `${array[i + 1]}px`;
  bars[high].style.height = `${array[high]}px`;

  return i + 1;
}
