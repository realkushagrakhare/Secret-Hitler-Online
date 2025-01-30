package game;

public enum GameState {
    SETUP,                                     // Game is being set up.
    CHANCELLOR_NOMINATION,                     // President is nominating a chancellor.
    CHANCELLOR_VOTING,                         // Voting on the chancellor is taking place.
    LEGISLATIVE_PRESIDENT,                     // In the legislative phase. The president is selecting a card to discard.
    LEGISLATIVE_CHANCELLOR,                    // In the legislative phase. The chancellor is selecting a card to enact.
    LEGISLATIVE_PRESIDENT_VETO,                // Chancellor decided to initiate veto, President chooses whether to allow.
    PRESIDENTIAL_POWER_PEEK,                   // President may peek at the next three cards in the deck
    PRESIDENTIAL_POWER_INVESTIGATE,            // President can investigate a party membership
    PRESIDENTIAL_POWER_EXECUTION,              // President may choose a player to execute
    PRESIDENTIAL_POWER_ELECTION,               // President chooses the next president, seat continues as normal after.
    POST_LEGISLATIVE,                          // Waiting for the President to end their turn.
    LIBERAL_VICTORY_POLICY,                    // Liberal Party won through enacting Liberal policies.
    LIBERAL_VICTORY_EXECUTION,                 // Liberal Party won through executing Hitler.
    FASCIST_VICTORY_POLICY,                    // Fascist Party won through enacting Fascist policies.
    FASCIST_VICTORY_ELECTION,                  // Fascist Party won by successfully electing Hitler chancellor.
    PRESIDENTIAL_POWER_CONFESSION,             // The president may choose a player to execute and find his membership.
    COMMUNIST_POWER_CONGRESS,                  // The new communist comes to know who the other communists are.
    FIVE_YEAR_PLAN,                            // 2 communist and 1 liberal policy is added to the deck.
    COMMUNIST_POWER_RADICALISATION,            // The communist start the radicalisation of a player.
    COMMUNIST_POWER_RADICALISATION_ACCEPT_DENY,// The radicalisation of a particular player is being accepted or denied by the fellow communist.
    CHANCELLOR_POWER_BUGGING,                  // The chancellor selects or rejects the choice by the president.
    PRESIDENTIAL_POWER_BUGGING,                // The president chooses a player to bug.
    PRESIDENTIAL_POWER_GET_BUGGING_IDENTITY,   // The president and the chancellor investigate a player.
    COMMUNIST_VICTORY_POLICY,                  // Communist Party won through enacting Liberal policies.
    COMMUNIST_VICTORY_EXECUTION,               // Communist Party won through executing Hitler.
    ANARCHIST_POWER_ASSASSINATION,             // The Anarchist reveals their secret role and executes a player.
    POLICY_REMOVAL,                            // The president selects a policy to remove from the game.
    MONARCHIST_POWER_ELECTION,                 // The Monarchist can reveal their secret role and call for a special election.
    MONARCHIST_OPPOSITION_NOMINATION,          // The current President nominates a chancellor candidate in opposition to the monarchist's candidate.
    MONARCHIST_ELECTION_VOTING,                // Players vote on which candidate they want to elect as the chancellor.
    MONARCHIST_ELECTION_TIE,                   // In case of tie, monarchist decides which candidate will be the next chancellor.
}
