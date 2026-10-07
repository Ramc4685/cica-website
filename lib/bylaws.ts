// CICA Bylaws, reproduced from the Google Doc (lib/documents.ts → officialDocuments.bylaws, last
// updated June 5, 2025). The wording is verbatim. Only layout was restored where the plain-text export
// ran items together: section labels are split from their text, and the sentence "Any other
// tournaments may be held at the discretion of the President." is shown after the tournament list it
// was attached to. Tournament names (BNPL, CICA Cup, ...) stay as written: this is the governing text.

import type { RuleBlock } from "@/lib/rules/types"

export interface BylawArticle {
  /** Anchor id, e.g. "article-iv". */
  id: string
  numeral: string
  title: string
  blocks: readonly RuleBlock[]
}

const section = (label: string, title: string, ...blocks: RuleBlock[]): RuleBlock => ({ kind: "group", label, title, blocks })
const p = (text: string): RuleBlock => ({ kind: "p", text })
const ul = (...items: string[]): RuleBlock => ({ kind: "list", items })
const ol = (...items: string[]): RuleBlock => ({ kind: "list", ordered: true, items })

export const bylawsTitle = "Central Illinois Cricket Association (CICA) Bylaws"

export const bylawsPreamble = "The Central Illinois Cricket Association is organized to promote and develop cricket by creating opportunities for local players and building community in the Bloomington/Normal region. These By-Laws guide the association’s operations to ensure that cricket serves as a platform for local engagement, participation, and growth."

export const bylawArticles: readonly BylawArticle[] = [
  {
    id: "article-i", numeral: "I", title: "Name",
    blocks: [p("The name of this organization shall be the Central Illinois Cricket Association, hereafter referred to as CICA.")],
  },
  {
    id: "article-ii", numeral: "II", title: "Purpose",
    blocks: [
      p("The purposes of CICA are:"),
      ul(
        "To promote the sport of cricket in the Bloomington/Normal region.",
        "To make all relevant decisions pertaining to the conduct of cricket matches between and involving member teams and have binding authority on such matters.",
        "To ensure all CICA cricket matches are conducted according to the laws of cricket and all members uphold the traditions and spirit of the game.",
        "To foster community engagement and development through the sport of cricket.",
      ),
    ],
  },
  {
    id: "article-iii", numeral: "III", title: "Membership",
    blocks: [
      section("Section 1", "Membership Categories",
        p("There shall be two categories of membership in CICA:"),
        { kind: "group", label: "A.", title: "Individual Member", blocks: [ol(
          "Eligibility: Individual membership is open to all individuals interested in furthering the purpose of CICA who complete a membership application.",
          "Rights: Individual members receive free entry into the outdoor BNPL player auction, waived tournament registration fees, the right to vote, hold office, participate in CICA tournaments and activities, elect the President, and receive invitations to the Annual General Meeting.",
          "Dues: $20 annual dues",
        )] },
        { kind: "group", label: "B.", title: "Team Member", blocks: [ol(
          "Eligibility: Team membership is open to players listed on tournament team rosters who complete a membership application.",
          "Rights: Team members may participate in CICA tournaments for their registered team but do not participate in other CICA activities. Team members do not have voting rights.",
          "Dues: No annual dues. Tournament registration fees apply.",
        )] },
      ),
      section("Section 2", "Application", p("All members must complete a membership application providing contact information and an agreement to uphold CICA's bylaws and code of conduct.")),
      section("Section 3", "Standing", p("Members in good standing have paid all required dues for the current year and upheld CICA's bylaws and code of conduct.")),
    ],
  },
  {
    id: "article-iv", numeral: "IV", title: "Officers",
    blocks: [
      section("Section 1", "Officers", p("The officers of CICA shall consist of the President, Secretary, and Treasurer.")),
      section("Section 2", "Eligibility", p("Officers must be voting members in good standing of CICA. The President shall be a resident of McLean County, have played in CICA tournaments for at least 3 years, and shall not be a team captain due to conflict of interest.")),
      section("Section 3", "Election/Appointment of Officers", p("The President shall be elected by a 2/3 majority vote of members. The Secretary and Treasurer shall be appointed by the President.")),
      section("Section 4", "Terms", p("The President shall serve a 2-year term and may serve no more than 2 consecutive terms. Other officers shall serve 1-year terms and may be reappointed.")),
      section("Section 5", "Vacancy", p("If the President is unable to complete their term, the Board shall appoint an interim President until the next election.")),
      section("Section 6", "Removal", p("Any officer may be removed by a 2/3 vote of members or 2/3 vote of the Board.")),
      section("Section 7", "Duties",
        p("The President shall be responsible for the overall management of CICA and for conducting endorsed CICA tournaments, including:"),
        ul(
          "BNPL (Bloomington Normal Premier League) outdoor tournament, held annually in April/May",
          "CICA Mains outdoor tournament, held annually mid-May through end of August, before Labor Day weekend",
          "CICA Mini outdoor tournament, held annually after Labor Day weekend",
          "CICA Cup indoor tournament, held annually November to March",
        ),
        p("Any other tournaments may be held at the discretion of the President."),
        p("The Secretary shall take meeting minutes and maintain records."),
        p("The Treasurer shall manage finances, maintain financial records, and provide reports."),
      ),
      section("Section 8", "Liability", p("Officers shall not be personally liable for the debts, liabilities, or other obligations of CICA.")),
    ],
  },
  {
    id: "article-v", numeral: "V", title: "Board of Directors",
    blocks: [
      section("Section 1", "Membership", p("The Board shall consist of 3-5 directors including the President, Secretary, and Treasurer.")),
      section("Section 2", "Eligibility", p("Directors must be U.S. citizens/permanent residents able to support CICA's development.")),
      section("Section 3", "Selection", p("Directors shall be selected by a vote of current directors.")),
      section("Section 4", "Terms", p("Directors shall serve 2-year terms and may serve unlimited consecutive terms.")),
      section("Section 5", "Vacancy", p("Vacancies shall be filled by appointment of the Board.")),
      section("Section 6", "Duties", p("The Board shall be responsible for the overall management of CICA. The Board may overrule the President's decisions if a conflict of interest is found.")),
      section("Section 7", "Meetings", p("The Board shall meet at least quarterly.")),
      section("Section 8", "Quorum", p("A majority of directors shall constitute a quorum.")),
      section("Section 9", "Voting", p("A majority vote shall be required for any motion.")),
      section("Section 10", "Removal", p("Directors may be removed by a 2/3 vote of directors.")),
      section("Section 11", "Compensation", p("Director roles are voluntary and unpaid.")),
      section("Section 12", "Liability", p("Directors shall not be personally liable for the debts, liabilities, or obligations of CICA.")),
      section("Section 13", "Officers", p("Any director may become President if no other candidate contests the election. Directors may hold officer or committee positions if requested by the President.")),
    ],
  },
  {
    id: "article-vi", numeral: "VI", title: "Committees",
    blocks: [
      section("Section 1", "Standing Committees", p("The Board shall appoint standing committees such as Tournament, Finance, Marketing, etc.")),
      section("Section 2", "Eligibility", p("Committees shall be chaired by a Director. Membership is open to members in good standing.")),
      section("Section 3", "Selection", p("Committee members shall be appointed by the Board.")),
      section("Section 4", "Duties", p("Committees shall execute activities related to their designated focus area.")),
    ],
  },
  {
    id: "article-vii", numeral: "VII", title: "Meetings",
    blocks: [
      section("Section 1", "Annual Meeting", p("An Annual General Meeting shall be held each year.")),
      section("Section 2", "Special Meetings", p("Special meetings may be called by the President or Board.")),
      section("Section 3", "Notice", p("Notice shall be sent to members at least 10 days before meetings.")),
      section("Section 4", "Voting", p("Unless specified elsewhere, a simple majority vote shall prevail.")),
    ],
  },
  {
    id: "article-viii", numeral: "VIII", title: "Finances",
    blocks: [
      section("Section 1", "Fiscal Year", p("The fiscal year shall be January 1 to December 31.")),
      section("Section 2", "Accounting", p("Finances shall be managed and accounted for by the Treasurer.")),
      section("Section 3", "Audit", p("An annual audit shall be conducted by the Board or an independent agent.")),
    ],
  },
  {
    id: "article-ix", numeral: "IX", title: "Indemnification",
    blocks: [p("CICA shall indemnify officers and directors to the fullest extent under Illinois law.")],
  },
  {
    id: "article-x", numeral: "X", title: "Amendments",
    blocks: [p("The bylaws may be amended by a 2/3 vote of members at any membership meeting.")],
  },
  {
    id: "article-xi", numeral: "XI", title: "Dissolution",
    blocks: [p("Upon dissolution, assets shall be distributed to another 501(c)(3) organization.")],
  },
  {
    id: "article-xii", numeral: "XII", title: "Disciplinary Committee",
    blocks: [
      section("Section 1", "Composition", p("The Disciplinary Committee shall consist of 3-5 members appointed by the Board of Directors. Members must be individual members in good standing of CICA and no more than one member may come from the same member team.")),
      section("Section 2", "Eligibility", p("Disciplinary Committee members may not simultaneously serve on the Board of Directors to avoid conflicts of interest.")),
      section("Section 3", "Term", p("Disciplinary Committee members shall serve 1-year terms and may be reappointed.")),
      section("Section 4", "Removal", p("Members may be removed by a 2/3 vote of the Board of Directors.")),
      section("Section 5", "Resignation", p("Members may resign by providing written notice to the Board.")),
      section("Section 6", "Vacancy", p("Vacancies shall be filled by appointment of the Board.")),
      section("Section 7", "Duties", p("The Disciplinary Committee shall investigate complaints, hold hearings, determine if rules or code of conduct were violated, and determine appropriate sanctions.")),
      section("Section 8", "Meetings", p("The Committee shall meet as needed to review complaints and conduct hearings.")),
      section("Section 9", "Non-Liability", p("Committee members shall not be personally liable for debts or obligations of CICA.")),
    ],
  },
  {
    id: "article-xiii", numeral: "XIII", title: "Disciplinary Procedures",
    blocks: [
      section("Section 1", "Grounds for Discipline", p("Members may be disciplined for conduct detrimental to CICA or violations of bylaws, rules, or code of conduct.")),
      section("Section 2", "Notice", p("Accused members shall be notified in writing of allegations and offered a hearing.")),
      section("Section 3", "Hearing", p("Hearings shall be conducted per CICA Procedures Manual policies.")),
      section("Section 4", "Sanctions", p("Sanctions shall be determined based on level of offense per CICA Procedures Manual.")),
      section("Section 5", "Appeal", p("Members may appeal rulings in accordance with CICA Procedures Manual.")),
    ],
  },
]
