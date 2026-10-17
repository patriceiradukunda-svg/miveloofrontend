const CODES = 'AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GT GU GW GY HK HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ');
const PINNED = ['RW', 'UG', 'TZ', 'KE', 'BI', 'CD'];

/** Country list in the visitor's language: Rwanda and its neighbours first, then A–Z. */
export function countryOptions(locale: string): { code: string; name: string }[] {
  let dn: Intl.DisplayNames | undefined;
  try { dn = new Intl.DisplayNames([locale === 'rw' ? 'rw' : 'en', 'en'], { type: 'region' }); } catch { dn = undefined; }
  const all = CODES.map((code) => ({ code, name: dn?.of(code) ?? code }));
  const rest = all.filter((c) => !PINNED.includes(c.code)).sort((a, b) => a.name.localeCompare(b.name));
  const pinned = PINNED.map((p) => all.find((c) => c.code === p)).filter((c): c is { code: string; name: string } => !!c);
  return [...pinned, ...rest];
}
