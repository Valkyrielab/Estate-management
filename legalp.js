
() => {
  const canvas = document.getElementById('sig-canvas');
  const ctx = canvas.getContext('2d');
  const clearBtn = document.getElementById('clear-btn');
  const undoBtn = document.getElementById('undo-btn');
  const form = document.getElementById('sig-form');
  const sigDataInput = document.getElementById('sig-data');

  
 //Scale canvas for HiDPI displays
  function scaleCanvas() {
    const ratio = window.devicePixelRatio || 1;
    const w = canvas.width;
    const h = canvas.height;
    canvas.width = w * ratio;
    canvas.height = h * ratio;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(ratio, ratio);
    initCanvasStyle();
  }

  
function initCanvasStyle() {
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#fff';
    // Optional: fill background white so PNG isn’t transparent
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
    ctx.restore();
  }
  
// Track strokes for undo
  const strokes = [];
  let currentStroke = [];
  let drawing = false;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  }

  function startDraw(e) {
    e.preventDefault();
    drawing = true;
    currentStroke = [];
    const { x, y } = getPos(e);
    currentStroke.push({ x, y });
  }

  function moveDraw(e) {
    if (!drawing) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    const prev = currentStroke[currentStroke.length - 1];
    currentStroke.push({ x, y });
    // draw segment
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();
  }

  function endDraw(e) {
    if (!drawing) return;
    e.preventDefault();
    drawing = false;
    if (currentStroke.length > 0) {
      strokes.push([...currentStroke]);
    }
  }

  function redrawAll() {
    // clear to white
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initCanvasStyle();

  for (const stroke of strokes) {
      ctx.beginPath();
      for (let i = 1; i < stroke.length; i++) {
        ctx.moveTo(stroke[i - 1].x, stroke[i - 1].y);
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
      ctx.closePath();
    }
  }

  function clearCanvas() {
    strokes.length = 0;
    
edrawAll();
  }

  function undo() {
    if (strokes.length > 0) {
      strokes.pop();
      redrawAll();
    }
  }

  // Mouse events
  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', moveDraw);
  window.addEventListener('mouseup', endDraw);

  
// Touch events
  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchmove', moveDraw, { passive: false });
  window.addEventListener('touchend', endDraw);

  clearBtn.addEventListener('click', clearCanvas);
  undoBtn.addEventListener('click', undo);

  form.addEventListener('submit', (e) => {
    // If nothing signed, optionally block submit
    
if (strokes.length === 0) {
      e.preventDefault();
      alert('Please add your signature before submitting.');
      return;
    }
    // Convert to PNG data URL (you could use 'image/jpeg' if preferred)
    sigDataInput.value = canvas.toDataURL('image/png');
    // Allow form to submit normally (POSTs signature_data_url)
  });

  scaleCanvas();
};

