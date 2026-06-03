export const products = {
  makhana: {
    demand: "HIGH",
    competition: "MEDIUM",
    category: "Healthy Snacks",

    hsCode: "200819",

    certifications: [
      "FSSAI",
      "FDA",
      "Organic Certification",
    ],

    customsNotes:
      "Requires food-grade packaging and labeling compliance.",

    restricted: false,

    avgSellingPrice: 95,
    recommendedSellingPrice: 110,
    wholesaleMargin: 42,

    supplierType:
      "Indian wholesalers and farm cooperatives",

    moq: "100kg",

    shippingMethod: "Air + Sea Hybrid",

    packaging:
      "Vacuum packed premium retail bags",

    topMarkets: [
      {
        country: "UK",
        score: 92,
        demand: "HIGH",
        risk: "LOW",
      },

      {
        country: "Germany",
        score: 88,
        demand: "HIGH",
        risk: "MEDIUM",
      },

      {
        country: "UAE",
        score: 84,
        demand: "MEDIUM",
        risk: "LOW",
      },
    ],
  },

  "leather bags": {
    demand: "HIGH",
    competition: "HIGH",
    category: "Fashion",

    hsCode: "420221",

    certifications: [
      "Leather Export License",
      "REACH Compliance",
    ],

    customsNotes:
      "Requires proper leather origin documentation.",

    restricted: false,

    avgSellingPrice: 180,
    recommendedSellingPrice: 220,
    wholesaleMargin: 55,

    supplierType:
      "Leather manufacturers and exporters",

    moq: "50 pieces",

    shippingMethod: "Sea Freight",

    packaging:
      "Premium branded packaging",

    topMarkets: [
      {
        country: "USA",
        score: 90,
        demand: "HIGH",
        risk: "MEDIUM",
      },

      {
        country: "France",
        score: 82,
        demand: "MEDIUM",
        risk: "LOW",
      },
    ],
  },
};