import type { Category, Lang } from '../types';

/** Every UI string, both languages. Armenian strings are rendered through
 *  <Txt>, which routes them to the Armenian face automatically. */
const STRINGS = {
  // brand
  brandTitle: { en: 'Criminal Code', hy: 'Քրեական օրենսգիրք' },
  brandSub: { en: 'Republic of Armenia', hy: 'Հայաստանի Հանրապետություն' },
  // header
  searchPlaceholder: {
    en: 'Search articles, offences, keywords…',
    hy: 'Որոնել հոդվածներ, հանցատեսակներ, բառեր…',
  },
  clear: { en: 'CLEAR', hy: 'ՄԱՔՐԵԼ' },
  themeGta: { en: 'GTA', hy: 'GTA' },
  themeRegular: { en: 'REGULAR', hy: 'ՍՈՎՈՐԱԿԱՆ' },
  openMenu: { en: 'Open contents', hy: 'Բացել բովանդակությունը' },
  closeMenu: { en: 'Close contents', hy: 'Փակել բովանդակությունը' },
  // sidebar
  tabContents: { en: 'CONTENTS', hy: 'ԲՈՎԱՆԴԱԿՈՒԹՅՈՒՆ' },
  tabSearch: { en: 'ARTICLES', hy: 'ՀՈԴՎԱԾՆԵՐ' },
  part: { en: 'PART', hy: 'ՄԱՍ' },
  section: { en: 'SECTION', hy: 'ԲԱԺԻՆ' },
  chapter: { en: 'CHAPTER', hy: 'ԳԼՈՒԽ' },
  art: { en: 'Art.', hy: 'Հոդ.' },
  article: { en: 'ARTICLE', hy: 'ՀՈԴՎԱԾ' },
  noMatch: { en: 'NO MATCH', hy: 'ՀԱՄԸՆԿՆՈՒՄ ՉԿԱ' },
  results: { en: 'RESULTS', hy: 'ԱՐԴՅՈՒՆՔՆԵՐ' },
  records: { en: 'ARTICLES', hy: 'ՀՈԴՎԱԾ' },
  bookmark: { en: 'Bookmark', hy: 'Պահել' },
  bookmarked: { en: 'Bookmarked', hy: 'Պահված է' },
  // filters
  category: { en: 'CATEGORY', hy: 'ԿԱՏԵԳՈՐԻԱ' },
  penalty: { en: 'PENALTY', hy: 'ՊԱՏԻԺ' },
  maxTerm: { en: 'MAX TERM', hy: 'ԱՌԱՎ. ԺԱՄԿԵՏ' },
  any: { en: 'ANY', hy: 'ՑԱՆԿԱՑԱԾ' },
  years: { en: 'YR', hy: 'ՏԱՐԻ' },
  months: { en: 'MO', hy: 'ԱՄԻՍ' },
  clearAll: { en: 'CLEAR ALL', hy: 'ՄԱՔՐԵԼ ԲՈԼՈՐԸ' },
  saved: { en: 'SAVED', hy: 'ՊԱՀՎԱԾ' },
  savedTip: {
    en: 'Only articles you have bookmarked.',
    hy: 'Միայն ձեր պահած հոդվածները։',
  },
  fine: { en: 'FINE', hy: 'ՏՈՒԳԱՆՔ' },
  prison: { en: 'PRISON', hy: 'ԱԶԱՏԱԶՐԿՈՒՄ' },
  life: { en: 'LIFE', hy: 'ՑՄԱՀ' },
  lifeTip: {
    en: 'Include life-imprisonment articles in results (added on top of the MAX TERM range).',
    hy: 'Ներառել ցմահ ազատազրկման հոդվածները (ավելացվում են ԱՌԱՎ. ԺԱՄԿԵՏ միջակայքին)։',
  },
  catPerson: { en: 'PERSON', hy: 'ԱՆՁ' },
  catProperty: { en: 'PROPERTY', hy: 'ՍԵՓԱԿԱՆՈՒԹՅՈՒՆ' },
  catState: { en: 'STATE', hy: 'ՊԵՏՈՒԹՅՈՒՆ' },
  catOrder: { en: 'ORDER', hy: 'ԿԱՐԳ' },
  catOther: { en: 'GENERAL', hy: 'ԸՆԴՀԱՆՈՒՐ' },
  // article tabs
  tabText: { en: 'TEXT', hy: 'ՏԵՔՍՏ' },
  tabGeneral: { en: 'GENERAL', hy: 'ԸՆԴՀԱՆՈՒՐ' },
  tabRelated: { en: 'RELATED ARTICLES', hy: 'ՀԱՐԱԿԻՑ ՀՈԴՎԱԾՆԵՐ' },
  tabAmendments: { en: 'AMENDMENTS', hy: 'ՓՈՓՈԽՈՒԹՅՈՒՆՆԵՐ' },
  // article sections
  penaltyByClause: { en: 'PENALTY BY CLAUSE', hy: 'ՊԱՏԻԺ ԸՍՏ ՄԱՍԵՐԻ' },
  noSanction: { en: 'No sanction defined.', hy: 'Պատիժ սահմանված չէ։' },
  provisions: { en: 'TEXT PROVISIONS', hy: 'ԴՐՈՒՅԹՆԵՐ' },
  classification: { en: 'CLASSIFICATION', hy: 'ԴԱՍԱԿԱՐԳՈՒՄ' },
  hierarchy: { en: 'PLACE IN THE CODE', hy: 'ՏԵՂԸ ՕՐԵՆՍԳՐՔՈՒՄ' },
  envelope: { en: 'PENALTY ENVELOPE', hy: 'ՊԱՏԺԻ ԾԱՎԱԼ' },
  envelopeNote: {
    en: 'The widest custodial range and sanction options across all clauses of this article.',
    hy: 'Այս հոդվածի բոլոր մասերի ամենալայն ազատազրկման միջակայքը և պատժի տարբերակները։',
  },
  crossRefs: { en: 'CROSS-REFERENCES', hy: 'ՀՂՈՒՄՆԵՐ' },
  noRefs: {
    en: 'This article does not reference other articles.',
    hy: 'Այս հոդվածը այլ հոդվածների չի հղում։',
  },
  referencedBy: { en: 'REFERENCED BY', hy: 'ՀՂՎՈՒՄ Է' },
  noBackRefs: {
    en: 'No other article references this one.',
    hy: 'Այլ հոդվածներ այս հոդվածին չեն հղում։',
  },
  compare2003: { en: 'COMPARED WITH THE 2003 CODE', hy: '2003 Թ. ՕՐԵՆՍԳՐՔԻ ՀԵՏ ՀԱՄԵՄԱՏՈՒԹՅՈՒՆ' },
  noAmendments: {
    en: 'No amendment history is recorded for this article in the current dataset.',
    hy: 'Այս հոդվածի փոփոխությունների պատմությունը տվյալների բազայում առկա չէ։',
  },
  amendmentsHint: {
    en: 'The 2022 Code replaced the 2003 Code in full. Per-article comparison notes will appear here once they are added to the dataset.',
    hy: '2022 թ. օրենսգիրքն ամբողջությամբ փոխարինել է 2003 թ. օրենսգրքին։ Հոդվածային համեմատական նշումները կհայտնվեն այստեղ՝ տվյալներին ավելանալուն պես։',
  },
  // readout
  type: { en: 'TYPE', hy: 'ՏԵՍԱԿ' },
  term: { en: 'TERM', hy: 'ԺԱՄԿԵՏ' },
  severity: { en: 'SEVERITY', hy: 'ԾԱՆՐՈՒԹՅՈՒՆ' },
  yes: { en: 'YES', hy: 'ԱՅՈ' },
  no: { en: 'NO', hy: 'ՈՉ' },
  avail: { en: 'AVAIL', hy: 'ԱՌԿԱ' },
  typePrison: { en: 'PRISON', hy: 'ԱԶԱՏԱԶՐԿՈՒՄ' },
  typeFine: { en: 'FINE', hy: 'ՏՈՒԳԱՆՔ' },
  typeOther: { en: 'OTHER', hy: 'ԱՅԼ' },
  filters: { en: 'FILTERS', hy: 'ՖԻԼՏՐԵՐ' },
  // landing / browse
  landingTitle: {
    en: 'The Criminal Code of the Republic of Armenia',
    hy: 'Հայաստանի Հանրապետության քրեական օրենսգիրք',
  },
  searchGo: { en: 'Search', hy: 'Որոնել' },
  footerDisclaimer: {
    en: 'Independent project. Not an official publication of the Republic of Armenia. Legal texts are sourced from the Armenian Legal Information System (ARLIS). For the authoritative and most current version, consult',
    hy: 'Անկախ նախագիծ։ Հայաստանի Հանրապետության պաշտոնական հրապարակում չէ։ Իրավական տեքստերի աղբյուրը Հայաստանի իրավական տեղեկատվական համակարգն է (ARLIS)։ Պաշտոնական և արդի տարբերակի համար դիմեք',
  },
  landingLead: {
    en: 'The 2022 Criminal Code of the Republic of Armenia — every article, bilingual, searchable.',
    hy: 'Հայաստանի Հանրապետության 2022 թ. քրեական օրենսգիրքը՝ բոլոր հոդվածները, երկլեզու, որոնելի։',
  },
  landingHint: {
    en: 'Pick an article from the contents, or search by number, offence or keyword.',
    hy: 'Ընտրեք հոդված բովանդակությունից կամ որոնեք համարով, հանցատեսակով կամ բառով։',
  },
  statArticles: { en: 'ARTICLES', hy: 'ՀՈԴՎԱԾ' },
  statChapters: { en: 'CHAPTERS', hy: 'ԳԼՈՒԽ' },
  statLife: { en: 'LIFE SENTENCES', hy: 'ՑՄԱՀ ՊԱՏԻԺ' },
  statFine: { en: 'WITH FINES', hy: 'ՏՈՒԳԱՆՔՈՎ' },
  shortcutFocus: { en: 'focus search', hy: 'որոնման դաշտ' },
  shortcutNumber: { en: 'type a number to jump to an article', hy: 'մուտքագրեք համարը՝ հոդվածին անցնելու համար' },
  shortcutFilters: { en: 'filters sit right next to the search box', hy: 'ֆիլտրերը որոնման դաշտի կողքին են' },
  notFound: { en: 'NO SUCH ARTICLE', hy: 'ՀՈԴՎԱԾԸ ՉԻ ԳՏՆՎԵԼ' },
  backToContents: { en: 'Back to contents', hy: 'Վերադառնալ բովանդակություն' },
  matchesFor: { en: 'matches for', hy: 'համընկնում՝' },
  noMatchLead: {
    en: 'Nothing matches. Try a shorter keyword or loosen the filters.',
    hy: 'Ոչինչ չի համընկնում։ Փորձեք ավելի կարճ բառ կամ թուլացրեք ֆիլտրերը։',
  },
} as const;

export type StringKey = keyof typeof STRINGS;

/** Category → its localized chip/tag label key. */
export const CAT_KEY: Record<Category, StringKey> = {
  person: 'catPerson',
  property: 'catProperty',
  state: 'catState',
  order: 'catOrder',
  other: 'catOther',
};

export function t(key: StringKey, lang: Lang): string {
  return STRINGS[key][lang];
}
