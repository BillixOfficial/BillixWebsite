import type { Article, Source } from './types'
import dataUpdates from './data-updates.json'
import dailyUpdates from './daily-updates.json'

/**
 * Latest Bill Updates. Short, dated items built only from verified public data.
 * Each item states the date of the data it uses. All URLs checked 2026-10-13.
 *
 * Two more lists are merged in below, both written by .github/workflows/daily-updates.yml:
 * - data-updates.json: EIA/BLS releases, generated from templates and published automatically.
 * - daily-updates.json: researched drafts, added only when the draft's pull request is merged.
 */

const ACCESSED = '2026-10-13'

const src = (title: string, publisher: string, url: string, note?: string): Source =>
  note ? { title, publisher, url, accessed: ACCESSED, note } : { title, publisher, url, accessed: ACCESSED }

const editorialUpdates: Article[] = [
  // ---------------------------------------------------------------------------
  // Heating oil, week of October 5, 2026
  // ---------------------------------------------------------------------------
  {
    slug: 'heating-oil-prices-october-2026',
    title: 'Heating Oil Starts the 2026-27 Season at a Record Weekly Price',
    description:
      'EIA\'s first weekly survey of the heating season put the U.S. residential heating oil price at $6.042 a gallon for the week of October 5, 2026, the highest weekly figure in its records, not adjusted for inflation.',
    category: 'heating-cooling',
    kind: 'update',
    authorId: 'billix-editorial',
    publishedAt: '2026-10-13',
    reviewedAt: '2026-10-13',
    geography: {
      scope: 'multi-state',
      states: ['CT', 'ME', 'MA', 'NH', 'RI', 'VT', 'NY', 'NJ', 'PA', 'DE', 'MD'],
      label: 'Northeast heating-oil states',
    },
    alicePose: 'point-up',
    relatedVideo: 'leaving-oil-heat',
    relatedTools: ['heating-comparison'],
    keyTakeaways: [
      'Data as of the week of October 5, 2026 (released October 7): U.S. average residential heating oil was $6.042 per gallon, before taxes.',
      'That is about 70% higher than the same week a year earlier and above the previous weekly high of $5.902 in November 2022 (both not adjusted for inflation).',
      'EIA\'s October 6 forecast expects oil-heated households to spend about 21% more this winter than last.',
    ],
    sections: [
      {
        id: 'the-numbers',
        heading: 'The numbers',
        blocks: [
          {
            type: 'p',
            text:
              'The U.S. Energy Information Administration (EIA) collects residential heating oil prices weekly from October through March. Its first survey of the 2026-27 season, for the week of **October 5, 2026** and released October 7, put the U.S. average at **$6.042 per gallon**[^1]. EIA\'s residential prices exclude taxes[^1].',
          },
          {
            type: 'p',
            text:
              'In EIA\'s weekly series, which begins in October 1990, that is the highest value on record. The previous high was $5.902 for the week of November 7, 2022. A year earlier, for the week of October 6, 2025, the price was $3.555, so this year\'s opening price is about 70% higher (Billix calculation)[^2]. These are nominal prices, not adjusted for inflation.',
          },
          {
            type: 'table',
            caption: 'Residential heating oil, week of October 5, 2026, dollars per gallon excluding taxes',
            headers: ['Area', 'Price', 'Change from a year earlier'],
            rows: [
              ['U.S. average', '$6.042', '+$2.487'],
              ['New England', '$6.037', '+$2.561'],
              ['New York', '$6.230', '+$2.391'],
              ['Massachusetts', '$6.119', '+$2.571'],
              ['Pennsylvania', '$5.833', '+$2.568'],
            ],
          },
        ],
      },
      {
        id: 'winter-outlook',
        heading: 'What EIA expects this winter',
        blocks: [
          {
            type: 'p',
            text:
              'In its Winter Fuels Outlook published October 6, 2026, EIA forecast an average heating oil price of **$5.26 per gallon** for October through March, up 34% from last winter, with monthly forecasts falling from $5.79 in November to $4.84 in March. It expects households that heat mainly with oil, about 3% of U.S. households, to spend about **$2,115**, or 21% more than last winter[^3].',
          },
          {
            type: 'p',
            text:
              'EIA attributes the increase to lower global production of distillate fuel, which includes heating oil, because of reduced refining activity, and to low U.S. distillate inventories heading into winter[^3]. Its forecasts assume a warmer winter in the Northeast than last year, and EIA notes that a strong El Niño pattern could cause large temperature differences from its forecast[^3].',
          },
        ],
      },
      {
        id: 'what-to-watch',
        heading: 'What to watch',
        blocks: [
          {
            type: 'list',
            items: [
              'EIA\'s next weekly heating oil release is scheduled for October 15, 2026, and its next Short-Term Energy Outlook for November 10, 2026[^1][^3].',
              'Weekly averages are not the price any one dealer charges. Delivered prices, taxes and fees vary by dealer and state.',
              'For how to compare oil with gas or a heat pump using the cost of the same heat, see [Leaving oil heat: gas, heat pump or mini-splits?](/learn/leaving-oil-heat-options).',
            ],
          },
        ],
      },
    ],
    sources: [
      src('Heating Oil and Propane Update', 'U.S. Energy Information Administration', 'https://www.eia.gov/petroleum/heatingoilpropane/', 'Week of October 5, 2026; released October 7, 2026.'),
      src('Weekly U.S. No. 2 Heating Oil Residential Price (series W_EPD2F_PRS_NUS_DPG)', 'U.S. Energy Information Administration', 'https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s=W_EPD2F_PRS_NUS_DPG&f=W', 'Series begins October 1990. Release date 10/7/2026.'),
      src('Winter Fuels Outlook 2026-27', 'U.S. Energy Information Administration', 'https://www.eia.gov/outlooks/steo/report/perspectives/2026/10-winterfuels/article.php', 'Published October 6, 2026; forecast completed October 1, 2026.'),
    ],
  },

  // ---------------------------------------------------------------------------
  // Water & sewer CPI, August 2026
  // ---------------------------------------------------------------------------
  {
    slug: 'water-sewer-prices-outpace-inflation-august-2026',
    title: 'Water and Sewer Prices Rose 4.9% in the Year to August 2026',
    description:
      'The latest Consumer Price Index data, for August 2026, show water and sewer prices up 4.9% from a year earlier, compared with 3.4% for all consumer prices.',
    category: 'water-sewer',
    kind: 'update',
    authorId: 'billix-editorial',
    publishedAt: '2026-10-13',
    reviewedAt: '2026-10-13',
    geography: { scope: 'national', label: 'United States' },
    alicePose: 'showing-bill',
    relatedVideo: 'why-water-bills-rise',
    relatedTools: ['water-bill'],
    keyTakeaways: [
      'Data for August 2026 (the latest available on October 13, 2026): the BLS water and sewerage index rose 4.9% year over year; all items rose 3.4%.',
      'Over 20 years (August 2006 to August 2026), water and sewer prices rose about 155%, compared with about 64% for all items.',
      'The index measures price changes, not the dollar amount of any household\'s bill.',
    ],
    sections: [
      {
        id: 'the-latest-data',
        heading: 'The latest data',
        blocks: [
          {
            type: 'p',
            text:
              'The Bureau of Labor Statistics (BLS) Consumer Price Index includes a series for **water and sewerage maintenance** (U.S. city average, not seasonally adjusted). Its index stood at 765.482 in **August 2026**, up from 729.598 in August 2025, an increase of **4.9%**[^1]. Over the same 12 months, the index for all items rose from 323.976 to 334.980, or **3.4%**[^2] (percentages are Billix calculations from the BLS index values).',
          },
          {
            type: 'table',
            caption: 'Price change through August 2026 (Billix calculation on BLS index values)',
            headers: ['Period', 'Water and sewer', 'All items'],
            rows: [
              ['1 year (Aug 2025 to Aug 2026)', '+4.9%', '+3.4%'],
              ['10 years (Aug 2016 to Aug 2026)', '+48.2%', '+39.1%'],
              ['20 years (Aug 2006 to Aug 2026)', '+155.4%', '+64.3%'],
            ],
          },
        ],
      },
      {
        id: 'how-to-read-it',
        heading: 'How to read these numbers',
        blocks: [
          {
            type: 'list',
            items: [
              '**It is a price index, not a bill.** What you pay also depends on how much water you use and on your local rate structure.',
              '**This series excludes trash.** BLS also publishes a broader water, sewer and trash collection index; the two should not be mixed.',
              '**One month is missing.** BLS did not publish an October 2025 value for these series[^1].',
              '**Local prices vary widely.** A national index can rise while some cities hold rates flat and others raise them sharply.',
            ],
          },
          {
            type: 'p',
            text:
              'Within 2026 alone, the water and sewer index rose every month from January (745.474) through August (765.482), about 2.7% in seven months[^1]. Over longer periods, the 10-year gap is modest, about 6.6% after inflation; the large gap appears over 20 years. For why water and sewer prices have tended to outpace inflation, including aging pipes, fixed costs and new drinking water rules, see [Why water bills keep rising](/learn/why-water-bills-keep-rising).',
          },
        ],
      },
      {
        id: 'next-release',
        heading: 'What comes next',
        blocks: [
          {
            type: 'p',
            text:
              'The September 2026 CPI had not been released as of October 13, 2026. We will update this item when BLS publishes it. You can check the series yourself on the BLS data page for CUUR0000SEHG01[^1].',
          },
        ],
      },
    ],
    sources: [
      src('CPI-U, Water and sewerage maintenance, U.S. city average (series CUUR0000SEHG01)', 'U.S. Bureau of Labor Statistics', 'https://data.bls.gov/timeseries/CUUR0000SEHG01', 'Values for Aug 2006, Aug 2016, Aug 2025 and Aug 2026 retrieved from the BLS Public Data API on October 13, 2026.'),
      src('CPI-U, All items, U.S. city average (series CUUR0000SA0)', 'U.S. Bureau of Labor Statistics', 'https://data.bls.gov/timeseries/CUUR0000SA0'),
    ],
  },

  // ---------------------------------------------------------------------------
  // Residential electricity prices, data through July 2026
  // ---------------------------------------------------------------------------
  {
    slug: 'residential-electricity-prices-2026',
    title: 'Home Electricity Prices Are Running About 7% Above Last Year',
    description:
      'EIA data through July 2026 show the average U.S. residential electricity price at 18.19 cents per kWh for January to July, up from 17.01 cents a year earlier. EIA forecasts 18.2 cents for 2026 as a whole.',
    category: 'electricity',
    kind: 'update',
    authorId: 'billix-editorial',
    publishedAt: '2026-10-13',
    reviewedAt: '2026-10-13',
    geography: { scope: 'national', label: 'United States' },
    alicePose: 'presenting',
    relatedVideo: 'electric-bill-line-by-line',
    relatedTools: ['electricity-cost'],
    keyTakeaways: [
      'Data through July 2026 (released September 24, 2026): the U.S. average residential price was 18.19 cents per kWh for January to July, about 6.9% above the same months of 2025.',
      'EIA\'s October 2026 outlook forecasts 18.2 cents for 2026 and 18.7 cents for 2027, after 17.3 cents in 2025.',
      'Prices differ widely by state, and bills also depend on how much electricity you use.',
    ],
    sections: [
      {
        id: 'the-latest-data',
        heading: 'The latest data',
        blocks: [
          {
            type: 'p',
            text:
              'EIA\'s Electric Power Monthly, with data for **July 2026** released September 24, 2026, shows an average U.S. residential price of **18.19 cents per kWh** for January through July 2026, compared with 17.01 cents for the same months of 2025, an increase of about **6.9%**[^1]. For July alone, the price was 18.31 cents, up from 17.45 cents in July 2025, about 4.9%[^1] (percentages are Billix calculations).',
          },
          {
            type: 'table',
            caption: 'Average U.S. residential electricity price, cents per kWh',
            headers: ['Period', 'Price', 'Source'],
            rows: [
              ['2020 (annual)', '13.15', 'EIA Electric Power Monthly'],
              ['2025 (annual)', '17.30', 'EIA Electric Power Monthly'],
              ['Jan to Jul 2025', '17.01', 'EIA Electric Power Monthly'],
              ['Jan to Jul 2026', '18.19', 'EIA Electric Power Monthly'],
              ['2026 (forecast)', '18.2', 'EIA Short-Term Energy Outlook, Oct 2026'],
              ['2027 (forecast)', '18.7', 'EIA Short-Term Energy Outlook, Oct 2026'],
            ],
          },
          {
            type: 'p',
            text:
              'From 2020 to 2025 the annual average rose from 13.15 to 17.30 cents, about 32% before inflation[^1]. EIA\'s October 6, 2026 outlook forecasts 18.2 cents for 2026 and 18.7 cents for 2027[^2].',
          },
        ],
      },
      {
        id: 'why',
        heading: 'Why prices are rising',
        blocks: [
          {
            type: 'p',
            text:
              'EIA notes that wholesale power prices, which are strongly influenced by natural gas prices and weather, are only one part of residential prices; residential prices also include costs such as transmission and distribution upgrades and, in some regions, capacity market auction prices[^2]. For a closer look at those two halves of the bill, see [Supply vs. delivery charges](/learn/supply-vs-delivery-charges).',
          },
          {
            type: 'p',
            text:
              'A different measure, the BLS Consumer Price Index for electricity, rose 3.8% from August 2025 to August 2026, compared with 3.4% for all items (Billix calculation on BLS index values)[^3][^4]. The CPI and EIA\'s average price are built differently and cover different months, so their percentages will not match exactly.',
          },
        ],
      },
      {
        id: 'what-it-means',
        heading: 'What it means for a bill',
        blocks: [
          {
            type: 'p',
            text:
              'National averages hide large differences between states, and your bill depends on both your price and your usage. To see what your own rate means for a month of use, try our [electricity cost calculator](/tools/electricity-cost), or walk through your statement with [How to read your electric bill](/learn/how-to-read-your-electric-bill). EIA\'s next Electric Power Monthly, with August data, is scheduled for October 23, 2026[^1].',
          },
        ],
      },
    ],
    sources: [
      src('Electric Power Monthly, Table 5.3: Average Price of Electricity to Ultimate Customers', 'U.S. Energy Information Administration', 'https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_3', 'Data for July 2026; released September 24, 2026.'),
      src('Short-Term Energy Outlook: Electricity, coal, and renewables (October 2026)', 'U.S. Energy Information Administration', 'https://www.eia.gov/outlooks/steo/report/elec_coal_renew.php', 'Released October 6, 2026.'),
      src('CPI-U, Electricity, U.S. city average (series CUUR0000SEHF01)', 'U.S. Bureau of Labor Statistics', 'https://data.bls.gov/timeseries/CUUR0000SEHF01', 'August 2025: 298.738; August 2026: 310.057.'),
      src('CPI-U, All items, U.S. city average (series CUUR0000SA0)', 'U.S. Bureau of Labor Statistics', 'https://data.bls.gov/timeseries/CUUR0000SA0'),
    ],
  },
]

export const updates: Article[] = [...editorialUpdates, ...(dataUpdates as unknown as Article[]), ...(dailyUpdates as unknown as Article[])]
