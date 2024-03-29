"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const countries = [
      {
        Code: "AF",
        Label: "Afghanistan",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "AL",
        Label: "Albania",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "DZ",
        Label: "Algeria",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "AD",
        Label: "Andorra",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "AO",
        Label: "Angola",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "AG",
        Label: "Antigua and Barbuda",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "AR",
        Label: "Argentina",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "AM",
        Label: "Armenia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "AU",
        Label: "Australia",
        createdAt: new Date(),
        updatedAt: new Date(),
        IsCommissioningMarket: true,
      },
      {
        Code: "AT",
        Label: "Austria",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "AZ",
        Label: "Azerbaijan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "BS",
        Label: "The Bahamas",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "BH",
        Label: "Bahrain",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "BD",
        Label: "Bangladesh",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "BB",
        Label: "Barbados",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "BY",
        Label: "Belarus",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "BE",
        Label: "Belgium",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "BZ",
        Label: "Belize",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "BJ",
        Label: "Benin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "BT",
        Label: "Bhutan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "BO",
        Label: "Bolivia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "BA",
        Label: "Bosnia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "BW",
        Label: "Botswana",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "BR",
        Label: "Brazil",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "BN",
        Label: "Brunei",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "BG",
        Label: "Bulgaria",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "BF",
        Label: "Burkina Faso",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "BI",
        Label: "Burundi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "KH",
        Label: "Cambodia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "CM",
        Label: "Cameroon",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "CA",
        Label: "Canada",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "CV",
        Label: "Cape Verde",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "CF",
        Label: "Central African Republic",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "TD",
        Label: "Chad",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "CL",
        Label: "Chile",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "CN",
        Label: "China",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "CO",
        Label: "Colombia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "KM",
        Label: "Comoros",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "CD",
        Label: "Democratic Republic of the Congo",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "CG",
        Label: "Republic of the Congo",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "CR",
        Label: "Costa Rica",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "HR",
        Label: "Croatia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "CU",
        Label: "Cuba",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "CY",
        Label: "Cyprus",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "CZ",
        Label: "Czech Republic",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "DK",
        Label: "Denmark",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "DJ",
        Label: "Djibouti",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "DO",
        Label: "Dominican Republic",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "TL",
        Label: "East Timor",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "EC",
        Label: "Ecuador",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "EG",
        Label: "Egypt",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "SV",
        Label: "El Salvador",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "GQ",
        Label: "Equatorial Guinea",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "ER",
        Label: "Eritrea",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "EE",
        Label: "Estonia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "ET",
        Label: "Ethiopia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "FJ",
        Label: "Fiji",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "FI",
        Label: "Finland",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "FR",
        Label: "France",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "GA",
        Label: "Gabon",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "GM",
        Label: "Gambia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "GE",
        Label: "Georgia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "DE",
        Label: "Germany",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "GH",
        Label: "Ghana",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "GR",
        Label: "Greece",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "GD",
        Label: "Grenada",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "GT",
        Label: "Guatemala",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "GN",
        Label: "Guinea",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "GW",
        Label: "Guinea-Bissau",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "GY",
        Label: "Guyana",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "HT",
        Label: "Haiti",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "HN",
        Label: "Honduras",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "HK",
        Label: "Hong Kong",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "HU",
        Label: "Hungary",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "IS",
        Label: "Iceland",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "IN",
        Label: "India",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "ID",
        Label: "Indonesia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "IR",
        Label: "Iran",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "IQ",
        Label: "Iraq",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "IE",
        Label: "Ireland",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "IL",
        Label: "Israel",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "IT",
        Label: "Italy",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "CI",
        Label: "Ivory Coast",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "JM",
        Label: "Jamaica",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "JP",
        Label: "Japan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "JO",
        Label: "Jordan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "KZ",
        Label: "Kazakhstan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "KE",
        Label: "Kenya",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "KI",
        Label: "Kiribati",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "KP",
        Label: "North Korea",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "KR",
        Label: "South Korea",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "XK",
        Label: "Kosovo",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "KW",
        Label: "Kuwait",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "KG",
        Label: "Kyrgyzstan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "LA",
        Label: "Laos",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "LV",
        Label: "Latvia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "LB",
        Label: "Lebanon",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "LS",
        Label: "Lesotho",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "LR",
        Label: "Liberia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "LY",
        Label: "Libya",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "LI",
        Label: "Liechtenstein",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "LT",
        Label: "Lithuania",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "LU",
        Label: "Luxembourg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "MK",
        Label: "Macedonia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "MG",
        Label: "Madagascar",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "MW",
        Label: "Malawi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "MY",
        Label: "Malaysia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "MV",
        Label: "Maldives",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "ML",
        Label: "Mali",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "MT",
        Label: "Malta",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "MH",
        Label: "Marshall Islands",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "MR",
        Label: "Mauritania",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "MU",
        Label: "Mauritius",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "MX",
        Label: "Mexico",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "MD",
        Label: "Moldova",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "MC",
        Label: "Monaco",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "MN",
        Label: "Mongolia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "ME",
        Label: "Montenegro",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "MA",
        Label: "Morocco",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "MZ",
        Label: "Mozambique",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "MM",
        Label: "Myanmar",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "NA",
        Label: "Namibia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "NR",
        Label: "Nauru",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "NP",
        Label: "Nepal",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "NL",
        Label: "Netherlands",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "NZ",
        Label: "New Zealand",
        createdAt: new Date(),
        updatedAt: new Date(),
        IsCommissioningMarket: true,
      },
      {
        Code: "NI",
        Label: "Nicaragua",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "NE",
        Label: "Niger",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "NG",
        Label: "Nigeria",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "NO",
        Label: "Norway",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "OM",
        Label: "Oman",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "PK",
        Label: "Pakistan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "PW",
        Label: "Palau",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "PS",
        Label: "Palestine",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "PA",
        Label: "Panama",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "PG",
        Label: "Papua New Guinea",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "PY",
        Label: "Paraguay",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "PE",
        Label: "Peru",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "PH",
        Label: "Philippines",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "PL",
        Label: "Poland",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "PT",
        Label: "Portugal",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "QA",
        Label: "Qatar",
        createdAt: new Date(),
        updatedAt: new Date(),
        IsCommissioningMarket: true,
      },
      {
        Code: "RO",
        Label: "Romania",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "RU",
        Label: "Russia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "RW",
        Label: "Rwanda",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "KN",
        Label: "Saint Kitts and Nevis",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "LC",
        Label: "Saint Lucia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "VC",
        Label: "Saint Vincent and the Grenadines",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "WS",
        Label: "Samoa",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "SM",
        Label: "San Marino",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "ST",
        Label: "São Tomé and Príncipe",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "SA",
        Label: "Saudi Arabia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "SN",
        Label: "Senegal",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "RS",
        Label: "Serbia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "SC",
        Label: "Seychelles",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "SL",
        Label: "Sierra Leone",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "SG",
        Label: "Singapore",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "SK",
        Label: "Slovakia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "SI",
        Label: "Slovenia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "SB",
        Label: "Solomon Islands",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "SO",
        Label: "Somalia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "ZA",
        Label: "South Africa",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "SS",
        Label: "South Sudan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "ES",
        Label: "Spain",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "LK",
        Label: "Sri Lanka",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "SD",
        Label: "Sudan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "SR",
        Label: "Suriname",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "SZ",
        Label: "Swaziland",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "SE",
        Label: "Sweden",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "CH",
        Label: "Switzerland",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "SY",
        Label: "Syria",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "TW",
        Label: "Taiwan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "TJ",
        Label: "Tajikistan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "TZ",
        Label: "Tanzania",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "TH",
        Label: "Thailand",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "TG",
        Label: "Togo",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "TO",
        Label: "Tonga",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "TT",
        Label: "Trinidad and Tobago",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "TN",
        Label: "Tunisia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "TR",
        Label: "Turkey",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "TM",
        Label: "Turkmenistan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "TV",
        Label: "Tuvalu",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "UG",
        Label: "Uganda",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "UA",
        Label: "Ukraine",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "AE",
        Label: "United Arab Emirates",
        createdAt: new Date(),
        updatedAt: new Date(),
        IsCommissioningMarket: true,
      },
      {
        Code: "GB",
        Label: "United Kingdom",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "US",
        Label: "United States",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "UY",
        Label: "Uruguay",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "UZ",
        Label: "Uzbekistan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "VU",
        Label: "Vanuatu",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "VE",
        Label: "Venezuela",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "VN",
        Label: "Vietnam",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "YE",
        Label: "Yemen",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "ZM",
        Label: "Zambia",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "ZW",
        Label: "Zimbabwe",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "Portfolio",
        Label: "Portfolio",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Countries", countries, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Countries", null, {});
  },
};
