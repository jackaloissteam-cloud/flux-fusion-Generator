import { useMemo, useState } from 'react';
import {
  Check,
  Clipboard,
  Command,
  Copy,
  Info,
  Layers3,
  RotateCcw,
  Sparkles,
  WandSparkles,
} from 'lucide-react';

type OptionKey =
  | 'motif'
  | 'artistA'
  | 'artistB'
  | 'fusion'
  | 'composition'
  | 'lighting'
  | 'palette'
  | 'detail';

type FormState = Record<OptionKey, string>;

const options: Record<OptionKey, { label: string; values: string[] }> = {
  motif: {
    label: 'Motiv',
    values: ['Portrait', 'Landschaft', 'Sci-Fi', 'Fantasy', 'Surrealismus', 'Architektur'],
  },
  artistA: {
    label: 'Künstler A (Basisstil)',
    values: [
      'J.M.W. Turner',
      'John Berkey',
      'Zdzisław Beksiński',
      'Caravaggio',
      'Roy Lichtenstein',
      'Romero Britto',
      'Atey Ghailan',
      'Krenz Cushart',
      'Ray Caesar',
      'Takeshi Obata',
    ],
  },
  artistB: {
    label: 'Künstler B (Fusion)',
    values: [
      'John Berkey',
      'J.M.W. Turner',
      'Zdzisław Beksiński',
      'Caravaggio',
      'Roy Lichtenstein',
      'Romero Britto',
      'Atey Ghailan',
      'Krenz Cushart',
      'Ray Caesar',
      'Takeshi Obata',
    ],
  },
  fusion: {
    label: 'Fusionstyp',
    values: [
      'Atmosphärische Sci-Fi-Romantik',
      'Düstere Manga-Surrealwelt',
      'Neon-Pop-Comic',
      'Barock-Fashion-Manga',
      'Cinematic Dark Fantasy',
      'Digital Surreal Couture',
    ],
  },
  composition: {
    label: 'Komposition',
    values: ['Weitwinkel', 'Close-Up', 'Dramatische Perspektive', 'Zentralperspektive', 'Vogelperspektive'],
  },
  lighting: {
    label: 'Licht',
    values: ['Cinematic Lighting', 'Golden Hour', 'Chiaroscuro', 'Soft Diffused Light', 'Hard Rim Light'],
  },
  palette: {
    label: 'Farbwelt',
    values: ['Gedämpft', 'Neon', 'Pastell', 'Erdig', 'Monochrom'],
  },
  detail: {
    label: 'Detailgrad',
    values: ['Hyperdetailliert', 'Malerisch', 'Fotorealistisch', 'Minimalistisch'],
  },
};

const initialState: FormState = Object.fromEntries(
  Object.entries(options).map(([key, config]) => [key, config.values[0]]),
) as FormState;

const fieldOrder: OptionKey[] = ['motif', 'artistA', 'artistB', 'fusion', 'composition', 'lighting', 'palette', 'detail'];

function App() {
  const [form, setForm] = useState<FormState>(initialState);
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<'idle' | 'generated' | 'copied' | 'error'>('idle');

  const promptLength = useMemo(() => prompt.length, [prompt]);

  function updateField(key: OptionKey, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    if (status !== 'idle') setStatus('idle');
  }

  function generatePrompt() {
    const nextPrompt =
      `${form.motif} im Stil von ${form.artistA} + ${form.artistB}, ` +
      `Fusion: ${form.fusion}, ` +
      `Komposition: ${form.composition}, ` +
      `Licht: ${form.lighting}, ` +
      `Farbwelt: ${form.palette}, ` +
      `Detailgrad: ${form.detail}, ` +
      'Rendering: hochauflösend, sauber, klar.';
    setPrompt(nextPrompt);
    setStatus('generated');
    window.setTimeout(() => document.getElementById('prompt-output')?.focus(), 0);
  }

  async function copyPrompt() {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setStatus('copied');
    } catch {
      setStatus('error');
    }
  }

  function resetAll() {
    setForm(initialState);
    setPrompt('');
    setStatus('idle');
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" data-testid="link-home" aria-label="Flux Stil-Fusion Generator Startseite">
          <span className="brand-mark" aria-hidden="true"><WandSparkles size={18} strokeWidth={1.8} /></span>
          <span>flux / studio</span>
        </a>
        <nav className="topnav" aria-label="Hauptnavigation">
          <a className="nav-link" href="#studio" data-testid="link-studio">Generator</a>
          <a className="nav-link" href="#about" data-testid="link-about">Arbeitsweise</a>
          <button className="nav-button" type="button" onClick={resetAll} data-testid="button-reset-top">
            <RotateCcw size={14} />
            Zurücksetzen
          </button>
        </nav>
      </header>

      <main className="page-content">
        <section className="hero" id="about" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">Kreativwerkzeug / 01</p>
            <h1 id="page-title">Stile kreuzen.<br /><em>Welten öffnen.</em></h1>
            <p className="hero-copy">
              Ein fokussierter Prompt-Generator für Bildideen mit eigener Handschrift. Kombiniere zwei visuelle Stimmen und gib deiner nächsten Szene eine Richtung.
            </p>
          </div>
          <div className="hero-stamp" aria-label="Motto: Make the unexpected visible">
            <span className="stamp-dot one" />
            <span className="stamp-dot two" />
            <span className="stamp-text">make the<br />unexpected<br />visible</span>
          </div>
        </section>

        <section className="workspace" id="studio" aria-label="Prompt Studio">
          <div className="panel controls-panel">
            <div className="panel-heading">
              <div>
                <p className="panel-kicker">Deine Zutaten</p>
                <h2 className="panel-title">Baue deine Fusion</h2>
              </div>
              <span className="step-count">08 Parameter</span>
            </div>

            <div className="field-grid">
              {fieldOrder.map((key, index) => {
                const config = options[key];
                return (
                  <div className={`field ${key === 'fusion' ? 'field-wide' : ''}`} key={key}>
                    <label className="field-label" htmlFor={`select-${key}`}>
                      {config.label}
                      <span>{String(index + 1).padStart(2, '0')}</span>
                    </label>
                    <div className="select-wrap">
                      <select
                        className="field-select"
                        id={`select-${key}`}
                        value={form[key]}
                        onChange={(event) => updateField(key, event.target.value)}
                        data-testid={`select-${key}`}
                      >
                        {config.values.map((value) => <option value={value} key={value}>{value}</option>)}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="controls-footer">
              <div className="hint"><Info size={14} /> Alle Werte bleiben in deinem Browser.</div>
              <button className="action-button" type="button" onClick={generatePrompt} data-testid="button-generate">
                <Sparkles size={16} />
                Prompt erzeugen
              </button>
            </div>
          </div>

          <div className="panel output-panel" aria-live="polite">
            <div className="output-top">
              <div>
                <p className="panel-kicker">Dein Ergebnis</p>
                <h2 className="panel-title">Prompt Canvas</h2>
              </div>
              <span className="output-mark" aria-hidden="true"><Layers3 size={18} /></span>
            </div>

            {!prompt ? (
              <div className="output-empty" data-testid="empty-output">
                <Command size={26} strokeWidth={1.4} />
                <p>Wähle deine Zutaten und klicke auf „Prompt erzeugen“.<br />Deine Bildidee wartet schon.</p>
              </div>
            ) : (
              <div className="prompt-box">
                <textarea
                  id="prompt-output"
                  className="prompt-text"
                  value={prompt}
                  readOnly
                  aria-label="Generierter Prompt"
                  data-testid="textarea-output"
                />
                <div className="prompt-meta">
                  <span>{promptLength} Zeichen / DE</span>
                  <button className="copy-button" type="button" onClick={copyPrompt} data-testid="button-copy">
                    {status === 'copied' ? <Check size={14} /> : <Copy size={14} />}
                    {status === 'copied' ? 'Kopiert' : 'Kopieren'}
                  </button>
                </div>
              </div>
            )}

            <div className="output-actions">
              <span className={`status-message ${status === 'error' ? 'error' : ''}`} data-testid="status-message">
                {status === 'generated' && <><Check size={13} /> Prompt bereit</>}
                {status === 'copied' && <><Check size={13} /> In die Zwischenablage kopiert</>}
                {status === 'error' && <><Clipboard size={13} /> Kopieren nicht möglich — bitte Text markieren</>}
                {status === 'idle' && 'Noch kein Prompt erzeugt'}
              </span>
              <button className="text-button" type="button" onClick={resetAll} data-testid="button-reset">
                <RotateCcw size={13} /> Alles zurücksetzen
              </button>
            </div>
          </div>
        </section>

        <section className="notes-strip" aria-label="Hinweise zur Arbeitsweise">
          <div className="note-item">
            <span className="note-number">01</span>
            <div><strong>Basis trifft Kontrast</strong><p>Der erste Stil gibt deiner Szene Haltung. Der zweite bringt Reibung.</p></div>
          </div>
          <div className="note-item">
            <span className="note-number">02</span>
            <div><strong>Weniger ist präziser</strong><p>Jede Auswahl ist ein bewusst gesetzter Impuls für dein Modell.</p></div>
          </div>
          <div className="note-item">
            <span className="note-number">03</span>
            <div><strong>Direkt weiterarbeiten</strong><p>Prompt kopieren und dort einsetzen, wo deine Bilder entstehen.</p></div>
          </div>
        </section>

        <footer className="footer">
          <span>Flux Stil-Fusion Generator</span>
          <span>Ein kleines Studio für große Bilder</span>
        </footer>
      </main>
    </div>
  );
}

export default App;