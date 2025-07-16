document.addEventListener('DOMContentLoaded', () => {
  const taskList = document.getElementById('task-list');
  const shredder = document.getElementById('shredder');
  const form = document.getElementById('add-task-form');
  const taskInput = document.getElementById('task-input');
  const confettiCanvas = document.getElementById('confetti');
  const shredSVG = document.getElementById('shredder-svg');
  const shredsGroup = shredSVG.querySelector('#shreds');

  function updateLastTaskGlow() {
    // Remove previous last-child highlighting
    const items = document.querySelectorAll('.task-item');
    items.forEach((item, idx, arr) => {
      if (idx === arr.length - 1) item.classList.add('last');
      else item.classList.remove('last');
    });
  }

  function addTask(text) {
    if (!text || text.trim() === '') return; // Fixed: proper validation
    const li = document.createElement('li');
    li.className = 'task-item';
    li.draggable = true;
    li.textContent = text.trim(); // Ensure clean text

    li.addEventListener('dragstart', e => {
      li.classList.add('dragging');
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData('text/plain', text);
      setTimeout(() => li.style.display = 'none', 0);
      shredder.classList.add('over');
    });
    li.addEventListener('dragend', () => {
      li.classList.remove('dragging');
      li.style.display = '';
      shredder.classList.remove('over');
    });

    taskList.appendChild(li);
    updateLastTaskGlow();
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const val = taskInput.value.trim();
    console.log('Form submitted with value:', val); // Debug line
    if (val) {
      addTask(val);
      taskInput.value = '';
      updateLastTaskGlow();
    }
  });

  // Also add click handler for the button directly (backup)
  const addButton = document.getElementById('add-task-btn');
  if (addButton) {
    addButton.addEventListener('click', function(e) {
      e.preventDefault();
      const val = taskInput.value.trim();
      console.log('Button clicked with value:', val); // Debug line
      if (val) {
        addTask(val);
        taskInput.value = '';
        updateLastTaskGlow();
      }
    });
  }

  // Drag events for shredder
  shredder.addEventListener('dragover', e => {
    e.preventDefault();
    shredder.classList.add('over');
    shredsGroup.style.opacity = 1;
  });
  shredder.addEventListener('dragleave', () => {
    shredder.classList.remove('over');
    shredsGroup.style.opacity = 0;
  });
  shredder.addEventListener('drop', e => {
    e.preventDefault();
    shredder.classList.remove('over');
    shredsGroup.style.opacity = 0;
    const dragging = document.querySelector('.task-item.dragging');
    if (dragging) {
      animateShreds();
      dragging.remove();
      updateLastTaskGlow();
      if (taskList.children.length === 0) {
        setTimeout(fireConfetti, 600);
      }
    }
  });

  // Allow dropping back to task list
  taskList.addEventListener('dragover', e => e.preventDefault());

  // Animate the paper shreds SVG group
  function animateShreds() {
    shredsGroup.style.opacity = 1;
    shredsGroup.style.transition = "opacity 0.4s";
    shredsGroup.childNodes.forEach((shred, i) => {
      if (shred.nodeType === 1) {
        shred.style.transition = "transform 0.7s cubic-bezier(0.2,0.75,0.4,1.1)";
        shred.style.transform = `translateY(${32 + Math.random()*20}px)`;
      }
    });
    setTimeout(() => {
      shredsGroup.style.opacity = 0;
      shredsGroup.childNodes.forEach((shred) => {
        if (shred.nodeType === 1) {
          shred.style.transition = "none";
          shred.style.transform = "";
        }
      });
    }, 500);
  }

  // Confetti effect
  function fireConfetti() {
    confettiCanvas.style.display = 'block';
    runConfetti();
    setTimeout(() => {
      confettiCanvas.style.display = 'none';
      clearConfetti();
    }, 2400);
  }

  // Starter tasks
  addTask('Try dragging me!');
  addTask('Add your own tasks!');
  updateLastTaskGlow();
});
