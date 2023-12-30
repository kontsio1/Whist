import {Heading, ListItem, UnorderedList} from "@chakra-ui/react";

export const Rules = () => {
    return (
        <div>
            <Heading>How to play Whist</Heading>
            <body>
            <p>Whist is a classic English trick-taking card game which was widely played in the 18th and 19th
                centuries Although the rules are simple, there is scope for strategic play</p>
            <h1>History</h1>
            <p>Whist is a descendant of the 16th-century game of trump or ruff. Whist replaced the popular variant of trump known as ruff and honours. The game takes its name from the 17th-century whist (or wist) meaning quiet, silent, attentive, which is the root of the modern wistful.
                According to Daines Barrington, whist was first played on scientific principles by a party of gentlemen who frequented the Crown Coffee House in Bedford Row, London, around 1728. Edmond Hoyle, suspected to be a member of this group, began to tutor wealthy young gentlemen in the game and published A Short Treatise on the Game of Whist in 1742. It became the standard text and rules for the game for the next hundred years.
                In 1862, Henry Jones, writing under the pseudonym "Cavendish", published The Principles of Whist Stated and Explained, and Its Practice Illustrated on an Original System, by Means of Hands Played Completely Through, which became the standard text. In his book, Jones outlined a comprehensive history of Whist, and suggested that its ancestors could include a game called Trionf, mentioned by a sixteenth century Italian poet named Berni, and a game called Trump (or Triumph), mentioned in Shakespeare's Antony and Cleopatra. Many subsequent editions and enlargements of Jones's book were published using the simpler title Cavendish On Whist. By this time, whist was governed by elaborate and rigid rules covering the laws of the game, etiquette and play which took time to study and master.
                In the 1890s, a variant known as bridge whist became popular which eventually evolved into contract bridge. The traditional game of whist survives at social events called whist drives. There are many modern variants of whist played for fun.</p>
            <h1>Rules</h1>
            <p>A standard 52-card pack is used. The cards in each suit rank from highest to lowest: A K Q J 10 9 8 7 6 5 4 3 2. Whist is played by four players, who play in two partnerships with the partners sitting opposite each other. Players draw cards to determine dealer and partners, with the two highest playing against the lowest two, who have seating rights. To comment on the cards in any way is strictly against the rules. One may not comment upon the hand one was dealt nor about one's good fortune or bad fortune. One may not signal to one's partner.</p>
            <h3>Shuffling and dealing</h3>
            <p>The cards can be shuffled by any player, though usually the player to dealer's left. The dealer has the right to shuffle last if they wish. To speed up dealing, a second pack can be shuffled by the dealer's partner during the deal and then placed to the right ready for the next hand. The cards are cut by the player on dealer's right before dealing. The dealer deals out the cards, one at a time, face down, so that each player has thirteen cards. The final card, which belongs to the dealer, is turned face up to indicate which suit is trumps. The turned-up trump card remains face up on the table until it is the dealer's turn to play to the first trick, at which point the dealer may pick up the card and place it in his/her hand. The deal advances clockwise.</p>
            <h1>Play</h1>
            <p>The player to the dealer's left leads to the first trick with any card in the hand. The other players, in clockwise order, each play a card to the trick and must follow suit by playing a card of the suit led if held. A player with no card of the suit led may play any card, either discarding or trumping. The trick is won by the highest card of the suit led, unless a trump is played, in which case the highest trump wins. The winner of the trick leads the next trick.</p>
            <p>Play continues until all thirteen tricks are played, at which point the score is recorded. If no team has enough points to win the game, another hand is played.</p>
            <p>Part of the skill involved in the game is one's ability to remember what cards have been played and reason out what cards remain. Therefore, once each trick is played, its cards are turned face down and kept in a stack of four near the player who won the trick. Before the next trick starts, a player may ask to review the cards from the last trick only. Once the lead card is played, however, no previously played cards can be reviewed by anyone.</p>
            <h1>Scoring</h1>
            <p>After all tricks have been played, the side that won more tricks scores one point for each trick won in excess of six. When all four players are experienced, it is unusual for the score for a single hand to be higher than two. A game is over when one team reaches a score of five. There are so-called "Hotel Rules" variations in which the teams agree to play to a higher score, such as "American" and "Long" (seven and nine, respectively).</p>
            <p>Longer variations of the game, in which the winning score is set higher than five, can be played with "honours" rules in effect. Honours have no effect on the play of a hand, but serve as bonus points that speed up the games as an element of luck. If the partners on a single team are dealt the top four cards (ace, king, queen, jack) in the trump suit, they collect four additional points at the end of the hand; if they are dealt three of these cards, they score two points. Tricks are scored before honours, and the latter cannot be used to score the winning point.</p>
            <p>For example, a game is being played to nine points and the score is tied 6-6. A hand is played, and the winning team takes seven tricks and claims honours for three of the four highest trump cards. They score one point for their tricks, but only one point for their honours since the second point would take them up to nine and win the game. The score after the hand is thus 8-6.</p>
            <p>Methods of keeping score include whist marker devices, or a set of four metal counters which can be arranged in different formations for the score values 1 through 9.</p>
            <h1>Tactics</h1>
            <UnorderedList>
                <ListItem>For the opening lead, it is best to lead your strongest suit, which is usually the longest. A singleton may also be a good lead, aiming at trumping in that suit, as one's partner should normally return the suit led.</ListItem>
                <ListItem>1st hand: It is usual to lead the king from a sequence of honours that includes it, including AK (the lead of an ace therefore denies the king).</ListItem>
                <ListItem>2nd hand usually plays low, especially with a single honour. However, it is often correct to split honours (play the lower of two touching honours) and to cover a J or 10 when holding Qx and cover a Q when holding the ace.</ListItem>
                <ListItem>3rd hand usually plays high, though play the lowest of touching honours. The finesse can be a useful technique, especially in trumps where honours cannot be trumped if they are not cashed.</ListItem>
                <ListItem>Discards are usually low cards of an unwanted suit. However, when the opponents are drawing trumps a suit preference signal is given by throwing a low card of one's strongest suit.</ListItem>
            </UnorderedList>
            </body>
        </div>

    )
}