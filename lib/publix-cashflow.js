// ─────────────────────────────────────────────────────────────────────
// lib/publix-cashflow.js
// Publix Super Markets — 44-quarter cash flow dataset (FY2015–FY2025)
// Embedded from SEC EDGAR XBRL data
// ─────────────────────────────────────────────────────────────────────

export const CASHFLOW_QUARTERS = [
  { period: "2015-Q1", fiscal_year: 2015, quarter: 1, operating_cash_flow: 1135388000, capex: -221571000, free_cash_flow: 913817000, investing_activities: -901036000, financing_activities: -186094000, net_change_in_cash: 48258000, depreciation_amortization: 134073000, stock_repurchases: -277730000, dividends_paid: 0, cash_end_of_period: 455751000 },
  { period: "2015-Q2", fiscal_year: 2015, quarter: 2, operating_cash_flow: 543040000, capex: -283365000, free_cash_flow: 259675000, investing_activities: -262568000, financing_activities: -458979000, net_change_in_cash: -178507000, depreciation_amortization: 135693000, stock_repurchases: -204220000, dividends_paid: -303354000, cash_end_of_period: 277244000 },
  { period: "2015-Q3", fiscal_year: 2015, quarter: 3, operating_cash_flow: 699169000, capex: -274100000, free_cash_flow: 425069000, investing_activities: -399660000, financing_activities: -249255000, net_change_in_cash: 50254000, depreciation_amortization: 152361000, stock_repurchases: -200217000, dividends_paid: -154968000, cash_end_of_period: 327498000 },
  { period: "2015-Q4", fiscal_year: 2015, quarter: 4, operating_cash_flow: 563768000, capex: -456612000, free_cash_flow: 107156000, investing_activities: -283237000, financing_activities: -255853000, net_change_in_cash: 24678000, depreciation_amortization: 159765000, stock_repurchases: -173634000, dividends_paid: -154444000, cash_end_of_period: 352176000 },
  { period: "2016-Q1", fiscal_year: 2016, quarter: 1, operating_cash_flow: 1248417000, capex: -336682000, free_cash_flow: 911735000, investing_activities: -766644000, financing_activities: -340272000, net_change_in_cash: 141501000, depreciation_amortization: 149934000, stock_repurchases: -277919000, dividends_paid: -153957000, cash_end_of_period: 493677000 },
  { period: "2016-Q2", fiscal_year: 2016, quarter: 2, operating_cash_flow: 567006000, capex: -394054000, free_cash_flow: 172952000, investing_activities: -398843000, financing_activities: -357078000, net_change_in_cash: -188915000, depreciation_amortization: 157733000, stock_repurchases: -245482000, dividends_paid: -172116000, cash_end_of_period: 304762000 },
  { period: "2016-Q3", fiscal_year: 2016, quarter: 3, operating_cash_flow: 803340000, capex: -379780000, free_cash_flow: 423560000, investing_activities: -479492000, financing_activities: -324049000, net_change_in_cash: -201000, depreciation_amortization: 151027000, stock_repurchases: -199240000, dividends_paid: -171245000, cash_end_of_period: 304561000 },
  { period: "2016-Q4", fiscal_year: 2016, quarter: 4, operating_cash_flow: 634192000, capex: -333311000, free_cash_flow: 300881000, investing_activities: -161119000, financing_activities: -339315000, net_change_in_cash: 133758000, depreciation_amortization: 165509000, stock_repurchases: -237621000, dividends_paid: -170584000, cash_end_of_period: 438319000 },
  { period: "2017-Q1", fiscal_year: 2017, quarter: 1, operating_cash_flow: 1161526000, capex: -287654000, free_cash_flow: 873872000, investing_activities: -676955000, financing_activities: -354258000, net_change_in_cash: 130313000, depreciation_amortization: 157291000, stock_repurchases: -287451000, dividends_paid: -169722000, cash_end_of_period: 568632000 },
  { period: "2017-Q2", fiscal_year: 2017, quarter: 2, operating_cash_flow: 494424000, capex: -441600000, free_cash_flow: 52824000, investing_activities: -360910000, financing_activities: -448421000, net_change_in_cash: -314907000, depreciation_amortization: 160383000, stock_repurchases: -306793000, dividends_paid: -176410000, cash_end_of_period: 253725000 },
  { period: "2017-Q3", fiscal_year: 2017, quarter: 3, operating_cash_flow: 1157065000, capex: -333898000, free_cash_flow: 823167000, investing_activities: 218818000, financing_activities: -958913000, net_change_in_cash: 416970000, depreciation_amortization: 166633000, stock_repurchases: -844384000, dividends_paid: -173655000, cash_end_of_period: 670695000 },
  { period: "2017-Q4", fiscal_year: 2017, quarter: 4, operating_cash_flow: 767266000, capex: -365907000, free_cash_flow: 401359000, investing_activities: -417052000, financing_activities: -440984000, net_change_in_cash: -90770000, depreciation_amortization: 179702000, stock_repurchases: -313236000, dividends_paid: -169873000, cash_end_of_period: 579925000 },
  { period: "2018-Q1", fiscal_year: 2018, quarter: 1, operating_cash_flow: 1104802000, capex: -449980000, free_cash_flow: 654822000, investing_activities: -525314000, financing_activities: -515058000, net_change_in_cash: 64430000, depreciation_amortization: 160170000, stock_repurchases: -432894000, dividends_paid: -168597000, cash_end_of_period: 644355000 },
  { period: "2018-Q2", fiscal_year: 2018, quarter: 2, operating_cash_flow: 728659000, capex: -281393000, free_cash_flow: 447266000, investing_activities: -352261000, financing_activities: -458823000, net_change_in_cash: -82425000, depreciation_amortization: 168211000, stock_repurchases: -317877000, dividends_paid: -190655000, cash_end_of_period: 561930000 },
  { period: "2018-Q3", fiscal_year: 2018, quarter: 3, operating_cash_flow: 1029530000, capex: -367472000, free_cash_flow: 662058000, investing_activities: -401231000, financing_activities: -573946000, net_change_in_cash: 54353000, depreciation_amortization: 172717000, stock_repurchases: -441275000, dividends_paid: -188441000, cash_end_of_period: 616283000 },
  { period: "2018-Q4", fiscal_year: 2018, quarter: 4, operating_cash_flow: 768935000, capex: -251244000, free_cash_flow: 517691000, investing_activities: -463978000, financing_activities: -321976000, net_change_in_cash: -17019000, depreciation_amortization: 176056000, stock_repurchases: -213826000, dividends_paid: -186817000, cash_end_of_period: 599264000 },
  { period: "2019-Q1", fiscal_year: 2019, quarter: 1, operating_cash_flow: 1428356000, capex: -254836000, free_cash_flow: 1173520000, investing_activities: -606928000, financing_activities: -408550000, net_change_in_cash: 412878000, depreciation_amortization: 174049000, stock_repurchases: -333857000, dividends_paid: -185835000, cash_end_of_period: 1012142000 },
  { period: "2019-Q2", fiscal_year: 2019, quarter: 2, operating_cash_flow: 833608000, capex: -396377000, free_cash_flow: 437231000, investing_activities: -599388000, financing_activities: -425752000, net_change_in_cash: -191532000, depreciation_amortization: 176927000, stock_repurchases: -256851000, dividends_paid: -215552000, cash_end_of_period: 820610000 },
  { period: "2019-Q3", fiscal_year: 2019, quarter: 3, operating_cash_flow: 905024000, capex: -234173000, free_cash_flow: 670851000, investing_activities: -72769000, financing_activities: -358855000, net_change_in_cash: 473400000, depreciation_amortization: 183771000, stock_repurchases: -223598000, dividends_paid: -214162000, cash_end_of_period: 1294010000 },
  { period: "2019-Q4", fiscal_year: 2019, quarter: 4, operating_cash_flow: 857443000, capex: -255732000, free_cash_flow: 601711000, investing_activities: -977944000, financing_activities: -410127000, net_change_in_cash: -530628000, depreciation_amortization: 181922000, stock_repurchases: -274264000, dividends_paid: -213184000, cash_end_of_period: 763000000 },
  { period: "2020-Q1", fiscal_year: 2020, quarter: 1, operating_cash_flow: 2292505000, capex: -269288000, free_cash_flow: 2023217000, investing_activities: -893813000, financing_activities: -543199000, net_change_in_cash: 855493000, depreciation_amortization: 178969000, stock_repurchases: -442509000, dividends_paid: -211847000, cash_end_of_period: 1618875000 },
  { period: "2020-Q2", fiscal_year: 2020, quarter: 2, operating_cash_flow: 1251193000, capex: -304715000, free_cash_flow: 946478000, investing_activities: -914788000, financing_activities: -531787000, net_change_in_cash: -195382000, depreciation_amortization: 180299000, stock_repurchases: -332605000, dividends_paid: -225495000, cash_end_of_period: 1423493000 },
  { period: "2020-Q3", fiscal_year: 2020, quarter: 3, operating_cash_flow: 736222000, capex: -320316000, free_cash_flow: 415906000, investing_activities: -1083318000, financing_activities: -473599000, net_change_in_cash: -820695000, depreciation_amortization: 185912000, stock_repurchases: -316031000, dividends_paid: -224264000, cash_end_of_period: 602798000 },
  { period: "2020-Q4", fiscal_year: 2020, quarter: 4, operating_cash_flow: 1144080000, capex: -333681000, free_cash_flow: 810399000, investing_activities: -536081000, financing_activities: -537415000, net_change_in_cash: 70584000, depreciation_amortization: 191820000, stock_repurchases: -348855000, dividends_paid: -222394000, cash_end_of_period: 673000000 },
  { period: "2021-Q1", fiscal_year: 2021, quarter: 1, operating_cash_flow: 1488297000, capex: -345933000, free_cash_flow: 1142364000, investing_activities: -707036000, financing_activities: -475685000, net_change_in_cash: 305576000, depreciation_amortization: 192241000, stock_repurchases: -340092000, dividends_paid: -220975000, cash_end_of_period: 979059000 },
  { period: "2021-Q2", fiscal_year: 2021, quarter: 2, operating_cash_flow: 1090980000, capex: -303989000, free_cash_flow: 786991000, investing_activities: -697843000, financing_activities: -468386000, net_change_in_cash: -75249000, depreciation_amortization: 196849000, stock_repurchases: -248145000, dividends_paid: -256562000, cash_end_of_period: 903810000 },
  { period: "2021-Q3", fiscal_year: 2021, quarter: 3, operating_cash_flow: 1547444000, capex: -333409000, free_cash_flow: 1214035000, investing_activities: -833694000, financing_activities: -446028000, net_change_in_cash: 267722000, depreciation_amortization: 199246000, stock_repurchases: -244209000, dividends_paid: -255349000, cash_end_of_period: 1171532000 },
  { period: "2021-Q4", fiscal_year: 2021, quarter: 4, operating_cash_flow: 1262279000, capex: -304669000, free_cash_flow: 957610000, investing_activities: -793427000, financing_activities: -507901000, net_change_in_cash: -39049000, depreciation_amortization: 205664000, stock_repurchases: -304554000, dividends_paid: -254114000, cash_end_of_period: 1132000000 },
  { period: "2022-Q1", fiscal_year: 2022, quarter: 1, operating_cash_flow: 1573000000, capex: -402000000, free_cash_flow: 1171000000, investing_activities: -1320000000, financing_activities: -705000000, net_change_in_cash: -452000000, depreciation_amortization: 202000000, stock_repurchases: -538000000, dividends_paid: -253000000, cash_end_of_period: 680000000 },
  { period: "2022-Q2", fiscal_year: 2022, quarter: 2, operating_cash_flow: 1204000000, capex: -386000000, free_cash_flow: 818000000, investing_activities: 85000000, financing_activities: -941000000, net_change_in_cash: 348000000, depreciation_amortization: 206000000, stock_repurchases: -733000000, dividends_paid: -307000000, cash_end_of_period: 1028000000 },
  { period: "2022-Q3", fiscal_year: 2022, quarter: 3, operating_cash_flow: 1310000000, capex: -498000000, free_cash_flow: 812000000, investing_activities: -161000000, financing_activities: -578000000, net_change_in_cash: 571000000, depreciation_amortization: 211000000, stock_repurchases: -375000000, dividends_paid: -304000000, cash_end_of_period: 1599000000 },
  { period: "2022-Q4", fiscal_year: 2022, quarter: 4, operating_cash_flow: 1417000000, capex: -482000000, free_cash_flow: 935000000, investing_activities: -899000000, financing_activities: -781000000, net_change_in_cash: -263000000, depreciation_amortization: 219000000, stock_repurchases: -491000000, dividends_paid: -302000000, cash_end_of_period: 1336000000 },
  { period: "2023-Q1", fiscal_year: 2023, quarter: 1, operating_cash_flow: 1509000000, capex: -492000000, free_cash_flow: 1017000000, investing_activities: -757000000, financing_activities: -527000000, net_change_in_cash: 225000000, depreciation_amortization: 222000000, stock_repurchases: -317000000, dividends_paid: -299000000, cash_end_of_period: 1561000000 },
  { period: "2023-Q2", fiscal_year: 2023, quarter: 2, operating_cash_flow: 1221000000, capex: -392000000, free_cash_flow: 829000000, investing_activities: -656000000, financing_activities: -563000000, net_change_in_cash: 2000000, depreciation_amortization: 225000000, stock_repurchases: -258000000, dividends_paid: -334000000, cash_end_of_period: 1563000000 },
  { period: "2023-Q3", fiscal_year: 2023, quarter: 3, operating_cash_flow: 1527000000, capex: -441000000, free_cash_flow: 1086000000, investing_activities: -1410000000, financing_activities: -591000000, net_change_in_cash: -474000000, depreciation_amortization: 229000000, stock_repurchases: -320000000, dividends_paid: -332000000, cash_end_of_period: 1089000000 },
  { period: "2023-Q4", fiscal_year: 2023, quarter: 4, operating_cash_flow: 1343000000, capex: -668000000, free_cash_flow: 675000000, investing_activities: -1024000000, financing_activities: -543000000, net_change_in_cash: -224000000, depreciation_amortization: 238000000, stock_repurchases: -270000000, dividends_paid: -331000000, cash_end_of_period: 865000000 },
  { period: "2024-Q1", fiscal_year: 2024, quarter: 1, operating_cash_flow: 1675000000, capex: -792000000, free_cash_flow: 883000000, investing_activities: -1165000000, financing_activities: -619000000, net_change_in_cash: -109000000, depreciation_amortization: 258000000, stock_repurchases: -394000000, dividends_paid: -329000000, cash_end_of_period: 756000000 },
  { period: "2024-Q2", fiscal_year: 2024, quarter: 2, operating_cash_flow: 1057000000, capex: -407000000, free_cash_flow: 650000000, investing_activities: -574000000, financing_activities: -754000000, net_change_in_cash: -271000000, depreciation_amortization: 236000000, stock_repurchases: -421000000, dividends_paid: -356000000, cash_end_of_period: 485000000 },
  { period: "2024-Q3", fiscal_year: 2024, quarter: 3, operating_cash_flow: 1565000000, capex: -792000000, free_cash_flow: 773000000, investing_activities: -517000000, financing_activities: -588000000, net_change_in_cash: 460000000, depreciation_amortization: 258000000, stock_repurchases: -287000000, dividends_paid: -352000000, cash_end_of_period: 945000000 },
  { period: "2024-Q4", fiscal_year: 2024, quarter: 4, operating_cash_flow: 1271000000, capex: -621000000, free_cash_flow: 650000000, investing_activities: -764000000, financing_activities: -596000000, net_change_in_cash: -89000000, depreciation_amortization: 256000000, stock_repurchases: -291000000, dividends_paid: -351000000, cash_end_of_period: 856000000 },
  { period: "2025-Q1", fiscal_year: 2025, quarter: 1, operating_cash_flow: 2076000000, capex: -555000000, free_cash_flow: 1521000000, investing_activities: -1054000000, financing_activities: -694000000, net_change_in_cash: 328000000, depreciation_amortization: 285000000, stock_repurchases: -453000000, dividends_paid: -351000000, cash_end_of_period: 1184000000 },
  { period: "2025-Q2", fiscal_year: 2025, quarter: 2, operating_cash_flow: 1164000000, capex: -463000000, free_cash_flow: 701000000, investing_activities: -953000000, financing_activities: -739000000, net_change_in_cash: -528000000, depreciation_amortization: 242000000, stock_repurchases: -413000000, dividends_paid: -360000000, cash_end_of_period: 656000000 },
  { period: "2025-Q3", fiscal_year: 2025, quarter: 3, operating_cash_flow: 1534000000, capex: -555000000, free_cash_flow: 979000000, investing_activities: -553000000, financing_activities: -778000000, net_change_in_cash: 203000000, depreciation_amortization: 285000000, stock_repurchases: -487000000, dividends_paid: -359000000, cash_end_of_period: 859000000 },
  { period: "2025-Q4", fiscal_year: 2025, quarter: 4, operating_cash_flow: 1134000000, capex: -679000000, free_cash_flow: 455000000, investing_activities: -724000000, financing_activities: -637000000, net_change_in_cash: -227000000, depreciation_amortization: 279000000, stock_repurchases: -345000000, dividends_paid: -356000000, cash_end_of_period: 632000000 },
];

/**
 * Aggregate quarterly cash flow data into annual totals.
 * Uses Q4 cash_end_of_period as the year-end cash balance.
 *
 * @param {Array} quarters - Array of CASHFLOW_QUARTERS entries
 * @returns {Array} Annual aggregated records
 */
export function computeAnnualCashflow(quarters) {
  const byYear = {};

  for (const q of quarters) {
    const yr = q.fiscal_year;
    if (!byYear[yr]) {
      byYear[yr] = {
        fiscal_year: yr,
        operating_cash_flow: 0,
        capex: 0,
        free_cash_flow: 0,
        depreciation_amortization: 0,
        stock_repurchases: 0,
        dividends_paid: 0,
        cash_end_of_period: null,
      };
    }
    const a = byYear[yr];
    a.operating_cash_flow += q.operating_cash_flow;
    a.capex += q.capex;
    a.free_cash_flow += q.free_cash_flow;
    a.depreciation_amortization += q.depreciation_amortization;
    a.stock_repurchases += q.stock_repurchases;
    a.dividends_paid += q.dividends_paid;
    // Q4 sets year-end cash balance
    if (q.quarter === 4) {
      a.cash_end_of_period = q.cash_end_of_period;
    }
  }

  return Object.values(byYear).sort((a, b) => a.fiscal_year - b.fiscal_year);
}
