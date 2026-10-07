// CICA Playing Conditions and Rules ("CICA General Rules"), reproduced from CICA_RuleBook.docx in the
// rules folder (lib/documents.ts → officialDocuments.generalRules; footer "Last revised: Jan 29, 2024",
// Drive file updated Sep 11, 2026).
//
// Editorial notes, so the next sync knows what differs from the source:
// - Omitted: "Covid-19 Guidelines and Waiver" (2022 summer season only; organizer decision 2026-10-07).
// - Restored: the word "Umpire" (and "Umpires", "Umpire's", "self-umpire") is missing from the .docx
//   itself in about 80 places, leaving fragments like "towards s/Players" or "the  shall be informed".
//   Every restoration follows the surrounding sentence; nothing else in those sentences changed.
//   TODO(organizers): fix the source document in Drive.
// - Joined: bullets that the document wraps mid-sentence (Common Code of Conduct, Suspect Action) are
//   shown as one item each. Obvious typos fixed: "t is to be recorded" → "it is to be recorded",
//   "20$" / "50$" → "$20" / "$50". Long headings are shortened ("Substitutes", "Score Sheets and
//   Points"); the Delayed/No Show block keeps its source label.
// - Amounts, points, times and penalties are unchanged.

import type { RuleBlock, RuleItem, RuleSection } from "@/lib/rules/types"

const p = (text: string): RuleBlock => ({ kind: "p", text })
const ul = (...items: RuleItem[]): RuleBlock => ({ kind: "list", items })
const group = (label: string, ...blocks: RuleBlock[]): RuleBlock => ({ kind: "group", label, blocks })

export const generalRulesSections: readonly RuleSection[] = [
  {
    id: "common-code-of-conduct", title: "Common Code of Conduct",
    blocks: [
      p("The CICA Organizers will try its best to enforce all ICC and CICA rules and regulations."),
      ul(
        "CICA expects teams to be professional and play with the spirit of the game.",
        "Physical and Verbal behavior, Challenging/Mocking/Personal and derogatory comments towards Umpires/Players or spectators will result in 1 demerit point if reported and found guilty and a $50 fine.",
        "Teams with 2 demerit points will lose 3 Points and Captain will be suspended for next game. The team will also be subject to a $100 fine.",
        "Teams with 3 demerit points are disqualified from the tournament.",
        "Players challenging Umpires/Players/Spectator will result in 1 demerit point and be fined $100 if reported and found guilty. The player is red flagged for the entire tournament.",
        "If reported and found guilty again in the same tournament. The Concerned player will not be allowed to play again for the rest of the tournament.",
        "Points will be saved and if the same player in total gets 5 demerit points in total. He will not be allowed to play further in any CICA conducted tournaments. Corrective action is to be decided at the time of an occurrence.",
        "Ultimately, CICA Organizers’ goal is to improve CICA standards and make it more professional.",
        "In order for CICA to consider the investigation, it requires reports from Captains/Vice Captain/CICA Volunteers, Team Representative and Umpires. Any individual player’s grievances will be considered for investigation based on the respective team captain’s report but CICA encourages captains to file grievances for all cases.",
        "CICA players are urged not to respond to spectators for any inappropriate comments or any discriminatory comments. Report any incidents immediately via email to organizers@cicainfo.com.",
      ),
    ],
  },
  {
    id: "registration-fees", title: "Registration Fees",
    blocks: [ul(
      "Each member club shall pay an entrance fee decided by CICA and register at least eleven players on or before the registration date of the playing season.",
      "Maximum number of players that can register per team is as allocated for the tournament shared by CICA Prior to the Tournament.",
      "Any replacement after an allocated player is $20.",
      "If a player who has not played a single game is being replaced. A replacement fee is not required.",
      "Player replaced can only play once the fee is paid via Chase QuickPay (paycica@cicainfo.com)",
      "A team gets registered only when the team submits registration and pays the tournament fee. CICA does not accept CASH.",
    )],
  },
  {
    id: "playing-conditions", title: "CICA Playing Conditions",
    blocks: [
      p("All games will be played under CICA Playing Conditions. The CICA Playing Conditions are modifications of the [ICC T20 Rules](https://images.icc-cricket.com/image/upload/prd/rz8dfczzfiwa0pwzmcs3.pdf) ICC ‘Standard 20-20 International Match Playing Conditions’. Apart from the below mentioned modifications all other ICC Playing Conditions will be followed."),
      ul(
        "A player needs to play a minimum of games in the league stage decided by committee prior to the tournament to qualify for knockouts. Failure to do so will result in direct elimination of the team breaking the minimum criteria rule.",
        "Rain related canceled games are points split and playing 11 needs to be submitted to CICA within 24 hours of canceled games to be counted as a player count.",
        "Playing 11 for Walkover games will only be counted for the team that was awarded walkover.",
        "Teams offering Walkover will be awarded negative 2 points.",
        "Captains Vote - For any new issues not mentioned in the document. Organizers will discuss internally. In case of disagreement between the Organizing committee, Captains Vote will decide the outcome of the issue.",
      ),
      group("Length of the Game", ul(
        "All games must start on scheduled time and complete before the next scheduled game time slot.",
        "CICA Tournament - Each inning shall consist of certain overs decided prior to the tournament starts. No game will be played less than 10 overs, unless CICA approves it.",
        "Each fielding side will be allowed a time slot to complete their overs quota. It is the responsibility of both teams to adhere to the allotted time slot.",
        "Failure to do so, Teams need to vacate the ground and play the remainder of the game on a different ground or a later date and time.",
        "If the game is not completed by the end of the following week (unless long weekend), Winner will be decided by DLS.",
        "For Indoor - Teams need to book the ground if available and pay for the extra time to play the game or DLS will be enforced for a winner.",
        "Any break or interruption will not be considered as part of this time. Teams are advised to take breaks based on the impact on the duration of the game.",
      )),
    ],
  },
  {
    id: "starting-time", title: "Starting Time and Grace Period",
    blocks: [ul(
      "Each Captain must submit a team list to the Umpires 5 min before start time or during toss and no less than 7 players can take the field unless otherwise agreed upon by both teams and Umpires.",
      "Grace period of 15 minutes will be allowed for teams that do not have their 7 players on the ground by match start time. After grace period has elapsed and 7 players are still not in the ground and both teams do not agree to start the game with fewer players, two overs will be subtracted every 5 minutes from the team causing the delay.",
      "If any team has less than 7 players after 20 minutes of scheduled match time. Toss will be awarded to opponents.",
      "If any team has less than 7 players after 25 minutes of scheduled match time. Match will be awarded to the team that has more than 7 players on the ground or called abandoned with both teams getting -1 points.",
      "10 minutes post the actual match start time, the game shall start as soon as 7 players from both teams are on the ground. Other members will be allowed to take the field after the over is completed during which they arrive at the ground.",
      "The maximum grace period for players running late is 30 minutes from the scheduled start of the game. Once the grace period has elapsed, players running late FOR ANY REASON cannot join their teams. These players will only be allowed as a substitute fielder. The team must finish the game with players that arrived within the grace period allowed (30 minutes). Please note that it is crucial for captains to be in the ground before match start time so they can submit their team list to Umpires.",
      { text: "If Umpires are absent, for games that are assigned neutral Umpires, teams are allowed to wait a maximum of 5 minutes after the scheduled match start time.", items: [
        "If Umpires are not on the ground by this time, then the teams must notify CICA and continue with self-umpiring. Umpires can take over at the end of the over in which they arrive.",
        "Teams are free to start the game earlier if they agree on self-umpiring for the time Umpires are absent.",
        "If the game is not started due to absent Umpires and the grace period (15 minutes) has elapsed, the team refusing to self-umpire and causing delay will receive ZERO points and the opposing team will be awarded a win and award 2 points.",
      ] },
      "If Umpires are absent, respective team captains, CICA Volunteers or Other Umpires should report to CICA by email to organizers@cicainfo.com within 48 hours of the scheduled game completion. Teams will be penalized as described under “Umpires” and “Points Table”.",
      "The starting time may be shifted by an extra 30 minutes for wet field conditions and for all other matches on that day and may be played with reduced overs.",
      "The rule above, regarding 7 players to start a game, applies for both the innings.",
      "The rule above, regarding start time, is applicable for all the matches.",
    )],
  },
  {
    id: "drinks", title: "Drinks",
    blocks: [ul(
      "In a 20 overs game, one five-minute drinks-break will be taken at the end of 10th over in each inning.",
      "This shall not limit players to drinking water only during breaks. Teams (only one member from a team at a time) can provide water bottles to Umpires and Umpires will share water with players when necessary.",
      "Batting team players are not allowed to come to the field after every over for drinks unless called by the batsman and approved by the Umpires. Umpires can keep extra water bottles to avoid delay of the game.",
    )],
  },
  {
    id: "bad-weather", title: "Bad Weather/Bad Light",
    blocks: [ul(
      "If the game is not completed due to bad light or weather and less than 50% overs of the 2nd inning is completed, the game may be rescheduled if a ground is available.",
      { text: "If the game is not completed due to bad light or weather and more than 50% of the 2nd inning is completed, the game needs to be continued from where it was interrupted.", items: [
        "For any reason if the game is not completed by the end of the following week (unless long weekend). Winner will be declared by DLS method.",
      ] },
      "CICA will schedule a date (Last day of deadline) if both teams are unable to come up with a date to play their game.",
      "Only Same players will be allowed to play the continued game. NO EXCEPTIONS.",
      "During the first and second round, points are shared between the two teams for any completely washed-out Games.",
      "For the entire knock out matches held in this tournament, any completely washed-out match can be rescheduled according to Reschedule rules and approved by the CICA Organizers.",
    )],
  },
  {
    id: "score-sheets", title: "Score Sheets and Points",
    blocks: [
      ul(
        "All the team must score using CricClubs mobile app",
        "For some reason if you could not do it through CricClubs app, please score manually and do manual entry afterwards.",
        "All scorecards must be submitted immediately after the game.",
        "Tampering Scorecard is not acceptable. CICA will take strong action if teams are found to Tamper scorecard/Playing 11, Intentionally.",
      ),
      { kind: "table", caption: "Points Allocation and Penalties", head: ["Result", "Award/Penalty"], rows: [
        ["Win", "+2 Points"],
        ["Bonus", "No bonus points"],
        ["Draw/Tie/No Result", "1 Points (to each team)"],
        ["Umpires", "Refer to the Umpires section."],
        ["Walkover", "-1 point for team giving walkover and $50 fine (If not informed before 24 hrs)"],
        ["Other", "Decision of the CICA"],
      ] },
    ],
  },
  {
    id: "playing-area", title: "Playing Area",
    blocks: [ul(
      "Eastview Cricket Field is under the control of the Eastview Christian Church, and must be used only as directed and according to the rules of Eastview Christian Church. It is private property.",
      "Cricket Ground in Normal, is under the Control of the City of Normal and CICA, and must be used only as directed and according to the rules of CICA, respective Park District NORMAL.",
      "Cricket Ground in Baywood is under the Control of the CICA and must be used only as directed & according to the rules of CICA, respective Park District Bloomington. Captain is responsible for informing the players about the speed limit in Baywood neighborhood.",
      "Indoor Cricket Ground is under control Of ISU and should be used only if reserved.",
      "No one is allowed to enter the playing area. Only the Captain may enter the field, upon Umpire’s request, in settling disputes during play.",
      "Cricket club members must pick up their garbage or deposit the trash in allotted trash holders after the game is over.",
      "Boundaries must not be adjusted during a match unless disrupted.",
      "Strictly NO SMOKING in the playing area or ground premises.",
      "Violation of NO SMOKING rule carries fines from ground owning authorities, CICA and a Player suspension.",
      { text: "Old Ground Rules:", items: [
        "If the ball touches the net, it’s 2 runs declared.",
        "If the ball is in the ditch and within the fielder’s reach the batsmen need to run until the fielder raises his hand to show that it is stuck in the ditch and a 2 run will be declared",
        "If a fielder catches the ball in the ditch, it is considered as out.",
        "If the ball touches the electric wires. It's considered a 6.",
      ] },
      { text: "Eastview Ground Rules:", items: [
        "Power Plays are mandatory on this ground.",
        "Play should be on both sides of the wicket and need to change every over.",
        "Refer to the Field Restrictions section for Powerplay rules or as directed by CICA",
      ] },
    )],
  },
  {
    id: "discipline", title: "Discipline",
    blocks: [ul(
      "A CICA Organizers member, who is also a playing member of a Cricket club, cannot exercise CICA authority in any match in which he is involved as an active participant or be NOT allowed to vote on any act affecting himself or his team.",
      "Cricket Club members must behave with a disciplined gentlemanly attitude at all games and functions.",
      "Cricket should be played not only within its Laws but also within the Spirit of the Game.",
      { text: "Any physical or verbal (direct or implied, written or via email, on a website or internet chat groups) attack by a player(s) or a CICA member against:", items: [
        "The Umpire",
        "Other Cricketers",
        "The Stumps, pitch matting, ball or other cricket gear",
        "Spectators",
        "Executive Body will result in the suspension and/or fine against the player(s) and/or his team, or both. Suspension and/or fine shall be decided after the completion of investigation by the executive CICA Organizers.",
      ] },
    )],
  },
  {
    id: "code-of-conduct", title: "Code of Conduct",
    blocks: [ul(
      { text: "Expressing dissent at an Umpire's decision verbally or by action will result in a warning. Actions classified as showing dissent (list is not all inclusive):", items: [
        "Arguing with the Umpire for a given decision",
        "Refusing to leave the pitch after being given out",
        "Taunting or using foul language with the Umpire",
      ] },
      "Excessive appealing - If an individual is found to be appealing unnecessarily, the Umpire may recommend to the CICA Organizers to make a decision on that individual/team.",
      "Using abusive language when on the field irrespective of where the aggression is directed towards can result in a player's suspension during the same match by the Umpires. It is advised that the Umpire provide one official verbal warning to the player(s) and the captain involved prior to taking the issue to the CICA Organizers. However depending on the offense the Umpire may use his own discretion in deciding whether an official warning is necessary.",
      "Any scoring discrepancy as identified by the Umpire will be reported to the CICA Organizers to make their decision.",
      "Any game delaying tactics employed by the batting or the fielding teams the Umpire will be giving two official verbal warnings and if it is still continuing the Umpire may recommend to the CICA Organizers to make a decision on the team captain.",
    )],
  },
  {
    id: "protests", title: "Protest/Complaint",
    blocks: [ul(
      "All claims, protest and complaints must be submitted to the executive CICA Organizers via email (organizers@cicainfo.com), in writing within 5 days, of the incident. Correspondence should be confirmed as having been received.",
      "CICA will initiate investigation based on the merit of the complaint and conclusion of investigation subject to cooperation of Umpires and captains especially alleging team captain.",
      "Any complaints or protest sent from any Player should contain what rule from the CICA rules is disobeyed by the individual or by any team.",
    )],
  },
  {
    id: "players-and-replacements", title: "Registering a New Player/Replacement of Player",
    blocks: [ul(
      "There is no date restriction to add a new/replace player, however, players must have played at least 2 games with the same team to participate in the postseason (quarters, semis and finals) games for that team.",
      "Teams cannot replace/change players in an already submitted roster which has not reached max quota for that tournament. You can only ADD players until you reach max quota using the above mentioned steps. No exception to this rule.",
      "Teams must pay $20 for each player replaced after reaching the roster limit. Maximum players per team cannot exceed the size decided by the CICA committee prior to the start of the tournament.",
      "Player/s removed from the roster once cannot be added back for the given season.",
      "Notification of New/Replacement player must reach CICA, 1 hour before the game's scheduled time.",
      "Any violation of these rules will result in a game being awarded to the opposition team. Based on the severity of the violation CICA may consider additional penalties including teams being banned from CICA conducted tournaments.",
    )],
  },
  {
    id: "walkover", title: "Walkover",
    blocks: [ul(
      "Walkover games will result in penalty points (-2) for the defaulting team and opposition will be awarded full winning points.",
      "Playing 11 will be only considered for the team that was awarded the Walkover.",
      "The Club/Team missing the game must inform the opposition captain and CICA, at least 24 hours in advance. Failure to do so will result in penalty points (-2) and a fine of $50. Fine must be before the teams next game otherwise further action will be imposed on the defaulting team and may face a ban from further tournaments.",
    )],
  },
  {
    id: "reschedule", title: "Re-schedule",
    blocks: [
      ul(
        "All rain affected games need to be played **before** following Saturday matches failing which will be treated as No Result Games and points will be shared.",
        "Playing 11 from both teams will be considered for rain affected abandoned games",
        "Games rescheduled by CICA due to weather conditions will not go towards Reschedule count for teams.",
        "Captains of teams involved in washed out games will contact CICA Organizers to reschedule their match within the time mentioned above. Umpires will be notified with the change by both the captains.",
        "If Both teams cannot conclude on a day. CICA will schedule the game on a convenient day of the following week.",
        "Both teams will be expected to find Umpires in the self-requested rescheduled game.",
        "For rain affected or wet field situations, scheduled Umpires will plan to attend based on the rescheduled game.",
        "The requests will be approved on a first come first serve basis and the organizers will define the terms at the time of rescheduling.",
        "Late start of all games for dew/weather conditions must be approved by the Umpire along with the team captains. CICA is not responsible for any rescheduling of such games and in these events points will be split evenly between the teams. CICA will decide any scheduling changes/penalties for Quarters/Semifinals/finals.",
        "In case of any conflicts on Quarterfinal/Semifinal/final scheduling issues CICA Organizers will be notified via email on a timely manner within 24 hours of the incident through the involved team representative and the CICA's approval will be deemed final in all circumstances.",
        "CICA will not entertain any reschedules for player availability and personal reasons or any such, it is to the teams to decide and notify CICA for any reschedule that happens. Once it is accepted and approved by the CICA Organizers, the change must be known to the entire CICA and the updated schedule for that game should be posted on the CICA site.",
      ),
      group("Rescheduled Matches format and rules", ul(
        "All rescheduled matches should be completed within +- 1 week of the CICA scheduled date or else points will be shared. All rescheduled games must be completed, and results uploaded by the following friday. Only Exceptions are allowed if the following weekend is a long weekend",
        "All reschedule requests must come 24 hours prior to the scheduled match date/time.",
        "To request for a reschedule, captains should follow as directed by CICA.",
        "All rescheduled matches would be on **Old/EastView** grounds.",
        { text: "For 20 Over Games only", items: [
          "Weekend rescheduled matches will be 20 overs.",
          "Weekday rescheduled matches will be 16 overs.",
        ] },
        "If a match stops due to bad light or because or scheduled next game, teams (if not at fault) will get a chance to continue & complete within the same week/weekend but must produce results by Friday if more than 50% of second innings is complete.",
        { text: "If one team is available, CICA will appoint a day of the week (last day of the deadline) and award the game to whichever team is available in the ground.", items: [
          "If both teams do not show up. Match will be abandoned and both teams will be awarded 0 points.",
        ] },
        "Teams scheduled to do umpiring won't be penalized for rescheduled games. Its teams are asking for rescheduling responsibility to arrange Umpires. (cica requests captains to help with Umpires for the reschedule matches)",
      )),
    ],
  },
  {
    id: "field-restrictions", title: "Field Restrictions",
    blocks: [ul(
      { text: "**Powerplay**: Thirty-yard inner circle will be required for each CICA games played.", items: [
        "**For 20 over game,** for first 4 overs, maximum of 2 players allowed outside of 30 yard circle & next 2 overs (5th and 6th over), maximum of 3 players allowed outside of 30 yard circle.",
      ] },
      "For 16 over game, First 2 overs, maximum of 2 players allowed outside of 30 yard circle & next 2 overs (3rd and 4th over), maximum of 3 players allowed outside of 30 yard circle.",
      "For 13 over Game:- First 2 overs, maximum of 2 players allowed outside of 30 yard circle, and Next 1 over any time after 2 overs.",
      "After finishing the power play overs, a maximum of 5 players can be outside the inner circle.",
      { text: "If a team is playing with less than 11 players:-", items: [
        "During PP - Less players can be in the 30 yard Circle and PP rule can be followed.",
        "After PP - Minimum of 4 fielders need to be inside 30 yards circle",
      ] },
      { text: "**For the rest of the innings:**", items: [
        "Fielders may be placed anywhere on the field, subject to the following rules. At the time the ball is bowled",
        "No fielder may be standing on or with any part of his body over the pitch.",
        "There may be no more than two fielders, other than the wicket-keeper, standing in the quadrant of the field behind square leg.",
        "Maximum of 5 fielders on Leg side of batsman irrespective of the side of the wickets (over or around) the bowler is bowling from.",
        "Minimum of 4 fielders in the inner circle all the time",
      ] },
    )],
  },
  {
    id: "substitutes", title: "Substitutes",
    blocks: [
      ul(
        "A runner for a batsman is not allowed as per ICC rules. Unless agreed by the opponent team.",
        "The Umpires shall have discretion to allow, for other wholly acceptable reasons, a substitute fielder to act for a nominated player, at the start of the match, or at any subsequent time.",
        "If a fielder fails to take the field with his side at the start of the match or at any later time, or leaves the field during a session of play, the Umpire shall be informed of the reason for his absence, and he shall not thereafter come on to the field during a session of play without the consent of the Umpire. The Umpire shall give such consent as soon as practicable.",
        { text: "If the player is absent from the field for longer than 8 minutes", items: [
          "The player shall not be permitted to bowl in that innings after his return until he has been on the field for at least that length of playing time for which he was absent.",
          "The player shall not be permitted to bat unless or until, in the aggregate, he has returned to the field and/or his side’s innings has been in progress for at least that length of playing time for which he has been absent or, if earlier, when his side has lost five wickets.",
          "The restriction in above Clauses A and B shall not apply if the player has suffered an external blow (as opposed to an internal injury such as a pulled muscle) whilst participating earlier in the match and consequently been forced to leave the field. Nor shall it apply if the player has been absent for very exceptional and wholly acceptable reasons (other than injury or illness).",
        ] },
        "In the event of a batsman or a fieldsman already being off the field at the commencement of an interruption in play through ground, weather or light conditions or for other exceptional circumstances, he shall be allowed to count any such stoppage time as playing time, provided that he personally informs the Umpires when he is fit enough to take the field had play been in progress. Similarly, if at the commencement of an interruption in play through ground, weather or light conditions or for other exceptional circumstances, a player is on the field but still has some unexpired penalty time remaining from a previous absence, he shall automatically be allowed to count any such stoppage time as playing time.",
        "Substitute fielders shall only be permitted in cases of injury, illness or other wholly acceptable reasons. ‘Wholly acceptable reasons’ should be limited to extreme circumstances and should not include what is commonly referred to as a ‘comfort break’.",
        "The opposing captain shall have no right of objection to any player acting as a substitute on the field, nor as to where the substitute shall field. However, no substitute shall act as wicketkeeper",
        { text: "A batsman may retire at any time during his innings when the ball is dead. The Umpires, before allowing play to proceed shall be informed of the reason for a batsman retiring.", items: [
          "If a batsman retires because of illness, injury or any other unavoidable cause, he is entitled to resume his innings subject to (c) below. If for any reason he does not do so, his innings is to be recorded as ‘Retired - not out’ and he is only allowed to bat as a last batsman.",
          "If a batsman retires for any reason other than as in (a) above, it is to be recorded as ‘Retired - out’ and cannot bat again.",
        ] },
      ),
    ],
  },
  {
    id: "tie-breaker", title: "Tie Breaker",
    blocks: [ul(
      "During the league games, if a match ends in tie, points shall be shared between teams and NO SUPER OVER for league games.",
      "During the Knockout matches a SUPER OVER will decide the match result.",
      { text: "Procedure for the super over, the following procedure will apply should the provision for any Super Over be adopted in Knockout matches.", items: [
        "Subject to weather conditions the Super Over will take place on the scheduled day of the match. In normal circumstances it shall commence 10 minutes after the conclusion of the match. In case of weather interruption, CICA Umpires will make the call in consulting with CICA Organizers.",
        "The Super Over will take place on the pitch allocated for the match (the designated pitch).",
        "Only nominated players in the main match may participate in the Super Over. Should any player (including the batsmen and bowler) be unable to continue to participate in the Super Over due to injury, illness or other wholly acceptable reasons, the relevant Laws and Playing Conditions as they apply in the main match shall also apply in the Super Over.",
        "Each team’s over is played with the same fielding restrictions as apply for the 20th or 16th over in a normal game.",
        "The team batting second in the main match will bat first in the Super Over.",
        "Each side has three nominated batsmen, meaning that the loss of two wickets ends the Super Over. Nominated batsmen cannot bowl in super over",
        "The fielding captain or his nominee shall select the ball with which he wishes to bowl his over in the Super Over from the used balls and Umpire must be consented for Ball quality. Such used balls to include the balls used in previous match, but no new balls. The team fielding first in the Super Over shall have first choice of ball. The team fielding second may choose to use the same ball as chosen by the team bowling first. If the ball needs to be changed, then playing conditions as stated for the main match shall apply.",
        "The loss of two wickets in the Super Over ends the team’s Super Over innings.",
        "The team scoring the most runs in the Super Over shall be declared the winner.",
        { text: "In the event of the teams having scored same number of runs in the Super Over:", items: [
          "a) the team whose batsmen hit the most number of boundaries (fours and sixes) combined from its two innings in the main match and the Super Over shall be the winner.",
          "If the total number of boundaries hit by both teams is equal, the team whose batsmen score the most number of boundaries (fours and sixes) in its innings in the main match (ignoring the Super Over) will be the winner.",
          "If still equal, a count-back from the final ball of the Super Over shall be conducted. The team with the higher scoring delivery shall be the winner. If a team loses two wickets during its Super Over, then any unbowled deliveries will be counted as dot balls. Note that for this purpose, the runs scored from a delivery is defined as the total team runs scored since the completion of the previous legitimate ball, i.e. including any runs resulting from wides, no ball or penalty runs.",
        ] },
      ] },
    )],
  },
  {
    id: "ranking-nrr", title: "Final Ranking & Net Run Rate",
    blocks: [ul(
      "**Outdoor** - In the case of the teams with the same number of points, Head-to-Head victory is considered first and then the international Net Run Rate formula described here at [1] will be used to decide ranking for the teams for subsequent rounds.",
      "**Indoor** - In the case of the teams with the same number of points, Net Run Rate formula described here at [1] will be used to decide ranking for the teams for subsequent rounds.",
      "In case of a Scheduling conflict. Priority will be given to the higher ranked team. If two teams are in a different pool, Head to Head Victory is considered first and then NRR to decide a higher ranked team.",
    ), p("[1] [http://www.espncricinfo.com/ci/content/page/429305.html](http://www.espncricinfo.com/ci/content/page/429305.html)")],
  },
  {
    id: "umpires", title: "Umpires",
    blocks: [
      ul(
        "CICA shall be responsible for assigning Umpires to all regular games. The Umpires will be scheduled from the teams and umpiring schedule will be posted with regular game schedule",
        "Captain of the respective team scheduled for Umpiring is responsible to send Umpires on time.",
        "Umpires are the final authority during the game. Their decisions are final decisions. If any team leaves the field they will automatically forfeit the game.",
        "Umpires will always remain IMPARTIAL on the field.",
        "Umpires will keep track of the number of overs while the fielder is out of the field.",
        "Umpires will keep time of all intervals and notify the captains when to resume.",
        "Umpires will be fully authorized to make any decision of any misconduct behavior by players during the game.",
        "Umpires will be asked to submit a description of the issue along with the action taken.",
        "Umpires may record each over to review their decisions. (CICA strongly advises to record the video)",
        "In case of review, both Umpires should view the recording and make the decision. No player should be involved from both sides.",
        "If video recording is not conclusive, the original decision stays.",
      ),
      group("Assignment of Umpires", ul(
        "For Qualifiers (first round) Umpires will be assigned from random teams in the opposite pools",
        "For the second round, Umpires will be assigned from random teams in the opposite/same pools.",
        "Its Captain’s responsibility to arrange the Umpires. If captains fail to send Umpires to games their teams are assigned, CICA Organizers shall take the appropriate corrective action as notified above and award a negative point.",
      )),
      group("Delayed/No Show (beginning Indoor 2025)",
        ul({ text: "Umpires Running Late: From Match Scheduled Start time", items: [
          "Team causing 1st offense - 10 min is grace, Next 15 min $20 fine, after that fine $50",
          "Team causing 2nd Offense - 15 mins $20 and after that fine $50",
        ] }),
        p("**No show:**"),
        ul(
          "1st offense: $100 fine (Awarded to both teams impacted or neutral Umpires arranged)",
          "2nd offense and further: -1 point and $100 fine (Dollar amount awarded to both teams impacted)",
        ),
        p("A Team will not be allowed to play their next game unless the fine is paid."),
      ),
    ],
  },
  {
    id: "captains", title: "Captains",
    blocks: [ul(
      "Will be conversant and proficient with the laws of Cricket.",
      "Will follow the constitution, rules and regulation of the CICA.",
      "Will control the behavior of all his team players.",
      "Will be responsible to send Umpires to games their teams have been assigned umpiring duties.",
      "Will respect the Umpire's opinions and decisions.",
      "Will be responsible to go over the rules and regulations with their players.",
      "Will be the ONLY PERSON to clear doubts, confusion; talk issues with the Umpires with regards to the game in progress. All other players indulging in conversation with the Umpire should strictly keep it to light, casual conversations and not related to the game in progress. If there is a fight in the game, the CICA Organizers would suspend all involved players for one game and the player(s) at fault would be penalized further. In addition, CICA Organizers shall fine the player(s) if it deems necessary but fine is not to exceed $100.",
      "Will be responsible to notify CICA Organizers, if Umpires do not show up or show up late (after grace period).",
    )],
  },
  {
    id: "suspect-action", title: "Suspect Action",
    blocks: [ul(
      "Captain or batsmen facing the bowler can report to the Umpire for suspected Action.",
      "Umpire if feels the same, He will give a fair warning to bowler and notify the captain.",
      "If continued, Umpire can give a no-ball as suspected action. Umpire should be considerate towards the bowler in making a judgment.",
      "Umpire/Captain must record and send an official complaint along with video recording to organizers@cicainfo.com.",
      { text: "If a batsman/Team complains about someone having suspect action and Umpires are not in agreement/Not taking action.", items: [
        "**Main and/or Leg Umpire must record his entire spell, review and share the videos to CICA**",
      ] },
      "Captains should refrain his team players from shouting about bowler actions from outside the playing area. If reported, Will be penalized for a fine and/or suspension.",
      "CICA with consent from the bowler will observe the bowling action/request Umpires to record videos.",
      "If a bowler is not In agreement. He will be stopped from bowling with immediate effect.",
      "If any member of CICA is positive about the suspect action. Evidence will be shared to an independent neutral expert (non- CICA) for confirmation.",
      "If suspect action is identified to a certain degree of conviction. The Concerned bowler will not be allowed to bowl in any CICA conducted matches.",
      "Concerned bowler can reappeal the decision after taking corrective measures suggested by the expert.",
      "Additionally, Umpires can report suspect action to CICA committee with evidence.",
      "Umpire calling no ball for suspect action in a match need to mandatory report to CICA after the game",
      "If reported and found guilty 3 times, Specific bowler cannot bowl in any CICA tournament going forward.",
    )],
  },
  {
    id: "questions", title: "Q&A",
    blocks: [
      group("Q1. What happens if the Leg Umpire misses recording a delivery while the fielding team is appealing?", ul(
        "The Main Umpire has the final authority to determine what happened and make the appropriate decision.",
        "If the Main Umpire is certain about the delivery, the decision will be based on the Main Umpire’s observation.",
        "If the Main Umpire is not certain, the benefit of the doubt will remain in favor of the original appeal/fielding team, particularly for events such as stumping, no-ball, run-out, etc.",
      )),
      group("Q2. Is a batsman allowed to retire hurt in CICA?", p("Answer: Yes."), ul(
        "A batsman can retire hurt due to injury and remain Not Out.",
        "The batsman/batting team captain must inform the Umpire before retiring.",
        "The Umpire will confirm whether the retirement is accepted as Retired Hurt. If not, the Umpire may declare the batsman Retired Out.",
        "Retired hurt only considered injury, batsman can Inform he is injured. Umpires make final call seeing the situation",
        "The Umpire must inform the Scorer, and the status must be updated in CricClubs.",
        "A batsman who **retires hurt may return to bat** in the same innings.",
        "A batsman who is **retired out can not bat** again in that innings.",
      )),
      group("Q3. If a player has not been on the field, how long must he wait before returning to bat?", ul(
        "Within 8 min he can play without penalty",
        "After 8 min he needs to serve the time he missed",
        { text: "Max times served is", items: ["Bowling - max 40 min", "Batting - 5 wickets"] },
        "The batsman cannot simply return whenever he chooses if a penalty time applies.",
        "The Umpires should determine when the player is eligible to return and communicate this to the player and Scorer.",
      )),
      group("Q4. What happens if a player refuses to accept an Umpire’s decision and prevents the game from continuing?", ul(
        "The player must respect the Umpire’s decision and allow play to continue.",
        { text: "If a player deliberately refuses to continue play or causes the match to be stopped,", items: [
          "CICA committee may be involved, If not available, Umpires decision is final",
          "If the Umpire decision is not honored and No further play is possible the **opposing team may be awarded the game**.",
        ] },
        "The player/s in question may also be subject to a **suspension for a specified period**, depending on the severity of the incident.",
        "Additional disciplinary action may be taken by the CICA disciplinary committee, if applicable.",
      )),
    ],
  },
]
