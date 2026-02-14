(() => {
  // Not current window,do nothing
  if (window.top !== window.self) return;

  // Store our link as the domain 
  const href = window.location.href;
  if (!href || href === "about:blank") return; // Do nothing if blank 

  // Only run on http or https sites
  const protocol = window.location.protocol;
  if (!/^https?:$/.test(protocol)) return;

  // Evaluate our href link 
  const summary = globalThis.SurfShieldScoring.evaluate(href); // Returns an object with our checks completed
  if (!summary.shouldDisplay) return; // Do not display, end early

  // Retrieve reasons from summary
  const reasons = summary.reasons.map((item) => {
    const reasonMeta = globalThis.SurfShieldReasons[item.reason] || {
      title: `Reason ${item.reason}`,
      description: "No description available."
    };
    return {
      code: item.reason,
      weight: item.weight,
      title: reasonMeta.title,
      description: reasonMeta.description
    };
  });

  // if we have an existing banner
  const existing = document.getElementById("surfshield-risk-banner");
  if (existing) existing.remove();

  const severity =
    summary.totalScore >= 9
      ? "critical"
      : summary.totalScore >= 6
        ? "warning"
        : "caution";

  const paletteBySeverity = {
    critical: {
      from: "#2f1114",
      to: "#16161d",
      accent: "#f87171",
      softAccent: "rgba(248, 113, 113, 0.28)",
      text: "#fee2e2",
      muted: "#fecaca"
    },
    warning: {
      from: "#3a2a0f",
      to: "#17161d",
      accent: "#fbbf24",
      softAccent: "rgba(251, 191, 36, 0.26)",
      text: "#fef3c7",
      muted: "#fde68a"
    },
    caution: {
      from: "#13253b",
      to: "#17161d",
      accent: "#60a5fa",
      softAccent: "rgba(96, 165, 250, 0.26)",
      text: "#dbeafe",
      muted: "#bfdbfe"
    }
  };
  const palette = paletteBySeverity[severity];

  const banner = document.createElement("section");
  banner.id = "surfshield-risk-banner";
  banner.setAttribute("role", "alert");
  banner.style.cssText = [
    "position: fixed",
    "top: 12px",
    "left: 12px",
    "right: 12px",
    "z-index: 2147483647",
    "display: flex",
    "justify-content: center",
    "pointer-events: none",
    "font-family: Manrope, Segoe UI, system-ui, sans-serif",
    "box-sizing: border-box"
  ].join("; ");

  const card = document.createElement("div");
  card.style.cssText = [
    "width: min(980px, 100%)",
    "pointer-events: auto",
    "border-radius: 16px",
    `border: 1px solid ${palette.softAccent}`,
    `border-left: 6px solid ${palette.accent}`,
    `background: linear-gradient(135deg, ${palette.from} 0%, ${palette.to} 100%)`,
    `color: ${palette.text}`,
    "padding: 14px 16px 12px",
    "box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4)",
    "backdrop-filter: blur(8px)"
  ].join("; ");

  const header = document.createElement("div");
  header.style.cssText = [
    "display: flex",
    "align-items: flex-start",
    "justify-content: space-between",
    "gap: 10px"
  ].join("; ");

  const headingWrap = document.createElement("div");
  const title = document.createElement("div");
  title.textContent = "SurfShield detected risky signals";
  title.style.cssText = "font-size: 15px; font-weight: 800; letter-spacing: 0.1px;";
  headingWrap.appendChild(title);

  const subtitle = document.createElement("div");
  subtitle.textContent = `Score ${summary.totalScore} • ${reasons.length} flag${reasons.length === 1 ? "" : "s"}`;
  subtitle.style.cssText = `margin-top: 2px; font-size: 12px; color: ${palette.muted};`;
  headingWrap.appendChild(subtitle);

  const severityPill = document.createElement("span");
  severityPill.textContent = severity.toUpperCase();
  severityPill.style.cssText = [
    "display: inline-block",
    "margin-top: 8px",
    "padding: 3px 8px",
    "font-size: 11px",
    "font-weight: 700",
    "letter-spacing: 0.4px",
    `border: 1px solid ${palette.softAccent}`,
    "border-radius: 999px",
    `color: ${palette.text}`,
    "background: rgba(255, 255, 255, 0.08)"
  ].join("; ");
  headingWrap.appendChild(severityPill);

  const dismissButton = document.createElement("button");
  dismissButton.type = "button";
  dismissButton.textContent = "Dismiss";
  dismissButton.style.cssText = [
    "border: 1px solid rgba(255, 255, 255, 0.22)",
    "background: rgba(255, 255, 255, 0.06)",
    "color: inherit",
    "font: inherit",
    "font-size: 12px",
    "font-weight: 600",
    "padding: 6px 10px",
    "border-radius: 10px",
    "cursor: pointer"
  ].join("; ");
  dismissButton.addEventListener("click", () => {
    banner.remove();
    document.documentElement.style.scrollPaddingTop = "";
  });

  header.appendChild(headingWrap);
  header.appendChild(dismissButton);
  card.appendChild(header);

  const reasonsWrap = document.createElement("div");
  reasonsWrap.style.cssText = [
    "display: grid",
    "gap: 8px",
    "margin-top: 10px",
    "max-height: 180px",
    "overflow: auto"
  ].join("; ");

  for (const reason of reasons) {
    const row = document.createElement("div");
    row.style.cssText = [
      "display: grid",
      "grid-template-columns: auto 1fr",
      "gap: 10px",
      "align-items: start",
      "padding: 8px 10px",
      "border-radius: 10px",
      "background: rgba(255, 255, 255, 0.06)",
      "border: 1px solid rgba(255, 255, 255, 0.08)"
    ].join("; ");

    const weight = document.createElement("span");
    weight.textContent = String(reason.weight);
    weight.style.cssText = [
      "display: inline-flex",
      "align-items: center",
      "justify-content: center",
      "min-width: 28px",
      "height: 22px",
      "border-radius: 8px",
      `background: ${palette.softAccent}`,
      "font-size: 11px",
      "font-weight: 800"
    ].join("; ");
    row.appendChild(weight);

    const textWrap = document.createElement("div");
    const reasonTitle = document.createElement("div");
    reasonTitle.textContent = reason.title;
    reasonTitle.style.cssText = "font-size: 13px; font-weight: 700;";
    textWrap.appendChild(reasonTitle);

    const reasonDesc = document.createElement("div");
    reasonDesc.textContent = reason.description;
    reasonDesc.style.cssText = `margin-top: 2px; font-size: 12px; color: ${palette.muted};`;
    textWrap.appendChild(reasonDesc);

    row.appendChild(textWrap);
    reasonsWrap.appendChild(row);
  }

  card.appendChild(reasonsWrap);
  banner.appendChild(card);

  // Add to DOM
  const attachBanner = () => {
    if (!document.body) return;
    document.body.prepend(banner);
    const height = Math.ceil(banner.getBoundingClientRect().height + 16);
    document.documentElement.style.scrollPaddingTop = `${height}px`;
  };

  if (document.body) {
    attachBanner();
  } else {
    document.addEventListener("DOMContentLoaded", attachBanner, { once: true });
  }
})();
