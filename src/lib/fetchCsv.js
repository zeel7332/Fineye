import Papa from "papaparse";

export async function fetchCsv(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch CSV: ${res.status} ${res.statusText}`);
  }
  const text = await res.text();
  const normalizeHeader = (h) => {
    const s = (h || "")
      .replace(/\uFEFF/g, "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/\//g, " ");
    if (s === "fund name") return "fund_name";
    if (s === "input fund name") return "input_fund_name";
    if (s === "classification") return "classification";
    if (s === "month") return "month";
    if (s === "stock instrument") return "stock_name";
    if (s === "percent aum") return "percent_aum";
    if (s === "stock name") return "stock_name";
    if (s === "sector") return "sector";
    if (s === "net qty bought") return "net_qty_bought";
    if (s === "approx. buy value(in rs. cr) *") return "approx_buy_value_cr";
    if (s === "net qty sold") return "net_qty_sold";
    if (s === "approx. sell value(in rs. cr) *") return "approx_sell_value_cr";
    return s;
  };
  const parseWith = (delimiter) =>
    new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        delimiter,
        skipEmptyLines: true,
        transformHeader: normalizeHeader,
        complete: (results) => {
          try {
            const rows = Array.isArray(results.data) ? results.data : [];
            const normalized = rows
              .map((r) => {
                const fund_name = (r.fund_name ?? r["Fund Name"] ?? r["fund name"] ?? "").trim();
                const classification = (r.classification ?? r["Classification"] ?? r["classification"] ?? "").trim();
                const month = (r.month ?? r["Month"] ?? r["month"] ?? "").trim();
                const stock_name =
                  (r.stock_name ?? r["Stock/Instrument"] ?? r["Stock / Instrument"] ?? r["stock/instrument"] ?? "").trim();
                const percent_aum_raw =
                  (r.percent_aum ?? r["Percent AUM"] ?? r["percent aum"] ?? "").toString().trim();
                const percent_aum = parseFloat(percent_aum_raw) || null;
                const sector = (r.sector ?? r["Sector"] ?? r["sector"] ?? "").trim();
                const company_name = (r.company_name ?? r["company_name"] ?? "").trim();
                const ticker = (r.ticker ?? r["ticker"] ?? "").trim();
                
                const net_qty_bought_raw = (r.net_qty_bought ?? r["Net Qty Bought"] ?? "").toString().trim();
                const approx_buy_value_raw =
                  (r.approx_buy_value_cr ?? r["Approx. Buy Value(In Rs. cr) *"] ?? "").toString().trim();
                const net_qty_sold_raw = (r.net_qty_sold ?? r["Net Qty Sold"] ?? "").toString().trim();
                const approx_sell_value_raw =
                  (r.approx_sell_value_cr ?? r["Approx. Sell Value(In Rs. cr) *"] ?? "").toString().trim();
                const parseNum = (x) => {
                  const cleaned = x.replace(/[,\s]/g, "").replace(/[^\d.-]/g, "");
                  const num = parseFloat(cleaned);
                  return isNaN(num) ? null : num;
                };
                const net_qty_bought = parseNum(net_qty_bought_raw);
                const approx_buy_value_cr = parseNum(approx_buy_value_raw);
                const net_qty_sold = parseNum(net_qty_sold_raw);
                const approx_sell_value_cr = parseNum(approx_sell_value_raw);
                return {
                  fund_name,
                  classification,
                  month,
                  stock_name,
                  percent_aum,
                  sector,
                  company_name,
                  ticker,
                  net_qty_bought,
                  approx_buy_value_cr,
                  net_qty_sold,
                  approx_sell_value_cr
                };
              })
              .filter((row) => 
                row.stock_name && (
                  row.fund_name ||
                  row.net_qty_bought !== null ||
                  row.approx_buy_value_cr !== null ||
                  row.net_qty_sold !== null ||
                  row.approx_sell_value_cr !== null
                )
              );
            resolve(normalized);
          } catch (e) {
            reject(e);
          }
        },
        error: (err) => reject(err),
      });
    });

  const delimiters = ["\t", ",", ";"];
  for (const d of delimiters) {
    const out = await parseWith(d);
    if (out && out.length > 0) return out;
  }
  // Fallback: index-based parsing in case headers are missing or malformed
  const parseByIndex = (delimiter) =>
    new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: false,
        delimiter,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const rows = Array.isArray(results.data) ? results.data : [];
            const normalized = rows
              .filter((r) => Array.isArray(r) && r.length >= 10)
              .map((r) => {
                const c2 = (r[2] ?? "").trim();
                const c3 = (r[3] ?? "").trim();
                const c4 = (r[4] ?? "").trim();
                const c6 = (r[6] ?? "").trim();
                const c9 = (r[9] ?? "").toString().trim();
                const fund_name = c2;
                const classification = c3;
                const month = c4;
                const stock_name = c6;
                const percent_aum = parseFloat(c9) || null;
                return { fund_name, classification, month, stock_name, percent_aum };
              })
              .filter(
                (row) =>
                  row.stock_name &&
                  row.fund_name &&
                  row.fund_name.toLowerCase() !== "fund name" &&
                  row.stock_name.toLowerCase() !== "stock/instrument"
              );
            resolve(normalized);
          } catch (e) {
            reject(e);
          }
        },
        error: (err) => reject(err),
      });
    });
  for (const d of delimiters) {
    const out = await parseByIndex(d);
    if (out && out.length > 0) return out;
  }
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length > 1) {
    const clean = (s) =>
      (s ?? "")
        .replace(/\u00A0/g, " ")
        .replace(/\uFEFF/g, "")
        .trim();
    const detectDelim = (l) => {
      if (l.includes(",")) return ",";
      if (l.includes("\t")) return "\t";
      return "spaces";
    };
    const splitBy = (l, d) => {
      if (d === ",") return l.split(",").map(clean);
      if (d === "\t") return l.split("\t").map(clean);
      return l.split(/ {2,}/).map(clean);
    };
    const headerDelim = detectDelim(lines[0]);
    const header = splitBy(lines[0], headerDelim);
    const idx = {
      fund_name: header.findIndex((h) => normalizeHeader(h) === "fund_name"),
      classification: header.findIndex((h) => normalizeHeader(h) === "classification"),
      month: header.findIndex((h) => normalizeHeader(h) === "month"),
      stock_name: header.findIndex((h) => normalizeHeader(h) === "stock_name"),
      percent_aum: header.findIndex((h) => normalizeHeader(h) === "percent_aum"),
      sector: header.findIndex((h) => normalizeHeader(h) === "sector"),
      net_qty_bought: header.findIndex((h) => normalizeHeader(h) === "net_qty_bought"),
      approx_buy_value_cr: header.findIndex((h) => normalizeHeader(h) === "approx_buy_value_cr"),
    };
    const rows = lines.slice(1).map((l) => splitBy(l, detectDelim(l)));
    const out = rows
      .map((r) => {
        const fund_name = clean(r[idx.fund_name]);
        const classification = clean(r[idx.classification]);
        const month = clean(r[idx.month]);
        const stock_name = clean(r[idx.stock_name]);
        const pa = clean(r[idx.percent_aum]).replace(/%/g, "");
        const percent_aum = parseFloat(pa) || null;
        const sector = clean(r[idx.sector]);
        const parseNum = (x) => {
          const cleaned = (x || "").replace(/[,\s]/g, "").replace(/[^\d.-]/g, "");
          const num = parseFloat(cleaned);
          return isNaN(num) ? null : num;
        };
        const net_qty_bought = parseNum(clean(r[idx.net_qty_bought]));
        const approx_buy_value_cr = parseNum(clean(r[idx.approx_buy_value_cr]));
        return { fund_name, classification, month, stock_name, percent_aum, sector, net_qty_bought, approx_buy_value_cr };
      })
      .filter((row) => row.stock_name && row.fund_name);
    if (out.length > 0) return out;
  }
  return [];
}
