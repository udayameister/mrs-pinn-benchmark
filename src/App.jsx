import { useState, useRef, useCallback, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ReferenceLine } from "recharts";

// ─────────────────────────────────────────────
//  STYLES
// ─────────────────────────────────────────────
const S = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Lexend:wght@300;400;600;700;800&display=swap');

:root {
  --bg:#f4f6fb; --white:#fff; --border:#dde3f0; --border2:#c8d1e8;
  --accent:#2563eb; --accent-l:#eff4ff; --accent2:#7c3aed;
  --green:#059669; --green-l:#ecfdf5;
  --red:#dc2626;   --red-l:#fef2f2;
  --amber:#d97706; --amber-l:#fffbeb;
  --text:#0f172a;  --text2:#475569; --muted:#94a3b8;
  --sh:0 2px 16px rgba(37,99,235,.07);
  --sh2:0 6px 36px rgba(37,99,235,.12);
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Lexend',sans-serif;background:var(--bg);color:var(--text);font-size:14px}

.app{max-width:1280px;margin:0 auto;padding:28px 20px 60px}

/* NAV TABS */
.tabs{display:flex;gap:4px;background:var(--white);border:1px solid var(--border);border-radius:14px;padding:5px;margin-bottom:24px;box-shadow:var(--sh)}
.tab{flex:1;padding:9px 4px;border:none;border-radius:10px;background:transparent;font-family:'Lexend',sans-serif;font-size:.78rem;font-weight:600;color:var(--muted);cursor:pointer;transition:all .2s;letter-spacing:.3px}
.tab.active{background:var(--accent);color:#fff;box-shadow:0 3px 12px rgba(37,99,235,.3)}
.tab:hover:not(.active){background:var(--accent-l);color:var(--accent)}

/* HEADER */
.hdr{display:flex;align-items:center;gap:16px;margin-bottom:28px;padding-bottom:24px;border-bottom:2px solid var(--border)}
.hdr-icon{width:50px;height:50px;background:linear-gradient(135deg,#2563eb,#7c3aed);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 4px 18px rgba(124,58,237,.3);flex-shrink:0}
.hdr h1{font-size:1.55rem;font-weight:800;color:var(--text);letter-spacing:-.5px}
.hdr h1 span{color:var(--accent)}
.hdr p{font-family:'IBM Plex Mono',monospace;font-size:.62rem;color:var(--muted);margin-top:3px;letter-spacing:1.5px;text-transform:uppercase}
.hdr-badges{margin-left:auto;display:flex;gap:6px;flex-shrink:0}
.badge{font-family:'IBM Plex Mono',monospace;font-size:.6rem;letter-spacing:.8px;padding:4px 11px;border-radius:20px}
.badge-blue{background:var(--accent-l);color:var(--accent);border:1px solid #bfdbfe}
.badge-purple{background:#f5f3ff;color:var(--accent2);border:1px solid #ddd6fe}

/* CARD */
.card{background:var(--white);border:1px solid var(--border);border-radius:16px;padding:22px;box-shadow:var(--sh);margin-bottom:18px}
.card-title{font-family:'IBM Plex Mono',monospace;font-size:.63rem;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:16px;display:flex;align-items:center;gap:8px}
.card-title::after{content:'';flex:1;height:1px;background:var(--border)}

/* GRID LAYOUTS */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
@media(max-width:720px){.g2,.g3,.g4{grid-template-columns:1fr}}

/* METRIC CHIP */
.metric{background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:14px 16px}
.metric-lbl{font-family:'IBM Plex Mono',monospace;font-size:.58rem;color:var(--muted);letter-spacing:1.2px;text-transform:uppercase;margin-bottom:5px}
.metric-val{font-size:1.35rem;font-weight:700;font-family:'IBM Plex Mono',monospace}
.metric-sub{font-size:.7rem;color:var(--muted);margin-top:2px}
.val-green{color:var(--green)} .val-red{color:var(--red)} .val-blue{color:var(--accent)} .val-purple{color:var(--accent2)}

/* BUTTONS */
.btn{padding:11px 22px;border:none;border-radius:10px;font-family:'Lexend',sans-serif;font-size:.85rem;font-weight:600;cursor:pointer;transition:all .2s}
.btn-primary{background:linear-gradient(135deg,#2563eb,#3b82f6);color:#fff;box-shadow:0 3px 14px rgba(37,99,235,.28)}
.btn-primary:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 22px rgba(37,99,235,.38)}
.btn-primary:disabled{opacity:.45;cursor:not-allowed;transform:none}
.btn-outline{background:transparent;border:1px solid var(--border2);color:var(--text2)}
.btn-outline:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-l)}
.btn-green{background:linear-gradient(135deg,#059669,#10b981);color:#fff;box-shadow:0 3px 14px rgba(5,150,105,.25)}
.btn-green:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 22px rgba(5,150,105,.35)}
.btn-green:disabled{opacity:.45;cursor:not-allowed;transform:none}

/* PROGRESS */
.prog-wrap{margin:14px 0}
.prog-label{display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:.65rem;color:var(--muted);margin-bottom:5px}
.prog-bg{height:8px;background:var(--bg);border-radius:4px;overflow:hidden;border:1px solid var(--border)}
.prog-fill{height:100%;border-radius:4px;transition:width .4s ease}
.fill-blue{background:linear-gradient(90deg,#2563eb,#60a5fa)}
.fill-green{background:linear-gradient(90deg,#059669,#34d399)}
.fill-purple{background:linear-gradient(90deg,#7c3aed,#a78bfa)}

/* SPECTRUM CANVAS */
.spectrum-wrap{background:#0f172a;border-radius:12px;overflow:hidden;border:1px solid #1e293b;padding:12px;margin-bottom:10px;position:relative}
.spectrum-wrap canvas{display:block;width:100%;height:180px}
.spectrum-legend{display:flex;gap:16px;margin-top:8px;flex-wrap:wrap}
.leg-item{display:flex;align-items:center;gap:6px;font-family:'IBM Plex Mono',monospace;font-size:.62rem;color:#94a3b8}
.leg-dot{width:10px;height:3px;border-radius:2px;flex-shrink:0}

/* LOG */
.log-box{background:#0f172a;border-radius:10px;padding:14px;max-height:200px;overflow-y:auto;font-family:'IBM Plex Mono',monospace;font-size:.68rem;line-height:1.8;border:1px solid #1e293b}
.log-line{display:flex;gap:10px}
.log-ep{color:#64748b;flex-shrink:0;width:80px}
.log-loss{color:#60a5fa}
.log-phys{color:#a78bfa}
.log-val{color:#34d399}
.log-info{color:#94a3b8}

/* TABLE */
.tbl{width:100%;border-collapse:collapse;font-size:.8rem}
.tbl th{font-family:'IBM Plex Mono',monospace;font-size:.6rem;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);padding:8px 12px;border-bottom:2px solid var(--border);text-align:left;background:var(--bg)}
.tbl td{padding:9px 12px;border-bottom:1px solid var(--border);color:var(--text2)}
.tbl tr:last-child td{border-bottom:none}
.tbl tr:hover td{background:var(--accent-l)}
.tbl-val{font-family:'IBM Plex Mono',monospace;font-size:.75rem;color:var(--text)}
.chip{display:inline-block;padding:2px 9px;border-radius:10px;font-size:.65rem;font-weight:600;font-family:'IBM Plex Mono',monospace}
.chip-h{background:var(--green-l);color:var(--green)}
.chip-d{background:var(--red-l);color:var(--red)}

/* SLIDER */
.slider-wrap{margin:10px 0}
.slider-wrap label{font-family:'IBM Plex Mono',monospace;font-size:.65rem;color:var(--text2);letter-spacing:.8px;display:flex;justify-content:space-between;margin-bottom:5px}
input[type=range]{width:100%;accent-color:var(--accent)}

/* INFERENCE PANEL */
.inf-result{padding:20px;border-radius:14px;text-align:center;margin-top:14px;border:2px solid transparent;transition:all .4s}
.inf-healthy{background:var(--green-l);border-color:#6ee7b7}
.inf-disease{background:var(--red-l);border-color:#fca5a5}
.inf-none{background:var(--bg);border-color:var(--border)}
.inf-icon{font-size:2.5rem;margin-bottom:8px}
.inf-label{font-size:1.1rem;font-weight:700}
.inf-conf{font-family:'IBM Plex Mono',monospace;font-size:.75rem;color:var(--text2);margin-top:4px}

/* PHYSICS EQ */
.eq-box{background:#0f172a;border-radius:10px;padding:14px 18px;font-family:'IBM Plex Mono',monospace;font-size:.72rem;color:#e2e8f0;line-height:2;border:1px solid #1e293b}
.eq-green{color:#34d399} .eq-blue{color:#60a5fa} .eq-purple{color:#a78bfa} .eq-amber{color:#fbbf24}

/* STATUS */
.status-bar{display:flex;align-items:center;gap:8px;padding:9px 14px;background:var(--bg);border-radius:8px;border:1px solid var(--border);font-family:'IBM Plex Mono',monospace;font-size:.67rem;color:var(--text2)}
.sdot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.sdot-idle{background:var(--muted)}
.sdot-run{background:var(--accent);animation:spulse 1s ease infinite}
.sdot-ok{background:var(--green)}
.sdot-err{background:var(--red)}
@keyframes spulse{0%,100%{box-shadow:0 0 0 0 rgba(37,99,235,.4)}50%{box-shadow:0 0 0 4px rgba(37,99,235,0)}}

/* SCATTER DOTS */
.scatter-h{fill:#10b981} .scatter-d{fill:#ef4444}

/* SCROLLBAR */
.log-box::-webkit-scrollbar{width:4px}
.log-box::-webkit-scrollbar-track{background:#1e293b}
.log-box::-webkit-scrollbar-thumb{background:#334155;border-radius:2px}

.section-hdr{font-size:1.05rem;font-weight:700;color:var(--text);margin-bottom:14px;display:flex;align-items:center;gap:8px}
.divider{height:1px;background:var(--border);margin:20px 0}
`;

// ─────────────────────────────────────────────
//  MRS PHYSICS ENGINE
// ─────────────────────────────────────────────

// Metabolite frequencies (ppm relative to water at 4.7 ppm)
const METABOLITES = {
  NAA:  { ppm: 2.01, name: "N-Acetyl Aspartate",  healthy: [8.0, 10.5], disease: [4.5,  7.0] },
  Cr:   { ppm: 3.02, name: "Creatine",             healthy: [6.5,  8.5], disease: [5.0,  7.5] },
  Cho:  { ppm: 3.22, name: "Choline",              healthy: [1.5,  3.0], disease: [3.5,  5.5] },
  mI:   { ppm: 3.56, name: "Myo-Inositol",         healthy: [3.0,  5.0], disease: [5.5,  8.5] },
  Glu:  { ppm: 2.35, name: "Glutamate",            healthy: [7.0,  9.5], disease: [4.0,  6.5] },
  Lac:  { ppm: 1.32, name: "Lactate",              healthy: [0.0,  0.5], disease: [1.2,  3.0] },
};

const PMIN = 0.5, PMAX = 4.5, NPTS = 512;

function randBetween(a, b) { return a + Math.random() * (b - a); }

function lorentzian(x, x0, amp, lw) {
  return amp * (lw / 2) / ((x - x0) ** 2 + (lw / 2) ** 2);
}

function generateSpectrum(isDisease, noise = 0.15) {
  const ppm = Array.from({ length: NPTS }, (_, i) => PMIN + (PMAX - PMIN) * i / NPTS);
  const spectrum = new Float32Array(NPTS);
  const amps = {};
  for (const [k, m] of Object.entries(METABOLITES)) {
    const range = isDisease ? m.disease : m.healthy;
    amps[k] = randBetween(...range);
    for (let i = 0; i < NPTS; i++)
      spectrum[i] += lorentzian(ppm[i], m.ppm, amps[k], randBetween(0.04, 0.09));
  }
  // add noise
  for (let i = 0; i < NPTS; i++)
    spectrum[i] += (Math.random() - 0.5) * noise;
  return { ppm, spectrum, amps, label: isDisease ? 1 : 0 };
}

// ─────────────────────────────────────────────
//  PINN MODEL (pure JS, no external library)
// ─────────────────────────────────────────────

function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }
function relu(x) { return Math.max(0, x); }
function softmax(arr) {
  const m = Math.max(...arr);
  const e = arr.map(x => Math.exp(x - m));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map(x => x / s);
}

class PINN {
  constructor(inputDim = 12, hiddenDims = [64, 32, 16]) {
    this.layers = [];
    let prev = inputDim;
    for (const h of hiddenDims) {
      this.layers.push(this._initLayer(prev, h));
      prev = h;
    }
    this.layers.push(this._initLayer(prev, 2));
    this.lr = 0.012;
    this.physicsWeight = 0.35;
    this.history = [];
  }

  _initLayer(in_, out) {
    const scale = Math.sqrt(2 / in_);
    return {
      W: Array.from({ length: out }, () =>
        Array.from({ length: in_ }, () => (Math.random() * 2 - 1) * scale)),
      b: Array.from({ length: out }, () => 0),
    };
  }

  _forward(x) {
    let act = x;
    const activations = [x];
    for (let l = 0; l < this.layers.length; l++) {
      const { W, b } = this.layers[l];
      const z = W.map((row, i) =>
        row.reduce((s, w, j) => s + w * act[j], 0) + b[i]);
      act = l < this.layers.length - 1 ? z.map(relu) : z;
      activations.push(act);
    }
    return { output: softmax(act), activations };
  }

  // Extract physics-constrained features from raw spectrum
  extractFeatures(spectrum, ppm) {
    const feats = [];
    // 1. Amplitude at each metabolite peak
    for (const m of Object.values(METABOLITES)) {
      let closest = 0, minDist = Infinity;
      for (let i = 0; i < ppm.length; i++) {
        const d = Math.abs(ppm[i] - m.ppm);
        if (d < minDist) { minDist = d; closest = spectrum[i]; }
      }
      feats.push(closest);
    }
    // 2. NAA/Cr ratio (physics constraint)
    feats.push(feats[0] / (feats[1] + 1e-6));
    // 3. Cho/Cr ratio (physics constraint)
    feats.push(feats[2] / (feats[1] + 1e-6));
    // 4. NAA/Cho ratio
    feats.push(feats[0] / (feats[2] + 1e-6));
    // 5. mI/Cr ratio
    feats.push(feats[3] / (feats[1] + 1e-6));
    // 6. Total spectral area (integral)
    feats.push(spectrum.reduce((s, v) => s + Math.abs(v), 0) / spectrum.length);
    // 7. Spectral entropy
    const total = feats[feats.length - 1] + 1e-6;
    let entropy = 0;
    for (const v of spectrum) {
      const p = Math.abs(v) / total;
      if (p > 1e-9) entropy -= p * Math.log(p);
    }
    feats.push(entropy / Math.log(spectrum.length));
    return feats;
  }

  // Physics residual: penalise if NAA/Cr deviates from expected range
  physicsResidual(features) {
    const naaCr = features[6];   // NAA/Cr ratio
    const choCr = features[7];   // Cho/Cr ratio
    // Physics: healthy → 1.4–2.2; disease → 0.6–1.2
    // Penalise extremes with soft constraint
    const r1 = Math.max(0, naaCr - 3.0) ** 2 + Math.max(0, 0.3 - naaCr) ** 2;
    const r2 = Math.max(0, choCr - 3.5) ** 2;
    return (r1 + r2) * this.physicsWeight;
  }

  _crossEntropy(probs, label) {
    return -Math.log(probs[label] + 1e-9);
  }

  trainStep(batch) {
    let totalLoss = 0, totalPhys = 0;
    const grads = this.layers.map(l => ({
      W: l.W.map(r => r.map(() => 0)),
      b: l.b.map(() => 0),
    }));

    for (const { features, label } of batch) {
      const { output, activations } = this._forward(features);
      const ce = this._crossEntropy(output, label);
      const phys = this.physicsResidual(features);
      totalLoss += ce + phys;
      totalPhys += phys;

      // Backprop (simplified gradient for 2-class softmax + CE)
      let delta = output.map((p, i) => p - (i === label ? 1 : 0));

      for (let l = this.layers.length - 1; l >= 0; l--) {
        const aIn = activations[l];
        const { W, b } = this.layers[l];
        const newDelta = new Array(aIn.length).fill(0);

        for (let i = 0; i < delta.length; i++) {
          grads[l].b[i] += delta[i];
          for (let j = 0; j < aIn.length; j++) {
            grads[l].W[i][j] += delta[i] * aIn[j];
            newDelta[j] += delta[i] * W[i][j];
          }
        }

        // ReLU derivative for hidden layers
        if (l > 0) {
          for (let j = 0; j < newDelta.length; j++)
            newDelta[j] *= activations[l][j] > 0 ? 1 : 0;
        }
        delta = newDelta;
      }
    }

    // Apply gradients
    const n = batch.length;
    for (let l = 0; l < this.layers.length; l++) {
      for (let i = 0; i < this.layers[l].b.length; i++) {
        this.layers[l].b[i] -= (this.lr / n) * grads[l].b[i];
        for (let j = 0; j < this.layers[l].W[i].length; j++)
          this.layers[l].W[i][j] -= (this.lr / n) * grads[l].W[i][j];
      }
    }

    return { loss: totalLoss / n, physLoss: totalPhys / n };
  }

  predict(features) {
    const { output } = this._forward(features);
    return { probs: output, pred: output[1] > output[0] ? 1 : 0 };
  }
}

// ─────────────────────────────────────────────
//  GENERATE DATASET
// ─────────────────────────────────────────────
function generateDataset(n = 240) {
  const samples = [];
  for (let i = 0; i < n; i++) {
    const isD = i % 2 === 0;
    const s = generateSpectrum(isD, 0.12);
    samples.push(s);
  }
  return samples;
}

// ─────────────────────────────────────────────
//  CHART HELPERS
// ─────────────────────────────────────────────
function drawSpectrum(canvas, spectra, labels) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.offsetWidth || 600, H = 180;
  canvas.width = W; canvas.height = H;
  ctx.clearRect(0, 0, W, H);

  const ppm = spectra[0].ppm;
  const allVals = spectra.flatMap(s => Array.from(s.spectrum));
  const vmin = Math.min(...allVals), vmax = Math.max(...allVals);
  const pad = 10;

  const px = i => pad + (i / (ppm.length - 1)) * (W - 2 * pad);
  const py = v => H - pad - ((v - vmin) / (vmax - vmin + 1e-9)) * (H - 2 * pad);

  spectra.forEach((s, si) => {
    ctx.beginPath();
    ctx.strokeStyle = labels[si] === 0 ? "rgba(16,185,129,.75)" : "rgba(239,68,68,.75)";
    ctx.lineWidth = 1.5;
    for (let i = 0; i < s.spectrum.length; i++) {
      if (i === 0) ctx.moveTo(px(i), py(s.spectrum[i]));
      else ctx.lineTo(px(i), py(s.spectrum[i]));
    }
    ctx.stroke();
  });

  // Metabolite labels
  const metColors = { NAA: "#60a5fa", Cr: "#a78bfa", Cho: "#fbbf24", mI: "#f472b6", Glu: "#34d399", Lac: "#fb923c" };
  Object.entries(METABOLITES).forEach(([k, m]) => {
    const xi = Math.round((m.ppm - PMIN) / (PMAX - PMIN) * (ppm.length - 1));
    const x = px(xi);
    ctx.strokeStyle = metColors[k] + "99";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(x, pad); ctx.lineTo(x, H - pad); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = metColors[k];
    ctx.font = "bold 10px IBM Plex Mono";
    ctx.fillText(k, x - 8, pad + 12);
  });
}

// ─────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────
export default function MrsPinn() {
  const [tab, setTab] = useState("dataset");
  const [dataset, setDataset] = useState(null);
  const [model, setModel] = useState(null);
  const [trainLog, setTrainLog] = useState([]);
  const [trainMetrics, setTrainMetrics] = useState([]);
  const [evalResults, setEvalResults] = useState(null);
  const [inferResult, setInferResult] = useState(null);
  const [status, setStatus] = useState("idle");
  const [statusMsg, setStatusMsg] = useState("Ready");
  const [training, setTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inferParams, setInferParams] = useState({
    NAA: 7.2, Cr: 7.0, Cho: 2.1, mI: 4.0, Glu: 7.5, Lac: 0.2
  });

  const canvasTrain = useRef(), canvasTest = useRef(), canvasInfer = useRef();

  // Generate dataset
  const handleGenerate = useCallback(() => {
    setStatus("run"); setStatusMsg("Generating MRS spectra…");
    const raw = generateDataset(240);
    const pinn = new PINN();
    const withFeats = raw.map(s => ({
      ...s,
      features: pinn.extractFeatures(Array.from(s.spectrum), s.ppm),
    }));
    const shuffle = [...withFeats].sort(() => Math.random() - 0.5);
    const split = Math.floor(shuffle.length * 0.75);
    const ds = { all: withFeats, train: shuffle.slice(0, split), test: shuffle.slice(split) };
    setDataset(ds);
    setModel(null); setTrainLog([]); setTrainMetrics([]); setEvalResults(null); setInferResult(null);
    setStatus("ok"); setStatusMsg(`Dataset ready — ${ds.train.length} train / ${ds.test.length} test`);

    setTimeout(() => {
      if (canvasTrain.current)
        drawSpectrum(canvasTrain.current, ds.train.slice(0, 8), ds.train.slice(0, 8).map(s => s.label));
      if (canvasTest.current)
        drawSpectrum(canvasTest.current, ds.test.slice(0, 6), ds.test.slice(0, 6).map(s => s.label));
    }, 100);
  }, []);

  // Train model
  const handleTrain = useCallback(async () => {
    if (!dataset) return;
    setTraining(true); setTrainLog([]); setTrainMetrics([]); setStatus("run");
    setStatusMsg("Training PINN…"); setProgress(0);

    const pinn = new PINN(12, [64, 32, 16]);
    const EPOCHS = 80, BATCH = 16;
    const logs = [], metrics = [];

    for (let ep = 0; ep < EPOCHS; ep++) {
      const shuffled = [...dataset.train].sort(() => Math.random() - 0.5);
      let epochLoss = 0, epochPhys = 0;
      for (let b = 0; b < shuffled.length; b += BATCH) {
        const batch = shuffled.slice(b, b + BATCH);
        const { loss, physLoss } = pinn.trainStep(batch);
        epochLoss += loss; epochPhys += physLoss;
      }
      const nb = Math.ceil(shuffled.length / BATCH);
      epochLoss /= nb; epochPhys /= nb;

      // Validation
      let correct = 0;
      for (const s of dataset.test) {
        const { pred } = pinn.predict(s.features);
        if (pred === s.label) correct++;
      }
      const valAcc = correct / dataset.test.length;

      if (ep % 5 === 0 || ep === EPOCHS - 1) {
        logs.push({ ep, loss: epochLoss.toFixed(4), phys: epochPhys.toFixed(4), valAcc: (valAcc * 100).toFixed(1) });
        setTrainLog([...logs]);
      }
      metrics.push({ epoch: ep + 1, loss: +epochLoss.toFixed(4), physLoss: +epochPhys.toFixed(4), valAcc: +(valAcc * 100).toFixed(2) });
      setTrainMetrics([...metrics]);
      setProgress(Math.round((ep + 1) / EPOCHS * 100));

      if (ep % 8 === 0) await new Promise(r => setTimeout(r, 0));
    }

    setModel(pinn);
    setTraining(false);
    setStatus("ok");
    setStatusMsg("Training complete — model ready");
  }, [dataset]);

  // Evaluate
  const handleEvaluate = useCallback(() => {
    if (!model || !dataset) return;
    setStatus("run"); setStatusMsg("Evaluating on test set…");

    let tp = 0, tn = 0, fp = 0, fn = 0;
    const scatterData = [];

    for (const s of dataset.test) {
      const { pred, probs } = model.predict(s.features);
      const actual = s.label;
      if (pred === 1 && actual === 1) tp++;
      else if (pred === 0 && actual === 0) tn++;
      else if (pred === 1 && actual === 0) fp++;
      else fn++;
      scatterData.push({
        x: s.features[6],   // NAA/Cr
        y: s.features[7],   // Cho/Cr
        pred, actual,
        correct: pred === actual,
        probDisease: probs[1].toFixed(3),
      });
    }

    const acc = (tp + tn) / dataset.test.length;
    const prec = tp / (tp + fp + 1e-9);
    const rec = tp / (tp + fn + 1e-9);
    const f1 = 2 * prec * rec / (prec + rec + 1e-9);
    const spec = tn / (tn + fp + 1e-9);

    setEvalResults({ acc, prec, rec, f1, spec, tp, tn, fp, fn, scatterData });
    setStatus("ok"); setStatusMsg(`Evaluation complete — Accuracy: ${(acc * 100).toFixed(1)}%`);
  }, [model, dataset]);

  // Inference
  const handleInference = useCallback(() => {
    if (!model) return;
    setStatus("run"); setStatusMsg("Running inference…");

    // Build synthetic spectrum from user-specified metabolite amplitudes
    const ppm = Array.from({ length: NPTS }, (_, i) => PMIN + (PMAX - PMIN) * i / NPTS);
    const spectrum = new Float32Array(NPTS);
    const keys = Object.keys(METABOLITES);
    keys.forEach(k => {
      const m = METABOLITES[k];
      for (let i = 0; i < NPTS; i++)
        spectrum[i] += lorentzian(ppm[i], m.ppm, inferParams[k], 0.06);
    });

    const features = model.extractFeatures(Array.from(spectrum), ppm);
    const { pred, probs } = model.predict(features);

    setInferResult({
      pred, probs,
      features,
      spectrum,
      ppm,
      ratios: {
        "NAA/Cr": (inferParams.NAA / (inferParams.Cr + 1e-9)).toFixed(2),
        "Cho/Cr": (inferParams.Cho / (inferParams.Cr + 1e-9)).toFixed(2),
        "NAA/Cho": (inferParams.NAA / (inferParams.Cho + 1e-9)).toFixed(2),
        "mI/Cr": (inferParams.mI / (inferParams.Cr + 1e-9)).toFixed(2),
      }
    });

    setTimeout(() => {
      if (canvasInfer.current)
        drawSpectrum(canvasInfer.current,
          [{ spectrum, ppm }],
          [pred]);
    }, 80);

    setStatus("ok"); setStatusMsg("Inference complete");
  }, [model, inferParams]);

  const dotCls = { idle: "sdot-idle", run: "sdot-run", ok: "sdot-ok", err: "sdot-err" }[status];

  // ── TABS ──────────────────────────────────
  return (
    <>
      <style>{S}</style>
      <div className="app">
        {/* Header */}
        <div className="hdr">
          <div className="hdr-icon">⚛</div>
          <div>
            <h1>MRS based <span>PINN</span> Analyzer</h1>
            <p>Magnetic Resonance Spectroscopy - Physics-Informed Neural Networks </p>
          </div> <div style={{
              marginTop:"6px",
              fontSize:"0.75rem",
              color:"#475569",
              lineHeight:"1.4",
              fontFamily:"IBM Plex Mono"
            }}>
              <h3>Developed by,</h3><br/>
              <strong>Udayakumar Palanivelu B.E., M.E., Ph.D., </strong><br/>
              Assitant Professor,<br/> Department of Computer Science and Engineering (Artificial Intelligence and Machine Learning)<br/>
              Madanapalle Institute of Technology and Science(MITS) University, Andhra Pradesh
            </div>
          <div className="hdr-badges">
            <span className="badge badge-blue">PINN v1.0</span>
            <span className="badge badge-purple">MRS Engine</span>
          </div>
        </div> <div className="card">
          <h3 style={{marginBottom:10}}>System Overview</h3>
          <p style={{color:"#475569"}}>
            The MRS–PINN Analyzer is an advanced computational framework that integrates Physics-Informed Neural Networks (PINNs) with Magnetic Resonance Spectroscopy (MRS) for intelligent brain metabolite analysis and disease classification. The system is designed to bridge the gap between data-driven deep learning models and domain-specific physical knowledge, enabling more interpretable, robust, and clinically meaningful predictions.
          </p>
        </div>

        {/* Tab Bar */}
        <div className="tabs">
          {[["dataset","📊 Dataset"],["train","🧠 Train"],["evaluate","📈 Evaluate"],["inference","🔬 Inference"]].map(([id,lbl]) => (
            <button key={id} className={`tab${tab===id?" active":""}`} onClick={() => setTab(id)}>{lbl}</button>
          ))}
        </div>

        {/* ── TAB: DATASET ── */}
        {tab === "dataset" && (
          <>
            <div className="card">
              <div className="card-title">Physics Model — MRS Signal Equations</div>
              <div className="eq-box">
                <div><span className="eq-blue">S(ω)</span> = Σ<sub>k</sub> <span className="eq-green">A_k</span> · <span className="eq-amber">L(ω, ω_k, Δω_k)</span> + <span className="eq-purple">η(ω)</span></div>
                <div style={{marginTop:6}}><span className="eq-amber">L(ω,ω₀,Δω)</span> = (Δω/2) / [(ω−ω₀)² + (Δω/2)²]   <span style={{color:"#64748b"}}># Lorentzian lineshape</span></div>
                <div style={{marginTop:6}}><span className="eq-green">Physics Constraints:</span>  NAA/Cr ∈ [1.4,2.2] (healthy)  |  Cho/Cr ∈ [0.6,1.0] (healthy)</div>
                <div style={{marginTop:4}}><span className="eq-purple">Physics Loss:</span>  L_phys = λ·[max(0, R_NAACr−3)² + max(0, R_ChoCr−3.5)²]  |  λ = 0.35</div>
                <div style={{marginTop:4}}><span className="eq-blue">Total Loss:</span>  L_total = L_CE(ŷ,y) + L_phys</div>
              </div>
            </div>

            <div className="g2">
              <div className="card">
                <div className="card-title">Dataset Configuration</div>
                <div className="g2" style={{gap:10,marginBottom:14}}>
                  {[["Total Samples","240"],["Train Split","75% (180)"],["Test Split","25% (60)"],["Classes","Healthy / Disease"]].map(([l,v]) => (
                    <div className="metric" key={l}><div className="metric-lbl">{l}</div><div className="metric-val val-blue" style={{fontSize:"1rem"}}>{v}</div></div>
                  ))}
                </div>
                <div className="card-title" style={{marginTop:10}}>Metabolite Panel</div>
                <table className="tbl">
                  <thead><tr><th>Metabolite</th><th>ppm</th><th>Healthy</th><th>Disease</th></tr></thead>
                  <tbody>
                    {Object.entries(METABOLITES).map(([k,m]) => (
                      <tr key={k}>
                        <td><b>{k}</b> <span style={{color:"var(--muted)",fontSize:".7rem"}}>{m.name}</span></td>
                        <td className="tbl-val">{m.ppm}</td>
                        <td className="tbl-val" style={{color:"var(--green)"}}>{m.healthy[0]}–{m.healthy[1]}</td>
                        <td className="tbl-val" style={{color:"var(--red)"}}>{m.disease[0]}–{m.disease[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button className="btn btn-primary" style={{marginTop:16,width:"100%"}} onClick={handleGenerate}>
                  ⚡ Generate MRS Dataset
                </button>
              </div>

              <div className="card">
                <div className="card-title">Training Spectra Preview</div>
                <div className="spectrum-wrap">
                  <canvas ref={canvasTrain} style={{height:180}} />
                </div>
                <div className="spectrum-legend">
                  <div className="leg-item"><div className="leg-dot" style={{background:"#10b981"}} />Healthy</div>
                  <div className="leg-item"><div className="leg-dot" style={{background:"#ef4444"}} />Disease</div>
                  {Object.keys(METABOLITES).map(k => (
                    <div className="leg-item" key={k}><div className="leg-dot" style={{background:{NAA:"#60a5fa",Cr:"#a78bfa",Cho:"#fbbf24",mI:"#f472b6",Glu:"#34d399",Lac:"#fb923c"}[k]}} />{k}</div>
                  ))}
                </div>
                <div className="card-title" style={{marginTop:14}}>Test Spectra Preview</div>
                <div className="spectrum-wrap">
                  <canvas ref={canvasTest} style={{height:180}} />
                </div>
                {dataset && (
                  <div className="g2" style={{marginTop:12,gap:8}}>
                    <div className="metric"><div className="metric-lbl">Train Healthy</div><div className="metric-val val-green">{dataset.train.filter(s=>s.label===0).length}</div></div>
                    <div className="metric"><div className="metric-lbl">Train Disease</div><div className="metric-val val-red">{dataset.train.filter(s=>s.label===1).length}</div></div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── TAB: TRAIN ── */}
        {tab === "train" && (
          <>
            <div className="g2">
              <div className="card">
                <div className="card-title">PINN Architecture</div>
                <table className="tbl">
                  <thead><tr><th>Layer</th><th>Type</th><th>Units</th><th>Params</th></tr></thead>
                  <tbody>
                    {[["Input","Feature Vector","12","—"],["Hidden 1","Dense + ReLU","64","832"],["Hidden 2","Dense + ReLU","32","2,080"],["Hidden 3","Dense + ReLU","16","528"],["Output","Dense + Softmax","2","34"]].map(([l,t,u,p]) => (
                      <tr key={l}><td><b>{l}</b></td><td style={{color:"var(--accent2)"}}>{t}</td><td className="tbl-val">{u}</td><td className="tbl-val">{p}</td></tr>
                    ))}
                  </tbody>
                </table>
                <div className="divider" />
                <div className="g2" style={{gap:10}}>
                  {[["Learning Rate","0.012"],["Epochs","80"],["Batch Size","16"],["Physics λ","0.35"]].map(([l,v]) => (
                    <div className="metric" key={l}><div className="metric-lbl">{l}</div><div className="metric-val val-purple" style={{fontSize:"1rem"}}>{v}</div></div>
                  ))}
                </div>
                <button className="btn btn-primary" style={{marginTop:16,width:"100%"}}
                  disabled={!dataset || training} onClick={handleTrain}>
                  {training ? "⏳ Training…" : "▶ Train PINN Model"}
                </button>
                {!dataset && <div style={{color:"var(--red)",fontSize:".75rem",marginTop:8,fontFamily:"IBM Plex Mono"}}>⚠ Generate dataset first (Dataset tab)</div>}
              </div>

              <div className="card">
                <div className="card-title">Training Progress</div>
                <div className="prog-wrap">
                  <div className="prog-label"><span>Epoch Progress</span><span>{progress}%</span></div>
                  <div className="prog-bg"><div className="prog-fill fill-blue" style={{width:`${progress}%`}} /></div>
                </div>
                {trainMetrics.length > 0 && (
                  <>
                    <div className="g3" style={{gap:8,marginBottom:14}}>
                      <div className="metric"><div className="metric-lbl">Total Loss</div><div className="metric-val val-red" style={{fontSize:"1rem"}}>{trainMetrics[trainMetrics.length-1].loss}</div></div>
                      <div className="metric"><div className="metric-lbl">Physics Loss</div><div className="metric-val val-purple" style={{fontSize:"1rem"}}>{trainMetrics[trainMetrics.length-1].physLoss}</div></div>
                      <div className="metric"><div className="metric-lbl">Val Acc</div><div className="metric-val val-green" style={{fontSize:"1rem"}}>{trainMetrics[trainMetrics.length-1].valAcc}%</div></div>
                    </div>
                    <ResponsiveContainer width="100%" height={160}>
                      <LineChart data={trainMetrics} margin={{top:4,right:8,left:-20,bottom:0}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e6f0" />
                        <XAxis dataKey="epoch" tick={{fontSize:10,fontFamily:"IBM Plex Mono"}} />
                        <YAxis tick={{fontSize:10,fontFamily:"IBM Plex Mono"}} />
                        <Tooltip contentStyle={{fontFamily:"IBM Plex Mono",fontSize:11}} />
                        <Legend wrapperStyle={{fontSize:11,fontFamily:"IBM Plex Mono"}} />
                        <Line type="monotone" dataKey="loss" stroke="#ef4444" dot={false} strokeWidth={2} name="Total Loss" />
                        <Line type="monotone" dataKey="physLoss" stroke="#8b5cf6" dot={false} strokeWidth={1.5} name="Physics Loss" />
                        <Line type="monotone" dataKey="valAcc" stroke="#10b981" dot={false} strokeWidth={2} name="Val Acc %" yAxisId={1} />
                      </LineChart>
                    </ResponsiveContainer>
                  </>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-title">Training Log</div>
              <div className="log-box">
                {trainLog.length === 0
                  ? <span className="log-info">Waiting for training to start…</span>
                  : trainLog.map((l, i) => (
                    <div className="log-line" key={i}>
                      <span className="log-ep">Epoch {l.ep.toString().padStart(3,"0")}</span>
                      <span className="log-loss">loss={l.loss}</span>
                      <span className="log-phys">phys={l.phys}</span>
                      <span className="log-val">val_acc={l.valAcc}%</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </>
        )}

        {/* ── TAB: EVALUATE ── */}
        {tab === "evaluate" && (
          <>
            <div className="card">
              <button className="btn btn-green" disabled={!model || !dataset} onClick={handleEvaluate} style={{marginBottom:16}}>
                📊 Run Full Evaluation
              </button>
              {!model && <span style={{color:"var(--red)",fontSize:".75rem",fontFamily:"IBM Plex Mono",marginLeft:12}}>⚠ Train model first</span>}

              {evalResults && (
                <>
                  <div className="section-hdr">Performance Metrics</div>
                  <div className="g4" style={{marginBottom:20}}>
                    {[["Accuracy",(evalResults.acc*100).toFixed(2)+"%","val-green"],["Precision",(evalResults.prec*100).toFixed(2)+"%","val-blue"],["Recall",(evalResults.rec*100).toFixed(2)+"%","val-purple"],["F1 Score",(evalResults.f1*100).toFixed(2)+"%","val-amber"],["Specificity",(evalResults.spec*100).toFixed(2)+"%","val-blue"],["True Pos",evalResults.tp,"val-green"],["True Neg",evalResults.tn,"val-green"],["False Pos+Neg",evalResults.fp+evalResults.fn,"val-red"]].map(([l,v,c]) => (
                      <div className="metric" key={l}><div className="metric-lbl">{l}</div><div className={`metric-val ${c}`}>{v}</div></div>
                    ))}
                  </div>

                  <div className="g2">
                    <div>
                      <div className="section-hdr" style={{fontSize:".9rem"}}>Confusion Matrix</div>
                      <table className="tbl">
                        <thead><tr><th></th><th>Pred Healthy</th><th>Pred Disease</th></tr></thead>
                        <tbody>
                          <tr><td><b>Actual Healthy</b></td><td><span className="chip chip-h">TN {evalResults.tn}</span></td><td><span className="chip chip-d">FP {evalResults.fp}</span></td></tr>
                          <tr><td><b>Actual Disease</b></td><td><span className="chip chip-d">FN {evalResults.fn}</span></td><td><span className="chip chip-h">TP {evalResults.tp}</span></td></tr>
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <div className="section-hdr" style={{fontSize:".9rem"}}>NAA/Cr vs Cho/Cr Feature Space</div>
                      <ResponsiveContainer width="100%" height={220}>
                        <ScatterChart margin={{top:4,right:8,left:-10,bottom:4}}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e6f0" />
                          <XAxis dataKey="x" name="NAA/Cr" type="number" tick={{fontSize:10,fontFamily:"IBM Plex Mono"}} label={{value:"NAA/Cr",position:"insideBottom",offset:-2,fontSize:10}} />
                          <YAxis dataKey="y" name="Cho/Cr" type="number" tick={{fontSize:10,fontFamily:"IBM Plex Mono"}} label={{value:"Cho/Cr",angle:-90,position:"insideLeft",fontSize:10}} />
                          <Tooltip contentStyle={{fontFamily:"IBM Plex Mono",fontSize:10}} />
                          <Scatter name="Healthy" data={evalResults.scatterData.filter(d=>d.actual===0)} fill="#10b981" opacity={0.7} />
                          <Scatter name="Disease" data={evalResults.scatterData.filter(d=>d.actual===1)} fill="#ef4444" opacity={0.7} />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="divider" />
                  <div className="section-hdr" style={{fontSize:".9rem"}}>Test Sample Predictions</div>
                  <div style={{maxHeight:260,overflowY:"auto"}}>
                    <table className="tbl">
                      <thead><tr><th>#</th><th>NAA/Cr</th><th>Cho/Cr</th><th>Actual</th><th>Predicted</th><th>P(Disease)</th><th>Result</th></tr></thead>
                      <tbody>
                        {evalResults.scatterData.slice(0, 30).map((d, i) => (
                          <tr key={i}>
                            <td className="tbl-val">{i+1}</td>
                            <td className="tbl-val">{(+d.x).toFixed(2)}</td>
                            <td className="tbl-val">{(+d.y).toFixed(2)}</td>
                            <td><span className={`chip ${d.actual===0?"chip-h":"chip-d"}`}>{d.actual===0?"Healthy":"Disease"}</span></td>
                            <td><span className={`chip ${d.pred===0?"chip-h":"chip-d"}`}>{d.pred===0?"Healthy":"Disease"}</span></td>
                            <td className="tbl-val">{(+d.probDisease*100).toFixed(1)}%</td>
                            <td>{d.correct ? "✅":"❌"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* ── TAB: INFERENCE ── */}
        {tab === "inference" && (
          <>
            <div className="g2">
              <div className="card">
                <div className="card-title">Set Metabolite Concentrations (mM)</div>
                {Object.entries(inferParams).map(([k, v]) => {
                  const m = METABOLITES[k];
                  const min = Math.min(...m.healthy, ...m.disease) * 0.5;
                  const max = Math.max(...m.healthy, ...m.disease) * 1.2;
                  return (
                    <div className="slider-wrap" key={k}>
                      <label>
                        <span><b>{k}</b> — {m.name}</span>
                        <span style={{color:"var(--accent)",fontWeight:700}}>{v.toFixed(1)} mM</span>
                      </label>
                      <input type="range" min={min.toFixed(1)} max={max.toFixed(1)} step="0.1" value={v}
                        onChange={e => setInferParams(p => ({ ...p, [k]: +e.target.value }))} />
                    </div>
                  );
                })}
                <div className="g2" style={{gap:8,marginTop:14}}>
                  <button className="btn btn-outline" onClick={() => setInferParams({NAA:8.5,Cr:7.2,Cho:2.0,mI:3.8,Glu:8.0,Lac:0.1})}>Load Healthy Sample</button>
                  <button className="btn btn-outline" onClick={() => setInferParams({NAA:5.5,Cr:6.5,Cho:4.8,mI:7.2,Glu:5.0,Lac:2.1})}>Load Disease Sample</button>
                </div>
                <button className="btn btn-primary" style={{marginTop:12,width:"100%"}}
                  disabled={!model} onClick={handleInference}>
                  🔬 Run PINN Inference
                </button>
                {!model && <div style={{color:"var(--red)",fontSize:".75rem",marginTop:8,fontFamily:"IBM Plex Mono"}}>⚠ Train model first (Train tab)</div>}
              </div>

              <div className="card">
                <div className="card-title">Inference Result</div>
                {!inferResult ? (
                  <div style={{color:"var(--muted)",textAlign:"center",padding:"40px 0",fontSize:".85rem"}}>
                    Set parameters and click Run Inference
                  </div>
                ) : (
                  <>
                    <div className={`inf-result ${inferResult.pred===0?"inf-healthy":"inf-disease"}`}>
                      <div className="inf-icon">{inferResult.pred===0?"✅":"⚠️"}</div>
                      <div className="inf-label" style={{color:inferResult.pred===0?"var(--green)":"var(--red)"}}>
                        {inferResult.pred===0 ? "Healthy Brain" : "Disease Detected"}
                      </div>
                      <div className="inf-conf">
                        P(Healthy) = {(inferResult.probs[0]*100).toFixed(1)}% &nbsp;|&nbsp;
                        P(Disease) = {(inferResult.probs[1]*100).toFixed(1)}%
                      </div>
                    </div>

                    <div className="g2" style={{marginTop:14,gap:8}}>
                      {Object.entries(inferResult.ratios).map(([k,v]) => (
                        <div className="metric" key={k}><div className="metric-lbl">{k}</div><div className="metric-val val-blue" style={{fontSize:"1rem"}}>{v}</div></div>
                      ))}
                    </div>

                    <div style={{marginTop:14}}>
                      <div className="card-title">Synthesized MRS Spectrum</div>
                      <div className="spectrum-wrap">
                        <canvas ref={canvasInfer} style={{height:180}} />
                      </div>
                      <div className="spectrum-legend">
                        <div className="leg-item"><div className="leg-dot" style={{background:inferResult.pred===0?"#10b981":"#ef4444"}} />{inferResult.pred===0?"Healthy signal":"Disease signal"}</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {inferResult && (
              <div className="card">
                <div className="card-title">Extracted Feature Vector (PINN Input)</div>
                <table className="tbl">
                  <thead><tr><th>#</th><th>Feature</th><th>Value</th><th>Description</th></tr></thead>
                  <tbody>
                    {["NAA peak","Cr peak","Cho peak","mI peak","Glu peak","Lac peak","NAA/Cr ratio","Cho/Cr ratio","NAA/Cho ratio","mI/Cr ratio","Spectral area","Spectral entropy"].map((name, i) => (
                      <tr key={i}>
                        <td className="tbl-val">{i+1}</td>
                        <td><b>{name}</b></td>
                        <td className="tbl-val">{inferResult.features[i]?.toFixed(4)}</td>
                        <td style={{color:"var(--muted)",fontSize:".72rem"}}>
                          {i < 6 ? `Lorentzian amplitude at ${Object.values(METABOLITES)[i]?.ppm} ppm` :
                           i < 10 ? "Physics-constrained metabolite ratio" :
                           i === 10 ? "Total spectral integral (normalized)" : "Shannon entropy of spectral distribution"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Status Bar */}
        <div className="status-bar" style={{marginTop:10}}>
          <div className={`sdot ${dotCls}`} />
          <span>{statusMsg}</span>
          {model && <span style={{marginLeft:"auto",color:"var(--green)"}}>✓ Model trained</span>}
          {dataset && <span style={{marginLeft: model ? 12 : "auto",color:"var(--accent)"}}>✓ Dataset ready ({dataset.all.length} samples)</span>}
        </div>
      </div>
    </>
  );
}
