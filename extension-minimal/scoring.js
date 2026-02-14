globalThis.SurfShieldScoring = {
  
  evaluate(href) {
    //Parse URL
    let parsedUrl = null;
    try {
      parsedUrl = new URL(href);
    } catch {
      parsedUrl = null;
    }
    // Provide all needed URL types 
    const context = {
      href: href || "",
      url: parsedUrl,
      hostname: parsedUrl?.hostname || ""
    };
    // Retrieve all checks 
    const checks = Object.values(globalThis.SurfShieldChecks || {});
    const reasons = []; // Make empty array with reasons
    let totalScore = 0; // Default is 0 risk score

    // Loop through all check, run on functions, and if triggered add to our reasons and total score
    for (const check of checks) {
      if (typeof check !== "function") continue;
      const outcome = check(context);
      if (!outcome || outcome.triggered !== true) continue;

      const weight = Number(outcome.weight) || 0;
      const reason = Number(outcome.reason) || 0;
      totalScore += weight;
      reasons.push({ reason, weight });
    }
    // Sort by highest weight (largest risk) first
    reasons.sort((a, b) => b.weight - a.weight);
    // Return if shouldDisplay, riskScore, and all individual triggered reasons
    return {
      shouldDisplay: totalScore >= globalThis.SurfShieldConfig.scoring.displayThreshold,
      totalScore,
      reasons
    };
  }
};
