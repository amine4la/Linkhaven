// Decode URL to catch decoding phising tactics
function decodeUpToTwoTimes(input) {
  let value = input || "";
  for (let i = 0; i < 2; i += 1) {
    try {
      const decoded = decodeURIComponent(value);
      if (decoded === value) break;
      value = decoded;
    } catch {
      break;
    }
  }
  return value;
}

// Basic format that returns an array of a result
function result(triggered, weight, reason) {
  return { triggered, weight, reason };
}

function normalizeHost(hostname) {
  return (hostname || "").toLowerCase().replace(/^www\./, "");
}

function getApexDomain(hostname) {
  const parts = normalizeHost(hostname).split(".").filter(Boolean);
  if (parts.length <= 2) return parts.join(".");
  return parts.slice(-2).join(".");
}

function getSecondLevelLabel(apexDomain) {
  const parts = (apexDomain || "").split(".");
  return parts.length >= 2 ? parts[0] : "";
}

function getTld(apexDomain) {
  const parts = (apexDomain || "").split(".");
  return parts.length >= 2 ? parts[1] : "";
}

function levenshteinDistance(a, b) {
  const left = a || "";
  const right = b || "";
  if (left === right) return 0;
  if (!left.length) return right.length;
  if (!right.length) return left.length;

  const prev = new Array(right.length + 1);
  const curr = new Array(right.length + 1);

  for (let j = 0; j <= right.length; j += 1) prev[j] = j;

  for (let i = 1; i <= left.length; i += 1) {
    curr[0] = i;
    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1] + 1,
        prev[j] + 1,
        prev[j - 1] + cost
      );
    }
    for (let j = 0; j <= right.length; j += 1) prev[j] = curr[j];
  }

  return prev[right.length];
}

// All individual checks and functions
globalThis.SurfShieldChecks = {
  insecureHttp({ href }) {
    const triggered = (href || "").startsWith("http://");
    return result(
      triggered,
      globalThis.SurfShieldConfig.weights.insecureHttp,
      globalThis.SurfShieldConfig.reasonCodes.insecureHttp
    );
  },

  urlCredentials({ url }) {
    const triggered = Boolean(url && (url.username || url.password));
    return result(
      triggered,
      globalThis.SurfShieldConfig.weights.urlCredentials,
      globalThis.SurfShieldConfig.reasonCodes.urlCredentials
    );
  },

  encodedNullByte({ href }) {
    const normalized = decodeUpToTwoTimes(href).toLowerCase();
    const triggered =
      normalized.includes("%00") || normalized.includes("\u0000");
    return result(
      triggered,
      globalThis.SurfShieldConfig.weights.encodedNullByte,
      globalThis.SurfShieldConfig.reasonCodes.encodedNullByte
    );
  },

  encodedControlChars({ href }) {
    const normalized = decodeUpToTwoTimes(href).toLowerCase();
    const triggered =
      normalized.includes("%0a") ||
      normalized.includes("%0d") ||
      normalized.includes("%09") ||
      normalized.includes("\n") ||
      normalized.includes("\r") ||
      normalized.includes("\t");
    return result(
      triggered,
      globalThis.SurfShieldConfig.weights.encodedControlChars,
      globalThis.SurfShieldConfig.reasonCodes.encodedControlChars
    );
  },
  longUrl({ hostname, href }) {
    let domain = (hostname || "").toLowerCase();
    if (!domain && href) {
      try {
        domain = new URL(href).hostname.toLowerCase();
      } catch {
        domain = "";
      }
    }

    const triggered = domain.length > 30;
    return result(
      triggered,
      globalThis.SurfShieldConfig.weights.longDomain,
      globalThis.SurfShieldConfig.reasonCodes.longDomain
    );
  },
  domainDifference({ hostname, href, url }) {
    let domain = normalizeHost(hostname);
    if (!domain && url?.hostname) {
      domain = normalizeHost(url.hostname);
    }
    if (!domain && href) {
      try {
        domain = normalizeHost(new URL(href).hostname);
      } catch {
        domain = "";
      }
    }

    if (!domain) {
      return result(
        false,
        globalThis.SurfShieldConfig.weights.domainDifference,
        globalThis.SurfShieldConfig.reasonCodes.domainDifference
      );
    }

    const candidateApex = getApexDomain(domain);
    const candidateLabel = getSecondLevelLabel(candidateApex);
    const candidateTld = getTld(candidateApex);

    if (
      candidateLabel.length < globalThis.SurfShieldConfig.domainDifference.minLabelLength
    ) {
      return result(
        false,
        globalThis.SurfShieldConfig.weights.domainDifference,
        globalThis.SurfShieldConfig.reasonCodes.domainDifference
      );
    }

    const brandDomains = globalThis.SurfShieldConfig.domainsToTestDifferenceOf || [];
    for (const brandDomainRaw of brandDomains) {
      const brandApex = getApexDomain(brandDomainRaw);
      if (!brandApex || brandApex === candidateApex) continue;

      const brandLabel = getSecondLevelLabel(brandApex);
      const brandTld = getTld(brandApex);
      if (!brandLabel || candidateTld !== brandTld) continue;

      const distance = levenshteinDistance(candidateLabel, brandLabel);
      if (distance > 0 && distance <= globalThis.SurfShieldConfig.domainDifference.maxEditDistance) {
        return result(
          true,
          globalThis.SurfShieldConfig.weights.domainDifference,
          globalThis.SurfShieldConfig.reasonCodes.domainDifference
        );
      }
    }

    return result(
      false,
      globalThis.SurfShieldConfig.weights.domainDifference,
      globalThis.SurfShieldConfig.reasonCodes.domainDifference
    );
  },
  suspiciousKeyword({ hostname }) {
    const lowerHost = (hostname || "").toLowerCase();
    const triggered = globalThis.SurfShieldConfig.lists.suspiciousKeywords.some(
      (keyword) => lowerHost.includes(keyword)
    );
    return result(
      triggered,
      globalThis.SurfShieldConfig.weights.suspiciousKeyword,
      globalThis.SurfShieldConfig.reasonCodes.suspiciousKeyword
    );
  }
};
