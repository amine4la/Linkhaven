const checks = [
  "Check large database of known scam sites",
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
  "Policy and trust-page cues",
];

function App() {
  return (
    <div className="page">
      <header className="hero">
        <div className="badge">Launching soon for Chrome</div>
        <h1>Fight phishing with instant, human-readable safety warnings.</h1>
        <p>
          SurfShield helps families protect parents and grandparents online. If
          a website looks like a bank scam, we show a clear warning at the top
          before they type anything sensitive.
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
          <h2>12 safety checks that catch common phishing tricks.</h2>
          <p className="section-copy">
            Built for regular people, not security experts. SurfShield focuses
            on obvious scam patterns and gives simple warnings.
          </p>

          <div className="check-list">
            {checks.map((item) => (
              <span key={item} className="check-pill">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="flow-section" aria-label="Bank phishing example">
          <p className="section-label">Real-life example</p>
          <h2>Dad clicks a fake bank link. SurfShield steps in fast.</h2>
          <p className="section-copy">
            He thinks he opened his bank, but the web address is slightly wrong.
            SurfShield spots it and shows a warning before he signs in.
          </p>
          <div className="example-strip">
            <p>
              Looks real:{" "}
              <span className="dim">bankofamerica-secure-login.com</span>
            </p>
            <p className="warn">
              SurfShield warning: This site may be pretending to be your bank.
              Do not enter your password.
            </p>
          </div>
        </section>

        <section id="how-it-works" className="flow-section">
          <p className="section-label">User experience</p>
          <h2>Simple warning banner. Clear reason. No tech jargon.</h2>
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
