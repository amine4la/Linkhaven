globalThis.SurfShieldConfig = {
  scoring: {
    displayThreshold: 3
  },
  reasonCodes: {
    insecureHttp: 655,
    urlCredentials: 711,
    encodedNullByte: 712,
    encodedControlChars: 713,
    suspiciousKeyword: 715,
    longDomain: 718,
    domainDifference: 719
  },
  weights: {
    insecureHttp: 3,
    urlCredentials: 4,
    encodedNullByte: 4,
    encodedControlChars: 3,
    riskyTld: 2,
    suspiciousKeyword: 2,
    longDomain: 3,
    domainDifference: 5
  },
  domainDifference: {
    maxEditDistance: 2,
    minLabelLength: 6
  },
  lists: {
    suspiciousKeywords: [
      "login",
      "secure",
      "verify",
      "update",
      "account",
      "billing",
      "support"
    ],
  }
  , domainsToTestDifferenceOf:[
    "paypal.com",
    "google.com",
    "facebook.com",
    "apple.com",
    "amazon.com",
    "microsoft.com",
    "bankofamerica.com",
    "wellsfargo.com",
    "chase.com",
    "netflix.com",
    "RBC.COM",
    "TD.COM",
    "CIBC.COM",
    "SCOTIABANK.COM",
    "BMO.COM",
    "HSBC.COM",
    "GMAIL.COM",
    "YAHOO.COM",
    "OUTLOOK.COM",
    "LINKEDIN.COM",
    "TWITTER.COM"
  ]
};
