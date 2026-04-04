import { useState } from "react";

export default function App() {
  const [sequence, setSequence] = useState("");
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePredict = async () => {
    setError("");
    setResult("");
    setConfidence(null);

    const cleanSeq = sequence.replace(/[\s\n\r]/g, "").toUpperCase();

    if (!cleanSeq) {
      setError("Sequence cannot be empty.");
      return;
    }

    if (cleanSeq.length < 10) {
      setError("Sequence must be at least 10 base pairs long.");
      return;
    }

    const invalidCharsMatch = cleanSeq.match(/[^ATGC]/);
    if (invalidCharsMatch) {
      setError(
        `Invalid character '${invalidCharsMatch[0]}' found. Only A, T, G, C are permitted.`
      );
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("https://antibiotic-resistance-determination-ml.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gene: cleanSeq }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Prediction failed.");
        return;
      }

      setResult(data.result === 1 ? "Resistant" : "Not Resistant");
      setConfidence(data.confidence ?? null);
    } catch {
      setError("Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setSequence(
      "ATGCGTACGATCGATCGATCGTAGCTAGCTAGCTAGCTAGCGTACGATCGATCGATGCTAGCTAGC"
    );
    setError("");
  };

  const resultColor = result === "Resistant" ? "#dc2626" : "#16a34a";
  const resultBg =
    result === "Resistant"
      ? "linear-gradient(135deg, #fff1f2 0%, #ffffff 100%)"
      : "linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)";

  return (
    <div className="page-shell">
      <div className="page-inner">
        <header className="topbar">
          <div>
            <div className="brand">ResistPredict</div>
            <div className="brand-sub">GENOMIC ML ANALYSIS</div>
          </div>

          <div className="status-pill">Local model active</div>
        </header>

        <section className="hero-card">
          <div className="hero-copy">
            <div className="hero-badge">Antibiotic Resistance Predictor</div>
            <h1 className="hero-title">
              Predict resistance from
              <span className="hero-title-gradient"> gene sequences</span>
            </h1>
            <p className="hero-text">
              Paste a DNA sequence containing A, T, G, and C bases to run your
              trained machine learning model and estimate antibiotic resistance
              with confidence.
            </p>
          </div>
        </section>

        <section className="main-grid">
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">Input sequence</div>
              <button className="link-btn" onClick={loadSample}>
                Load sample
              </button>
            </div>

            <textarea
              value={sequence}
              onChange={(e) => setSequence(e.target.value)}
              placeholder="Paste your ATGC sequence here..."
              rows={8}
              className="sequence-box"
            />

            <div className="meta-row">
              <div className="meta-text">
                Length:{" "}
                <span className="meta-strong">
                  {sequence.replace(/[\s\n\r]/g, "").length}
                </span>{" "}
                bp
              </div>
            </div>

            <button
              onClick={handlePredict}
              disabled={loading}
              className="predict-btn"
            >
              {loading ? "Analyzing sequence..." : "Run Prediction"}
            </button>

            {error && <div className="error-box">{error}</div>}
          </div>

          <div className="side-col">
            <div className="panel">
              <div className="small-heading">Prediction Result</div>

              {!result && !loading && (
                <div className="empty-state">
                  Enter a valid gene sequence and run the model to view the
                  prediction.
                </div>
              )}

              {loading && (
                <div className="loading-state">
                  <div className="spinner" />
                  <div className="loading-text">Running model inference...</div>
                </div>
              )}

              {result && !loading && (
                <div
                  className="result-card"
                  style={{
                    background: resultBg,
                    borderColor:
                      result === "Resistant"
                        ? "rgba(220,38,38,0.18)"
                        : "rgba(22,163,74,0.18)",
                  }}
                >
                  <div
                    className="result-badge"
                    style={{
                      background:
                        result === "Resistant"
                          ? "rgba(220,38,38,0.08)"
                          : "rgba(22,163,74,0.08)",
                      color: resultColor,
                    }}
                  >
                    {result === "Resistant" ? "High Risk" : "Low Risk"}
                  </div>

                  <div
                    className="result-title"
                    style={{ color: resultColor }}
                  >
                    {result === "Resistant"
                      ? "Antibiotic Resistance Detected"
                      : "No Resistance Detected"}
                  </div>

                  <div className="result-title" style={{ color: resultColor }}>
                    {result}
                  </div>

                  {confidence !== null && (
                    <>
                      <div className="confidence-row">
                        Confidence: {(confidence * 100).toFixed(2)}%
                      </div>

                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${confidence * 100}%`,
                            background: resultColor,
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="panel">
              <div className="small-heading">Model Notes</div>
              <ul className="notes-list">
                <li>Input is sanitized before inference.</li>
                <li>Only A, T, G, and C characters are accepted.</li>
                <li>Confidence is derived from model probability output.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .page-shell {
          min-height: 100vh;
          width: 100%;
          background:
            radial-gradient(circle at top left, rgba(186,230,253,0.45), transparent 28%),
            radial-gradient(circle at top right, rgba(167,243,208,0.35), transparent 24%),
            linear-gradient(135deg, #f8fbff 0%, #eef7ff 45%, #ffffff 100%);
          color: #0f172a;
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        .page-inner {
          width: min(1280px, calc(100vw - 32px));
          margin: 0 auto;
          padding: 18px 0 24px;
          box-sizing: border-box;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 14px;
        }

        .brand {
          font-size: 1.45rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0f172a;
        }

        .brand-sub {
          font-size: 0.74rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #64748b;
          margin-top: 2px;
        }

        .status-pill {
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.76);
          border: 1px solid rgba(148,163,184,0.2);
          box-shadow: 0 8px 24px rgba(15,23,42,0.06);
          color: #475569;
          font-size: 0.88rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .hero-card,
        .panel {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(148,163,184,0.18);
          box-shadow: 0 24px 60px rgba(15,23,42,0.08);
          border-radius: 26px;
        }

        .hero-card {
          padding: 22px 24px;
          margin-bottom: 16px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(37,99,235,0.08);
          color: #2563eb;
          font-weight: 700;
          font-size: 0.8rem;
          margin-bottom: 12px;
        }

        .hero-title {
          font-size: clamp(1.9rem, 3vw, 3rem);
          line-height: 1.02;
          margin: 0;
          letter-spacing: -0.04em;
          font-weight: 800;
          color: #0f172a;
        }

        .hero-title-gradient {
          background: linear-gradient(90deg, #2563eb 0%, #0ea5e9 45%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-text {
          margin-top: 12px;
          margin-bottom: 0;
          color: #475569;
          font-size: 0.98rem;
          line-height: 1.65;
          max-width: 760px;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 1.18fr 0.82fr;
          gap: 16px;
          align-items: start;
        }

        .panel {
          padding: 20px;
          box-sizing: border-box;
        }

        .side-col {
          display: grid;
          gap: 16px;
        }

        .panel-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .panel-title,
        .small-heading {
          font-size: 0.9rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #64748b;
        }

        .link-btn {
          background: transparent;
          border: none;
          color: #2563eb;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
        }

        .sequence-box {
          width: 100%;
          resize: vertical;
          min-height: 230px;
          max-height: 320px;
          padding: 16px;
          border-radius: 18px;
          border: 1px solid rgba(148,163,184,0.25);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.94rem;
          line-height: 1.55;
          background: rgba(248,250,252,0.92);
          color: #0f172a;
          outline: none;
          box-sizing: border-box;
          box-shadow: inset 0 1px 2px rgba(15,23,42,0.03);
        }

        .meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-top: 10px;
          margin-bottom: 12px;
        }

        .meta-text {
          color: #64748b;
          font-size: 0.9rem;
        }

        .meta-strong {
          font-weight: 700;
          color: #334155;
        }

        .predict-btn {
          width: 100%;
          padding: 14px 18px;
          border-radius: 16px;
          border: none;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: white;
          font-weight: 800;
          font-size: 1rem;
          letter-spacing: -0.01em;
          cursor: pointer;
          box-shadow: 0 14px 30px rgba(37,99,235,0.22);
          transition: all 0.2s ease;
        }

        .predict-btn:disabled {
          background: linear-gradient(135deg, #94a3b8, #cbd5e1);
          cursor: not-allowed;
          box-shadow: none;
        }

        .error-box {
          margin-top: 12px;
          padding: 12px 14px;
          border-radius: 14px;
          background: rgba(254,242,242,0.95);
          border: 1px solid rgba(248,113,113,0.22);
          color: #b91c1c;
          font-weight: 600;
        }

        .empty-state {
          min-height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #64748b;
          border-radius: 18px;
          background: rgba(248,250,252,0.8);
          border: 1px dashed rgba(148,163,184,0.28);
          padding: 20px;
        }

        .loading-state {
          min-height: 180px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
        }

        .spinner {
          width: 46px;
          height: 46px;
          border-radius: 999px;
          border: 4px solid rgba(37,99,235,0.15);
          border-top-color: #2563eb;
          animation: spin 1s linear infinite;
        }

        .loading-text {
          color: #475569;
          font-weight: 600;
        }

        .result-card {
          border-radius: 22px;
          padding: 20px;
          border: 1px solid;
          box-shadow: 0 14px 30px rgba(15,23,42,0.05);
        }

        .result-badge {
          display: inline-flex;
          align-items: center;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 800;
          margin-bottom: 14px;
        }

        .result-title {
          font-size: 1.9rem;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .confidence-row {
          margin-top: 16px;
          color: #475569;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .progress-track {
          margin-top: 10px;
          height: 10px;
          background: rgba(148,163,184,0.18);
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.45s ease;
        }

        .notes-list {
          margin: 0;
          padding-left: 18px;
          color: #475569;
          line-height: 1.75;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 960px) {
          .page-inner {
            width: min(100vw - 24px, 1280px);
            padding-top: 14px;
          }

          .main-grid {
            grid-template-columns: 1fr;
          }

          .sequence-box {
            min-height: 200px;
          }
        }

        @media (max-width: 640px) {
          .topbar {
            flex-direction: column;
            align-items: flex-start;
          }

          .hero-card,
          .panel {
            border-radius: 22px;
          }

          .page-inner {
            width: calc(100vw - 20px);
          }
        }
      `}</style>
    </div>
  );
}
