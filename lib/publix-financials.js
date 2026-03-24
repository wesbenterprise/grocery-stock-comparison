// ────────────────────────────────────────────────────────────────────
// lib/publix-financials.js
// Publix Super Markets — 44-quarter financial dataset (FY2015–FY2025)
// Embedded from SEC EDGAR XBRL data
// ────────────────────────────────────────────────────────────────────

const RAW_QUARTERS = [
  { period:"2015-Q1", fiscal_year:2015, quarter:1, period_end:"2015-03-28", revenue:8412745000, gross_profit:2411514000, gross_margin_pct:28.67, operating_income:773794000, operating_margin_pct:9.2, net_income:548918000, net_margin_pct:6.52, eps_basic:0.71, total_assets:15905937000, total_liabilities:4176984000, stockholders_equity:8591535000 },
  { period:"2015-Q2", fiscal_year:2015, quarter:2, period_end:"2015-06-27", revenue:8018031000, gross_profit:2295692000, gross_margin_pct:28.63, operating_income:668440000, operating_margin_pct:8.34, net_income:482741000, net_margin_pct:6.02, eps_basic:0.62, total_assets:15714319000, total_liabilities:3662174000, stockholders_equity:8984622000 },
  { period:"2015-Q3", fiscal_year:2015, quarter:3, period_end:"2015-09-26", revenue:7902144000, gross_profit:2163921000, gross_margin_pct:27.38, operating_income:558126000, operating_margin_pct:7.06, net_income:412314000, net_margin_pct:5.22, eps_basic:0.53, total_assets:15946059000, total_liabilities:3796287000, stockholders_equity:9123906000 },
  { period:"2015-Q4", fiscal_year:2015, quarter:4, period_end:"2015-12-26", revenue:8285839000, gross_profit:2288022000, gross_margin_pct:27.61, operating_income:677881000, operating_margin_pct:8.18, net_income:521075000, net_margin_pct:6.29, eps_basic:0.68, total_assets:16359278000, total_liabilities:3928016000, stockholders_equity:9440453000 },
  { period:"2016-Q1", fiscal_year:2016, quarter:1, period_end:"2016-03-26", revenue:8790561000, gross_profit:2519437000, gross_margin_pct:28.66, operating_income:826787000, operating_margin_pct:9.41, net_income:581889000, net_margin_pct:6.62, eps_basic:0.75, total_assets:17004056000, total_liabilities:3950696000, stockholders_equity:9591132000 },
  { period:"2016-Q2", fiscal_year:2016, quarter:2, period_end:"2016-06-25", revenue:8190537000, gross_profit:2309064000, gross_margin_pct:28.19, operating_income:659351000, operating_margin_pct:8.05, net_income:478187000, net_margin_pct:5.84, eps_basic:0.62, total_assets:16940312000, total_liabilities:3743459000, stockholders_equity:9942670000 },
  { period:"2016-Q3", fiscal_year:2016, quarter:3, period_end:"2016-09-24", revenue:8090649000, gross_profit:2188570000, gross_margin_pct:27.05, operating_income:535637000, operating_margin_pct:6.62, net_income:421135000, net_margin_pct:5.21, eps_basic:0.55, total_assets:17332819000, total_liabilities:4000632000, stockholders_equity:10159188000 },
  { period:"2016-Q4", fiscal_year:2016, quarter:4, period_end:"2016-12-31", revenue:9202362000, gross_profit:2522733000, gross_margin_pct:27.41, operating_income:729876000, operating_margin_pct:7.93, net_income:544477000, net_margin_pct:5.92, eps_basic:0.71, total_assets:17386458000, total_liabilities:3889021000, stockholders_equity:10405171000 },
  { period:"2017-Q1", fiscal_year:2017, quarter:1, period_end:"2017-04-01", revenue:8752946000, gross_profit:2496042000, gross_margin_pct:28.52, operating_income:740012000, operating_margin_pct:8.45, net_income:555271000, net_margin_pct:6.34, eps_basic:0.73, total_assets:18026221000, total_liabilities:3939172000, stockholders_equity:10575902000 },
  { period:"2017-Q2", fiscal_year:2017, quarter:2, period_end:"2017-07-01", revenue:8482827000, gross_profit:2366475000, gross_margin_pct:27.9, operating_income:613303000, operating_margin_pct:7.23, net_income:495072000, net_margin_pct:5.84, eps_basic:0.65, total_assets:17941315000, total_liabilities:3804244000, stockholders_equity:10836496000 },
  { period:"2017-Q3", fiscal_year:2017, quarter:3, period_end:"2017-09-30", revenue:8586080000, gross_profit:2366345000, gross_margin_pct:27.56, operating_income:634794000, operating_margin_pct:7.39, net_income:474927000, net_margin_pct:5.53, eps_basic:0.63, total_assets:17969044000, total_liabilities:4266509000, stockholders_equity:10541896000 },
  { period:"2017-Q4", fiscal_year:2017, quarter:4, period_end:"2017-12-30", revenue:9014985000, gross_profit:2478259000, gross_margin_pct:27.49, operating_income:744715000, operating_margin_pct:8.26, net_income:766624000, net_margin_pct:8.5, eps_basic:1.04, total_assets:18183506000, total_liabilities:4074887000, stockholders_equity:11017149000 },
  { period:"2018-Q1", fiscal_year:2018, quarter:1, period_end:"2018-03-31", revenue:9345807000, gross_profit:2664350000, gross_margin_pct:28.51, operating_income:833957000, operating_margin_pct:8.92, net_income:680271000, net_margin_pct:7.28, eps_basic:0.93, total_assets:18546137000, total_liabilities:3928369000, stockholders_equity:11126566000 },
  { period:"2018-Q2", fiscal_year:2018, quarter:2, period_end:"2018-06-30", revenue:8826003000, gross_profit:2459957000, gross_margin_pct:27.87, operating_income:642792000, operating_margin_pct:7.28, net_income:616172000, net_margin_pct:6.98, eps_basic:0.84, total_assets:18576862000, total_liabilities:3805429000, stockholders_equity:11485083000 },
  { period:"2018-Q3", fiscal_year:2018, quarter:3, period_end:"2018-09-29", revenue:8858101000, gross_profit:2422060000, gross_margin_pct:27.34, operating_income:583152000, operating_margin_pct:6.58, net_income:677744000, net_margin_pct:7.65, eps_basic:0.94, total_assets:18998748000, total_liabilities:4106856000, stockholders_equity:11666996000 },
  { period:"2018-Q4", fiscal_year:2018, quarter:4, period_end:"2018-12-29", revenue:9365807000, gross_profit:2537960000, gross_margin_pct:27.1, operating_income:684502000, operating_margin_pct:7.31, net_income:406980000, net_margin_pct:4.35, eps_basic:0.57, total_assets:18982516000, total_liabilities:3987852000, stockholders_equity:11823342000 },
  { period:"2019-Q1", fiscal_year:2019, quarter:1, period_end:"2019-03-30", revenue:9760110000, gross_profit:2793718000, gross_margin_pct:28.62, operating_income:856575000, operating_margin_pct:8.78, net_income:980971000, net_margin_pct:10.05, eps_basic:1.37, total_assets:22970300000, total_liabilities:6973560000, stockholders_equity:12450398000 },
  { period:"2019-Q2", fiscal_year:2019, quarter:2, period_end:"2019-06-29", revenue:9446916000, gross_profit:2634326000, gross_margin_pct:27.89, operating_income:679438000, operating_margin_pct:7.19, net_income:661057000, net_margin_pct:7.0, eps_basic:0.92, total_assets:23383629000, total_liabilities:7097775000, stockholders_equity:12897061000 },
  { period:"2019-Q3", fiscal_year:2019, quarter:3, period_end:"2019-09-28", revenue:9417933000, gross_profit:2577858000, gross_margin_pct:27.37, operating_income:612030000, operating_margin_pct:6.5, net_income:574026000, net_margin_pct:6.1, eps_basic:0.81, total_assets:23929393000, total_liabilities:7405844000, stockholders_equity:13200858000 },
  { period:"2019-Q4", fiscal_year:2019, quarter:4, period_end:"2019-12-28", revenue:9837794000, gross_profit:2716382000, gross_margin_pct:27.61, operating_income:741206000, operating_margin_pct:7.53, net_income:789341000, net_margin_pct:8.02, eps_basic:1.11, total_assets:24507120000, total_liabilities:7605776000, stockholders_equity:13604000000 },
  { period:"2020-Q1", fiscal_year:2020, quarter:1, period_end:"2020-03-28", revenue:11306951000, gross_profit:3269383000, gross_margin_pct:28.91, operating_income:1151611000, operating_margin_pct:10.18, net_income:667335000, net_margin_pct:5.9, eps_basic:0.94, total_assets:25202317000, total_liabilities:7955599000, stockholders_equity:13505729000 },
  { period:"2020-Q2", fiscal_year:2020, quarter:2, period_end:"2020-06-27", revenue:11468563000, gross_profit:3312889000, gross_margin_pct:28.89, operating_income:1077045000, operating_margin_pct:9.39, net_income:1367055000, net_margin_pct:11.92, eps_basic:1.94, total_assets:26845843000, total_liabilities:8506838000, stockholders_equity:14734397000 },
  { period:"2020-Q3", fiscal_year:2020, quarter:3, period_end:"2020-09-26", revenue:11136409000, gross_profit:3133393000, gross_margin_pct:28.14, operating_income:876323000, operating_margin_pct:7.87, net_income:917584000, net_margin_pct:8.24, eps_basic:1.31, total_assets:27194202000, total_liabilities:8407773000, stockholders_equity:15227652000 },
  { period:"2020-Q4", fiscal_year:2020, quarter:4, period_end:"2020-12-26", revenue:11292036000, gross_profit:3133294000, gross_margin_pct:27.75, operating_income:907021000, operating_margin_pct:8.03, net_income:1019864000, net_margin_pct:9.03, eps_basic:1.47, total_assets:28094077000, total_liabilities:8808213000, stockholders_equity:15757000000 },
  { period:"2021-Q1", fiscal_year:2021, quarter:1, period_end:"2021-03-27", revenue:11760235000, gross_profit:3377013000, gross_margin_pct:28.72, operating_income:1051604000, operating_margin_pct:8.94, net_income:1495093000, net_margin_pct:12.71, eps_basic:2.16, total_assets:29446420000, total_liabilities:8836700000, stockholders_equity:16522259000 },
  { period:"2021-Q2", fiscal_year:2021, quarter:2, period_end:"2021-06-26", revenue:11927061000, gross_profit:3410983000, gross_margin_pct:28.6, operating_income:1109358000, operating_margin_pct:9.3, net_income:1009404000, net_margin_pct:8.46, eps_basic:0.29, total_assets:29983121000, total_liabilities:8813288000, stockholders_equity:17266580000 },
  { period:"2021-Q3", fiscal_year:2021, quarter:3, period_end:"2021-09-25", revenue:12007162000, gross_profit:3295526000, gross_margin_pct:27.45, operating_income:909520000, operating_margin_pct:7.57, net_income:856906000, net_margin_pct:7.14, eps_basic:0.25, total_assets:30874323000, total_liabilities:9301760000, stockholders_equity:17706884000 },
  { period:"2021-Q4", fiscal_year:2021, quarter:4, period_end:"2021-12-25", revenue:12699542000, gross_profit:3482478000, gross_margin_pct:27.42, operating_income:1082518000, operating_margin_pct:8.52, net_income:1050597000, net_margin_pct:8.27, eps_basic:3.7, total_assets:31524000000, total_liabilities:9486000000, stockholders_equity:18170000000 },
  { period:"2022-Q1", fiscal_year:2022, quarter:1, period_end:"2022-03-26", revenue:13336000000, gross_profit:3769000000, gross_margin_pct:28.26, operating_income:1282000000, operating_margin_pct:9.61, net_income:618000000, net_margin_pct:4.63, eps_basic:0.18, total_assets:30911368000, total_liabilities:8894041000, stockholders_equity:17549000000 },
  { period:"2022-Q2", fiscal_year:2022, quarter:2, period_end:"2022-06-25", revenue:13035000000, gross_profit:3558000000, gross_margin_pct:27.3, operating_income:1073000000, operating_margin_pct:8.23, net_income:628000000, net_margin_pct:4.82, eps_basic:0.18, total_assets:30374604000, total_liabilities:8837791000, stockholders_equity:17243000000 },
  { period:"2022-Q3", fiscal_year:2022, quarter:3, period_end:"2022-09-24", revenue:13107000000, gross_profit:3470000000, gross_margin_pct:26.47, operating_income:935000000, operating_margin_pct:7.13, net_income:394000000, net_margin_pct:3.01, eps_basic:0.12, total_assets:30347557000, total_liabilities:9105228000, stockholders_equity:17065000000 },
  { period:"2022-Q4", fiscal_year:2022, quarter:4, period_end:"2022-12-31", revenue:15464000000, gross_profit:4207000000, gross_margin_pct:27.21, operating_income:1469000000, operating_margin_pct:9.5, net_income:1278000000, net_margin_pct:8.26, eps_basic:0.38, total_assets:31047000000, total_liabilities:9195000000, stockholders_equity:17786000000 },
  { period:"2023-Q1", fiscal_year:2023, quarter:1, period_end:"2023-04-01", revenue:14438000000, gross_profit:3910000000, gross_margin_pct:27.08, operating_income:1215000000, operating_margin_pct:8.42, net_income:1241000000, net_margin_pct:8.6, eps_basic:0.37, total_assets:32241000000, total_liabilities:9109000000, stockholders_equity:18432000000 },
  { period:"2023-Q2", fiscal_year:2023, quarter:2, period_end:"2023-07-01", revenue:14189000000, gross_profit:3809000000, gross_margin_pct:26.84, operating_income:1070000000, operating_margin_pct:7.54, net_income:1097000000, net_margin_pct:7.73, eps_basic:0.33, total_assets:32776000000, total_liabilities:9165000000, stockholders_equity:19183000000 },
  { period:"2023-Q3", fiscal_year:2023, quarter:3, period_end:"2023-09-30", revenue:14062000000, gross_profit:3780000000, gross_margin_pct:26.88, operating_income:1056000000, operating_margin_pct:7.51, net_income:833000000, net_margin_pct:5.92, eps_basic:0.25, total_assets:33354000000, total_liabilities:9533000000, stockholders_equity:19496000000 },
  { period:"2023-Q4", fiscal_year:2023, quarter:4, period_end:"2023-12-30", revenue:14845000000, gross_profit:3946000000, gross_margin_pct:26.58, operating_income:1132000000, operating_margin_pct:7.63, net_income:1178000000, net_margin_pct:7.94, eps_basic:0.36, total_assets:34384000000, total_liabilities:9713000000, stockholders_equity:20416000000 },
  { period:"2024-Q1", fiscal_year:2024, quarter:1, period_end:"2024-03-30", revenue:15162000000, gross_profit:4003000000, gross_margin_pct:26.4, operating_income:1195000000, operating_margin_pct:7.88, net_income:1366000000, net_margin_pct:9.01, eps_basic:0.41, total_assets:35764000000, total_liabilities:9864000000, stockholders_equity:21030000000 },
  { period:"2024-Q2", fiscal_year:2024, quarter:2, period_end:"2024-06-29", revenue:14636000000, gross_profit:3831000000, gross_margin_pct:26.18, operating_income:1052000000, operating_margin_pct:7.19, net_income:972000000, net_margin_pct:6.64, eps_basic:0.29, total_assets:35752000000, total_liabilities:9609000000, stockholders_equity:21493000000 },
  { period:"2024-Q3", fiscal_year:2024, quarter:3, period_end:"2024-09-28", revenue:14733000000, gross_profit:3818000000, gross_margin_pct:25.91, operating_income:1020000000, operating_margin_pct:6.92, net_income:1097000000, net_margin_pct:7.45, eps_basic:0.33, total_assets:36851000000, total_liabilities:9984000000, stockholders_equity:22284000000 },
  { period:"2024-Q4", fiscal_year:2024, quarter:4, period_end:"2024-12-28", revenue:15646000000, gross_profit:4097000000, gross_margin_pct:26.19, operating_income:1201000000, operating_margin_pct:7.68, net_income:1200000000, net_margin_pct:7.67, eps_basic:0.38, total_assets:37601000000, total_liabilities:10173000000, stockholders_equity:22863000000 },
  { period:"2025-Q1", fiscal_year:2025, quarter:1, period_end:"2025-03-29", revenue:15934000000, gross_profit:4240000000, gross_margin_pct:26.61, operating_income:1344000000, operating_margin_pct:8.43, net_income:1011000000, net_margin_pct:6.34, eps_basic:0.31, total_assets:38398000000, total_liabilities:10051000000, stockholders_equity:23002000000 },
  { period:"2025-Q2", fiscal_year:2025, quarter:2, period_end:"2025-06-28", revenue:15690000000, gross_profit:4084000000, gross_margin_pct:26.03, operating_income:1152000000, operating_margin_pct:7.34, net_income:1375000000, net_margin_pct:8.76, eps_basic:0.42, total_assets:39370000000, total_liabilities:10323000000, stockholders_equity:23956000000 },
  { period:"2025-Q3", fiscal_year:2025, quarter:3, period_end:"2025-09-27", revenue:15499000000, gross_profit:4003000000, gross_margin_pct:25.83, operating_income:1062000000, operating_margin_pct:6.85, net_income:1183000000, net_margin_pct:7.63, eps_basic:0.37, total_assets:40363000000, total_liabilities:10840000000, stockholders_equity:24471000000 },
  { period:"2025-Q4", fiscal_year:2025, quarter:4, period_end:"2025-12-27", revenue:16086000000, gross_profit:4062000000, gross_margin_pct:25.25, operating_income:1066000000, operating_margin_pct:6.63, net_income:1165000000, net_margin_pct:7.24, eps_basic:0.36, total_assets:40989000000, total_liabilities:10887000000, stockholders_equity:25141000000 },
];

// ────────────────────────────────────────────────────────────────────
// Store Count Interpolation
// ────────────────────────────────────────────────────────────────────
const YEAR_END_STORE_COUNTS = {
  2014: 1100, 2015: 1114, 2016: 1136, 2017: 1167, 2018: 1211, 2019: 1239,
  2020: 1264, 2021: 1293, 2022: 1322, 2023: 1360, 2024: 1390, 2025: 1432
};

// ────────────────────────────────────────────────────────────────────
// Transformation Functions
// ────────────────────────────────────────────────────────────────────

function computeYoYGrowth(quarters, field) {
  return quarters.map((q, i) => {
    if (i < 4) return null;
    const current = q[field];
    const priorYear = quarters[i - 4][field];
    if (priorYear === 0 || priorYear == null) return null;
    return ((current - priorYear) / Math.abs(priorYear)) * 100;
  });
}

function computeQoQGrowth(quarters, field) {
  return quarters.map((q, i) => {
    if (i === 0) return null;
    const current = q[field];
    const prior = quarters[i - 1][field];
    if (prior === 0 || prior == null) return null;
    return ((current - prior) / Math.abs(prior)) * 100;
  });
}

export function filterByYears(quarters, startYear, endYear) {
  return quarters.filter(q => q.fiscalYear >= startYear && q.fiscalYear <= endYear);
}

export function formatRevenue(value) {
  if (value == null) return '—';
  const abs = Math.abs(value);
  if (abs >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString('en-US')}`;
}

export function getMarginColor(value, type) {
  if (type === 'net') {
    if (value >= 6.0) return '#22c55e';
    if (value >= 4.0) return '#C8A050';
    return '#ef4444';
  }
  if (type === 'gross') {
    if (value >= 27.5) return '#22c55e';
    if (value >= 26.0) return '#C8A050';
    return '#ef4444';
  }
  if (type === 'operating') {
    if (value >= 8.0) return '#22c55e';
    if (value >= 6.5) return '#C8A050';
    return '#ef4444';
  }
  return '#a3a3a3';
}

export function formatBillions(value, decimals = 1) {
  return `$${(value / 1e9).toFixed(decimals)}B`;
}

export function formatMillions(value, decimals = 1) {
  return `$${(value / 1e6).toFixed(decimals)}M`;
}

export function formatPercent(value, decimals = 2) {
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value) {
  return value.toLocaleString('en-US');
}

// ────────────────────────────────────────────────────────────────────
// Unrealized Equity Securities Gain/Loss (EquitySecuritiesFvNiUnrealizedGainLoss)
// Source: SEC EDGAR XBRL (us-gaap). ASC 321 effective FY2018; flows through income statement.
// These are mark-to-market swings on Publix's investment portfolio — NOT operational.
// Keyed by period string matching RAW_QUARTERS.
// Tax rate applied: ~27% blended effective rate (Publix FY2015–FY2025 average).
// ────────────────────────────────────────────────────────────────────
const UNREALIZED_SECURITIES_GL = {
  // Pre-ASC 321 (before 2018): recognized in OCI, not income statement
  '2015-Q1': 0, '2015-Q2': 0, '2015-Q3': 0, '2015-Q4': 0,
  '2016-Q1': 0, '2016-Q2': 0, '2016-Q3': 0, '2016-Q4': 0,
  '2017-Q1': 0, '2017-Q2': 0, '2017-Q3': 0, '2017-Q4': 0,
  // FY2018: ASC 321 adopted — unrealized gains/losses now hit income statement
  '2018-Q1':  -26000000,
  '2018-Q2':   77000000,
  '2018-Q3':  166000000,
  '2018-Q4': -325000000,  // FY total -$107M; Q4 = FY(-107) - Q1(-26) - Q2(77) - Q3(166)
  // FY2019
  '2019-Q1':  314000000,
  '2019-Q2':    5000000,
  '2019-Q3':  -27000000,
  '2019-Q4':  180000000,  // FY total $472M; Q4 = FY(472) - Q1(314) - Q2(5) - Q3(-27)
  // FY2020
  '2020-Q1': -387000000,
  '2020-Q2':  597000000,
  '2020-Q3':  131000000,
  '2020-Q4':  214000000,  // FY total $555M; Q4 = FY(555) - Q1(-387) - Q2(597) - Q3(131)
  // FY2021
  '2021-Q1':  785000000,
  '2021-Q2':  129000000,
  '2021-Q3':   73000000,
  '2021-Q4':  122000000,  // FY total $1109M; Q4 = FY(1109) - Q1(785) - Q2(129) - Q3(73)
  // FY2022
  '2022-Q1': -581000000,
  '2022-Q2': -358000000,
  '2022-Q3': -556000000,
  '2022-Q4':  -21000000,  // FY total -$1516M; Q4 = FY(-1516) - Q1(-581) - Q2(-358) - Q3(-556)
  // FY2023
  '2023-Q1':  246000000,
  '2023-Q2':  123000000,
  '2023-Q3': -144000000,
  '2023-Q4':  173000000,  // FY total $398M; Q4 = FY(398) - Q1(246) - Q2(123) - Q3(-144)
  // FY2024
  '2024-Q1':  387000000,
  '2024-Q2':   43000000,
  '2024-Q3':  224000000,
  '2024-Q4':  134000000,  // FY total $788M; Q4 = FY(788) - Q1(387) - Q2(43) - Q3(224)
  // FY2025
  '2025-Q1': -223000000,
  '2025-Q2':  446000000,
  '2025-Q3':  272000000,
  '2025-Q4':  218000000,  // FY total $713M; Q4 = FY(713) - Q1(-223) - Q2(446) - Q3(272)
};

// Combined federal (21%) + state statutory rate used by Publix in their own non-GAAP reconciliation.
// Verified against Q3 2022 press release: $141.5M tax on $556.3M adjustment = 25.44%.
// Source: Publix quarterly earnings releases, "Net earnings excluding fair value adjustment" disclosures.
const PUBLIX_TAX_RATE = 0.254;

// ────────────────────────────────────────────────────────────────────
// Initialize Quarters with computed fields
// ────────────────────────────────────────────────────────────────────

function initializeQuarters(raw) {
  // Step 1: camelCase conversion + store count interpolation
  const withStores = raw.map(r => {
    const fy = r.fiscal_year;
    const q = r.quarter;
    const prevEnd = YEAR_END_STORE_COUNTS[fy - 1];
    const thisEnd = YEAR_END_STORE_COUNTS[fy];
    const storeCount = q === 4 ? thisEnd : Math.round(prevEnd + (thisEnd - prevEnd) * (q / 4));
    return {
      period: r.period,
      fiscalYear: r.fiscal_year,
      quarter: r.quarter,
      periodEnd: r.period_end,
      revenue: r.revenue,
      grossProfit: r.gross_profit,
      grossMarginPct: r.gross_margin_pct,
      operatingIncome: r.operating_income,
      operatingMarginPct: r.operating_margin_pct,
      netIncome: r.net_income,
      netMarginPct: r.net_margin_pct,
      epsBasic: r.eps_basic,
      totalAssets: r.total_assets,
      totalLiabilities: r.total_liabilities,
      stockholdersEquity: r.stockholders_equity,
      storeCount,
      revenuePerStore: r.revenue / storeCount,
      // Unrealized securities G/L (pre-tax) that flowed through net income
      unrealizedSecuritiesGL: UNREALIZED_SECURITIES_GL[r.period] ?? 0,
    };
  });

  // Step 1b: compute operatingNetIncome = reported net income minus after-tax unrealized G/L
  const withOperatingNI = withStores.map(q => {
    // Strip the after-tax impact of unrealized securities gains/losses
    const afterTaxGL = q.unrealizedSecuritiesGL * (1 - PUBLIX_TAX_RATE);
    const operatingNetIncome = q.netIncome - afterTaxGL;
    const operatingNetMarginPct = (operatingNetIncome / q.revenue) * 100;
    return { ...q, operatingNetIncome, operatingNetMarginPct };
  });

  // Step 2: compute growth arrays
  const qoqRev = computeQoQGrowth(withOperatingNI, 'revenue');
  const yoyRev = computeYoYGrowth(withOperatingNI, 'revenue');
  const yoyNI = computeYoYGrowth(withOperatingNI, 'netIncome');
  const qoqNI = computeQoQGrowth(withOperatingNI, 'netIncome');
  const yoyOpNI = computeYoYGrowth(withOperatingNI, 'operatingNetIncome');

  return withOperatingNI.map((q, i) => ({
    ...q,
    qoqRevenueGrowth: qoqRev[i],
    yoyRevenueGrowth: yoyRev[i],
    yoyNetIncomeGrowth: yoyNI[i],
    qoqNetIncomeGrowth: qoqNI[i],
    yoyOperatingNetIncomeGrowth: yoyOpNI[i],
  }));
}

export const QUARTERS = initializeQuarters(RAW_QUARTERS);
export const LATEST_QUARTER = QUARTERS[QUARTERS.length - 1];

// ────────────────────────────────────────────────────────────────────
// Annual Aggregated Data
// ────────────────────────────────────────────────────────────────────

export function computeAnnualData(quarters) {
  const byYear = {};
  quarters.forEach(q => {
    if (!byYear[q.fiscalYear]) byYear[q.fiscalYear] = [];
    byYear[q.fiscalYear].push(q);
  });

  return Object.keys(byYear).sort().map(year => {
    const qs = byYear[year];
    const q4 = qs.find(q => q.quarter === 4) || qs[qs.length - 1];
    return {
      year: Number(year),
      revenue: qs.reduce((s, q) => s + q.revenue, 0),
      netIncome: qs.reduce((s, q) => s + q.netIncome, 0),
      operatingNetIncome: qs.reduce((s, q) => s + q.operatingNetIncome, 0),
      grossProfit: qs.reduce((s, q) => s + q.grossProfit, 0),
      operatingIncome: qs.reduce((s, q) => s + q.operatingIncome, 0),
      avgGrossMargin: qs.reduce((s, q) => s + q.grossMarginPct, 0) / qs.length,
      avgOperatingMargin: qs.reduce((s, q) => s + q.operatingMarginPct, 0) / qs.length,
      avgNetMargin: qs.reduce((s, q) => s + q.netMarginPct, 0) / qs.length,
      avgOperatingNetMargin: qs.reduce((s, q) => s + q.operatingNetMarginPct, 0) / qs.length,
      storeCount: q4.storeCount,
      totalAssets: q4.totalAssets,
      totalLiabilities: q4.totalLiabilities,
      stockholdersEquity: q4.stockholdersEquity,
      revenuePerStore: q4.revenue / q4.storeCount,
    };
  });
}

export const ANNUAL_DATA = computeAnnualData(QUARTERS);

// ────────────────────────────────────────────────────────────────────
// KPI Sparkline Data (last 8 quarters)
// ────────────────────────────────────────────────────────────────────

export function computeSparklines(quarters) {
  const last8 = quarters.slice(-8);
  return {
    revenue: last8.map(q => q.revenue / 1e9),
    netIncome: last8.map(q => q.netIncome / 1e9),
    operatingNetIncome: last8.map(q => q.operatingNetIncome / 1e9),
    netMarginPct: last8.map(q => q.netMarginPct),
    operatingNetMarginPct: last8.map(q => q.operatingNetMarginPct),
    storeCount: last8.map(q => q.storeCount),
  };
}

export const KPI_SPARKLINE_DATA = computeSparklines(QUARTERS);

// ────────────────────────────────────────────────────────────────────
// Seasonality Matrices
// ────────────────────────────────────────────────────────────────────

export const SEASONALITY_MATRIX = [
  { year: 2015, q1: 6.52, q2: 6.02, q3: 5.22, q4: 6.29 },
  { year: 2016, q1: 6.62, q2: 5.84, q3: 5.21, q4: 5.92 },
  { year: 2017, q1: 6.34, q2: 5.84, q3: 5.53, q4: 8.50 },
  { year: 2018, q1: 7.28, q2: 6.98, q3: 7.65, q4: 4.35 },
  { year: 2019, q1: 10.05, q2: 7.00, q3: 6.10, q4: 8.02 },
  { year: 2020, q1: 5.90, q2: 11.92, q3: 8.24, q4: 9.03 },
  { year: 2021, q1: 12.71, q2: 8.46, q3: 7.14, q4: 8.27 },
  { year: 2022, q1: 4.63, q2: 4.82, q3: 3.01, q4: 8.26 },
  { year: 2023, q1: 8.60, q2: 7.73, q3: 5.92, q4: 7.94 },
  { year: 2024, q1: 9.01, q2: 6.64, q3: 7.45, q4: 7.67 },
  { year: 2025, q1: 6.34, q2: 8.76, q3: 7.63, q4: 7.24 },
];

export const REVENUE_MATRIX = [
  { year: 2015, q1: 8412745000, q2: 8018031000, q3: 7902144000, q4: 8285839000 },
  { year: 2016, q1: 8790561000, q2: 8190537000, q3: 8090649000, q4: 9202362000 },
  { year: 2017, q1: 8752946000, q2: 8482827000, q3: 8586080000, q4: 9014985000 },
  { year: 2018, q1: 9345807000, q2: 8826003000, q3: 8858101000, q4: 9365807000 },
  { year: 2019, q1: 9760110000, q2: 9446916000, q3: 9417933000, q4: 9837794000 },
  { year: 2020, q1: 11306951000, q2: 11468563000, q3: 11136409000, q4: 11292036000 },
  { year: 2021, q1: 11760235000, q2: 11927061000, q3: 12007162000, q4: 12699542000 },
  { year: 2022, q1: 13336000000, q2: 13035000000, q3: 13107000000, q4: 15464000000 },
  { year: 2023, q1: 14438000000, q2: 14189000000, q3: 14062000000, q4: 14845000000 },
  { year: 2024, q1: 15162000000, q2: 14636000000, q3: 14733000000, q4: 15646000000 },
  { year: 2025, q1: 15934000000, q2: 15690000000, q3: 15499000000, q4: 16086000000 },
];

// ────────────────────────────────────────────────────────────────────
// Heatmap Helpers
// ────────────────────────────────────────────────────────────────────

export function getCellBackground(marginPct, globalMin, globalMax) {
  const intensity = (marginPct - globalMin) / (globalMax - globalMin);
  const alpha = 0.15 + intensity * 0.65;
  return `rgba(74, 222, 128, ${alpha.toFixed(3)})`; // green — higher margin = darker
}

export function getMinMax(marginMatrix, visibleYears) {
  const values = marginMatrix
    .filter(row => visibleYears.includes(row.year))
    .flatMap(row => [row.q1, row.q2, row.q3, row.q4]);
  return { min: Math.min(...values), max: Math.max(...values) };
}

export function getCellTooltip(row, quarter, revenueMatrix) {
  const qKey = `q${quarter}`;
  const netMargin = row[qKey];
  const revenueRow = revenueMatrix.find(r => r.year === row.year);
  const revenue = revenueRow ? revenueRow[qKey] : null;
  const revStr = revenue ? formatRevenue(revenue) : '—';
  return `${row.year}-Q${quarter}: Revenue ${revStr} · Net Margin ${netMargin.toFixed(2)}%`;
}

// ────────────────────────────────────────────────────────────────────
// Annotations for Revenue & Net Income Chart
// ────────────────────────────────────────────────────────────────────

export const ANNOTATIONS = [
  { id: 'covid_surge', quarter: '2020-Q1', label: '🦠 COVID Surge', labelPosition: 'start', color: '#ef4444' },
  { id: 'portfolio_peak', quarter: '2021-Q1', label: '💼 Portfolio Peak', labelPosition: 'end', color: '#2DD4BF' },
  { id: 'covid_normalize', quarter: '2021-Q2', label: '📉 Growth Normalizes', labelPosition: 'start', color: '#2DD4BF' },
  { id: 'inflation_surge', quarter: '2022-Q1', label: '💰 Inflation Pass-Through', labelPosition: 'start', color: '#C8A050' },
  { id: 'gross_margin_accel', quarter: '2022-Q1', label: '⬇️ GM Compression', labelPosition: 'end', color: '#C8A050' },
  { id: 'margin_trough', quarter: '2022-Q3', label: '📊 Margin Trough', labelPosition: 'end', color: '#ef4444' },
  { id: 'normalization', quarter: '2024-Q1', label: '🔄 Organic Growth', labelPosition: 'start', color: '#C8A050' },
];

export function getAnnotationXIndex(quarter, filteredData) {
  return filteredData.findIndex(q => q.period === quarter);
}

export function buildChartAnnotations(filteredData) {
  const result = {};
  ANNOTATIONS.forEach(a => {
    const idx = getAnnotationXIndex(a.quarter, filteredData);
    if (idx < 0) return;
    result[a.id] = {
      type: 'line',
      xMin: idx,
      xMax: idx,
      borderColor: a.color + '60',
      borderWidth: 1.5,
      borderDash: [6, 3],
      label: {
        display: true,
        content: a.label,
        position: a.labelPosition,
        color: a.color,
        font: { size: 10, weight: 500 },
        backgroundColor: '#0a0a0aCC',
        padding: { top: 2, bottom: 2, left: 6, right: 6 },
        borderRadius: 4,
      },
    };
  });
  return result;
}
