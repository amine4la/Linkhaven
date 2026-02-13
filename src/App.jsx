const checks = [
  "Domain reputation",
  "Typosquatting detection",
  "Homoglyph detection",
  "Stealth redirect checks",
  "Spoofed link mismatch",
  "Subdomain deception checks",
  "Suspicious TLD signals",
  "Certificate and HTTPS sanity",
  "Domain age context",
  "Form and credential trap signals",
  "Known threat feed matching",
  "Policy and trust-page cues",
];

function App() {
  return (
    <div className="page">
      <header className="hero">
        <div className="badge">Launching soon for Chrome</div>
        <h1>Fight phishing with instant, human-readable safety warnings.</h1>
        <p>
          SurfShield is a browser safety extension that runs dozens of website
          checks in real time and warns users with a clear top-page banner when
          risk is detected.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#mvp-checks">
            View 12 core checks
          </a>
          <a className="btn btn-secondary" href="#how-it-works">
            How it works
          </a>
        </div>
      </header>

      <main>
        <section id="mvp-checks" className="flow-section">
          <p className="section-label">Core features</p>
          <h2>12 practical checks, built for everyday users.</h2>
          <p className="section-copy">
            The first release focuses on the highest-impact phishing patterns,
            balancing strong detection with low false alarms.
          </p>

          <div className="check-list">
            {checks.map((item) => (
              <span key={item} className="check-pill">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="flow-section">
          <p className="section-label">User experience</p>
          <h2>Simple warning banner. Clear reason. Fast decision.</h2>
          <ol className="flow-steps">
            <li>
              <h3>Scan</h3>
              <p>
                Every page and critical link is evaluated against domain,
                structure, and trust signals.
              </p>
            </li>
            <li>
              <h3>Flag</h3>
              <p>
                If risk is found, SurfShield places a clear warning banner at
                the top with severity and reason.
              </p>
            </li>
            <li>
              <h3>Protect</h3>
              <p>
                Users get plain-language guidance to continue carefully or leave
                the page right away.
              </p>
            </li>
          </ol>
        </section>
      </main>

      <footer className="footer">
        <p>
          SurfShield helps users stay one step ahead of phishing scams online.
          Early access opening soon.
        </p>
      </footer>
    </div>
  );
}

export default App;
