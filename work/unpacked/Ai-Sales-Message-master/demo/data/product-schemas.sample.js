// Product metadata for the AI Sales Message demo.
// Generated from the Trade Builder's builder/data/product-schemas.js — all 71
// structures, same source Feature 1 uses. Per product this keeps: name,
// classification, family, dropdownFamily, the real scheduleColumns
// (key/label/type, derived/computed columns dropped), sampleDefaults for
// those columns, a sample pair/notional currency from header, and the real
// termsheet copy (outline/benefits/risks) with bullet prefixes stripped the
// same way the builder's renderTextLists() does. Outline/benefits/risks may
// still contain {PAIR}/{BASE}/{QUOTE}/{NOTIONAL} placeholders — substituted
// at render time by substTermsheetPlaceholders() in app.js, mirroring the
// builder's termsheetCopyForProduct().
window.DEMO_PRODUCT_SCHEMAS = {
  "FEC": {
    "name": "FEC",
    "classification": "Protect",
    "family": "fec",
    "dropdownFamily": "Linear / Vanilla",
    "pair": "AUDCNH",
    "notionalCcy": "CNH",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "forwardRate",
        "label": "FEC Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "forwardRate": 0.6545
    },
    "termsheet": {
      "outline": [
        "A Forward Exchange Contract (FEC) is a binding agreement between you and us in which one currency is sold or bought against another currency at an agreed Exchange Rate on an agreed date beyond two Business Days in the future."
      ],
      "benefits": [
        "A FEC enables you to fix Exchange Rates to Hedge your currency exposure by providing protection against unfavourable Exchange Rate movements between the day you and we agree to an FEC (the \"Trade Date\") and the day when payment for currency is made (the \"Value Date\")."
      ],
      "risks": [
        "An FEC does not provide any opportunity to participate in a favourable market move."
      ]
    }
  },
  "SWAP": {
    "name": "SWAP",
    "classification": "n/a",
    "family": "swap",
    "dropdownFamily": "Linear / Vanilla",
    "pair": "USDHKD",
    "notionalCcy": "",
    "fields": [
      {
        "key": "swapSpotDate",
        "label": "Swap Spot",
        "type": "date",
        "required": true
      },
      {
        "key": "maturityDate",
        "label": "Maturity",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "spotRate",
        "label": "Spot Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "swapRate",
        "label": "Swap Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "clientGets",
        "label": "Client Gets:",
        "type": "text",
        "required": false
      }
    ],
    "sampleDefaults": {
      "swapSpotDate": "2026-06-11",
      "maturityDate": "2026-12-11",
      "notional": 1000000,
      "spotRate": 0.6589,
      "swapRate": 0.6512,
      "clientGets": "7700"
    },
    "termsheet": {
      "outline": [
        "A Swap is a customised contract between you and us that obligates you to buy and sell an amount of currency on two specified dates. The first date is the Swap Spot Date, and the second date is in the future (Maturity Date). A Swap allows you to lock in a specific exchange rate today, to buy and sell a currency and sell and buy the currency in the future at the Swap Rate. The differences in the Reference Spot Rate and the Swap Rate are determined by the differences in interest rates between the currencies being swapped, which is also known as the Interest Rate Differential."
      ],
      "benefits": [
        "Reduce the Volatility in currency holdings by providing greater certainty with cash flows.",
        "Offset unfavourable outcomes in overall hedging portfolio.",
        "Optimise cash flow for efficient use of funds."
      ],
      "risks": [
        "If you enter into a Swap, you will not be able to participate in any favorable Exchange Rates for that transaction.",
        "Cancellations or adjustments will result in a cost to you.",
        "we are not obligated to cancel or reverse the Swap prior to the Maturity Date.",
        "The Swap transacted with we cannot be transacted with anyone else.",
        "As further set out in section 11 “Risks of we products” of this PDS."
      ]
    }
  },
  "Vanilla": {
    "name": "Vanilla",
    "classification": "Protect",
    "family": "vanilla",
    "dropdownFamily": "Linear / Vanilla",
    "pair": "AUDEUR",
    "notionalCcy": "EUR",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "pips",
        "label": "Pips/%",
        "type": "number",
        "required": false
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "protectionRate": 0.64
    },
    "termsheet": {
      "outline": [
        "A Vanilla Option is an agreement between two parties (in this case, with we as “the buyer” of the Vanilla Option and you as the “the seller” of the  Vanilla Option) that gives the buyer the right but not the obligation to exchange an amount of one currency for an amount of another currency at an agreed Exchange Rate on an agreed date in the future (Expiry Date). A Vanilla Option may be a Put Option (a right to sell currency) or a Call Option (a right to buy currency)."
      ],
      "benefits": [
        "The Premium is paid to you upfront.",
        "The Premium to be received is known at the time the Vanilla Option is entered into.",
        "The Premium received can be used to offset a potentially unfavourable move in Exchange Rates."
      ],
      "risks": [
        "Market Volatility:  The foreign exchange markets in which we operates are OTC and can change rapidly. These markets are speculative and volatile with the risk that prices will move quickly. we cannot guarantee that you will not make losses, (where your Vanilla Option is Out-of-TheMoney (OTM)) or that any unrealised profit or losses will remain unchanged for the term of the Vanilla Option. You need to monitor your Vanilla Options with we carefully.",
        "There may be no protection: The sale of a Vanilla Option to us are not designed to provide protection against an unfavourable movement in the relevant currency. If the Spot Rate at expiry is more favourable to us than the Strike Rate, we will Exercise the Vanilla Option and you will be obligated to exchange currencies at an Exchange Rate that is unfavourable to you. The Premium received by you is designed to be used to potentially offset any potential unfavourable moves in the Spot Rate that may occur. However, the Premium received may not be enough to offset the total impact of the unfavourable Spot Rate at the Expiry Date.",
        "Delivery of currency: If we exercises the Vanilla Option, you are obligated to deliver your currency to us at the Strike Rate, which will be at an Exchange Rate that is unfavourable to you.  Furthermore, if we exercises the Vanilla Option and you do not have the currency you are required to deliver, you will need to purchase it at the unfavourable Exchange Rate, in order to meet your obligations.",
        "Unknown liability: If you have to purchase currency at an unfavourable Exchange Rate to meet your obligations this will result in a cost to you. This cost is potentially unknown.",
        "Cancellations: The close-out/cancellation of a Vanilla Option prior to maturity may result in a financial loss to you. we will provide a quote for such services based on market conditions prevailing at the time of your request.",
        "Cooling-off: There is no cooling-off period. This means that once an Instruction to enter into a Vanilla Option has been accepted, you are unable to cancel the sale of your Vanilla Option without incurring a cost."
      ]
    }
  },
  "Vanilla (Deferred Premium)": {
    "name": "Vanilla (Deferred Premium)",
    "classification": "Protect",
    "family": "vanilla",
    "dropdownFamily": "Linear / Vanilla",
    "pair": "AUDEUR",
    "notionalCcy": "EUR",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "pips",
        "label": "Pips/%",
        "type": "number",
        "required": false
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "protectionRate": 0.64
    },
    "termsheet": {
      "outline": [
        "A Vanilla Option is an agreement between two parties (in this case, with we as “the buyer” of the Vanilla Option and you as the “the seller” of the  Vanilla Option) that gives the buyer the right but not the obligation to exchange an amount of one currency for an amount of another currency at an agreed Exchange Rate on an agreed date in the future (Expiry Date). A Vanilla Option may be a Put Option (a right to sell currency) or a Call Option (a right to buy currency)."
      ],
      "benefits": [
        "The Premium is paid to you upfront.",
        "The Premium to be received is known at the time the Vanilla Option is entered into.",
        "The Premium received can be used to offset a potentially unfavourable move in Exchange Rates."
      ],
      "risks": [
        "Market Volatility:  The foreign exchange markets in which we operates are OTC and can change rapidly. These markets are speculative and volatile with the risk that prices will move quickly. we cannot guarantee that you will not make losses, (where your Vanilla Option is Out-of-TheMoney (OTM)) or that any unrealised profit or losses will remain unchanged for the term of the Vanilla Option. You need to monitor your Vanilla Options with we carefully.",
        "There may be no protection: The sale of a Vanilla Option to us are not designed to provide protection against an unfavourable movement in the relevant currency. If the Spot Rate at expiry is more favourable to us than the Strike Rate, we will Exercise the Vanilla Option and you will be obligated to exchange currencies at an Exchange Rate that is unfavourable to you. The Premium received by you is designed to be used to potentially offset any potential unfavourable moves in the Spot Rate that may occur. However, the Premium received may not be enough to offset the total impact of the unfavourable Spot Rate at the Expiry Date.",
        "Delivery of currency: If we exercises the Vanilla Option, you are obligated to deliver your currency to us at the Strike Rate, which will be at an Exchange Rate that is unfavourable to you.  Furthermore, if we exercises the Vanilla Option and you do not have the currency you are required to deliver, you will need to purchase it at the unfavourable Exchange Rate, in order to meet your obligations.",
        "Unknown liability: If you have to purchase currency at an unfavourable Exchange Rate to meet your obligations this will result in a cost to you. This cost is potentially unknown.",
        "Cancellations: The close-out/cancellation of a Vanilla Option prior to maturity may result in a financial loss to you. we will provide a quote for such services based on market conditions prevailing at the time of your request.",
        "Cooling-off: There is no cooling-off period. This means that once an Instruction to enter into a Vanilla Option has been accepted, you are unable to cancel the sale of your Vanilla Option without incurring a cost."
      ]
    }
  },
  "Ratio": {
    "name": "Ratio",
    "classification": "Enhanced",
    "family": "ratio",
    "dropdownFamily": "Capped / Enhanced FEC",
    "pair": "AUDEUR",
    "notionalCcy": "EUR",
    "fields": [
      {
        "key": "expiryDate3pmTokyo",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leverage",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "enhancedRate": 0.68
    },
    "termsheet": {
      "outline": [
        "A Ratio Forward is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Call Option and a Sold Vanilla Put Option.",
        "A Ratio Forward gives you the ability to trade at an enhanced Exchange Rate relative to a comparative FEC. A Ratio Forward will always provide you with a guaranteed worst case Exchange Rate allowing you to protect against the risk that the Spot Rate is less favourable on Expiry of the contract. Because there is a ratio component associated with this Structured Option you may be obligated to exchange an amount of currency that is greater than the Notional Amount (i.e. the Notional Amount multiplied by a Leverage Ratio.)"
      ],
      "benefits": [
        "An ability to achieve an Enhanced Rate relative to the comparative Forward Exchange Rate.",
        "Protection at all times with a known worst case Exchange Rate."
      ],
      "risks": [
        "You will be obligated to trade a multiple (Leverage Ratio) of the Notional Amount at the Enhanced Rate if the Spot Rate is more favourable than the Enhanced Rate at Expiry.",
        "You are unable to participate in favourable currency movements beyond the Enhanced Rate. If the Spot Rate is more favourable than the Enhanced Rate you will be obligated to trade a multiple of the Notional Amount at the less favourable Enhanced Rate"
      ]
    }
  },
  "Accelerator": {
    "name": "Accelerator",
    "classification": "Protect",
    "family": "accelerator",
    "dropdownFamily": "Capped / Enhanced FEC",
    "pair": "AUDEUR",
    "notionalCcy": "EUR",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "obligationAmount",
        "label": "Obligation",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "limitRate",
        "label": "Limit Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "obligationAmount": 500000,
      "protectionRate": 0.64,
      "limitRate": 0.67
    },
    "termsheet": {
      "outline": [
        "An Accelerator is a type of Structured Option that combines a(n) {PAIR} a Bought Vanilla Call Option, a Bought Vanilla Put Option and a Sold Vanilla Put Option.",
        "An Accelerator allows you to protect against the risk that the Spot Rate will be less favourable than a nominated worst-case Exchange Rate (the Protection Rate). It also gives you the ability to participate in favourable movements in the Spot Rate by allowing you to potentially transact a portion of your Notional Amount at a favourable Spot Rate at Expiry. The Protection Rate can also be improved if the Spot Rate is more favourable than the Limit Rate at Expiry."
      ],
      "benefits": [
        "There is protection at all times with a known worst case Exchange Rate (Protection Rate).",
        "An ability to partially participate in favourable Exchange Rate movements.",
        "An ability to improve the Protection Rate if the Spot Rate is more favourable than the Limit Rate at Expiry."
      ],
      "risks": [
        "The unadjusted Protection Rate will be less favourable than the Exchange Rate applicable to a comparable FEC.",
        "If the Spot Rate at Expiry is more favourable than the Protection Rate you will be obligated to trade at the Protection Rate for a percentage of the Notional Amount.",
        "Improvement to the Protection Rate due to favourable Spot Rate movements will only reflect the favourable difference between the Spot Rate and the Limit Rate."
      ]
    }
  },
  "Accumulator": {
    "name": "Accumulator",
    "classification": "Enhanced",
    "family": "accumulator",
    "dropdownFamily": "Accumulator / Decumulator",
    "pair": "AUDEUR",
    "notionalCcy": "EUR",
    "fields": [
      {
        "key": "fixingDate",
        "label": "Fixing Date",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutRate",
        "label": "KO / Trigger Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "fixingDate": "2026-07-09",
      "notional": 1000000,
      "enhancedRate": 0.6625,
      "knockOutRate": 0.6475
    },
    "termsheet": {
      "outline": [
        "The Accumulator is a Structured Option products that offer an Enhanced Rate which, at inception, is more favourable than the Forward Exchange Rate. However, the amount you will settle at the Enhanced Rate will be dependent on the value of the Spot Rate determined at certain times (‘fixings”) during the life of the contract."
      ],
      "benefits": [
        "Ability to achieve an enhanced rate over the comparative Forward Exchange Rate so long as the underlying Spot Rate remains more favourable than the Knock-Out Rate on all Fixings throughout the term of the Structured Option contract."
      ],
      "risks": [
        "No guarantee that any protection will be accumulated.",
        "If insufficient cover is accumulated, the customer will need to buy any remaining requirement in the spot market, which may be at a level much less advantageous than the Enhanced Rate and the Forward Exchange Rate.",
        "The customer will be obliged to buy any accumulated Fixing Amounts at the Enhanced Rate and cannot participate in any favourable moves beyond that level.",
        "If the underlying Spot Rate is trading at a rate that is sufficiently more advantageous than the Enhanced Rate during the term of the structure, we may make a Margin Call to secure your OTM position.",
        "As this product tends to have a longer tenor there is a greater than usual risk that the Enhanced Rate will no longer seem attractive compared to the prevailing Spot Rate if the contract achieves its Expiry Date."
      ]
    }
  },
  "Accumulator (LEV)": {
    "name": "Accumulator (LEV)",
    "classification": "Enhanced",
    "family": "accumulator",
    "dropdownFamily": "Accumulator / Decumulator",
    "pair": "AUDEUR",
    "notionalCcy": "EUR",
    "fields": [
      {
        "key": "fixingDate",
        "label": "Fixing Date",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leverage",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutRate",
        "label": "KO / Trigger Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "fixingDate": "2026-07-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "enhancedRate": 0.681,
      "knockOutRate": 0.629
    },
    "termsheet": {
      "outline": [
        "The Accumulator is a Structured Option products that offer an Enhanced Rate which, at inception, is more favourable than the Forward Exchange Rate. However, the amount you will settle at the Enhanced Rate will be dependent on the value of the Spot Rate determined at certain times (‘fixings”) during the life of the contract."
      ],
      "benefits": [
        "Ability to achieve an enhanced rate over the comparative Forward Exchange Rate so long as the underlying Spot Rate remains more favourable than the Knock-Out Rate on all Fixings throughout the term of the Structured Option contract."
      ],
      "risks": [
        "No guarantee that any protection will be accumulated.",
        "If insufficient cover is accumulated, the customer will need to buy any remaining requirement in the spot market, which may be at a level much less advantageous than the Enhanced Rate and the Forward Exchange Rate.",
        "The customer will be obliged to buy any accumulated Fixing Amounts at the Enhanced Rate and cannot participate in any favourable moves beyond that level.",
        "If the underlying Spot Rate is trading at a rate that is sufficiently more advantageous than the Enhanced Rate during the term of the structure, we may make a Margin Call to secure your OTM position.",
        "As this product tends to have a longer tenor there is a greater than usual risk that the Enhanced Rate will no longer seem attractive compared to the prevailing Spot Rate if the contract achieves its Expiry Date."
      ]
    }
  },
  "Participator": {
    "name": "Participator",
    "classification": "Protect",
    "family": "participator",
    "dropdownFamily": "Participating / Collar",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "obligationAmount",
        "label": "Obligation",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "obligationAmount": 1000000,
      "protectionRate": 0.64
    },
    "termsheet": {
      "outline": [
        "A Participator is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Call Option and a Sold Vanilla Put Option.",
        "The Participating Forward allows you to protect against the risk that the Spot Rate will be less favourable than a nominated Exchange Rate (the \"Protection Rate\"). It also gives you the ability to participate in favourable movements in the Spot Rate by allowing you to trade a portion of your Notional Amount at a favourable Spot Rate at Expiry."
      ],
      "benefits": [
        "There is an ability to partially participate in favourable Exchange Rate movements.",
        "There is protection at all times with a known worst case Exchange Rate."
      ],
      "risks": [
        "The Protection Rate will be less favourable than the rate applicable to a comparable FEC",
        "If the Spot Rate at Expiry is more favourable than the Protection Rate you will be obligated to trade a proportion of your Notional Amount at the less favourable Protection Rate."
      ]
    }
  },
  "Participating Collar": {
    "name": "Participating Collar",
    "classification": "Protect",
    "family": "participating-collar",
    "dropdownFamily": "Participating / Collar",
    "pair": "AUDEUR",
    "notionalCcy": "EUR",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "obligationAmount",
        "label": "Obligation",
        "type": "currency",
        "required": true
      },
      {
        "key": "participationAmount",
        "label": "Participation",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "participationRate",
        "label": "Participation Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "obligationAmount": 1000000,
      "protectionRate": 0.645,
      "participationRate": 0.665
    },
    "termsheet": {
      "outline": [
        "A Participating Collar is a type of Structured Option that combines a(n) {BASE}/eur Bought Vanilla Call Option and two Sold Vanilla Put Options.",
        "A Participating Collar allows you to protect against the risk that the Spot Rate will be less favourable than a nominated Exchange Rate (the \"Protection Rate\"). It also gives you the ability to participate in favourable movements in the Spot Rate on a portion of your exposure between the Protection Rate and the Participation Rate at Expiry."
      ],
      "benefits": [
        "The Protection Rate is more favourable than the Protection Rate applicable to a comparable Participating Forward.",
        "There is the ability to partially participate in favourable Exchange Rate movements up to the level of the Participation Rate.",
        "There is protection at all times with a known Protection Rate."
      ],
      "risks": [
        "The Protection Rate will be less favourable than the Forward Exchange Rate applicable to a comparable FEC.",
        "If the Spot Rate at Expiry is more favourable than the Protection Rate you will be obligated to trade a portion of the Notional Amount (Notional Amount less Participation Percentage) at the less favourable Protection Rate.",
        "If the Spot Rate at Expiry is more favourable than the Protection Rate you will be obligated to trade a second amount, the Participation Percentage, at the less favourable Participation Rate."
      ]
    }
  },
  "Participating Collar (LEV)": {
    "name": "Participating Collar (LEV)",
    "classification": "Enhanced",
    "family": "participating-collar",
    "dropdownFamily": "Participating / Collar",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "obligationAmount",
        "label": "Obligation",
        "type": "currency",
        "required": true
      },
      {
        "key": "contingentAmount",
        "label": "Contingent",
        "type": "currency",
        "required": true
      },
      {
        "key": "totalLeverageAmount",
        "label": "Total Leverage",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "participationRate",
        "label": "Participation Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "obligationAmount": 1000000,
      "contingentAmount": 1000000,
      "protectionRate": 0.6427,
      "participationRate": 0.6673
    },
    "termsheet": {
      "outline": [
        "A Participating Collar (LEV) is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Call Option and two Sold Vanilla Put Options.",
        "A Leveraged Participating Collar has the same basic features as a Participating Collar, with the exception that the Protection Rate and/or the Participation Rate are enhanced relative to the Participating Collar. The reason for this is that if the Spot Rate at Expiry exceeds the Participation Rate you will be obligated to trade an amount in excess of the standard Participating Collar. The amount that you will be required to trade will depend on the Leverage Ratio that you have agreed to."
      ],
      "benefits": [
        "The Protection Rate is more favourable than the Protection Rate applicable to a comparable Participating Collar.",
        "There is the ability to partially participate in favourable Exchange Rate movements up to the level of the Participation Rate.",
        "There is protection at all times with a known Protection Rate."
      ],
      "risks": [
        "The Protection Rate will be less favourable than the Forward Exchange Rate applicable to a comparable FEC.",
        "If the Spot Rate at Expiry is more favourable than the Protection Rate you will be obligated to trade a portion of the Notional Amount (Notional Amount less Participation Percentage) at the less favourable Protection Rate.",
        "You are unable to participate in favourable currency movements beyond the Participation Rate. If the Spot Rate is more favourable than the Participation Rate you will be obligated to trade a multiple of the Notional Amount (notional amount multiplied by the Leverage Ratio) at the less favourable Participation Rate."
      ]
    }
  },
  "Participating Knock In": {
    "name": "Participating Knock In",
    "classification": "Participation",
    "family": "participating-knock-in",
    "dropdownFamily": "Participating / Collar",
    "pair": "AUDCNH",
    "notionalCcy": "CNH",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "obligationAmount",
        "label": "Obligation",
        "type": "currency",
        "required": true
      },
      {
        "key": "participationAmount",
        "label": "Participation",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInRate",
        "label": "KI Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "windowStart",
        "label": "Window Start",
        "type": "date",
        "required": true
      },
      {
        "key": "windowEnd",
        "label": "Window End",
        "type": "date",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "obligationAmount": 1000000,
      "protectionRate": 0.6418,
      "knockInRate": 0.6683,
      "windowStart": "2026-12-02",
      "windowEnd": "2026-12-09"
    },
    "termsheet": {
      "outline": [
        "A Participating Knock In is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Call Option, Sold Vanilla Put Option and a Sold Vanilla Put Barrier Option.",
        "A Knock-In Participating Forward allows you to protect against the risk that the Spot Rate will be less favourable than a nominated Exchange Rate (the \"Protection Rate\"). It also gives you the ability to participate in favourable movements in the Spot Rate on a percentage of your Notional Amount provided that a Knock-In Rate is not triggered during the term of the structure (or during a Window)"
      ],
      "benefits": [
        "There is the ability to participate in favourable Exchange Rate movements, provided the Knock-In Rate has not been triggered.",
        "There is protection at all times with a known Protection Rate.",
        "The Protection Rate and/or the Obligation Percentage are more favourable than the rates applicable to a comparable Participating Forward."
      ],
      "risks": [
        "The Protection Rate will be less favourable than the Exchange Rate applicable to a comparable FEC even when applying the Knock-In Rate.",
        "Part of your exposure must be traded at the Protection Rate at expiry. If the Spot Rate at Expiry is more favourable than the Protection Rate you will be obligated to trade at the less favourable Protection Rate.",
        "If the Spot Rate triggers the Knock-In Rate before Expiry (or during a Window) and the Spot Rate is more favourable than the Protection Rate you will be obligated to trade the full Notional Amount of the structure at the Protection Rate."
      ]
    }
  },
  "Participating Knock In (LEV)": {
    "name": "Participating Knock In (LEV)",
    "classification": "Enhanced",
    "family": "participating-knock-in",
    "dropdownFamily": "Participating / Collar",
    "pair": "AUDCNH",
    "notionalCcy": "CNH",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "obligationAmount",
        "label": "Obligation",
        "type": "currency",
        "required": true
      },
      {
        "key": "totalLeverageAmount",
        "label": "Total Leverage",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInRate",
        "label": "KI Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "windowStart",
        "label": "Window Start",
        "type": "date",
        "required": true
      },
      {
        "key": "windowEnd",
        "label": "Window End",
        "type": "date",
        "required": false
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "obligationAmount": 1000000,
      "protectionRate": 0.605,
      "knockInRate": 0.705,
      "windowStart": "2026-12-02"
    },
    "termsheet": {
      "outline": [
        "A Participating Knock In (LEV) is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Call Option, Sold Vanilla Put Option and a Sold Vanilla Put Barrier Option.",
        "A Leveraged Knock-In Participating Forward has the same basic features as a Knock-In Participating Forward, with the exception that the Protection Rate and/or the Knock-In Rate are enhanced relative to the Knock-In Participating Forward. The reason for this is that if the Spot Rate triggers the Knock-In Rate you will be obligated to trade an amount in excess of the standard Knock-In Participating Forward. The amount that you will be required to trade will depend on the Leverage Ratio that you have agreed to."
      ],
      "benefits": [
        "There is the ability to participate in favourable Exchange Rate movements, provided the Knock-In Rate has not been triggered.",
        "There is protection at all times with a known Protection Rate.",
        "The Protection Rate and/or the Obligation Percentage are more favourable than the rates applicable to a comparable Participating Forward."
      ],
      "risks": [
        "The Protection Rate will be less favourable than the Exchange Rate applicable to a comparable FEC even when applying the Knock-In Rate.",
        "Part of your exposure must be traded at the Protection Rate at Expiry. If the Spot Rate at Expiry is more favourable than the Protection Rate you will be obligated to trade at the less favourable Protection Rate.",
        "If the Spot Rate triggers the Knock-In Rate before Expiry (or during a Window) and the Spot Rate is more favourable than the Protection Rate at Expiry you will be obligated to trade a multiple of the Notional Amount at the less favourable Protection Rate."
      ]
    }
  },
  "Participating KO Conv.": {
    "name": "Participating KO Conv.",
    "classification": "Protect",
    "family": "participating-ko-conv",
    "dropdownFamily": "Participating / Collar",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "obligationAmount",
        "label": "Obligation",
        "type": "currency",
        "required": true
      },
      {
        "key": "participationAmount",
        "label": "Participation",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutRate",
        "label": "KO Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "obligationAmount": 1000000,
      "protectionRate": 0.6542,
      "knockOutRate": 0.6558
    },
    "termsheet": {
      "outline": [
        "A Participating KO Conv. is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Call Option, Sold Vanilla Put Option and a Sold Vanilla Put Barrier Option.",
        "A Participating Knok Out allows you to protect against the risk that the Spot Rate will be less favourable than a nominated Exchange Rate (the \"Protection Rate\"). It also gives you the ability to participate in favourable movements on a portion of your exposure in the Spot Rate provided that a Knock-Out Rate is triggered during the term of the structure."
      ],
      "benefits": [
        "There is the ability to participate in favourable Exchange Rate movements, provided the Knock-Out Rate has been triggered.",
        "There is protection at all times with a known Protection Rate.",
        "The Protection Rate and/or the Obligation Percentage are more favourable than the rates applicable to a comparable Participating Forward."
      ],
      "risks": [
        "The Protection Rate will be less favourable than the Exchange Rate applicable to a comparable FEC.",
        "If the Spot Rate at Expiry is more favourable than the Protection Rate and the Knock-Out Rate has not been triggered, you will be obligated to trade at the less favourable Protection Rate.",
        "Participation is limited to only a portion of your exposure should the trigger event occur."
      ]
    }
  },
  "Participating KO Conv. (LEV)": {
    "name": "Participating KO Conv. (LEV)",
    "classification": "Enhanced",
    "family": "participating-ko-conv",
    "dropdownFamily": "Participating / Collar",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "obligationAmount",
        "label": "Obligation",
        "type": "currency",
        "required": true
      },
      {
        "key": "participationAmount",
        "label": "Participation",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leveraged",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutRate",
        "label": "KO Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "obligationAmount": 1000000,
      "leveragedNotional": 2000000,
      "protectionRate": 0.655,
      "knockOutRate": 0.655
    },
    "termsheet": {
      "outline": [
        "A Participating KO Conv. (LEV) is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Put Option, Sold Vanilla Call Option and a Sold Vanilla Call Barrier Option.",
        "The Leveraged Participating Knock Out has the same basic features as a Participating Knock Out, with the exception that the Protection Rate and/or the Knock-Out Rate are enhanced relative to the Knock-Out Participating. The reason for this is that if the Spot Rate  does not trigger the Knock-Out Rate you will be obligated to trade an amount in excess of the standard Knock-Out Participating."
      ],
      "benefits": [
        "An ability to participate in favourable Exchange Rate movements on a portion of your exposure if the Knock-Out Rate is triggered.",
        "Protection at all times with a known worse case Exchange Rate.",
        "The Protection Rate and/or the Obligation Percentage are more favourable than the Exchange Rates applicable to a comparable standard Participating Forward."
      ],
      "risks": [
        "The Protection Rate will be less favourable than the Exchange Rate applicable to a comparable FEC.",
        "If the Spot Rate at Expiry is more favourable than the Protection Rate and the Knock-Out Rate has not been triggered, you will be obligated to trade a multiple of the Notional Amount at the less favourable Protection Rate.",
        "If the Spot Rate at Expiry is more favourable than the Protection Rate and the Knock-Out Rate has been triggered you will be obligated to trade the Obligation Percentage at the less favourable Protection Rate."
      ]
    }
  },
  "Knock In": {
    "name": "Knock In",
    "classification": "Participation",
    "family": "knock-in",
    "dropdownFamily": "Knock-In family",
    "pair": "AUDEUR",
    "notionalCcy": "EUR",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInRate",
        "label": "KI Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "windowStart",
        "label": "Window Start",
        "type": "date",
        "required": true
      },
      {
        "key": "windowEnd",
        "label": "Window End",
        "type": "date",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "protectionRate": 0.63,
      "knockInRate": 0.68,
      "windowStart": "2026-12-02",
      "windowEnd": "2026-12-09"
    },
    "termsheet": {
      "outline": [
        "A Knock In is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Call Option and a Sold Vanilla Put Barrier Option.",
        "A Knock-In allows you to protect against the risk that the Spot Rate will be less favourable than your nominated Exchange Rate (the \"Protection Rate\") whilst giving you the potential to take advantage of favourable currency movements to the level of the Knock-In Rate. If the Knock-In Rate is triggered at any time before Expiry (or during a Window) you will be obligated to trade at the Protection Rate on Expiry."
      ],
      "benefits": [
        "An ability to participate in favourable Exchange Rate movements to the level of the Knock-In Rate.",
        "Protection at all times with a known worst case Exchange Rate."
      ],
      "risks": [
        "Participation in favourable Exchange Rate movements is capped at the Knock-In Rate.",
        "The Protection Rate will be less favourable than the comparable Forward Exchange Rate.",
        "If the Spot Rate triggers the Knock-In Rate you will be obligated to trade at the Protection Rate, which may be less favourable than the Spot Rate."
      ]
    }
  },
  "Knock In (LEV)": {
    "name": "Knock In (LEV)",
    "classification": "Enhanced",
    "family": "knock-in",
    "dropdownFamily": "Knock-In family",
    "pair": "AUDEUR",
    "notionalCcy": "EUR",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leveraged",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInRate",
        "label": "KI Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "windowStart",
        "label": "Window Start",
        "type": "date",
        "required": true
      },
      {
        "key": "windowEnd",
        "label": "Window End",
        "type": "date",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "protectionRate": 0.6298,
      "knockInRate": 0.6803,
      "windowStart": "2026-12-02",
      "windowEnd": "2026-12-09"
    },
    "termsheet": {
      "outline": [
        "A Knock In (LEV) is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Call Option and a Sold Vanilla Put Barrier Option.",
        "A Leveraged Knock-In has the same basic features as a Knock-In, with the exception that the Protection Rate and/or the Knock-In Rate are enhanced relative to the Knock In. The reason for this is that if the Spot Rate triggers the Knock-In Rate you will be obligated to trade an amount in excess of the standard Knock-In. The amount that you will be required to trade will depend on the Leverage Ratio that you have agreed to."
      ],
      "benefits": [
        "An ability to achieve an enhanced Protection Rate comparative to a standard Knock-In structure.",
        "An ability to participate in favourable Exchange Rate movements to the level of the Knock-In Rate.",
        "Protection at all times with a known worst case Exchange Rate (Protection Rate)."
      ],
      "risks": [
        "Participation in favourable currency movements is capped at the level of the Knock-In Rate.",
        "If the Knock-In Rate is triggered during the term and the Spot Rate is more favourable than the Protection Rate at Expiry, you will be obligated to trade a multiple of the Notional Amount at the less favourable Protection Rate."
      ]
    }
  },
  "Knock In Collar": {
    "name": "Knock In Collar",
    "classification": "Participation",
    "family": "collar",
    "dropdownFamily": "Knock-In family",
    "pair": "AUDEUR",
    "notionalCcy": "EUR",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "participationRate",
        "label": "Participation Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInRate",
        "label": "KI Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "windowStart",
        "label": "Window Start",
        "type": "date",
        "required": true
      },
      {
        "key": "windowEnd",
        "label": "Window End",
        "type": "date",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "protectionRate": 0.635,
      "participationRate": 0.655,
      "knockInRate": 0.6755,
      "windowStart": "2026-12-02",
      "windowEnd": "2026-12-09"
    },
    "termsheet": {
      "outline": [
        "A Knock In Collar is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Call Option and a Sold Vanilla Put Barrier Option.",
        "A Knock-In Collar allows you to protect against the risk that the Spot Rate will be less favourable than a nominated Exchange Rate (the \"Protection Rate\") whilst giving you the potential to take advantage of favourable currency movements to the level of a Knock-In Rate. If the Knock-In Rate is triggered before Expiry (or during a Window) you are knocked in to a collar structure."
      ],
      "benefits": [
        "An ability to participate in favourable Exchange Rate movements to the level of the Knock-In Rate. When the Knock-In Rate has been triggered participation in favourable movements to the Participation Rate remains possible.",
        "Protection at all time with a known worst case Exchange Rate."
      ],
      "risks": [
        "The Protection Rate will be less favourable than the comparable Forward Exchange Rate and the comparable standard Knock-In structure.",
        "Participation in favourable movements in the Exchange Rate is capped to the level of the Participation Rate.",
        "If the Spot Rate triggers the Knock-In Rate before Expiry (or during a Window) and the Spot Rate is more favourable than the Participation Rate at Expiry you will be obligated to trade at the Participation Rate."
      ]
    }
  },
  "Knock In Collar (LEV)": {
    "name": "Knock In Collar (LEV)",
    "classification": "Enhanced",
    "family": "collar",
    "dropdownFamily": "Knock-In family",
    "pair": "AUDEUR",
    "notionalCcy": "EUR",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "contingentAmount",
        "label": "Contingent",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leveraged",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "participationRate",
        "label": "Participation Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInRate",
        "label": "KI Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "windowStart",
        "label": "Window Start",
        "type": "date",
        "required": true
      },
      {
        "key": "windowEnd",
        "label": "Window End",
        "type": "date",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "contingentAmount": 1000000,
      "leveragedNotional": 2000000,
      "protectionRate": 0.635,
      "participationRate": 0.655,
      "knockInRate": 0.6755,
      "windowStart": "2026-12-02",
      "windowEnd": "2026-12-09"
    },
    "termsheet": {
      "outline": [
        "A Knock In Collar (LEV) is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Call Option and a Sold Vanilla Put Barrier Option.",
        "A Leveraged Knock-In Collar has the same basic features as a Knock-In Collar, with the exception that the Protection Rate and/or the Participation and/or the Knock-In Rate are enhanced relative to the Knock-In Collar. The reason for this is that if the Spot Rate triggers the Knock-In Rate you will be obligated to trade an amount in excess of the standard Knock-In Collar. The amount that you will be required to trade will depend on the Leverage Ratio that you have agreed to."
      ],
      "benefits": [
        "An ability to participate in favourable Exchange Rate movements to the level of the Knock-In Rate. When the Knock-In Rate has been triggered participation in favourable movements to the Participation Rate remains possible.",
        "Protection at all time with a known worst case Exchange Rate."
      ],
      "risks": [
        "The Protection Rate will be less favourable than the comparable Forward Exchange Rate and the comparable standard Knock-In structure.",
        "Participation in favourable movements in the Exchange Rate is capped to the level of the Participation Rate.",
        "If the Spot Rate triggers the Knock-In Rate before Expiry (or during a Window) and the Spot Rate is more favourable than the Participation Rate at Expiry you will be obligated to trade a multiple of the Notional Amount at the less favourable Participation Rate."
      ]
    }
  },
  "Knock In Conv.": {
    "name": "Knock In Conv.",
    "classification": "Participation",
    "family": "knock-in",
    "dropdownFamily": "Knock-In family",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutRate",
        "label": "KO Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInRate",
        "label": "KI Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "protectionRate": 0.655,
      "knockOutRate": 0.655,
      "knockInRate": 0.715
    },
    "termsheet": {
      "outline": [
        "A Knock In Converticble is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Put Option and a Sold Vanilla Call Double Barrier Option.",
        "The Knock-In Convertible is a Structured Option which allows you to protect against the risk that the Spot Rate will be less favourable than a nominated Exchange Rate (the \"Protection Rate\") whilst giving you the potential to take advantage of favourable currency movements to the level of a Knock-In Rate. IF the Knock-In Rate is triggered before Expiry (or during a Window), you will be obligated to trade at the Protection Rate on Expiry unless a Knock-Out Rate has also been triggered. If the Knock-Out Rate is triggered, you are left with a Vanilla Option and no obligation."
      ],
      "benefits": [
        "Protection at all times with a known worst case Exchange Rate (Protection Rate).",
        "Ability to participate in favourable currency movements.",
        "If the Knock-Out Rate has been triggered and Knock-In Rate has not been triggered participation in favourable movements is possible to any level."
      ],
      "risks": [
        "If the Knock-Out Rate has not been triggered, participation in favourable movements is capped at the Knock-In Rate.",
        "If the Knock-Out Rate has not been triggered and the Spot Rate triggers the Knock-In Rate before Expiry (or during a Window) and the Spot Rate is more favourable than the Protection Rate at Expiry you will be obligated to trade at the less favourable Protection Rate."
      ]
    }
  },
  "Knock In Conv. (LEV)": {
    "name": "Knock In Conv. (LEV)",
    "classification": "Enhanced",
    "family": "knock-in",
    "dropdownFamily": "Knock-In family",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "contingentAmount",
        "label": "Contingent",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leveraged",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutRate",
        "label": "KO Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInRate",
        "label": "KI Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "protectionRate": 0.655,
      "knockOutRate": 0.645,
      "knockInRate": 0.755
    },
    "termsheet": {
      "outline": [
        "A Knock In Converticble is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Call Option and a Sold Vanilla Put Double Barrier Option.",
        "The Leveraged Knock-In Convertible has the same basic features as a Knock-In Convertible, with the exception that the Protection Rate and/or the Knock-In or Knock-Out Rate are enhanced relative to the Knock-In Convertible. The reason for this is that if the Spot Rate triggers the Knock-In Rate you will be obligated to trade an amount in excess of the standard Knock-In Convertible. If the Knock-In Rate is triggered before Expiry (or during a Window), you will be obligated to trade a multiple of the Notional Amount at the Protection Rate on Expiry unless a Knock-Out Rate has also been triggered. If the Knock-Out Rate is triggered, you are left with a Vanilla Option and no obligation."
      ],
      "benefits": [
        "Protection at all time with a known worst case Exchange Rate (Protection Rate).",
        "Ability to participate in favourable currency movements.",
        "If the Knock-Out Rate has been triggered and the Knock-In Rate has not been triggered participation in favourable movements is possible to any level."
      ],
      "risks": [
        "If the Knock-Out Rate has not been triggered participation in favourable movements is capped at the Knock-In Rate.",
        "If the Knock-Out Rate has not been triggered and the Spot Rate triggers the Knock-In Rate before Expiry (or during a Window) and the Spot Rate is more favourable than the Protection Rate at Expiry you will be obligated to trade a multiple of the Notional Amount at the less favourable Protection Rate."
      ]
    }
  },
  "Knock In Reset": {
    "name": "Knock In Reset",
    "classification": "Participation",
    "family": "knock-in",
    "dropdownFamily": "Knock-In family",
    "pair": "AUDEUR",
    "notionalCcy": "EUR",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "resetRate",
        "label": "Reset Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInRate",
        "label": "KI Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "windowStart",
        "label": "Window Start",
        "type": "date",
        "required": true
      },
      {
        "key": "windowEnd",
        "label": "Window End",
        "type": "date",
        "required": false
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "protectionRate": 0.655,
      "resetRate": 0.625,
      "knockInRate": 0.755,
      "windowStart": "2026-12-02"
    },
    "termsheet": {
      "outline": [
        "A Knock In Reset is a type of Structured Option that combines two {PAIR} Bought Vanilla Call Barrier Options and a Sold Vanilla Put Barrier Option.",
        "The Knock-In Reset allows you to protect against the risk that the Spot Rate will be less favourable than a nominated Exchange Rate (the \"Protection Rate\"). It also gives you the ability to participate in favourable movements in the Spot Rate provided that a Knock-In Rate is not triggered. If the Knock-In Rate is triggered, then you must deal at an agreed rate (the \"Reset Rate\"), which would be similar to the Exchange Rate of a comparable FEC. The Reset Rate will be more favourable than the Protection Rate and less favourable than the Knock-In Rate."
      ],
      "benefits": [
        "There is the ability to participate in favourable Exchange Rate movements on the full Notional Amount, provided the Knock-In Rate has not been triggered.",
        "There is protection at all times with a known Protection Rate.",
        "Should the Knock-In Rate be triggered, you will be knocked in to the Reset Rate that is more favourable to you than the Protection Rate available for a standard Knock-In structure"
      ],
      "risks": [
        "The Protection Rate will be less favourable than the Exchange Rate applicable to a comparable FEC and a comparable standard Knock-In.",
        "If the Knock-In Rate is triggered you will be obligated to trade the full Notional Amount at the Reset Rate that could be less favourable to you than the Spot Rate at Expiry."
      ]
    }
  },
  "Knock In Reset (LEV)": {
    "name": "Knock In Reset (LEV)",
    "classification": "Enhanced",
    "family": "knock-in",
    "dropdownFamily": "Knock-In family",
    "pair": "AUDEUR",
    "notionalCcy": "EUR",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "contingentAmount",
        "label": "Contingent",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leveraged",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "resetRate",
        "label": "Reset Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInRate",
        "label": "KI Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "windowStart",
        "label": "Window Start",
        "type": "date",
        "required": true
      },
      {
        "key": "windowEnd",
        "label": "Window End",
        "type": "date",
        "required": false
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "protectionRate": 0.655,
      "resetRate": 0.625,
      "knockInRate": 0.755,
      "windowStart": "2026-12-02"
    },
    "termsheet": {
      "outline": [
        "A Knock In Reset (LEV) is a type of Structured Option that combines two {PAIR} Bought Vanilla Call Barrier Options and a Sold Vanilla Put Barrier Option.",
        "The Leveraged Knock-In Reset has the same basic features as a Knock-In Reset, with the exception that the Protection Rate and/or the Reset Rate are enhanced relative to the Knock-In Reset. The reason for this is that if the Spot Rate triggers the Knock-In Rate you will be obligated to trade an amount in excess of the standard Knock-In Reset. The amount that you will be required to trade will depend on the Leverage Ratio that you have agreed to."
      ],
      "benefits": [
        "There is the ability to participate in favourable Exchange Rate movements on the full Notional Amount, provided the Knock-In/Out Rate has not been triggered.",
        "There is protection at all times with a known Protection Rate.",
        "Should the Knock-In/Out Rate be triggered, you will be knocked in to the Reset Rate that is more favourable to you than the Protection Rate available for a standard Knock-In structure."
      ],
      "risks": [
        "The Protection Rate will be less favourable than the Exchange Rate applicable to a comparable FEC and a comparable standard Knock-In.",
        "If the Knock-In/Out Rate is triggered you will be obligated to trade a multiple of the Notional Amount at the Reset Rate that could be less favourable to you than the Spot Rate at Expiry."
      ]
    }
  },
  "KIKO": {
    "name": "KIKO",
    "classification": "Enhanced",
    "family": "kiko",
    "dropdownFamily": "Knock-Out family",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInRate",
        "label": "KI Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutRate",
        "label": "KO Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInWindowStartDate",
        "label": "KI Window Start",
        "type": "date",
        "required": true
      },
      {
        "key": "knockInWindowEndDate",
        "label": "KI Window End",
        "type": "date",
        "required": true
      },
      {
        "key": "knockOutWindowStartDate",
        "label": "KO Window Start",
        "type": "date",
        "required": true
      },
      {
        "key": "knockOutWindowEndDate",
        "label": "KO Window End",
        "type": "date",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "protectionRate": 0.655,
      "knockInRate": 0.625,
      "knockOutRate": 0.675
    },
    "termsheet": {
      "outline": [
        "A KIKO is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Call Barrier Option and a Sold Vanilla Put Double Barrier Option.",
        "A KIKO gives you limited protection at an Exchange Rate that is more favourable than the Exchange Rate that would apply to an equivalent Forward Exchange Rate (an \"Enhanced Rate\") provided that a specified Knock-Out barrier is not triggered before expiry (or during a Window). If this occurs the contract ceases to exist. In addition, a KIKO gives you the potential to take advantage of favourable currency movements to the level of the Knock-In Rate. If the Knock-In Rate is triggered at any time before Expiry (or during a Window) you will be obligated to trade at the Protection Rate on Expiry, provided the Knock-Out rate has not triggered or does not trigger."
      ],
      "benefits": [
        "An ability to participate in favourable Exchange Rate movements, to the level of the Knock-In Rate if the Knock-Out Rate has not been triggered.",
        "If the Knock-In and Knock-Out Rates have not been triggered and the Spot Rate is less favourable than the Protection Rate you will transact at the more favourable Protection Rate.",
        "If the Knock-In and Knock-Out Rates have not been triggered and the Spot Rate is more favourable than the Protection Rate you can transact at the more favourable Spot Rate.",
        "The KIKO provides and enhanced protection rate compared to an FEC."
      ],
      "risks": [
        "Participation in favourable Exchange Rate movements is capped at the Knock-In Rate.",
        "If the Spot Rate triggers the Knock-In Rate you will be obligated to trade at the Protection Rate, which may be less favourable than the Spot Rate at Expiry as long as the Knock-Out Rate has not been triggered.",
        "If the Knock-Out Rate is triggered the contract ceases to exist and you may potentially have to transact at a less favourable Exchange Rate."
      ]
    }
  },
  "KIKO (LEV)": {
    "name": "KIKO (LEV)",
    "classification": "Enhanced",
    "family": "kiko",
    "dropdownFamily": "Knock-Out family",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "contingentAmount",
        "label": "Contingent",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leveraged",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInRate",
        "label": "KI Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutRate",
        "label": "KO Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInWindowStartDate",
        "label": "KI Window Start",
        "type": "date",
        "required": true
      },
      {
        "key": "knockInWindowEndDate",
        "label": "KI Window End",
        "type": "date",
        "required": true
      },
      {
        "key": "knockOutWindowStartDate",
        "label": "KO Window Start",
        "type": "date",
        "required": true
      },
      {
        "key": "knockOutWindowEndDate",
        "label": "KO Window End",
        "type": "date",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "protectionRate": 0.655,
      "knockInRate": 0.665,
      "knockOutRate": 0.622
    },
    "termsheet": {
      "outline": [
        "A Leveraged KIKO is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Call Barrier Option and a Sold Vanilla Put Barrier Option.",
        "A Leveraged KIKO gives you limited protection at an Exchange Rate that is more favourable than the Exchange Rate that would apply to an equivalent Forward Exchange Rate (an \"Enhanced Rate\") provided that a specified Knock-Out barrier is not triggered before expiry (or during a Window). If this occurs the contract ceases to exist. In addition, a Leveraged KIKO gives you the potential to take advantage of favourable currency movements to the level of the Knock-In Rate. If the Knock-In Rate is triggered at any time before Expiry (or during a Window), if the market is above the Enhanced Rate at expiry, you will be obligated to trade an amount in excess of the Protection amount, at the Enhanced Rate on Expiry, provided the Knock-Out rate has not triggered or does not trigger. The amount that you will be required to trade will depend on the Leverage Ratio that you have agreed to."
      ],
      "benefits": [
        "An ability to participate in favourable Exchange Rate movements, to the level of the Knock-In Rate if the Knock-Out Rate has not been triggered.",
        "If the Knock-In and Knock-Out Rates have not been triggered and the Spot Rate is less favourable than the Protection Rate you will transact at the more favourable Protection Rate.",
        "If the Knock-In and Knock-Out Rates have not been triggered and the Spot Rate is more favourable than the Protection Rate you can transact at the more favourable Spot Rate.",
        "The Leveraged KIKO provides and enhanced protection rate compared to an FEC."
      ],
      "risks": [
        "Participation in favourable Exchange Rate movements is capped at the Knock-In Rate.",
        "If the Spot Rate triggers the Knock-In Rate you will be obligated to trade at the Protection Rate, which may be less favourable than the Spot Rate at Expiry as long as the Knock-Out Rate has not been triggered.",
        "If the Knock-Out Rate is triggered the contract ceases to exist and you may potentially have to transact at a less favourable Exchange Rate."
      ]
    }
  },
  "Knock Out": {
    "name": "Knock Out",
    "classification": "Enhanced",
    "family": "knock-out",
    "dropdownFamily": "Knock-Out family",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leverage",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutRate",
        "label": "KO Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "windowStart",
        "label": "Window Start",
        "type": "date",
        "required": true
      },
      {
        "key": "windowEnd",
        "label": "Window End",
        "type": "date",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "enhancedRate": 0.626,
      "knockOutRate": 0.684,
      "windowStart": "2026-12-02",
      "windowEnd": "2026-12-09"
    },
    "termsheet": {
      "outline": [
        "A Knock Out is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Put Barrier Option and a Sold Vanilla Call Barrier Option."
      ],
      "benefits": [
        "An ability to achieve a more favourable Enhanced Rate relative to a comparative standard Knock-Out."
      ],
      "risks": [
        "If the Knock-Out Rate level is triggered, you can be left with no protection against unfavourable currency movements.",
        "If the Knock-Out Rate is not triggered and the Spot Rate is more favourable then the Enhanced Rate at Expiry you will be obligated to trade a multiple of the Notional Amount at the less favourable Enhanced Rate."
      ]
    }
  },
  "Knock Out (LEV)": {
    "name": "Knock Out (LEV)",
    "classification": "Enhanced",
    "family": "knock-out",
    "dropdownFamily": "Knock-Out family",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leverage",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutRate",
        "label": "KO Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "windowStart",
        "label": "Window Start",
        "type": "date",
        "required": true
      },
      {
        "key": "windowEnd",
        "label": "Window End",
        "type": "date",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "enhancedRate": 0.626,
      "knockOutRate": 0.684,
      "windowStart": "2026-12-02",
      "windowEnd": "2026-12-09"
    },
    "termsheet": {
      "outline": [
        "A Knock Out (LEV) is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Put Barrier Option and a Sold Vanilla Call Barrier Option.",
        "A Leveraged Knock-Out is a leveraged Structured Option that gives you limited protection at an Enhanced rate provided that a specified Knock-Out Rate has not been triggered before Expiry (or during a Window). If this occurs the contract ceases to exist. The Enhanced Rate applicable to a Leveraged Knock-Out will be more favourable than a comparable standard Knock-Out. Because there is a leveraged component associated with a leveraged Knock-Out you may be obligated to exchange an amount of currency that is greater than the Notional Amount (i.e. the contract Notional Amount multiplied by a Leverage Ratio)."
      ],
      "benefits": [
        "An ability to achieve a more favourable Enhanced Rate relative to a comparative standard Knock-Out."
      ],
      "risks": [
        "If the Knock-Out Rate level is triggered, you can be left with no protection against unfavourable currency movements.",
        "If the Knock-Out Rate is not triggered and the Spot Rate is more favourable then the Enhanced Rate at Expiry you will be obligated to trade a multiple of the Notional Amount at the less favourable Enhanced Rate."
      ]
    }
  },
  "Knock Out Collar": {
    "name": "Knock Out Collar",
    "classification": "Enhanced",
    "family": "collar",
    "dropdownFamily": "Knock-Out family",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "participationRate",
        "label": "Participation Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutRate",
        "label": "KO Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "windowStart",
        "label": "Window Start",
        "type": "date",
        "required": true
      },
      {
        "key": "windowEnd",
        "label": "Window End",
        "type": "date",
        "required": false
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "enhancedRate": 0.655,
      "participationRate": 0.755,
      "knockOutRate": 0.605,
      "windowStart": "2026-12-02"
    },
    "termsheet": {
      "outline": [
        "A Knock Out Collar is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Put Barrier Option and a Sold Vanilla Call Barrier Option.",
        "The Knock Out Collar gives you limited protection at an Enhanced Rate and the ability to participate in favourable movements in the Spot Rate between the Enhanced Rate and a Participation Rate.\nThe protection that it provides and the ability to participate in favourable movements are contingent upon the Knock-Out Rate not being triggered before Expiry (or during a Window). If this occurs the contract ceases to exist. A Knock-Out Collar gives you a more favourable Enhanced and/or Participation Rates relative to a comparative standard Collar."
      ],
      "benefits": [
        "A Knock-Out Collar provides enhanced Participation and/or Enhanced Rates relative to a comparative standard Collar.",
        "Provided that the Knock-Out Rate is not triggered you have the ability to participate in favourable Exchange Rate movements up to the Participation Rate."
      ],
      "risks": [
        "If the Knock-Out Rate is triggered prior to Expiry, there is no foreign exchange protection and you may have to transact at a less favourable Exchange Rate.",
        "If the Spot Rate is trading at an Exchange Rate that is more favourable than the Participation Rate at Expiry (and the Knock-Out Rate has not been triggered) you will be obligated to trade at the less favourable Participation Rate."
      ]
    }
  },
  "Knock Out Collar (LEV)": {
    "name": "Knock Out Collar (LEV)",
    "classification": "Enhanced",
    "family": "collar",
    "dropdownFamily": "Knock-Out family",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "contingentAmount",
        "label": "Contingent",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leveraged",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "participationRate",
        "label": "Participation Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutRate",
        "label": "KO Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "windowStart",
        "label": "Window Start",
        "type": "date",
        "required": true
      },
      {
        "key": "windowEnd",
        "label": "Window End",
        "type": "date",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "contingentAmount": 1000000,
      "leveragedNotional": 2000000,
      "enhancedRate": 0.655,
      "participationRate": 0.755,
      "knockOutRate": 0.605,
      "windowStart": "2026-12-02",
      "windowEnd": "2026-12-09"
    },
    "termsheet": {
      "outline": [
        "A Knock Out Collar (LEV) is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Call Barrier Option and a Sold Vanilla Put Barrier Option.",
        "A Leveraged Knock Out Collar has the same basic features as a Knock-Out Collar, with the exception that the Enhanced Rate and the Knock-Out Rate are enhanced relative to the Knock-Out Collar. A Leveraged Knock-Out Collar gives you limited protection against the risk that the Spot Rate will be less favourable than the Enhanced Rate and the ability to participate in favourable movements in the Spot Rate between the Enhanced Rate and a Participation Rate. The protection it provides and the ability to participate in favourable movements is contingent upon a specified Knock-Out Rate not being triggered before Expiry (or during a Window). If this occurs the contract ceases to exist."
      ],
      "benefits": [
        "An ability to achieve enhanced Exchange Rates relative to a comparable standard Knock-Out Collar.",
        "An ability to participate in favourable Exchange Rate movements up to the Participation Rate provided that the Knock-Out Rate has not been triggered."
      ],
      "risks": [
        "If the Knock-Out has been triggered you can be left with no protection against unfavourable Exchange Rate movements",
        "If the Spot Rate is trading at a level that is more favourable than the Participation Rate at Expiry (and the Knock-Out Rate has not been triggered), you will be obligated to trade a multiple of the Notional Amount at the less favourable Participation Rate."
      ]
    }
  },
  "Knock Out Conv.": {
    "name": "Knock Out Conv.",
    "classification": "Enhanced",
    "family": "knock-out",
    "dropdownFamily": "Knock-Out family",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutRate",
        "label": "KO Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "protectionRate": 0.6542,
      "knockOutRate": 0.6558
    },
    "termsheet": {
      "outline": [
        "A Knock Out Conv. is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Put Option and a Sold Vanilla Call Barrier Option.",
        "The Knock-Out Convertible allows you to protect against the risk that the Spot Rate will be less favourable than a nominated Exchange Rate (the “Protection Rate”). It also gives you the ability to participate in favourable movements in the Spot Rate provided that a Knock-Out Rate is triggered during the term of the structure."
      ],
      "benefits": [
        "An ability to participate in favourable Exchange Rate movements if the Knock-Out Rate has been triggered.",
        "Protection at all times with a known worst case Exchange Rate."
      ],
      "risks": [
        "The Protection Rate will be less favourable than the Exchange Rate applicable to a comparable FEC.",
        "If the Spot Rate at Expiry is more favourable than the Protection Rate and the Knock-Out Rate has not been triggered, you will be obligated to trade at the less favourable Protection Rate."
      ]
    }
  },
  "Knock Out Conv. (LEV)": {
    "name": "Knock Out Conv. (LEV)",
    "classification": "Enhanced",
    "family": "knock-out",
    "dropdownFamily": "Knock-Out family",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "contingentAmount",
        "label": "Contingent",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leveraged",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutRate",
        "label": "KO Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "contingentAmount": 1000000,
      "leveragedNotional": 2000000,
      "protectionRate": 0.657,
      "knockOutRate": 0.653
    },
    "termsheet": {
      "outline": [
        "A Knock Out Conv. (LEV) is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Put Option and a Sold Vanilla Call Barrier Option.",
        "The Leveraged Knock-Out Convertible has the same basic features as a Knock-Out Convertible, with the exception that the Protection Rate, and/or the Knock-Out Rate are enhanced relative to the Knock-Out Convertible. The reason for this is that if the Spot Rate does not trigger the Knock-Out Rate you will be obligated to trade an amount in excess of the standard Knock-Out Convertible."
      ],
      "benefits": [
        "An ability to participate in favourable Exchange Rate movements if the Knock-Out Rate has been triggered.",
        "An ability to achieve enhanced Exchange Rates relative to a comparable standard Knock-Out Convertible.",
        "Protection at all times with a known worst case Exchange Rate."
      ],
      "risks": [
        "The Protection Rate will be less favourable than the Exchange Rate applicable to a comparable FEC.",
        "If the Spot Rate at Expiry is more favourable than the Protection Rate and the Knock-Out Rate has not been triggered, you will be obligated to trade in a multiple of the Notional Amount at the less favourable Protection Rate."
      ]
    }
  },
  "Knock Out Reset": {
    "name": "Knock Out Reset",
    "classification": "Participation",
    "family": "knock-out",
    "dropdownFamily": "Knock-Out family",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "lowTrigger",
        "label": "Low Trigger",
        "type": "rate",
        "required": true
      },
      {
        "key": "highTrigger",
        "label": "High Trigger",
        "type": "rate",
        "required": true
      },
      {
        "key": "lowTriggerWindowStartDate",
        "label": "Low Trig. Start",
        "type": "date",
        "required": true
      },
      {
        "key": "lowTriggerWindowEndDate",
        "label": "Low Trig. End",
        "type": "date",
        "required": false
      },
      {
        "key": "highTriggerWindowStartDate",
        "label": "High Trig. Start",
        "type": "date",
        "required": true
      },
      {
        "key": "highTriggerWindowEndDate",
        "label": "High Trig. End",
        "type": "date",
        "required": false
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "enhancedRate": 0.665,
      "protectionRate": 0.645,
      "lowTrigger": 0.605,
      "highTrigger": 0.705
    },
    "termsheet": {
      "outline": [
        "A Knock Out Reset is a type of Structured Option that combines two {PAIR} Bought Vanilla Call Double Barrier Options and two Sold Vanilla Put Double Barrier Options.",
        "The Knock-Out Reset gives you the benefit of achieving an enhanced Exchange Rate (the “Enhanced Rate”) compared to the equivalent Forward Exchange Rate provided that the Spot Rate remains within a specified range for the entire term of the structure. A Knock-Out Reset will always provide you with a guaranteed worst case Exchange Rate allowing you to protect against the risk that the Spot Rate is less favourable at Expiry of the contract."
      ],
      "benefits": [
        "Ability to achieve an Enhanced Rate over the comparative Forward Exchange Rate if the Knock-In/Out Rate has not been triggered.",
        "Protection at all time with a known worst case Exchange Rate."
      ],
      "risks": [
        "If either Knock-In/Out Rate is triggered you will be trading at the Reset Rate that is less favourable than the comparative Forward Exchange Rate.",
        "There is potential to be transacting at an Exchange Rate that is less favourable than the Spot Rate at Expiry."
      ]
    }
  },
  "Knock Out Reset (LEV)": {
    "name": "Knock Out Reset (LEV)",
    "classification": "Enhanced",
    "family": "knock-out",
    "dropdownFamily": "Knock-Out family",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "contingentAmount",
        "label": "Contingent",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leveraged",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "lowTrigger",
        "label": "Low Trigger",
        "type": "rate",
        "required": true
      },
      {
        "key": "highTrigger",
        "label": "High Trigger",
        "type": "rate",
        "required": true
      },
      {
        "key": "lowTriggerWindowStartDate",
        "label": "Low Trig. Start",
        "type": "date",
        "required": true
      },
      {
        "key": "lowTriggerWindowEndDate",
        "label": "Low Trig. End",
        "type": "date",
        "required": false
      },
      {
        "key": "highTriggerWindowStartDate",
        "label": "High Trig. Start",
        "type": "date",
        "required": true
      },
      {
        "key": "highTriggerWindowEndDate",
        "label": "High Trig. End",
        "type": "date",
        "required": false
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "contingentAmount": 1000000,
      "leveragedNotional": 2000000,
      "enhancedRate": 0.665,
      "protectionRate": 0.645,
      "lowTrigger": 0.605,
      "highTrigger": 0.705
    },
    "termsheet": {
      "outline": [
        "A Knock Out Reset (LEV) is a type of Structured Option that combines two {PAIR} Bought Vanilla Put Double Barrier Options and two Sold Vanilla Call Double Barrier Options.",
        "The Leveraged Knock-Out Reset has the same basic features as a Knock-Out Reset, with the exception that the Enhanced Rate, the Reset Rate and/or the Knock-In/Out Rates are enhanced relative to the Knock-Out Reset. The reason for this is that if the Spot Rate triggers the Knock-In/Out Rate you will be obligated to trade an amount in excess of the standard Knock-Out Reset."
      ],
      "benefits": [
        "Ability to achieve an Enhanced Rate over the comparative Forward Exchange Rate if the Knock-In/Out Rate has not been triggered.",
        "Protection at all time with a known worst case Exchange Rate."
      ],
      "risks": [
        "If either Knock-In/Out Rate is triggered you will be trading at the Reset Rate in a multiple of the Notional Amount (Notional Amount multiplied by the Leverage Ratio) that is less favourable than the comparative Forward Exchange Rate.",
        "There is potential to be transacting at an Exchange Rate that is less favourable than the Spot Rate at Expiry."
      ]
    }
  },
  "Collar": {
    "name": "Collar",
    "classification": "Protect",
    "family": "collar",
    "dropdownFamily": "Participating / Collar",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leveraged",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "participationRate",
        "label": "Participation Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "protectionRate": 0.6705,
      "participationRate": 0.6395
    },
    "termsheet": {
      "outline": [
        "A Collar is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Put Option and a Sold Vanilla Call Option.",
        "A Collar allows you to protect against the risk that the Spot Rate will be less favourable than a nominated Exchange Rate (the \"Protection Rate\"). It also gives you the ability to participate in favourable movements in the Spot Rate between the Protection Rate and a Participation Rate."
      ],
      "benefits": [
        "There is protection at all times with a known worst case Protection Rate.",
        "An ability to participate in favourable Exchange Rate movements to the level of Participation Rate."
      ],
      "risks": [
        "Participation in favourable Exchange Rate movements is capped at the Participation Rate.",
        "If the Spot Rate at Expiry is more favourable than the Participation Rate you will be obligated to trade at the Participation Rate."
      ]
    }
  },
  "Collar (LEV)": {
    "name": "Collar (LEV)",
    "classification": "Enhanced",
    "family": "collar",
    "dropdownFamily": "Participating / Collar",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leveraged",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "participationRate",
        "label": "Participation Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "protectionRate": 0.6705,
      "participationRate": 0.6395
    },
    "termsheet": {
      "outline": [
        "A Collar is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Put Option and a Sold Vanilla Call Option.",
        "A Collar allows you to protect against the risk that the Spot Rate will be less favourable than a nominated Exchange Rate (the \"Protection Rate\"). It also gives you the ability to participate in favourable movements in the Spot Rate between the Protection Rate and a Participation Rate."
      ],
      "benefits": [
        "There is protection at all times with a known worst case Protection Rate.",
        "An ability to participate in favourable Exchange Rate movements to the level of Participation Rate."
      ],
      "risks": [
        "Participation in favourable Exchange Rate movements is capped at the Participation Rate.",
        "If the Spot Rate at Expiry is more favourable than the Participation Rate you will be obligated to trade at the Participation Rate."
      ]
    }
  },
  "Collar Plus": {
    "name": "Collar Plus",
    "classification": "Participation",
    "family": "collar-plus",
    "dropdownFamily": "Participating / Collar",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "participationRate",
        "label": "Participation Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutRate",
        "label": "KO Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "protectionRate": 0.655,
      "participationRate": 0.67,
      "knockOutRate": 0.655
    },
    "termsheet": {
      "outline": [
        "A Collar Plus is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Call Option, Sold Vanilla Put Option and a Bought Vanilla Call Barrier Option.",
        "The Collar Plus is a Structured Option which allows you to protect against the risk that the Spot Rate will be less favourable than a nominated Exchange Rate (the Protection Rate).  It also gives you the potential to achieve an Exchange Rate better than the Spot Rate if the market settles between the Protection Rate and the Participation Rate at the Expiry Time."
      ],
      "benefits": [
        "Ability to achieve a known Protection Rate at all times.",
        "Ability to deal at the participation rate should the market settle between the protection and participation rates and provided the knock out rate has not been triggered."
      ],
      "risks": [
        "Participation in favourable exchange rate movements is capped at the Participation rate.",
        "If the spot rate at the expiry time is more favourable than the participation rate you will be obligated to trade at the participation rate.",
        "The protection rate on the Collar Plus is typically worse than a comparable Collar."
      ]
    }
  },
  "Collar Plus (LEV)": {
    "name": "Collar Plus (LEV)",
    "classification": "Enhanced",
    "family": "collar-plus",
    "dropdownFamily": "Participating / Collar",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "contingentAmount",
        "label": "Contingent",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leveraged",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "participationRate",
        "label": "Participation Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutRate",
        "label": "KO Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "contingentAmount": 1000000,
      "leveragedNotional": 2000000,
      "protectionRate": 0.655,
      "participationRate": 0.715,
      "knockOutRate": 0.655
    },
    "termsheet": {
      "outline": [
        "A Leveraged Collar Plus is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Put Option, Sold Vanilla Call Option and a Bought Vanilla Put Barrier Option.",
        "The Leveraged Collar Plus has the same basic features as a Collar Plus, with the exception that the Protection Rate and/or the Participation Rate are enhanced relative to the Collar Plus. The reason for this is that if the market is more favourable than the Participation Rate at the Expiry Time you will be obligated to trade an amount in excess of the standard Collar Plus at the Participation Rate. The amount that you will be required to trade will depend on the Leverage Ratio that you have agreed to."
      ],
      "benefits": [
        "Ability to deal at the participation rate should the market settle between the protection and participation rates and provided the knock out rate has not been triggered.",
        "Ability to achieve a known Protection Rate at all times.",
        "Ability to achieve a Protection Rate that is significantly enhanced than what could be achieved under a comparable Collar Plus."
      ],
      "risks": [
        "Participation in favourable exchange rate movements is capped at the Participation rate.",
        "If the spot rate at the expiry time is more favourable than the participation rate you will be obligated to trade at the participation rate.",
        "The protection rate on the Collar Plus is typically worse than a comparable Collar."
      ]
    }
  },
  "Inverted Knock In": {
    "name": "Inverted Knock In",
    "classification": "Participation",
    "family": "inverted-knock-in",
    "dropdownFamily": "Knock-In family",
    "pair": "AUDEUR",
    "notionalCcy": "EUR",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInRate",
        "label": "KI Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "protectionRate": 0.655,
      "enhancedRate": 0.675,
      "knockInRate": 0.655
    },
    "termsheet": {
      "outline": [
        "An Inverted Knock In is a type of Structured Option that combines a(n) {PAIR} Bought Barrier Call Option and a Sold Vanilla Put Option.",
        "The Inverted Knock In is a Structured Option which protects against the risk that the Spot Rate will be less favourable than a nominated Foreign Exchange Rate (the Protection Rate) whilst giving the potential to take advantage of unfavourable currency movements beyond the level of a Knock-In Rate.  If the Knock-In Rate is triggered at Expiry you will  transact at the Enhanced Rate/Strike Rate."
      ],
      "benefits": [
        "Ability to achieve a known Protection Rate at all times.",
        "Ability to deal at the Enhanced Rate should the market settle beyond the Knock-In rate."
      ],
      "risks": [
        "Participation in unfavourable exchange rate movements is capped at the Enhanced rate.",
        "If the spot rate at the expiry time is more favourable than the protection rate you will be obligated to trade at the protection rate."
      ]
    }
  },
  "Inverted Knock In (LEV)": {
    "name": "Inverted Knock In (LEV)",
    "classification": "Enhanced",
    "family": "inverted-knock-in",
    "dropdownFamily": "Knock-In family",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "contingentAmount",
        "label": "Contingent",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leveraged",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInRate",
        "label": "KI Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "contingentAmount": 1000000,
      "leveragedNotional": 2000000,
      "protectionRate": 0.655,
      "enhancedRate": 0.675,
      "knockInRate": 0.655
    },
    "termsheet": {
      "outline": [
        "A Leveraged Inverted Knock In is a type of Structured Option that combines a(n) {PAIR} Bought Barrier Put Option and a Sold Vanilla Call Option.",
        "The Leveraged Inverted Knock In is a Structured Option which protects against the risk that the Spot Rate will be less favourable than a nominated Foreign Exchange Rate (the Protection Rate) whilst giving the potential to take advantage of unfavourable currency movements beyond the level of a Knock-In Rate.  If the Knock-In Rate is triggered at Expiry you will  transact at the Enhanced Rate/Strike Rate."
      ],
      "benefits": [
        "Ability to achieve a known Protection Rate at all times.",
        "Ability to deal at the Enhanced Rate should the market settle beyond the Knock-In rate."
      ],
      "risks": [
        "Participation in unfavourable exchange rate movements is capped at the Enhanced rate.",
        "If the spot rate at the expiry time is more favourable than the protection rate you will be obligated to trade at the protection rate."
      ]
    }
  },
  "Dynamic Forward": {
    "name": "Dynamic Forward",
    "classification": "Participation",
    "family": "dynamic-forward",
    "dropdownFamily": "Capped / Enhanced FEC",
    "pair": "AUDEUR",
    "notionalCcy": "EUR",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leveraged",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutTriggerRate",
        "label": "KO Trigger Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInTriggerRate",
        "label": "KI Trigger Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutTriggerWindowStartDate",
        "label": "KO Trigger Start",
        "type": "date",
        "required": true
      },
      {
        "key": "knockOutTriggerWindowEndDate",
        "label": "KO Trigger End",
        "type": "date",
        "required": true
      },
      {
        "key": "knockInTriggerWindowStartDate",
        "label": "KI Trigger Start",
        "type": "date",
        "required": true
      },
      {
        "key": "knockInTriggerWindowEndDate",
        "label": "KI Trigger End",
        "type": "date",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "enhancedRate": 0.655,
      "knockOutTriggerRate": 0.664,
      "knockInTriggerRate": 0.608,
      "knockOutTriggerWindowStartDate": "2026-09-09",
      "knockOutTriggerWindowEndDate": "2026-10-09",
      "knockInTriggerWindowStartDate": "2026-09-09",
      "knockInTriggerWindowEndDate": "2026-10-09"
    },
    "termsheet": {
      "outline": [
        "Dynamic Forward is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Call Barrier Option, Bought Vanilla Call Double Barrier Option, Sold Vanilla Put Double Barrier Option and a Bought Vanilla Put Double Barrier Option.",
        "A Leveraged Dynamic Forward offers a more favourable Enhanced Rate relative to the Dynamic Forward. The reason for this is that if the Spot Rate triggers the Knock-In Rate before Expiry (or during a Window) you may be obligated to trade a multiple of the Notional Amount at an Exchange Rate that is less favourable than the prevailing Spot Rate. The amount that you will be required to trade will depend on the Leverage Ratio that you have agreed to.\nA Leveraged Dynamic Forward gives you limited protection at an Enhanced Rate provided that a specified Knock Out Rate is not triggered before expiry (or during a Window). If this occurs the contract ceases to exist. A Leveraged Dynamic Forward also gives you the opportunity to improve versus the Enhanced Rate regardless of market direction, provided a Knock-In Rate also does not trigger before expiry (or during a Window). In the event that it does, you may be obligated at the Enhanced Rate for the Leveraged Amount. A Leveraged Dynamic Forward gives you an enhanced rate relative to a comparative FEC."
      ],
      "benefits": [
        "An ability to achieve a more favourable Enhanced Rate relative to a comparative standard Knock-Out.",
        "The possibility of achieving an improved Enhanced Rate relative regardless of market direction."
      ],
      "risks": [
        "If the Knock-Out Rate level is triggered, you will be left with no protection against unfavourable currency movements.",
        "If the Knock-In Rate is triggered and the Spot Rate is more favourable then the Enhanced Rate at Expiry you will be obligated to trade a multiple of the Notional Amount at the less favourable Enhanced Rate."
      ]
    }
  },
  "Dynamic Forward (LEV)": {
    "name": "Dynamic Forward (LEV)",
    "classification": "Enhanced",
    "family": "dynamic-forward",
    "dropdownFamily": "Capped / Enhanced FEC",
    "pair": "AUDEUR",
    "notionalCcy": "EUR",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leveraged",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutTriggerRate",
        "label": "KO Trigger Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInTriggerRate",
        "label": "KI Trigger Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutTriggerWindowStartDate",
        "label": "KO Trigger Start",
        "type": "date",
        "required": true
      },
      {
        "key": "knockOutTriggerWindowEndDate",
        "label": "KO Trigger End",
        "type": "date",
        "required": true
      },
      {
        "key": "knockInTriggerWindowStartDate",
        "label": "KI Trigger Start",
        "type": "date",
        "required": true
      },
      {
        "key": "knockInTriggerWindowEndDate",
        "label": "KI Trigger End",
        "type": "date",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "enhancedRate": 0.655,
      "knockOutTriggerRate": 0.664,
      "knockInTriggerRate": 0.608,
      "knockOutTriggerWindowStartDate": "2026-09-09",
      "knockOutTriggerWindowEndDate": "2026-10-09",
      "knockInTriggerWindowStartDate": "2026-09-09",
      "knockInTriggerWindowEndDate": "2026-10-09"
    },
    "termsheet": {
      "outline": [
        "Dynamic Forward  (LEV) is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Call Barrier Option, Bought Vanilla Call Double Barrier Option, Sold Vanilla Put Double Barrier Option and a Bought Vanilla Put Double Barrier Option.",
        "A Leveraged Dynamic Forward offers a more favourable Enhanced Rate relative to the Dynamic Forward. The reason for this is that if the Spot Rate triggers the Knock-In Rate before Expiry (or during a Window) you may be obligated to trade a multiple of the Notional Amount at an Exchange Rate that is less favourable than the prevailing Spot Rate. The amount that you will be required to trade will depend on the Leverage Ratio that you have agreed to.\nA Leveraged Dynamic Forward gives you limited protection at an Enhanced Rate provided that a specified Knock Out Rate is not triggered before expiry (or during a Window). If this occurs the contract ceases to exist. A Leveraged Dynamic Forward also gives you the opportunity to improve versus the Enhanced Rate regardless of market direction, provided a Knock-In Rate also does not trigger before expiry (or during a Window). In the event that it does, you may be obligated at the Enhanced Rate for the Leveraged Amount. A Leveraged Dynamic Forward gives you an enhanced rate relative to a comparative FEC."
      ],
      "benefits": [
        "An ability to achieve a more favourable Enhanced Rate relative to a comparative standard Knock-Out.",
        "The possibility of achieving an improved Enhanced Rate relative regardless of market direction."
      ],
      "risks": [
        "If the Knock-Out Rate level is triggered, you will be left with no protection against unfavourable currency movements.",
        "If the Knock-In Rate is triggered and the Spot Rate is more favourable then the Enhanced Rate at Expiry you will be obligated to trade a multiple of the Notional Amount at the less favourable Enhanced Rate."
      ]
    }
  },
  "Extendible": {
    "name": "Extendible",
    "classification": "Participation",
    "family": "extendible",
    "dropdownFamily": "Capped / Enhanced FEC",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "extendibleDate",
        "label": "Extend Date",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRateAndKnockInRate",
        "label": "Enhanced (& KI) Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "enhancedRateAndKnockInRate": 0.68
    },
    "termsheet": {
      "outline": [
        "An Extendible is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Put Option, a Sold Vanilla Call Option, a Bought Vanilla Put Barrier Option and a Sold Vanilla Call Barrier Option",
        "The Extendible Forward allows you to protect against the risk that the Spot Rate will be less favourable than the nominated Exchange Rate (the Protection Rate) whilst giving you the potential to have additional protection for a portion of your exposure, which we refer to as the ‘Extendible Amount’, for an additional period(s) after the first Expiry Date depending on the level of the Spot Rate on the first Expiry Date (or during a window)."
      ],
      "benefits": [
        "There is protection out to the First Expiry Date at a known worst case Protection Rate.",
        "Protection is at an Exchange Rate enhanced to a comparable FEC for both the first Expiry Date and the Second Expiry Date."
      ],
      "risks": [
        "If the Spot Rate is more favourable than the Protection Rate at the First Expiry Date, you will be obligated to trade at the less favourable Protection Rate.",
        "You will have an obligation to trade at a potentially unfavourable Spot Rate on the second Expiry Date, if the Knock-In Rate is triggered on the First Expiry Date (or during a Window).",
        "If the Knock-In Rate is not triggered on the First Expiry Date (or during a Window) you will not be protected for the Extendible Amount."
      ]
    }
  },
  "Extendible (LEV)": {
    "name": "Extendible (LEV)",
    "classification": "Enhanced",
    "family": "extendible",
    "dropdownFamily": "Capped / Enhanced FEC",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "extendibleDate",
        "label": "Extend Date",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "contingentAmount",
        "label": "Contingent",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRateAndKnockInRate",
        "label": "Enhanced (& KI) Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "contingentAmount": 1000000,
      "enhancedRateAndKnockInRate": 0.68
    },
    "termsheet": {
      "outline": [
        "An Extendible (LEV) is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Put Option, a Sold Vanilla Call Option, a Bought Vanilla Put Barrier Option and a Sold Vanilla Call Barrier Option",
        "A Leveraged Extendible Forward offers an enhanced Protection Rate relative to the Extendible Forward. The reason for this is that if the Spot Rate does trigger the Knock-In Rate on the first Expiry Date (or during a Window), you will be obligated to trade a multiple of the Notional Amount at an Exchange Rate that is less favourable than the prevailing Spot Rate. The amount that you will be required to trade will depend on the Leverage Ratio that you have agreed to. A Leveraged Extendible Forward is a Structured Option, which allows you to protect against the risk that the Spot Rate will be less favourable than the nominated Exchange Rate (the Protection Rate) whilst giving you the potential to have additional protection for a portion of your exposure, which we refer to as the ‘Extendible Amount’, for an additional period(s) after the first Expiry Date depending on the level of the Spot Rate on the first Expiry Date (or during a window)."
      ],
      "benefits": [
        "There is protection out to the First Expiry Date at a known worst case Protection Rate.",
        "A Leveraged Extendible Forward provides an enhanced Exchange Rate (Protection Rate) relative to a comparative FEC and standard Extendible Forward for both the first Expiry Date and the Second Expiry Date."
      ],
      "risks": [
        "If the Spot Rate is more favourable than the Protection Rate at the First Expiry Date, you will be obligated to trade at the less favourable Protection Rate.",
        "You will have an obligation to trade at a multiple of the Notional Amount at a potentially unfavourable Spot Rate at the Second Expiry Date if the Knock-In Rate is triggered on the First Expiry Date (or during a Window).",
        "If the Knock-In Rate is not triggered on the First Expiry Date (or during a Window) you will not be protected for the Extendible Amount."
      ]
    }
  },
  "Dynamic Improver": {
    "name": "Dynamic Improver",
    "classification": "Participation",
    "family": "dynamic-improver",
    "dropdownFamily": "Dynamic Improver",
    "pair": "AUDCNH",
    "notionalCcy": "CNH",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Ratio",
        "type": "currency",
        "required": true
      },
      {
        "key": "capRate",
        "label": "Cap Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutRate",
        "label": "KO Barrier",
        "type": "rate",
        "required": true
      },
      {
        "key": "windowStart",
        "label": "Window Start",
        "type": "date",
        "required": false
      },
      {
        "key": "windowEnd",
        "label": "Window End",
        "type": "date",
        "required": false
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "capRate": 0.69,
      "knockOutRate": 0.62,
      "windowStart": "2026-12-02",
      "windowEnd": "2026-12-09"
    },
    "termsheet": {
      "outline": [
        "The 'Dynamic Improver’ is a structured option designed to provide FX outperformance delivery rates when the spot rate is between the ‘Knock Out Barrier’ and ‘Cap Rate'. It allows the potential for a dynamic expiry outcome from favorable movements in the 'Spot Rate' within a defined range established by the ‘Cap Rate’ and the ‘Knock Out Barrier’. Should the spot rate trade the passed 'Knock Out Barrier’, the trade will be knocked out."
      ],
      "benefits": [
        "Can provide a more favourable ‘Cap Rate’ than other FX Dynamic Structures.",
        "Allows some participation in moves higher in the spot market, albeit capped at the ‘Cap Rate’."
      ],
      "risks": [
        "The 'Dynamic Improver’ does not offer a guaranteed 'Budget Rate'.",
        "If the trade does ‘Knock-Out’ then you will be left un-hedged.",
        "Participation in moves higher are limited via the ‘Cap Rate’."
      ]
    }
  },
  "Dynamic Improver (LEV)": {
    "name": "Dynamic Improver (LEV)",
    "classification": "Enhanced",
    "family": "dynamic-improver",
    "dropdownFamily": "Dynamic Improver",
    "pair": "AUDCNH",
    "notionalCcy": "CNH",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Ratio",
        "type": "currency",
        "required": true
      },
      {
        "key": "capRate",
        "label": "Cap Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutRate",
        "label": "KO Barrier",
        "type": "rate",
        "required": true
      },
      {
        "key": "windowStart",
        "label": "Window Start",
        "type": "date",
        "required": false
      },
      {
        "key": "windowEnd",
        "label": "Window End",
        "type": "date",
        "required": false
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "capRate": 0.69,
      "knockOutRate": 0.62,
      "windowStart": "2026-12-02",
      "windowEnd": "2026-12-09"
    },
    "termsheet": {
      "outline": [
        "The 'Dynamic Improver (LEV)’ is a structured option designed to provide FX outperformance delivery rates when the spot rate is between the ‘Knock Out Barrier’ and ‘Cap Rate'. The leveraged variant carries a larger Ratio Amount transacted at the Cap Rate, scaled from the master Leverage input. It allows the potential for a dynamic expiry outcome from favorable movements in the 'Spot Rate' within a defined range established by the ‘Cap Rate’ and the ‘Knock Out Barrier’. Should the spot rate trade the passed 'Knock Out Barrier’, the trade will be knocked out."
      ],
      "benefits": [
        "Can provide a more favourable ‘Cap Rate’ than other FX Dynamic Structures.",
        "Allows some participation in moves higher in the spot market, albeit capped at the ‘Cap Rate’."
      ],
      "risks": [
        "The 'Dynamic Improver (LEV)’ does not offer a guaranteed 'Budget Rate'.",
        "If the trade does ‘Knock-Out’ then you will be left un-hedged.",
        "Participation in moves higher are limited via the ‘Cap Rate’.",
        "At/past the Cap, you must deal the LEVERAGED Ratio Amount at the Cap rate — a multiple of the Notional Amount."
      ]
    }
  },
  "Knock In Improver": {
    "name": "Knock In Improver",
    "classification": "Participation",
    "family": "knock-in-improver",
    "dropdownFamily": "Knock-In family",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutTriggerRate",
        "label": "KO Trigger Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInTriggerRate",
        "label": "KI Trigger Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutTriggerWindowStartDate",
        "label": "KO Trigger Start",
        "type": "date",
        "required": true
      },
      {
        "key": "knockOutTriggerWindowEndDate",
        "label": "KO Trigger End",
        "type": "date",
        "required": true
      },
      {
        "key": "knockInTriggerWindowStartDate",
        "label": "KI Trigger Start",
        "type": "date",
        "required": true
      },
      {
        "key": "knockInTriggerWindowEndDate",
        "label": "KI Trigger End",
        "type": "date",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "protectionRate": 0.655,
      "knockOutTriggerRate": 0.635,
      "knockInTriggerRate": 0.673,
      "knockOutTriggerWindowStartDate": "2026-09-09",
      "knockOutTriggerWindowEndDate": "2026-10-09",
      "knockInTriggerWindowStartDate": "2026-09-09",
      "knockInTriggerWindowEndDate": "2026-10-09"
    },
    "termsheet": {
      "outline": [
        "A Knock In Improver is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Put Option, a Bought Vanilla Put Double Barrier Option and a Sold Vanilla Call Double Barrier Option.",
        "A Knock-In Improver allows you to protect against the risk that the Spot Rate will be less favourable than the nominated Exchange Rate (the Protection Rate) whilst giving you the potential to take advantage of favourable currency movements, or improve the Protection Rate should either of the Knock-In Rates or the Knock-Out Rates not be triggered."
      ],
      "benefits": [
        "Protection at all time with a known worst case Exchange Rate.",
        "An ability to transact at the market Spot Rate at Expiry (should either the Knock-In Rate or the Knock-Out Rate not be triggered).",
        "An ability to see the overall Protection Rate improve if the Spot Rate is less favourable than the Protection Rate and either Knock-In Rate or the Knock-Out Rate is not triggered.",
        "An ability to achieve a Protection Rate that is significantly enhanced than achievable under a Forward Exchange Contract."
      ],
      "risks": [
        "The Protection Rate will be less favourable than the Exchange Rate applicable to a comparable Forward Exchange Contract.",
        "Participation in favourable Exchange Rate movements is capped at the Knock-In Rate.",
        "If either the Knock-In Rate or Knock-Out Rate is triggered you will be obligated to trade at a potentially unfavourable Protection Rate."
      ]
    }
  },
  "Knock In Improver (LEV)": {
    "name": "Knock In Improver (LEV)",
    "classification": "Enhanced",
    "family": "knock-in-improver",
    "dropdownFamily": "Knock-In family",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "contingentAmount",
        "label": "Contingent",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leveraged",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutTriggerRate",
        "label": "KO Trigger Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInTriggerRate",
        "label": "KI Trigger Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutTriggerWindowStartDate",
        "label": "KO Trigger Start",
        "type": "date",
        "required": true
      },
      {
        "key": "knockOutTriggerWindowEndDate",
        "label": "KO Trigger End",
        "type": "date",
        "required": true
      },
      {
        "key": "knockInTriggerWindowStartDate",
        "label": "KI Trigger Start",
        "type": "date",
        "required": true
      },
      {
        "key": "knockInTriggerWindowEndDate",
        "label": "KI Trigger End",
        "type": "date",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "protectionRate": 0.655,
      "knockOutTriggerRate": 0.6425,
      "knockInTriggerRate": 0.6755,
      "knockOutTriggerWindowStartDate": "2026-09-09",
      "knockOutTriggerWindowEndDate": "2026-10-09",
      "knockInTriggerWindowStartDate": "2026-09-09",
      "knockInTriggerWindowEndDate": "2026-10-09"
    },
    "termsheet": {
      "outline": [
        "A Knock In Improver (LEV) is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Put Option, a Bought Vanilla Put Double Barrier Option and a Sold Vanilla Call Double Barrier Option.",
        "A Leveraged Knock-In Improver offers an enhanced Protection Rate relative to the Knock-In Improver. The reason for this is that if the Spot Rate triggers either of the Knock-In Rates or the Knock-Out Rates before Expiry (or during a Window) you may be obligated to trade a multiple of the Notional Amount at an Exchange Rate that is less favourable than the prevailing Spot Rate. The amount that you will be required to trade will depend on the Leverage Ratio that you have agreed to.\nA Leveraged Knock-In Improver is a Structured Option which allows you to protect against the risk that the Spot Rate will be less favourable than the nominated Exchange Rate (the Protection Rate) whilst giving you the potential to take advantage of favourable currency movements, or improve the Protection Rate should either of the Knock-In Rates or the Knock-Out Rates not be triggered."
      ],
      "benefits": [
        "Protection at all times at a known worst case Protection Rate.",
        "An ability to transact at the market Spot Rate at Expiry (should either Knock-In Rate or the Knock-Out Rate not be triggered).",
        "An ability to see the overall Protection Rate improve if the Spot Rate is less favourable than the Protection Rate and either Knock-In Rate or the Knock-Out Rate is not triggered.",
        "An ability to achieve a Protection Rate that is significantly enhanced than achievable under a Forward Exchange Contract."
      ],
      "risks": [
        "If the Spot Rate is more favourable at Expiry than the Protection Rate, and either the Knock-In Rate or the Knock-Out Rate is triggered, you will be obligated to trade a multiple of the Notional Amount at a less favourable Exchange Rate than the market Spot Rate at Expiry.",
        "If either the Knock-In Rate or Knock-Out Rate is triggered you will be obligated to trade at a potentially unfavourable Protection Rate.",
        "Due to the Leverage Ratio, there is less protection compared to the Knock-in Reset, Forward Exchange Contract and other unleveraged Structured Option products."
      ]
    }
  },
  "Tracker": {
    "name": "Tracker",
    "classification": "Protect",
    "family": "tracker",
    "dropdownFamily": "Capped / Enhanced FEC",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notionalProtectionAmount",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "limitRate",
        "label": "Limit Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notionalProtectionAmount": 1000000,
      "protectionRate": 0.645,
      "limitRate": 0.665
    },
    "termsheet": {
      "outline": [
        "A Tracker is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Put Option, Bought Vanilla Call Option and a Sold Vanilla Call Option.",
        "A Tracker allows you to protect against the risk that the Spot Rate will be less favourable than a nominated worst case Exchange Rate (the Protection Rate), whilst giving you the potential to improve the Protection Rate should the Spot Rate be more favourable than the Limit Rate."
      ],
      "benefits": [
        "Protection at all times with a known worst-case Exchange Rate.",
        "An ability to improve the Protection Rate if the Spot Rate at Expiry is more favourable than the Limit Rate."
      ],
      "risks": [
        "The unadjusted Protection Rate will be less favourable than the Exchange Rate applicable to a comparable FEC.",
        "If the Spot Rate at Expiry is more favourable than the Protection Rate or the Limit Rate you will be obligated to trade at an unfavourable Exchange Rate relative to the Spot Rate (although this Exchange Rate may be adjusted favourably if the Spot Rate is more favourable than the Limit Rate).",
        "Participation in favourable Exchange Rate movements is reduced by the difference between the Limit Rate and the Protection Rate."
      ]
    }
  },
  "Tracker (LEV)": {
    "name": "Tracker (LEV)",
    "classification": "Enhanced",
    "family": "tracker",
    "dropdownFamily": "Capped / Enhanced FEC",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notionalProtectionAmount",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leverage",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "limitRate",
        "label": "Limit Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notionalProtectionAmount": 1000000,
      "leveragedNotional": 2000000,
      "protectionRate": 0.645,
      "limitRate": 0.665
    },
    "termsheet": {
      "outline": [
        "A Tracker (LEV) is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Put Option, Bought Vanilla Call Option and a Sold Vanilla Call Option.",
        "A Leveraged Tracker allows you to protect against the risk that the Spot Rate will be less favourable than a nominated worst case Exchange Rate (the Protection Rate), whilst giving you the potential to improve the Protection Rate should the Spot Rate be more favourable than the Limit Rate.",
        "A Leveraged Tracker however offers an enhanced Protection Rate relative to the Tracker. The reason for this is that you may be required to trade a multiple of the Notional Amount at an Exchange Rate that is less favourable than the prevailing Spot Rate at Expiry. The amount that you will be required to trade will depend on the Leverage Ratio that you have agreed to."
      ],
      "benefits": [
        "Protection at all times with a known worst-case Exchange Rate.",
        "An ability to improve the Protection Rate if the Spot Rate at Expiry is more favourable than the Limit Rate.",
        "An ability to achieve a more favourable Protection Rate and/or a Limit Rate relative to an unleveraged Tracker."
      ],
      "risks": [
        "The unadjusted Protection Rate will be less favourable than the Exchange Rate applicable to a comparable FEC.",
        "If the Spot Rate at Expiry is more favourable than the Protection Rate or the Limit Rate you will be obligated to trade at an unfavourable Exchange Rate relative to the Spot Rate (although this Exchange Rate may be adjusted favourably if the Spot Rate is more favourable than the Limit Rate).",
        "Participation in favourable Exchange Rate movements is reduced by the difference between the Limit Rate and the Protection Rate.",
        "If the Spot Rate at Expiry is more favourable than the Protection Rate, you will be obligated to trade a multiple of the Notional Amount, determined by the Leverage Ratio, at the less favourable Protection Rate.",
        "Due to the Leverage Ratio, there is less protection compared to other unleveraged Structured Option products."
      ]
    }
  },
  "Capped FEC": {
    "name": "Capped FEC",
    "classification": "Enhanced",
    "family": "capped-fec",
    "dropdownFamily": "Capped / Enhanced FEC",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "variationAmount",
        "label": "Variation",
        "type": "currency",
        "required": true
      },
      {
        "key": "variationRate",
        "label": "Variation Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "enhancedRate": 0.665,
      "variationAmount": 1000000,
      "variationRate": 0.645
    },
    "termsheet": {
      "outline": [
        "A Capped FEC is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Call Option, Sold Vanilla Put Option and a Sold Vanilla Call Option.",
        "A Capped Forward protects against the risk that the Spot Rate will be less favourable than a nominated Enhanced Rate. If the Spot Rate is less favourable than a Variation Rate at Expiry, the Enhanced Rate will be adjusted for the difference in the Variation Rate and the Spot Rate. Due to this feature, the Enhanced Rate obtained at Expiry may be less favourable than the Enhanced Rate agreed at Trade Date."
      ],
      "benefits": [
        "An ability to achieve an Enhanced Rate relative to an equivalent FEC.",
        "If the Spot Rate is less favourable than the Variation Rate (0.7400), say 0.7000 the importer will be obligated to buy USD100,000 at an adjusted Enhanced Rate of 0.7312 (adjusted for the difference in the Variation Rate and the Spot Rate)."
      ],
      "risks": [
        "The Enhanced Rate will deteriorate as the Spot Rate moves unfavourably relative to the Variation Rate.",
        "The contract cannot be pre-delivered before expiry.",
        "If the Spot Rate at Expiry is more favourable than the Enhanced Rate you will be obligated to trade at the Enhanced Rate."
      ]
    }
  },
  "Capped FEC (LEV)": {
    "name": "Capped FEC (LEV)",
    "classification": "Enhanced",
    "family": "capped-fec",
    "dropdownFamily": "Capped / Enhanced FEC",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leveraged",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "variationAmount",
        "label": "Variation",
        "type": "currency",
        "required": true
      },
      {
        "key": "variationRate",
        "label": "Variation Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "enhancedRate": 0.6738,
      "variationAmount": 1000000,
      "variationRate": 0.6362
    },
    "termsheet": {
      "outline": [
        "A Capped FEC (LEV) is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Call Option, Sold Vanilla Put Option and a Sold Vanilla Call Option.",
        "A Leveraged Capped Forward protects against the risk that the Spot Rate will be less favourable than a nominated Enhanced Rate. If the Spot Rate is less favourable than a Variation Rate at Expiry, the Enhanced Rate will be adjusted for the difference in the Variation Rate and the Spot Rate. Due to this feature, the Enhanced Rate obtained at Expiry may be less favourable than the Enhanced Rate agreed at Trade Date.",
        "A Leveraged Capped Forward however offers a more favourable Enhanced Rate and/or Variation Rate relative to the Capped Forward. The reason for this is that you may be required to trade a multiple of the Notional Amount at an Enhanced Rate that is less favourable than the prevailing Spot Rate at Expiry. The amount that you will be required to trade will depend on the Leverage Ratio that you have agreed to."
      ],
      "benefits": [
        "An ability to achieve an Enhanced Rate relative to an equivalent FEC",
        "The Enhanced Rate will always be more favourable than the Spot Rate when the Spot Rate is less favourable than the Variation Rate.",
        "An ability to achieve a more favourable Enhanced Rate and/or Variation Rate relative to an unleveraged Capped Forward."
      ],
      "risks": [
        "The Enhanced Rate will deteriorate as the Spot Rate moves unfavourably relative to the Variation Rate.",
        "The contract cannot be pre-delivered before expiry",
        "If the Spot Rate at Expiry is more favourable than the Enhanced Rate you will be obligated to trade at the Enhanced Rate",
        "If the Spot Rate at Expiry is more favourable than the Enhanced Rate you will be obligated to trade a multiple of the Notional Amount, determined by the Leverage Ratio, at the less favourable Enhanced Rate.",
        "Due to the Leverage Ratio, there is less protection compared to other unleveraged Structured Option products."
      ]
    }
  },
  "Capped FEC w Protection": {
    "name": "Capped FEC w Protection",
    "classification": "Participation",
    "family": "capped-fec-protect",
    "dropdownFamily": "Capped / Enhanced FEC",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "variationAmount",
        "label": "Variation",
        "type": "currency",
        "required": true
      },
      {
        "key": "variationRate",
        "label": "Variation Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "enhancedRate": 0.66,
      "variationAmount": 1000000,
      "variationRate": 0.655,
      "protectionRate": 0.63
    },
    "termsheet": {
      "outline": [
        "A Capped FEC w Protection is a type of Structured Option that combines two {PAIR} Bought Vanilla Call Options, a Sold Vanilla Put Option and a Sold Vanilla Call Option.",
        "A Capped Forward with Protection allows you to protect against the risk that the Spot Rate will be less favourable than a nominated worst-case Exchange Rate (the Protection Rate), whilst giving you the potential to transact at an Enhanced Rate. If the Spot Rate is less favourable than a Variation Rate at Expiry, the Enhanced Rate will be adjusted for the difference in the Variation Rate and the Spot Rate. Due to this feature, the Enhanced Rate obtained on Expiry may be less favourable than the Enhanced Rate agreed at Trade Date. This deterioration in the Enhanced Rate will cease if the Spot Rate is less favourable than the Protection Rate."
      ],
      "benefits": [
        "An ability to achieve an Enhanced Rate relative to an equivalent FEC.",
        "The Enhanced Rate will always be more favourable than the Protection Rate.",
        "There is always protection with a known worse case Exchange Rate."
      ],
      "risks": [
        "The Enhanced Rate will deteriorate as the Spot Rate moves unfavourably below the Variation Rate.",
        "The contract cannot be pre-delivered at the Enhanced Rate before Expiry.",
        "If the Spot Rate at Expiry is more favourable than the Enhanced Rate you will be obligated to trade at the Enhanced Rate."
      ]
    }
  },
  "Capped FEC w Protection (LEV)": {
    "name": "Capped FEC w Protection (LEV)",
    "classification": "Enhanced",
    "family": "capped-fec-protect",
    "dropdownFamily": "Capped / Enhanced FEC",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leverage",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "variationAmount",
        "label": "Variation",
        "type": "currency",
        "required": true
      },
      {
        "key": "variationRate",
        "label": "Variation Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "enhancedRate": 0.673,
      "variationAmount": 1000000,
      "variationRate": 0.655,
      "protectionRate": 0.61
    },
    "termsheet": {
      "outline": [
        "A Capped FEC w Protection (LEV) is a type of Structured Option that combines two {PAIR} Bought Vanilla Call Options, a Sold Vanilla Put Option and a Sold Vanilla Call Option.",
        "A Leveraged Capped Forward with Protection allows you to protect against the risk that the Spot Rate will be less favourable than a nominated worst-case Exchange Rate (the Protection Rate), whilst giving you the potential transact at an Enhanced Rate. If the Spot Rate is less favourable than a Variation Rate at Expiry, the Enhanced Rate will be adjusted for the difference in the Variation Rate and the Spot Rate. Due to this feature, the Enhanced Rate obtained on Expiry may be less favourable than the Enhanced Rate agreed at Trade Date. This deterioration in the Enhanced Rate will cease if the Spot Rate is less favourable than the Protection Rate.",
        "A Leveraged Capped Forward with Protection however offers a more favourable Enhanced Rate and/or Variation Rate relative to the Capped Forward with Protection. The reason for this is that you may be required to trade a multiple of the Notional Amount at an Enhanced Rate that is less favourable than the prevailing Spot Rate at Expiry. The amount that you will be required to trade will depend on the Leverage Ratio that you have agreed to."
      ],
      "benefits": [
        "An ability to achieve an Enhanced Rate relative to an equivalent FEC.",
        "The Enhanced Rate will always be more favourable than the Protection Rate.",
        "There is always protection with a known worse case Exchange Rate.",
        "An ability to achieve a more favourable Enhanced Rate and/or Variation Rate and/or Protection Rate than the unleveraged Capped Forward with Protection."
      ],
      "risks": [
        "The Enhanced Rate will deteriorate as the Spot Rate moves unfavourably below the Variation Rate.",
        "The contract cannot be pre-delivered at the Enhanced Rate before Expiry.",
        "If the Spot Rate at Expiry is more favourable than the Enhanced Rate you will be obligated to trade at the Enhanced Rate.",
        "If the Spot Rate at Expiry is more favourable than the Enhanced Rate you will be obligated to trade a multiple of the Notional Amount, determined by the Leverage Ratio, at the less favourable Enhanced Rate.",
        "Due to the Leverage Ratio, there is less protection compared to other unleveraged Structured Option products."
      ]
    }
  },
  "Seagull": {
    "name": "Seagull",
    "classification": "Enhanced",
    "family": "seagull",
    "dropdownFamily": "Capped / Enhanced FEC",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "participationRate",
        "label": "Participation Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "variationRate",
        "label": "Variation Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "enhancedRate": 0.655,
      "participationRate": 0.67,
      "variationRate": 0.64
    },
    "termsheet": {
      "outline": [
        "A Seagull is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Put Option, Sold Vanilla Call Option and a Sold Vanilla Put Option.",
        "A Seagull protects against the risk that the Spot Rate will be less favourable than a nominated Enhanced Rate at Trade Date, along with the ability to participate in a more favourable Spot Rate to the level of a Participation Rate. Should the Spot Rate be less favourable, than a Variation Rate at Expiry, the Enhanced Rate will be adjusted for the difference in the Variation Rate and the Spot Rate. Due to this feature the Enhanced Rate, obtained on Expiry, may be less favourable than the Enhanced Rate agreed at Trade Date."
      ],
      "benefits": [
        "An ability to achieve an Enhanced Rate relative to an equivalent FEC.",
        "Ability to participate in favourable moves up to the Participation Rate.",
        "The Enhanced Rate will more favourable than the Spot Rate even when the Spot Rate is less favourable than the Variation Rate."
      ],
      "risks": [
        "The Enhanced Rate will depreciate as the Spot Rate moves unfavourably.",
        "The contract cannot be pre-delivered before the Expiry Date.",
        "If the Spot Rate at Expiry is more favourable than the Participation Rate you will be obligated to trade at the less favourable Participation Rate."
      ]
    }
  },
  "Seagull (LEV)": {
    "name": "Seagull (LEV)",
    "classification": "Enhanced",
    "family": "seagull",
    "dropdownFamily": "Capped / Enhanced FEC",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leveraged",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "participationRate",
        "label": "Participation Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "variationRate",
        "label": "Variation Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "enhancedRate": 0.655,
      "participationRate": 0.6825,
      "variationRate": 0.635
    },
    "termsheet": {
      "outline": [
        "A Seagull (LEV) is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Call Option, Sold Vanilla Put Option and a Sold Vanilla Call Option.",
        "A Seagull protects against the risk that the Spot Rate will be less favourable than a nominated Enhanced Rate at Trade Date, along with the ability to participate in a more favourable Spot Rate to the level of a Participation Rate. Should the Spot Rate be less favourable, than a Variation Rate at Expiry, the Enhanced Rate will be adjusted for the difference in the Variation Rate and the Spot Rate. Due to this feature the Enhanced Rate, obtained on Expiry, may be less favourable than the Enhanced Rate agreed at Trade Date.",
        "A Leveraged Seagull however offers a more favourable Enhanced Rate, Participation Rate and/or Variation Rate relative to the Seagull. The reason for this is that you may be required to trade a multiple of the Notional Amount at an Participation Rate that is less favourable than the prevailing Spot Rate at Expiry. The amount that you will be required to trade will depend on the Leverage Ratio that you have agreed to."
      ],
      "benefits": [
        "An ability to achieve an Enhanced Rate relative to an equivalent FEC.",
        "Ability to participate in favourable moves up to the Participation Rate.",
        "The Enhanced Rate will more favourable than the Spot Rate even when the Spot Rate is less favourable than the Variation Rate.",
        "The Enhanced Rate and/or the Variation Rate and/or Protection Rate will be more favourable than the unleveraged Seagull."
      ],
      "risks": [
        "The Enhanced Rate will depreciate as the Spot Rate moves unfavourably.",
        "The contract cannot be pre-delivered before the Expiry Date.",
        "If the Spot Rate at Expiry is more favourable than the Participation Rate you will be obligated to trade at the less favourable Participation Rate.",
        "If the Spot Rate at Expiry is more favourable than the Participation Rate you will be obligated to trade a multiple of the Notional Amount, determined by the Leverage Ratio, at the less favourable Participation Rate.",
        "Due to the Leverage Ratio, there is less protection compared to other unleveraged Structured Option products."
      ]
    }
  },
  "Enhanced FEC": {
    "name": "Enhanced FEC",
    "classification": "Enhanced",
    "family": "enhanced-fec",
    "dropdownFamily": "Capped / Enhanced FEC",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate1",
        "label": "Expiry 1",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "expiryDate2",
        "label": "Expiry 2",
        "type": "date",
        "required": true
      },
      {
        "key": "rate",
        "label": "Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "notional": 1000000,
      "enhancedRate": 0.68,
      "rate": 0.6938
    },
    "termsheet": {
      "outline": [
        "An Enhanced FEC is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Put Option and two Sold Vanilla Call Options.",
        "An Enhanced Forward gives you the ability to obtain an enhanced Exchange Rate relative to a comparative FEC at an Expiry Date in the future (first Expiry Date). If the Spot Rate is less favourable than the Enhanced Rate on a subsequent date (Second Expiry Date), you will be obligated to transact a second Notional Amount. An Enhanced Forward will always provide you with a guaranteed worst-case Exchange Rate (the Enhanced Rate) on the first Expiry Date."
      ],
      "benefits": [
        "Protection at a known worst-case Exchange Rate on the first Expiry Date.",
        "An ability to achieve an Enhanced Rate relative to the comparative FEC.",
        "The maximum obligation on the contracts can be realised across different Expiry Dates, minimising cash flow impact."
      ],
      "risks": [
        "Participation in favourable Exchange Rate movements is limited to the Enhanced Rate.",
        "There is no protection if the Spot Rate is less favourable than the Enhanced Rate on the second Expiry Date.",
        "If the Spot Rate is more favourable than the Enhanced Rate on the second Expiry Date you will be obligated to transact at the less favourable Enhanced Rate."
      ]
    }
  },
  "Enhanced FEC (LEV)": {
    "name": "Enhanced FEC (LEV)",
    "classification": "Enhanced",
    "family": "enhanced-fec",
    "dropdownFamily": "Capped / Enhanced FEC",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "expiryDate1",
        "label": "Expiry 1",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leveraged",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "expiryDate2",
        "label": "Expiry 2",
        "type": "date",
        "required": true
      },
      {
        "key": "rate",
        "label": "Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "enhancedRate": 0.68,
      "rate": 0.6938
    },
    "termsheet": {
      "outline": [
        "An Enhanced FEC (LEV) is a type of Structured Option that combines a(n) {PAIR} Bought Vanilla Put Option and two Sold Vanilla Call Options.",
        "A Leveraged Enhanced Forward gives you the ability to obtain an enhanced Exchange Rate relative to a comparative FEC at an Expiry Date in the future (first Expiry Date). If the Spot Rate is less favourable than the Enhanced Rate on a subsequent date (Second Expiry Date), you will be obligated to transact a second Notional Amount. An Enhanced Forward will always provide you with a guaranteed worst-case Exchange Rate (the Enhanced Rate) on the first Expiry Date.",
        "As there is a ratio component associated with a Leveraged Enhanced Forward you may be required to trade a multiple of the Notional Amount at the strike rate on the first or second expiry that is less favourable than the prevailing Spot Rate at that Expiry. The amount that you will be required to trade will depend on the Leverage Ratio that you have agreed to."
      ],
      "benefits": [
        "Protection at a known worst-case Exchange Rate on the first Expiry Date.",
        "An ability to achieve an Enhanced Rate relative to the comparative FEC.",
        "The maximum obligation on the contracts can be realised across different Expiry Dates, minimising cash flow impact.",
        "The Enhanced Rate will be more favourable than the unleveraged Enhanced Forward.",
        "The Leverage Ratio can be applied to either Expiry Date."
      ],
      "risks": [
        "Participation in favourable Exchange Rate movements is limited to the Enhanced Rate.",
        "There is no protection if the Spot Rate is less favourable than the Enhanced Rate on the second Expiry Date.",
        "If the Spot Rate is more favourable than the Enhanced Rate on the second Expiry Date you will be obligated to transact at the less favourable Enhanced Rate.",
        "If the Spot Rate at the agreed Expiry Date is more favourable than the Enhanced Rate you will be obligated to trade a multiple of the Notional Amount, determined by the Leverage Ratio, at the less favourable Enhanced Rate.",
        "Due to the Leverage Ratio, there is less protection compared to other unleveraged Structured Option products."
      ]
    }
  },
  "Knock In Barrier": {
    "name": "Knock In Barrier",
    "classification": "Enhanced",
    "family": "knock-in",
    "dropdownFamily": "Knock-In family",
    "pair": "AUDEUR",
    "notionalCcy": "EUR",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInRate",
        "label": "KI Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "windowStart",
        "label": "Window Start",
        "type": "date",
        "required": true
      },
      {
        "key": "windowEnd",
        "label": "Window End",
        "type": "date",
        "required": false
      },
      {
        "key": "premiumAmount",
        "label": "Premium",
        "type": "currency",
        "required": true
      },
      {
        "key": "premiumDate",
        "label": "Premium Date",
        "type": "date",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "protectionRate": 0.6535,
      "knockInRate": 0.6565,
      "windowStart": "2026-12-02",
      "premiumAmount": 20000,
      "premiumDate": "2026-06-11"
    },
    "termsheet": {
      "outline": [
        "A Vanilla Option is an agreement between two parties (in this case, with you as ”the buyer” of the Vanilla Option and we as the “the seller” of the Vanilla Option) that gives you the right but not the obligation to exchange an amount of one currency for an amount of another currency at an agreed Exchange Rate on an agreed date in the future (Expiry Date). A Vanilla Option may be a Put Option (a right to sell currency) or a Call Option (a right to buy currency).",
        "When you buy a Vanilla Option from we, it enables you to protect against a worst case Exchange Rate. It allows you to Hedge your currency exposure by providing protection against unfavourable currency movements between the time that you buy a Vanilla Option and the Expiry Date. At the same time, you are also able to participate in any favourable currency movements that exist on the Expiry Date. When you enter into a Vanilla Option you will be required to pay a non-refundable Premium for the Vanilla Option on the Premium Payment Date. Because you have bought the right but not the obligation to Exercise the Vanilla Option, you will not have to effect Settlement of the Vanilla Option if you elect not to Exercise."
      ],
      "benefits": [
        "A Vanilla Option bought from us provides protection against unfavourable movements in the Exchange Rate during the term of the Vanilla Option.",
        "Vanilla Options are flexible, where the Strike Rate, Trigger Rates, Expiry Date and Notional Amount can be tailored to your needs.",
        "Unless you Exercise your Vanilla Option you are not committed to exchange currencies at the Expiry Date (unless as a result of a Trigger Rate event a Knock-In Rate applies). Consequently, you are able to participate in favourable Exchange Rate movements."
      ],
      "risks": [
        "Market Volatility: The foreign exchange markets in which we operates are OTC and can change rapidly. These markets are speculative and volatile with the risk that prices will move quickly. When this occurs, your Vanilla Option may be worthless other than the time remaining to maturity. we cannot guarantee that you will be able to recover your Premium in the event that unfavourable exchange rates impact your Vanilla Option. You need to monitor your Vanilla Options with we carefully providing we with Instructions before unacceptable losses occur.",
        "Issuer Risk: When you enter into a Vanilla Option you are relying on we’s financial ability as Issuer to be able to perform its obligation to you. As a result you are exposed to the risk that we becomes insolvent and is unable to meet its obligations to you under a Vanilla Option. To assess our financial ability to meet our obligations to you, you can obtain a copy of our financial statements, free of charge by contacting your SwitchYard FX representative.",
        "Counterparty Risk: There is a risk that the Hedging Counterparties with whom we contract to mitigate its exposure when acting as principal to the Vanilla Option (by taking related offsetting or mitigating positions) may not be able to meet their contractual obligations to us. This means that we could be exposed to the insolvency of its Hedging Counterparties and to defaults by Hedging Counterparties. If a Hedging Counterparty is insolvent or defaults on its obligations to us, then this could give rise to a risk that we defaults on its obligations to you.",
        "Cooling-off: There is no cooling-off period. This means that once your Instruction to enter into a Vanilla Option has been accepted by we you are unable to cancel your Vanilla Option without incurring a cost.",
        "Default Risk: In accordance with the Terms and Conditions, if you fail to pay the Premium on the Premium Payment Date, we are not obliged to accept Exercise and may terminate the Vanilla Option and recover all costs and expenses incurred in connection with the Vanilla Option, including payment of the Premium, which shall remain due and payable as a debt. Similarly, if you fail to provide Settlement on the Value Date we may terminate your Vanilla Option. In such event, you will be liable for all costs and expenses that we incur.",
        "Conflicts of interest: we enters into transactions with a number of different clients and Hedging Counterparties that may be in conflict with your interests under the Vanilla Option(s) you have entered into with us. we are not required to prioritise your interests when dealing in Vanilla Options with you.",
        "Trigger Rate risk: For Vanilla Options that have a Trigger Rate, there is the risk that the Vanilla Option may not exist at Expiry because a Trigger Rate has been triggered (in the case of a Knock-Out Rate) or not triggered (in the case of a Knock-In Rate)."
      ]
    }
  },
  "Knock Out Barrier": {
    "name": "Knock Out Barrier",
    "classification": "Enhanced",
    "family": "knock-out",
    "dropdownFamily": "Knock-Out family",
    "pair": "AUDEUR",
    "notionalCcy": "EUR",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockOutRate",
        "label": "KO Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "windowStart",
        "label": "Window Start",
        "type": "date",
        "required": true
      },
      {
        "key": "windowEnd",
        "label": "Window End",
        "type": "date",
        "required": false
      },
      {
        "key": "premiumAmount",
        "label": "Premium",
        "type": "currency",
        "required": true
      },
      {
        "key": "premiumDate",
        "label": "Premium Date",
        "type": "date",
        "required": true
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "protectionRate": 0.64,
      "knockOutRate": 0.67,
      "windowStart": "2026-12-02",
      "premiumAmount": 20000,
      "premiumDate": "2026-06-11"
    },
    "termsheet": {
      "outline": [
        "A Vanilla Option is an agreement between two parties (in this case, with you as ”the buyer” of the Vanilla Option and we as the “the seller” of the Vanilla Option) that gives you the right but not the obligation to exchange an amount of one currency for an amount of another currency at an agreed Exchange Rate on an agreed date in the future (Expiry Date). A Vanilla Option may be a Put Option (a right to sell currency) or a Call Option (a right to buy currency).",
        "When you buy a Vanilla Option from we, it enables you to protect against a worst case Exchange Rate. It allows you to Hedge your currency exposure by providing protection against unfavourable currency movements between the time that you buy a Vanilla Option and the Expiry Date. At the same time, you are also able to participate in any favourable currency movements that exist on the Expiry Date. When you enter into a Vanilla Option you will be required to pay a non-refundable Premium for the Vanilla Option on the Premium Payment Date. Because you have bought the right but not the obligation to Exercise the Vanilla Option, you will not have to effect Settlement of the Vanilla Option if you elect not to Exercise."
      ],
      "benefits": [
        "A Vanilla Option bought from us provides protection against unfavourable movements in the Exchange Rate during the term of the Vanilla Option.",
        "Vanilla Options are flexible, where the Strike Rate, Trigger Rates, Expiry Date and Notional Amount can be tailored to your needs.",
        "Unless you Exercise your Vanilla Option you are not committed to exchange currencies at the Expiry Date (unless as a result of a Trigger Rate event a Knock-In Rate applies). Consequently, you are able to participate in favourable Exchange Rate movements."
      ],
      "risks": [
        "Market Volatility: The foreign exchange markets in which we operates are OTC and can change rapidly. These markets are speculative and volatile with the risk that prices will move quickly. When this occurs, your Vanilla Option may be worthless other than the time remaining to maturity. we cannot guarantee that you will be able to recover your Premium in the event that unfavourable exchange rates impact your Vanilla Option. You need to monitor your Vanilla Options with we carefully providing we with Instructions before unacceptable losses occur.",
        "Issuer Risk: When you enter into a Vanilla Option you are relying on we’s financial ability as Issuer to be able to perform its obligation to you. As a result you are exposed to the risk that we becomes insolvent and is unable to meet its obligations to you under a Vanilla Option. To assess our financial ability to meet our obligations to you, you can obtain a copy of our financial statements, free of charge by contacting your SwitchYard FX representative.",
        "Counterparty Risk: There is a risk that the Hedging Counterparties with whom we contract to mitigate its exposure when acting as principal to the Vanilla Option (by taking related offsetting or mitigating positions) may not be able to meet their contractual obligations to us. This means that we could be exposed to the insolvency of its Hedging Counterparties and to defaults by Hedging Counterparties. If a Hedging Counterparty is insolvent or defaults on its obligations to us, then this could give rise to a risk that we defaults on its obligations to you.",
        "Cooling-off: There is no cooling-off period. This means that once your Instruction to enter into a Vanilla Option has been accepted by we you are unable to cancel your Vanilla Option without incurring a cost.",
        "Default Risk: In accordance with the Terms and Conditions, if you fail to pay the Premium on the Premium Payment Date, we are not obliged to accept Exercise and may terminate the Vanilla Option and recover all costs and expenses incurred in connection with the Vanilla Option, including payment of the Premium, which shall remain due and payable as a debt. Similarly, if you fail to provide Settlement on the Value Date we may terminate your Vanilla Option. In such event, you will be liable for all costs and expenses that we incur.",
        "Conflicts of interest: we enters into transactions with a number of different clients and Hedging Counterparties that may be in conflict with your interests under the Vanilla Option(s) you have entered into with us. we are not required to prioritise your interests when dealing in Vanilla Options with you.",
        "Trigger Rate risk: For Vanilla Options that have a Trigger Rate, there is the risk that the Vanilla Option may not exist at Expiry because a Trigger Rate has been triggered (in the case of a Knock-Out Rate) or not triggered (in the case of a Knock-In Rate). There is the additional risk that you could lose your level of protection if your Vanilla Option ceases to exist due to a Knock-Out Rate being triggered."
      ]
    }
  },
  "Sold Vanilla": {
    "name": "Sold Vanilla",
    "classification": "Enhanced",
    "family": "sold-vanilla",
    "dropdownFamily": "Linear / Vanilla",
    "pair": "AUDEUR",
    "notionalCcy": "EUR",
    "fields": [
      {
        "key": "expiryDate",
        "label": "Expiry",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "protectionRate",
        "label": "Protection Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "pips",
        "label": "Pips/%",
        "type": "number",
        "required": false
      }
    ],
    "sampleDefaults": {
      "expiryDate": "2026-12-09",
      "notional": 1000000,
      "protectionRate": 0.64
    },
    "termsheet": {
      "outline": [
        "A Vanilla Option is an agreement between two parties (in this case, with we as “the buyer” of the Vanilla Option and you as the “the seller” of the  Vanilla Option) that gives the buyer the right but not the obligation to exchange an amount of one currency for an amount of another currency at an agreed Exchange Rate on an agreed date in the future (Expiry Date). A Vanilla Option may be a Put Option (a right to sell currency) or a Call Option (a right to buy currency).",
        "When you sell a Vanilla Option to us, you will receive a Premium for the Vanilla Option. By selling a Vanilla Option to us, you grant us as the buyer, the right, but not the obligation, to buy from you an agreed amount of one currency for another currency at an agreed price (the Strike Rate) on the specified Expiry Date."
      ],
      "benefits": [
        "The Premium is paid to you upfront.",
        "The Premium to be received is known at the time the Vanilla Option is entered into.",
        "The Premium received can be used to offset a potentially unfavourable move in Exchange Rates."
      ],
      "risks": [
        "When you sell a Vanilla Option to us, you will be receiving from us a non-refundable Premium, in cleared funds, payable within two (2) Business Days of the Trade Date. we will pay the Premium in either Australian Dollars or one of the currencies in the Vanilla Option Currency Pair. However, it is important to understand that if you sell a Vanilla Option to us, your loss may be potentially unknown as the Premium received by you may not offset the impact of an unfavourable Spot Rate move.",
        "Market Volatility:  The foreign exchange markets in which we operates are OTC and can change rapidly. These markets are speculative and volatile with the risk that prices will move quickly. we cannot guarantee that you will not make losses, (where your Vanilla Option is Out-of-TheMoney (OTM)) or that any unrealised profit or losses will remain unchanged for the term of the Vanilla Option. You need to monitor your Vanilla Options with we carefully.",
        "There may be no protection: The sale of a Vanilla Option to us are not designed to provide protection against an unfavourable movement in the relevant currency. If the Spot Rate at expiry is more favourable to us than the Strike Rate, we will Exercise the Vanilla Option and you will be obligated to exchange currencies at an Exchange Rate that is unfavourable to you. The Premium received by you is designed to be used to potentially offset any potential unfavourable moves in the Spot Rate that may occur. However, the Premium received may not be enough to offset the total impact of the unfavourable Spot Rate at the Expiry Date.",
        "Delivery of currency: If we exercises the Vanilla Option, you are obligated to deliver your currency to us at the Strike Rate, which will be at an Exchange Rate that is unfavourable to you.  Furthermore, if we exercises the Vanilla Option and you do not have the currency you are required to deliver, you will need to purchase it at the unfavourable Exchange Rate, in order to meet your obligations.",
        "Unknown liability: If you have to purchase currency at an unfavourable Exchange Rate to meet your obligations this will result in a cost to you. This cost is potentially unknown.",
        "Cancellations: The close-out/cancellation of a Vanilla Option prior to maturity may result in a financial loss to you. we will provide a quote for such services based on market conditions prevailing at the time of your request.",
        "Cooling-off: There is no cooling-off period. This means that once an Instruction to enter into a Vanilla Option has been accepted, you are unable to cancel the sale of your Vanilla Option without incurring a cost."
      ]
    }
  },
  "TARF": {
    "name": "TARF",
    "classification": "Enhanced",
    "family": "tarf",
    "dropdownFamily": "TARF family",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "fixingDate",
        "label": "Fixing Date",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leverage",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "target",
        "label": "Target Points",
        "type": "number",
        "required": false
      }
    ],
    "sampleDefaults": {
      "fixingDate": "2026-07-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "enhancedRate": 0.68,
      "target": 500
    },
    "termsheet": {
      "outline": [
        "The Leveraged TARF is a Structured Option which allows you to protect against the risk that the Spot Rate will be less favourable than a nominated Exchange Rate (the Enhanced Rate) on certain nominated Expiry Dates during an agreed term provided that an agreed level of gain (the Target Bucket) has not already been reached. we expresses the Target Bucket as a number of foreign exchange points (Points). Once the Target Bucket has been redeemed the TARF will terminate."
      ],
      "benefits": [
        "An ability to achieve an Enhanced Rate relative to an equivalent FEC.",
        "The Enhanced Rate is likely to be more favourable than other products without a Leverage Ratio.",
        "Some level of protection is guaranteed from the outset equivalent to the number of Points in the Target Bucket.",
        "An ability to achieve an Enhanced Rate or more Target Bucket Points relative to a TARF without a Leverage Ratio.",
        "The Enhanced Rate is likely to be more favourable than other leveraged products."
      ],
      "risks": [
        "Once the Target Bucket has been redeemed there is no further protection. This may occur before the final Fixing Date, which may mean that the Notional Amount traded at the Enhanced Rate will be less than the maximum Notional Amount. Consequently, you may need to trade at a less favourable Spot Rate.",
        "If the Fixing Rate is more favourable than the Enhanced Rate on a Fixing Date (and the Target Bucket has not been redeemed) you will be obligated to trade at the less favourable Enhanced Rate on a Leveraged Amount.",
        "A Leveraged TARF generally has an extended Tenor compared to other Structured Option products and as a result there is a greater risk that during the term of a TARF the Enhanced Rate will no longer be favourable when compared to the prevailing Spot Rate.",
        "If the Fixing Rate is more favourable than the Enhanced Rate on the Fixing Date, you will be obligated to trade a multiple of the Notional Amount, determined by the Leverage Ratio, at the less favourable Enhanced Rate.",
        "Due to the Leverage Ratio that is applied, there may be less protection compared to a TARF without a Leverage Ratio and other Structured Option products without a Leverage Ratio."
      ]
    }
  },
  "TARF (LEV)": {
    "name": "TARF (LEV)",
    "classification": "Enhanced",
    "family": "tarf",
    "dropdownFamily": "TARF family",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "fixingDate",
        "label": "Fixing Date",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leverage",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "target",
        "label": "Target Points",
        "type": "number",
        "required": false
      }
    ],
    "sampleDefaults": {
      "fixingDate": "2026-07-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "enhancedRate": 0.68,
      "target": 500
    },
    "termsheet": {
      "outline": [
        "The Leveraged TARF is a Structured Option which allows you to protect against the risk that the Spot Rate will be less favourable than a nominated Exchange Rate (the Enhanced Rate) on certain nominated Expiry Dates during an agreed term provided that an agreed level of gain (the Target Bucket) has not already been reached. we expresses the Target Bucket as a number of foreign exchange points (Points). Once the Target Bucket has been redeemed the TARF will terminate."
      ],
      "benefits": [
        "An ability to achieve an Enhanced Rate relative to an equivalent FEC.",
        "The Enhanced Rate is likely to be more favourable than other products without a Leverage Ratio.",
        "Some level of protection is guaranteed from the outset equivalent to the number of Points in the Target Bucket.",
        "An ability to achieve an Enhanced Rate or more Target Bucket Points relative to a TARF without a Leverage Ratio.",
        "The Enhanced Rate is likely to be more favourable than other leveraged products."
      ],
      "risks": [
        "Once the Target Bucket has been redeemed there is no further protection. This may occur before the final Fixing Date, which may mean that the Notional Amount traded at the Enhanced Rate will be less than the maximum Notional Amount. Consequently, you may need to trade at a less favourable Spot Rate.",
        "If the Fixing Rate is more favourable than the Enhanced Rate on a Fixing Date (and the Target Bucket has not been redeemed) you will be obligated to trade at the less favourable Enhanced Rate on a Leveraged Amount.",
        "A Leveraged TARF generally has an extended Tenor compared to other Structured Option products and as a result there is a greater risk that during the term of a TARF the Enhanced Rate will no longer be favourable when compared to the prevailing Spot Rate.",
        "If the Fixing Rate is more favourable than the Enhanced Rate on the Fixing Date, you will be obligated to trade a multiple of the Notional Amount, determined by the Leverage Ratio, at the less favourable Enhanced Rate.",
        "Due to the Leverage Ratio that is applied, there may be less protection compared to a TARF without a Leverage Ratio and other Structured Option products without a Leverage Ratio."
      ]
    }
  },
  "EKI TARF": {
    "name": "EKI TARF",
    "classification": "Enhanced",
    "family": "eki-tarf",
    "dropdownFamily": "TARF family",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "fixingDate",
        "label": "Fixing Date",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leverage",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInRate",
        "label": "KI (At Expiry)",
        "type": "rate",
        "required": true
      },
      {
        "key": "target",
        "label": "Target Points",
        "type": "number",
        "required": false
      }
    ],
    "sampleDefaults": {
      "fixingDate": "2026-07-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "enhancedRate": 0.6472,
      "knockInRate": 0.6627,
      "target": 500
    },
    "termsheet": {
      "outline": [
        "A Leveraged  European Knock-In TARF is a Structured Option which allows you to protect against the risk that the Spot Rate will be less favourable than a nominated Exchange Rate (the Enhanced Rate) on certain nominated Fixing Dates during an agreed term provided that an agreed level of gain (the Target Bucket) has not already been reached. we expresses the Target Bucket as a number of Foreign Exchange Points (Points). Once the Target Bucket has been redeemed, the European Knock-In TARF will terminate. The European Knock-In TARF also allows for the potential to take advantage of favourable currency movements if the Knock-In Rate is not triggered, which is determined by the Fixing Rate on the Fixing Date. If the Knock-In Rate is triggered at the Fixing Time on the Fixing Date, you will transact at the less favourable Enhanced Rate."
      ],
      "benefits": [
        "An ability to achieve an Enhanced Rate relative to an equivalent FEC.",
        "Ability to participate in favourable Exchange Rate movements, provided the Knock-In Rate is not triggered by the Fixing Rate on a Fixing Date.",
        "The Enhanced Rate is likely to be more favourable than other products without a Leverage Ratio.",
        "A degree of protection is guaranteed from the outset equivalent to the number of Points in the Target Bucket.",
        "Potential for no obligation when the Fixing Rate is more favourable than the Enhanced Rate and the Knock-In Rate has not been triggered.",
        "An ability to achieve a more favourable Enhanced Rate, Knock-In Rate or more Target Bucket Points relative to a European Knock-In TARF without a Leverage Ratio.",
        "The Enhanced Rate is likely to be more favourable than other leveraged products."
      ],
      "risks": [
        "Once the Target Bucket has been redeemed, there is no further protection. This may occur before the final Fixing Date, which may mean that the Notional Amount traded at the Enhanced Rate will be less than the maximum Notional Amount. Consequently, you may need to trade at a less favourable Spot Rate.",
        "If the Fixing Rate is more favourable than the Knock-In Rate on a Fixing Date (and the Target Bucket has not been redeemed) you will be obligated to trade at the less favourable Enhanced Rate.",
        "A Leveraged European Knock-In TARF generally has an extended Tenor compared to other Structured Option products and as a result, there is a greater risk that during the term of a Leveraged European Knock-In TARF the Enhanced Rate will no longer be favourable when compared to the prevailing Spot Rate.",
        "If the Fixing Rate is more favourable than the Knock-In Rate on the Fixing Date you will be obligated to trade a multiple of the Notional Amount, determined by the Leverage Ratio, at the less favourable Enhanced Rate.",
        "Due to the Leverage Ratio, there may be less protection than other Structured Option products."
      ]
    }
  },
  "EKI TARF (LEV)": {
    "name": "EKI TARF (LEV)",
    "classification": "Enhanced",
    "family": "eki-tarf",
    "dropdownFamily": "TARF family",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "fixingDate",
        "label": "Fixing Date",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leverage",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInRate",
        "label": "KI (At Expiry)",
        "type": "rate",
        "required": true
      },
      {
        "key": "target",
        "label": "Target Points",
        "type": "number",
        "required": false
      }
    ],
    "sampleDefaults": {
      "fixingDate": "2026-07-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "enhancedRate": 0.6472,
      "knockInRate": 0.6627,
      "target": 500
    },
    "termsheet": {
      "outline": [
        "A Leveraged  European Knock-In TARF is a Structured Option which allows you to protect against the risk that the Spot Rate will be less favourable than a nominated Exchange Rate (the Enhanced Rate) on certain nominated Fixing Dates during an agreed term provided that an agreed level of gain (the Target Bucket) has not already been reached. we expresses the Target Bucket as a number of Foreign Exchange Points (Points). Once the Target Bucket has been redeemed, the European Knock-In TARF will terminate. The European Knock-In TARF also allows for the potential to take advantage of favourable currency movements if the Knock-In Rate is not triggered, which is determined by the Fixing Rate on the Fixing Date. If the Knock-In Rate is triggered at the Fixing Time on the Fixing Date, you will transact at the less favourable Enhanced Rate."
      ],
      "benefits": [
        "An ability to achieve an Enhanced Rate relative to an equivalent FEC.",
        "Ability to participate in favourable Exchange Rate movements, provided the Knock-In Rate is not triggered by the Fixing Rate on a Fixing Date.",
        "The Enhanced Rate is likely to be more favourable than other products without a Leverage Ratio.",
        "A degree of protection is guaranteed from the outset equivalent to the number of Points in the Target Bucket.",
        "Potential for no obligation when the Fixing Rate is more favourable than the Enhanced Rate and the Knock-In Rate has not been triggered.",
        "An ability to achieve a more favourable Enhanced Rate, Knock-In Rate or more Target Bucket Points relative to a European Knock-In TARF without a Leverage Ratio.",
        "The Enhanced Rate is likely to be more favourable than other leveraged products."
      ],
      "risks": [
        "Once the Target Bucket has been redeemed, there is no further protection. This may occur before the final Fixing Date, which may mean that the Notional Amount traded at the Enhanced Rate will be less than the maximum Notional Amount. Consequently, you may need to trade at a less favourable Spot Rate.",
        "If the Fixing Rate is more favourable than the Knock-In Rate on a Fixing Date (and the Target Bucket has not been redeemed) you will be obligated to trade at the less favourable Enhanced Rate.",
        "A Leveraged European Knock-In TARF generally has an extended Tenor compared to other Structured Option products and as a result, there is a greater risk that during the term of a Leveraged European Knock-In TARF the Enhanced Rate will no longer be favourable when compared to the prevailing Spot Rate.",
        "If the Fixing Rate is more favourable than the Knock-In Rate on the Fixing Date you will be obligated to trade a multiple of the Notional Amount, determined by the Leverage Ratio, at the less favourable Enhanced Rate.",
        "Due to the Leverage Ratio, there may be less protection than other Structured Option products."
      ]
    }
  },
  "TARF Guaranteed Count": {
    "name": "TARF Guaranteed Count",
    "classification": "Enhanced",
    "family": "count-tarf",
    "dropdownFamily": "TARF family",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "fixingDate",
        "label": "Fixing Date",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leverage",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "fixingDate": "2026-07-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "enhancedRate": 0.68
    },
    "termsheet": {
      "outline": [
        "A TARF Guaranteed Count is a Structured Option which allows you to protect against the risk that the Spot Rate will be less favourable than a nominated Exchange Rate (the Enhanced Rate) on certain nominated Fixing Dates during an agreed term provided that an agreed number of Guaranteed Fixings have not already been used. Once all the Guaranteed Fixings have been used, the TARF Guaranteed Count will terminate."
      ],
      "benefits": [
        "An ability to achieve an Enhanced Rate relative to an equivalent FEC.",
        "The Enhanced Rate is likely to be more favourable than other products without a Leverage Ratio.",
        "A degree of protection is guaranteed from the outset equivalent to the Notional Amount for each of the Guaranteed Fixings.",
        "Guaranteed Fixings can be pre-delivered."
      ],
      "risks": [
        "Once all the Guaranteed Fixings are redeemed, there is no further protection. This may occur before the final Fixing Date.",
        "If the Fixing Rate is more favourable than the Enhanced Rate on any Fixing Date (and the Guaranteed Fixings have not all been used) you will be obligated to trade at the less favourable Enhanced Rate.",
        "A TARF Guaranteed Count generally has an extended Tenor compared to other Structured Option products and as a result there is a greater risk that during the term of a TARF Guaranteed Count the Enhanced Rate will no longer be favourable when compared to the prevailing Spot Rate."
      ]
    }
  },
  "TARF Guaranteed Count (LEV)": {
    "name": "TARF Guaranteed Count (LEV)",
    "classification": "Enhanced",
    "family": "count-tarf",
    "dropdownFamily": "TARF family",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "fixingDate",
        "label": "Fixing Date",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leverage",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "fixingDate": "2026-07-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "enhancedRate": 0.68
    },
    "termsheet": {
      "outline": [
        "A TARF Guaranteed Count is a Structured Option which allows you to protect against the risk that the Spot Rate will be less favourable than a nominated Exchange Rate (the Enhanced Rate) on certain nominated Fixing Dates during an agreed term provided that an agreed number of Guaranteed Fixings have not already been used. Once all the Guaranteed Fixings have been used, the TARF Guaranteed Count will terminate."
      ],
      "benefits": [
        "An ability to achieve an Enhanced Rate relative to an equivalent FEC.",
        "The Enhanced Rate is likely to be more favourable than other products without a Leverage Ratio.",
        "A degree of protection is guaranteed from the outset equivalent to the Notional Amount for each of the Guaranteed Fixings.",
        "Guaranteed Fixings can be pre-delivered."
      ],
      "risks": [
        "Once all the Guaranteed Fixings are redeemed, there is no further protection. This may occur before the final Fixing Date.",
        "If the Fixing Rate is more favourable than the Enhanced Rate on any Fixing Date (and the Guaranteed Fixings have not all been used) you will be obligated to trade at the less favourable Enhanced Rate.",
        "A TARF Guaranteed Count generally has an extended Tenor compared to other Structured Option products and as a result there is a greater risk that during the term of a TARF Guaranteed Count the Enhanced Rate will no longer be favourable when compared to the prevailing Spot Rate."
      ]
    }
  },
  "EKI TARF Guaranteed Count": {
    "name": "EKI TARF Guaranteed Count",
    "classification": "Enhanced",
    "family": "eki-tarf",
    "dropdownFamily": "TARF family",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "fixingDate",
        "label": "Fixing Date",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leverage",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInRate",
        "label": "KI (At Expiry)",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "fixingDate": "2026-07-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "enhancedRate": 0.64,
      "knockInRate": 0.67
    },
    "termsheet": {
      "outline": [
        "A EUROPEAN KNOCK-IN TARF Guaranteed Count is a Structured Option which allows you to protect against the risk that the Spot Rate will be less favourable than a nominated Exchange Rate (the Enhanced Rate) on certain nominated Fixing Dates during an agreed term provided that an agreed number of Guaranteed Fixings have not already been used. Once all the Guaranteed Fixings have been used, the TARF Guaranteed Count will terminate. The European Knock-In also allows for the potential to take advantage of favourable currency movements if the Knock-In Rate is not triggered, which is determined by the Fixing Rate on the Fixing Date. If the Knock-In Rate is triggered at the Fixing Time on the Fixing Date, you will transact at the less favourable Enhanced Rate."
      ],
      "benefits": [
        "An ability to achieve an Enhanced Rate relative to an equivalent FEC.",
        "Ability to participate in favourable Exchange Rate movements, provided the Knock-In Rate is not triggered by the Fixing Rate on a Fixing Date.",
        "The Enhanced Rate is likely to be more favourable than other products.",
        "A degree of protection is guaranteed from the outset equivalent to the Notional Amount for each of the Guaranteed Fixings.",
        "Guaranteed Fixings can be pre-delivered.",
        "Potential for no obligation when the Fixing Rate is more favourable than the Enhanced Rate and the Knock-In Rate has not been triggered."
      ],
      "risks": [
        "Once all the Guaranteed Fixings are redeemed, there is no further protection. This may occur before the final Fixing Date.",
        "If the Fixing Rate is more favourable than the Knock In Rate on the Fixing Date, you will be obligated to trade  the Notional Amount at the less favourable Enhanced Rate.",
        "A European Knock-In TARF Guaranteed Count generally has an extended Tenor compared to other Structured Option products and as a result there is a greater risk that during the term of a TARF Guaranteed Count the Enhanced Rate will no longer be favourable when compared to the prevailing Spot Rate."
      ]
    }
  },
  "EKI TARF Guaranteed Count (LEV)": {
    "name": "EKI TARF Guaranteed Count (LEV)",
    "classification": "Enhanced",
    "family": "eki-tarf",
    "dropdownFamily": "TARF family",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "fixingDate",
        "label": "Fixing Date",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leverage",
        "type": "currency",
        "required": true
      },
      {
        "key": "enhancedRate",
        "label": "Enhanced Rate",
        "type": "rate",
        "required": true
      },
      {
        "key": "knockInRate",
        "label": "KI (At Expiry)",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "fixingDate": "2026-07-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "enhancedRate": 0.64,
      "knockInRate": 0.67
    },
    "termsheet": {
      "outline": [
        "A EUROPEAN KNOCK-IN TARF Guaranteed Count is a Structured Option which allows you to protect against the risk that the Spot Rate will be less favourable than a nominated Exchange Rate (the Enhanced Rate) on certain nominated Fixing Dates during an agreed term provided that an agreed number of Guaranteed Fixings have not already been used. Once all the Guaranteed Fixings have been used, the TARF Guaranteed Count will terminate. The European Knock-In also allows for the potential to take advantage of favourable currency movements if the Knock-In Rate is not triggered, which is determined by the Fixing Rate on the Fixing Date. If the Knock-In Rate is triggered at the Fixing Time on the Fixing Date, you will transact at the less favourable Enhanced Rate."
      ],
      "benefits": [
        "An ability to achieve an Enhanced Rate relative to an equivalent FEC.",
        "Ability to participate in favourable Exchange Rate movements, provided the Knock-In Rate is not triggered by the Fixing Rate on a Fixing Date.",
        "The Enhanced Rate is likely to be more favourable than other products.",
        "A degree of protection is guaranteed from the outset equivalent to the Notional Amount for each of the Guaranteed Fixings.",
        "Guaranteed Fixings can be pre-delivered.",
        "Potential for no obligation when the Fixing Rate is more favourable than the Enhanced Rate and the Knock-In Rate has not been triggered."
      ],
      "risks": [
        "Once all the Guaranteed Fixings are redeemed, there is no further protection. This may occur before the final Fixing Date.",
        "If the Fixing Rate is more favourable than the Knock In Rate on the Fixing Date, you will be obligated to trade  the Notional Amount at the less favourable Enhanced Rate.",
        "A European Knock-In TARF Guaranteed Count generally has an extended Tenor compared to other Structured Option products and as a result there is a greater risk that during the term of a TARF Guaranteed Count the Enhanced Rate will no longer be favourable when compared to the prevailing Spot Rate."
      ]
    }
  },
  "Pivot TARF": {
    "name": "Pivot TARF",
    "classification": "Enhanced",
    "family": "pivot-tarf",
    "dropdownFamily": "TARF family",
    "pair": "AUDEUR",
    "notionalCcy": "EUR",
    "fields": [
      {
        "key": "fixingDate",
        "label": "Fixing Date",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leveraged",
        "type": "currency",
        "required": true
      },
      {
        "key": "lowStrikeEnhancedRate",
        "label": "Low Strike Enh.",
        "type": "rate",
        "required": true
      },
      {
        "key": "pivot",
        "label": "Pivot",
        "type": "rate",
        "required": true
      },
      {
        "key": "highStrikeEnhancedRate",
        "label": "High Strike Enh.",
        "type": "rate",
        "required": true
      },
      {
        "key": "target",
        "label": "Target Points",
        "type": "number",
        "required": false
      }
    ],
    "sampleDefaults": {
      "fixingDate": "2026-07-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "lowStrikeEnhancedRate": 0.625,
      "pivot": 0.655,
      "highStrikeEnhancedRate": 0.69,
      "target": 500
    },
    "termsheet": {
      "outline": [
        "The Leveraged Pivot TARF Structured Option product is a  Structured Options which offer two Enhanced Rates. The Upper Strike Rate provides an Enhanced Rate to buy the underlying currency pair and the Lower Strike Rate to sell the underlying currency. At each Fixing Date, the Fixing Rate is referenced against the Pivot Rate and the Upper and Lower Strike Rates. If the Spot Rate is fixed between the Pivot Rate and the Upper Strike, the customer will sell the currency pair on the Notional Amount at the Upper Strike Rate. If the Spot Rate is fixed between the Pivot Rate and the Lower Strike, the customer will buy the currency pair on  the Notional Amount at the Lower Strike Rate. In each case, the difference between the Fixing Rate and the Upper or Lower Strike Rates, as applicable, is calculated and deducted from the Target Bucket. Future Fixings will remain provided that the Target Bucket has not been exhausted. If at any Fixing Date the Spot Rate is higher than the Upper or lower than the Lower Strike Rate, the customer will be obligated to transact the Leveraged Notional Amount at the Upper or Lower Strike Rate and the Target Bucket will remain unchanged. Once the Target Bucket has been redeemed or at the final Fixing Date the Leveraged Pivot TARF will terminate."
      ],
      "benefits": [
        "An ability to achieve a more favourable Upper or Lower Strike Rate relative to an equivalent Forward Contract. The Upper or Lower Strike Rate is likely to be more favourable than other products without a Leverage Ratio.",
        "An ability to achieve a more favourable Upper or Lower Strike Rate or more Target Bucket Points relative to a  Pivot TARF without a Leverage Ratio.",
        "The Upper or Lower Strike Rate is likely to be more favourable than other leveraged products."
      ],
      "risks": [
        "Once the Target Bucket has been redeemed there is no further protection. This may occur before the final Fixing Date, which will mean that the Notional Amount may be reduced at the Upper or Lower Strike Rate. Consequently, you may need to trade at a less favourable Spot Rate for the amount of that reduction.",
        "Due to the nature of the Pivot TARF, positions may be generated on both sides of the market – buying and selling the underlying. Customers should ensure they have matching requirements or can manage an active hedging strategy.",
        "If the Fixing Rate is more favourable than the Upper or Lower Strike Rate on a Fixing Date (and the Target Bucket has not been redeemed) you will be obligated to trade at the less favourable Upper or Lower Strike Rate.",
        "A Pivot TARF generally has an extended Tenor compared to other Structured Option products and as a result there is a greater risk that during the term of a Pivot TARF the Upper or Lower Strike Rate will no longer be favourable when compared to the prevailing Spot Rate.",
        "If the Fixing Rate is more favourable than the Upper or Lower Strike Rate on the Fixing Date, you will be obligated to trade a multiple of the Notional Amount, determined by the Leverage Ratio, at the less favourable the Upper or Lower Strike Rate.",
        "Due to the Leverage Ratio that is applied, there may be less protection compared to a Pivot TARF without a Leverage Ratio and other Structured Option products without a Leverage Ratio."
      ]
    }
  },
  "Pivot TARF (LEV)": {
    "name": "Pivot TARF (LEV)",
    "classification": "Enhanced",
    "family": "pivot-tarf",
    "dropdownFamily": "TARF family",
    "pair": "AUDEUR",
    "notionalCcy": "EUR",
    "fields": [
      {
        "key": "fixingDate",
        "label": "Fixing Date",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Notional",
        "type": "currency",
        "required": true
      },
      {
        "key": "leveragedNotional",
        "label": "Leveraged",
        "type": "currency",
        "required": true
      },
      {
        "key": "lowStrikeEnhancedRate",
        "label": "Low Strike Enh.",
        "type": "rate",
        "required": true
      },
      {
        "key": "pivot",
        "label": "Pivot",
        "type": "rate",
        "required": true
      },
      {
        "key": "highStrikeEnhancedRate",
        "label": "High Strike Enh.",
        "type": "rate",
        "required": true
      },
      {
        "key": "target",
        "label": "Target Points",
        "type": "number",
        "required": false
      }
    ],
    "sampleDefaults": {
      "fixingDate": "2026-07-09",
      "notional": 1000000,
      "leveragedNotional": 2000000,
      "lowStrikeEnhancedRate": 0.625,
      "pivot": 0.655,
      "highStrikeEnhancedRate": 0.69,
      "target": 500
    },
    "termsheet": {
      "outline": [
        "The Leveraged Pivot TARF Structured Option product is a  Structured Options which offer two Enhanced Rates. The Upper Strike Rate provides an Enhanced Rate to buy the underlying currency pair and the Lower Strike Rate to sell the underlying currency. At each Fixing Date, the Fixing Rate is referenced against the Pivot Rate and the Upper and Lower Strike Rates. If the Spot Rate is fixed between the Pivot Rate and the Upper Strike, the customer will sell the currency pair on the Notional Amount at the Upper Strike Rate. If the Spot Rate is fixed between the Pivot Rate and the Lower Strike, the customer will buy the currency pair on  the Notional Amount at the Lower Strike Rate. In each case, the difference between the Fixing Rate and the Upper or Lower Strike Rates, as applicable, is calculated and deducted from the Target Bucket. Future Fixings will remain provided that the Target Bucket has not been exhausted. If at any Fixing Date the Spot Rate is higher than the Upper or lower than the Lower Strike Rate, the customer will be obligated to transact the Leveraged Notional Amount at the Upper or Lower Strike Rate and the Target Bucket will remain unchanged. Once the Target Bucket has been redeemed or at the final Fixing Date the Leveraged Pivot TARF will terminate."
      ],
      "benefits": [
        "An ability to achieve a more favourable Upper or Lower Strike Rate relative to an equivalent Forward Contract. The Upper or Lower Strike Rate is likely to be more favourable than other products without a Leverage Ratio.",
        "An ability to achieve a more favourable Upper or Lower Strike Rate or more Target Bucket Points relative to a  Pivot TARF without a Leverage Ratio.",
        "The Upper or Lower Strike Rate is likely to be more favourable than other leveraged products."
      ],
      "risks": [
        "Once the Target Bucket has been redeemed there is no further protection. This may occur before the final Fixing Date, which will mean that the Notional Amount may be reduced at the Upper or Lower Strike Rate. Consequently, you may need to trade at a less favourable Spot Rate for the amount of that reduction.",
        "Due to the nature of the Pivot TARF, positions may be generated on both sides of the market – buying and selling the underlying. Customers should ensure they have matching requirements or can manage an active hedging strategy.",
        "If the Fixing Rate is more favourable than the Upper or Lower Strike Rate on a Fixing Date (and the Target Bucket has not been redeemed) you will be obligated to trade at the less favourable Upper or Lower Strike Rate.",
        "A Pivot TARF generally has an extended Tenor compared to other Structured Option products and as a result there is a greater risk that during the term of a Pivot TARF the Upper or Lower Strike Rate will no longer be favourable when compared to the prevailing Spot Rate.",
        "If the Fixing Rate is more favourable than the Upper or Lower Strike Rate on the Fixing Date, you will be obligated to trade a multiple of the Notional Amount, determined by the Leverage Ratio, at the less favourable the Upper or Lower Strike Rate.",
        "Due to the Leverage Ratio that is applied, there may be less protection compared to a Pivot TARF without a Leverage Ratio and other Structured Option products without a Leverage Ratio."
      ]
    }
  },
  "NDF": {
    "name": "NDF",
    "classification": "Protect",
    "family": "ndf",
    "dropdownFamily": "Linear / Vanilla",
    "pair": "AUDUSD",
    "notionalCcy": "USD",
    "fields": [
      {
        "key": "fixingDate",
        "label": "Fixing Date",
        "type": "date",
        "required": true
      },
      {
        "key": "notional",
        "label": "Protection",
        "type": "currency",
        "required": true
      },
      {
        "key": "ndfRate",
        "label": "NDF Rate",
        "type": "rate",
        "required": true
      }
    ],
    "sampleDefaults": {
      "fixingDate": "2026-07-09",
      "notional": 1000000,
      "ndfRate": 0.6545
    },
    "termsheet": {
      "outline": [
        "A Non Deliverable Forward (NDF) is a type of forward exchange contract that is net cash settled on the Value Date. This means that there is no exchange of currencies; instead a single amount will be payable by You or Us depending on the value of the Notional Amount at the prevailing spot exchange rate on the Fixing Date, which will be 2 Business Days before the Value Date (unless otherwise agreed). For more information please see the PDS."
      ],
      "benefits": [
        "An NDF enables you to fix Exchange Rates to Hedge your currency exposure by providing protection against unfavourable Exchange Rate movements between the day you and we agree to an NDF and the Value Date.",
        "For a full list of benefits please see the PDS."
      ],
      "risks": [
        "An NDF does not provide any opportunity to participate in a favourable market move.",
        "For a full list of risks please see the PDS."
      ]
    }
  }
};
