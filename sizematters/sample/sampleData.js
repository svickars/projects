const worldData = {
  data: [{
      label: 'China',
      alias: 'CHN',
      continent: 'Asia',
      value: 200
    },
    {
      label: 'United States of America',
      alias: 'USA',
      continent: 'North America',
      value: 170
    },
    {
      label: 'Japan',
      alias: 'JPN',
      continent: 'Asia',
      value: 89
    },
    {
      label: 'Russian Federation',
      alias: 'RUS',
      continent: 'Europe',
      value: 59
    },
    {
      label: 'Germany',
      alias: 'DEU',
      continent: 'Europe',
      value: 48
    },
    {
      label: 'Republic of Korea',
      alias: 'KOR',
      continent: 'Asia',
      value: 43
    },
    {
      label: 'France',
      alias: 'FRA',
      continent: 'Europe',
      value: 35
    },
    {
      label: 'United Kingdom of Great Britain and Northern Ireland',
      alias: 'GBR',
      continent: 'Europe',
      value: 35
    },
    {
      label: 'India',
      alias: 'IND',
      continent: 'Asia',
      value: 26
    },
    {
      label: 'Canada',
      alias: 'CAN',
      continent: 'North America',
      value: 21
    },
    {
      label: 'Brazil',
      alias: 'BRA',
      continent: 'South America',
      value: 18
    },
    {
      label: 'Spain',
      alias: 'ESP',
      continent: 'Europe',
      value: 16
    },
    {
      label: 'Italy',
      alias: 'ITA',
      continent: 'Europe',
      value: 15
    },
    {
      label: 'Australia',
      alias: 'AUS',
      continent: 'Oceania',
      value: 12
    },
    {
      label: 'Turkey',
      alias: 'TUR',
      continent: 'Asia',
      value: 12
    },
    {
      label: 'Netherlands',
      alias: 'NLD',
      continent: 'Europe',
      value: 9
    },
    {
      label: 'Poland',
      alias: 'POL',
      continent: 'Europe',
      value: 9
    },
    {
      label: 'Israel',
      alias: 'ISR',
      continent: 'Asia',
      value: 8
    },
    {
      label: 'Sweden',
      alias: 'SWE',
      continent: 'Europe',
      value: 8
    },
    {
      label: 'Iran (Islamic Republic of)',
      alias: 'IRN',
      continent: 'Asia',
      value: 7
    },
    {
      label: 'Ukraine',
      alias: 'UKR',
      continent: 'Europe',
      value: 7
    },
    {
      label: 'Malaysia',
      alias: 'MYS',
      continent: 'Asia',
      value: 7
    },
    {
      label: 'Argentina',
      alias: 'ARG',
      continent: 'South America',
      value: 6
    },
    {
      label: 'Egypt',
      alias: 'EGY',
      continent: 'Africa',
      value: 6
    },
    {
      label: 'Mexico',
      alias: 'MEX',
      continent: 'North America',
      value: 6
    },
    {
      label: 'Belgium',
      alias: 'BEL',
      continent: 'Europe',
      value: 6
    },
    {
      label: 'Portugal',
      alias: 'PRT',
      continent: 'Europe',
      value: 5
    },
    {
      label: 'Denmark',
      alias: 'DNK',
      continent: 'Europe',
      value: 5
    },
    {
      label: 'Austria',
      alias: 'AUT',
      continent: 'Europe',
      value: 5
    },
    {
      label: 'Finland',
      alias: 'FIN',
      continent: 'Europe',
      value: 5
    },
    {
      label: 'Thailand',
      alias: 'THA',
      continent: 'Asia',
      value: 4
    },
    {
      label: 'Switzerland',
      alias: 'CHE',
      continent: 'Europe',
      value: 4
    },
    {
      label: 'Czech Republic',
      alias: 'CZE',
      continent: 'Europe',
      value: 4
    },
    {
      label: 'Singapore',
      alias: 'SGP',
      continent: 'Asia',
      value: 4
    },
    {
      label: 'Pakistan',
      alias: 'PAK',
      continent: 'Asia',
      value: 4
    },
    {
      label: 'Greece',
      alias: 'GRC',
      continent: 'Europe',
      value: 3
    },
    {
      label: 'Norway',
      alias: 'NOR',
      continent: 'Europe',
      value: 3
    },
    {
      label: 'Morocco',
      alias: 'MAR',
      continent: 'Africa',
      value: 3
    },
    {
      label: 'Hungary',
      alias: 'HUN',
      continent: 'Europe',
      value: 3
    },
    {
      label: 'South Africa',
      alias: 'ZAF',
      continent: 'Africa',
      value: 2
    },
    {
      label: 'Indonesia',
      alias: 'IND',
      continent: 'Asia',
      value: 2
    },
    {
      label: 'China, Hong Kong Special Administrative Region',
      alias: 'HKG',
      continent: 'Asia',
      value: 2
    },
    {
      label: 'Romania',
      alias: 'ROU',
      continent: 'Europe',
      value: 2
    },
    {
      label: 'New Zealand',
      alias: 'NZL',
      continent: 'Oceania',
      value: 2
    },
    {
      label: 'Ireland',
      alias: 'IRL',
      continent: 'Europe',
      value: 2
    },
    {
      label: 'Tunisia',
      alias: 'TUN',
      continent: 'Africa',
      value: 2
    },
    {
      label: 'Uzbekistan',
      alias: 'UZB',
      continent: 'Asia',
      value: 2
    },
    {
      label: 'Slovakia',
      alias: 'SVK',
      continent: 'Europe',
      value: 1
    },
    {
      label: 'Iraq',
      alias: 'IRQ',
      continent: 'Asia',
      value: 1
    },
    {
      label: 'Kazakhstan',
      alias: 'KAZ',
      continent: 'Asia',
      value: 1
    },
    {
      label: 'Serbia',
      alias: 'SRB',
      continent: 'Europe',
      value: 1
    },
    {
      label: 'Bulgaria',
      alias: 'BGR',
      continent: 'Europe',
      value: 1
    },
    {
      label: 'Viet Nam',
      alias: 'VNM',
      continent: 'Asia',
      value: 1
    },
    {
      label: 'Kenya',
      alias: 'KEN',
      continent: 'Africa',
      value: 1
    },
    {
      label: 'Jordan',
      alias: 'JOR',
      continent: 'Asia',
      value: 1
    },
    {
      label: 'Slovenia',
      alias: 'SVN',
      continent: 'Europe',
      value: 1
    },
    {
      label: 'Venezuela (Bolivarian Republic of)',
      alias: 'VEN',
      continent: 'South America',
      value: 1
    },
    {
      label: 'Lithuania',
      alias: 'LTU',
      continent: 'Europe',
      value: 1
    },
    {
      label: 'Colombia',
      alias: 'COL',
      continent: 'South America',
      value: 1
    }
  ]
}

export default worldData