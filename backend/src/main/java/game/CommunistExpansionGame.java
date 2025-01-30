package game;

import game.datastructures.*;
import game.datastructures.board.*;
import jdk.jfr.Percentage;

import java.util.*;

/**
 * Keeps track of the state of a game of Secret Hitler Communist.
 *
 * Secret Hitler Socialist is an expansion of Secret Hitler for 9-12 players, originally
 * created by Goat, Wolf {@literal &} Cabbage (c) 2016. You can find more
 * details on their website, #### Add link here ####, at <a href="https://www.secrethitler.com/">Secret Hitler Expansion</a>.
 *
 * Secret Hitler is licensed through Creative Commons.
 */
public class CommunistExpansionGame extends SecretHitlerGame {

    /////////////////// Static Fields
    // <editor-fold desc="Static Fields">

    // Keeps track of the number of communists, monarchist, anarchist and fascists that should be in the game
    // for a given number of players. - - - - - - - - - 9 10 11 12 13 14 15
    public static final int[] NUM_COMMUNIST_FOR_PLAYERS = { -1, -1, -1, 1, 1, -1, -1, -1, -1, 2, 2, 2, 2, 3, 3, 3};
    public static final int[] NUM_FASCISTS_FOR_PLAYERS = { -1, -1, -1, 0, 1, -1, -1, -1, -1, 2, 2, 3, 3, 3, 3, 4};

    public static final int MIN_NUM_FOR_MONARCHISTS = 3;
    public static final int MIN_NUM_FOR_ANARCHISTS = 3;
    // The number of communist policies in a standard deck.
    public static final int NUM_COMMUNIST_POLICIES = 8; //8

    public static final List<Policy> policyRemovalChoices = new ArrayList<>();

    public static final int MIN_PLAYERS = 3;
    public static final int MAX_PLAYERS = 15;
    private static final int MAX_BUGGING_VETO = 3;

    private List<String> radicalisationVetoList;
    private List<String> buggingVetoList;
    private int buggingVetoRemaining = MAX_BUGGING_VETO;

    private String anarchist;
    private boolean isAnarchistInGame;
    private boolean doesAnarchistKnowCommunists;
    private String monarchist;
    private boolean isMonarchistInGame;
    private int numCommunistPlayers;
    private String communist1;
    private String communist2;
    private List<Policy> fypPolicyAdded;
    private Map<String, Policy> policyRemovalMap;
    private String monarchistCandidate = "";
    private String monarchistOpposition = "";
    private boolean radicalisationSuccess = false;
    private boolean usedAnarchistPower = false;

    /////////////////// Constructor
    // <editor-fold desc="Constructor">

    /**
     * Constructs a new game of Secret Hitler Communist Expansion with the given players.
     *
     * @param players the names of the players to add to the game.
     * @requires there can be no repeat names in {@code players}. The number of
     *           players must be between MIN_PLAYERS and
     *           MAX_PLAYERS, inclusive.
     * @modifies this
     * @effects initializes the game, setting all player identities and card decks.
     *          The first player in the provided
     *          player list is the first president, and the game begins the
     *          chancellor nomination process.
     */
    public CommunistExpansionGame(Collection<String> players) {
        super(players);
    }

    @Override
    protected void validateAndSetUpPlayer(Collection<String> players){
        if (players.size() < MIN_PLAYERS) {
            throw new IllegalArgumentException("There must be at least " + MIN_PLAYERS + " to start the game (only "
                    + players.size() + " provided).");
        } else if (players.size() > MAX_PLAYERS) {
            throw new IllegalArgumentException(
                    "There can be a max of " + MAX_PLAYERS + " in a game (" + players.size() + " provided).");
        }
        super.playerList = new ArrayList<>();
        for (String name : players) {
            super.playerList.add(new CommunistExpansionPlayer(name));
        }

        buggingVetoList = new ArrayList<>();
        radicalisationVetoList = new ArrayList<>();
        fypPolicyAdded = new ArrayList<>();
    }

    @Override
    protected void assignBoard(){
        super.board = new CommunistExpansionBoard();

        // Add choices for policy removal which will be used later.
        policyRemovalChoices.add(new Policy(Policy.Type.LIBERAL));
        policyRemovalChoices.add(new Policy(Policy.Type.COMMUNIST));
        policyRemovalChoices.add(new Policy(Policy.Type.FASCIST));
        policyRemovalMap = new HashMap<>();
    }

    /////////////////// Game Setup
    // <editor-fold desc="Game Setup">

    /**
     * Randomly assigns the player roles.
     *
     * @requires the number of players is between 9 and 12, inclusive.
     * @modifies this
     * @effects all Players in playerList are assigned roles
     */
    @Override
    protected void assignRoles() {
        int players = playerList.size();
        if (players < MIN_PLAYERS) {
            throw new IllegalStateException("Cannot assign roles with insufficient players.");
        } else if (players > MAX_PLAYERS) {
            throw new IllegalStateException("Cannot assign roles with too many players.");
        }

        numFascistPlayers = NUM_FASCISTS_FOR_PLAYERS[players];
        isMonarchistInGame = players >= MIN_NUM_FOR_MONARCHISTS;
        if (isMonarchistInGame) {
            numFascistPlayers--;
        }
        int numFascistsToSet = numFascistPlayers;

        numCommunistPlayers = NUM_COMMUNIST_FOR_PLAYERS[players];
        isAnarchistInGame = players >= MIN_NUM_FOR_ANARCHISTS;
        if(isAnarchistInGame) {
            numCommunistPlayers--;
        }
        int numCommuninstsToSet = numCommunistPlayers;


        doesAnarchistKnowCommunists = numCommuninstsToSet < 3;
        numLiberalPlayers = players - numFascistPlayers
                -1 -(isMonarchistInGame ? 1 : 0) -(isAnarchistInGame ? 1 : 0);
        communist1 = "";
        communist2 = "";

        // Set all players to default state
        for (Player player : playerList) {
            player.setIdentity(Identity.LIBERAL);
        }

        // Randomly set one player to be hitler
        int indexOfHitler = super.random.nextInt(players);
        playerList.get(indexOfHitler).setIdentity(Identity.HITLER);

        boolean setMonarchist = isMonarchistInGame;
        while (setMonarchist) {
            int randomIndex = random.nextInt(players);
            if (!playerList.get(randomIndex).isHitler()){
                monarchist = playerList.get(randomIndex).getUsername();
                playerList.get(randomIndex).setIdentity(Identity.MONARCHIST);
                numFascistsToSet--;
                setMonarchist = false;
            }
        }

        boolean setAnarchist = isAnarchistInGame;
        while(setAnarchist){
            int randomIndex = random.nextInt(players);
            if (!playerList.get(randomIndex).isHitler()
                    && !playerList.get(randomIndex).isMonarchist()){
                anarchist = playerList.get(randomIndex).getUsername();
                playerList.get(randomIndex).setIdentity(Identity.ANARCHIST);
                if (doesAnarchistKnowCommunists){
                    playerList.get(randomIndex).recognizeCommunists();
                }
                numCommuninstsToSet--;
                setAnarchist = false;
            }
        }

        while (numFascistsToSet > 0) {
            int randomIndex = super.random.nextInt(players);
            if (!playerList.get(randomIndex).isFascist() && !playerList.get(randomIndex).isCommunist()) { // If player has not already been set
                playerList.get(randomIndex).setIdentity(Identity.FASCIST);
                numFascistsToSet--;
            }
        }

        while (numCommuninstsToSet > 0) {
            int randomIndex = super.random.nextInt(players);
            if (!playerList.get(randomIndex).isFascist() && !playerList.get(randomIndex).isCommunist()) {
                playerList.get(randomIndex).setIdentity(Identity.COMMUNIST);
                numCommuninstsToSet--;
                playerList.get(randomIndex).recognizeCommunists();
            }
        }

        setCommunists();
    }

    @Override
    protected void resetDeck(){
        draw = new Deck();
        discard = new Deck();

        for (int i = 0; i < NUM_FASCIST_POLICIES; i++) {
            draw.add(new Policy(Policy.Type.FASCIST));
        }
        for (int i = 0; i < NUM_LIBERAL_POLICIES; i++) {
            draw.add(new Policy(Policy.Type.LIBERAL));
        }

        for(int i = 0; i < NUM_COMMUNIST_POLICIES; i++){
            draw.add(new Policy(Policy.Type.COMMUNIST));
        }

        draw.shuffle();
    }

    // </editor-fold>

    /////////////////// State Management
    // <editor-fold desc="State Management">

    /**
     * Gets the current state of the game.SecretHitlerGame.
     *
     * @return a game.GameState representing the current state of the game.
     */
    public GameState getState() {
        if (board != null) {
            checkIfGameOver();
        }
        return state;
    }

    public String getCommunist1() {
        System.out.println("Communist1: " + communist1);
        return communist1; }

    public String getCommunist2() {
        System.out.println("Communist2: " + communist2);
        return communist2; }

    public int getNumCommunistPolicies() {
        return board.getNumCommunistPolicies();
    }

    public int getNumCommunistPlayers() { return numCommunistPlayers; }

    public List<String> getBuggingVetoList(){ return buggingVetoList; }

    public List<String> getRadicalisationVetoList(){ return radicalisationVetoList; }

    /**
     * Updates the game state if the game ended by policies.
     *
     * @modifies this
     * @effects sets this.state to the FASCIST_VICTORY_POLICY or
     *          LIBERAL_VICTORY_POLICY states if the
     *          win conditions for policies are met.
     */
    @Override
    protected void checkIfGameOver() {
        if (board.isFascistVictory()) {
            super.lastState = super.state;
            super.state = GameState.FASCIST_VICTORY_POLICY;
        } else if (board.isLiberalVictory()) {
            super.lastState = super.state;
            super.state = GameState.LIBERAL_VICTORY_POLICY;
        } else if(board.isCommunistVictory()){
            super.lastState = super.state;
            super.state = GameState.COMMUNIST_VICTORY_POLICY;
        }
    }

    /**
     * Returns whether the game has reached an ending victory state.
     */
    @Override
    public boolean hasGameFinished() {
        return super.state == GameState.FASCIST_VICTORY_ELECTION
                || super.state == GameState.FASCIST_VICTORY_POLICY
                || super.state == GameState.LIBERAL_VICTORY_EXECUTION
                || super.state == GameState.LIBERAL_VICTORY_POLICY
                || super.state == GameState.COMMUNIST_VICTORY_POLICY
                || super.state == GameState.COMMUNIST_VICTORY_EXECUTION;
    }

    /**
     * Gets the new state of the game after policy enacted.
     */
    @Override
    protected void setStateAfterPolicyEnact(){
        switch (board.getActivatedPower()) {
            case PEEK:
                state = GameState.PRESIDENTIAL_POWER_PEEK;
                break;
            case EXECUTION:
                state = GameState.PRESIDENTIAL_POWER_EXECUTION;
                break;
            case ELECTION:
                state = isMonarchistInGame && getPlayer(monarchist).isAlive()
                        ? GameState.MONARCHIST_POWER_ELECTION
                        : GameState.PRESIDENTIAL_POWER_ELECTION;
                break;
            case INVESTIGATE:
                state = GameState.PRESIDENTIAL_POWER_INVESTIGATE;
                break;
            case BUGGING:
                state = GameState.PRESIDENTIAL_POWER_BUGGING;
                break;
            case CONGRESS:
                state = GameState.COMMUNIST_POWER_CONGRESS;
                congress();
                concludeBoardActions();
                break;
            case RADICALISATION:
                if(!communist1.isBlank()) {
                    state = GameState.COMMUNIST_POWER_RADICALISATION;
                } else {
                    state = GameState.POST_LEGISLATIVE;
                }
                break;
            case FIVEYEARPLAN:
                state = GameState.FIVE_YEAR_PLAN;
                addCommunistLiberalPolicies();
                concludeBoardActions();
                break;
            case CONFESSION:
                state = GameState.PRESIDENTIAL_POWER_CONFESSION;
                break;
            case POLICYREMOVAL:
                state = GameState.POLICY_REMOVAL;
                break;
            case NONE:
                state = GameState.POST_LEGISLATIVE;
                break;
        }
    }

    /**
     * Adds 2 communist and 1 liberal policy from the discard to draw pile.
     */
    public void addCommunistLiberalPolicies(){
        int communistPoliciesToAdd = 2;
        int liberalPoliciesToAdd = 1;
        List<Policy> discardPolicies = discard.getPolicies();
        for(int i = 0; i < discardPolicies.size();){
            Policy policy = discardPolicies.get(i);
            if (policy.getType() == Policy.Type.LIBERAL && liberalPoliciesToAdd > 0) {
                liberalPoliciesToAdd--;
                fypPolicyAdded.add(discard.remove(i));
                draw.add(policy);
            } else if (policy.getType() == Policy.Type.COMMUNIST && communistPoliciesToAdd > 0){
                communistPoliciesToAdd--;
                fypPolicyAdded.add(discard.remove(i));
                draw.add(policy);
            } else {
                i++;
            }
        }

        Collections.shuffle(fypPolicyAdded);
        draw.shuffle();
    }

    public List<Policy> getFypPolicyAdded(){
        return fypPolicyAdded;
    }

    public void congress(){
        for(Player player : playerList){
            if(player.isCommunist()){
                player.recognizeCommunists();
            } else if(player.isAnarchist() && doesAnarchistKnowCommunists) {
                player.recognizeCommunists();
            }
        }
    }


    /**
     * Executes a given player.
     *
     * @param username the username of the player to execute.
     * @throws IllegalStateException    if called when state is not
     *                                  {@code PRESIDENTIAL_POWER_EXECUTION} or {@code PRESIDENTIAL_POWER_CONFESSION}.
     * @throws IllegalArgumentException if the player is already dead or is not in
     *                                  the game.
     * @modifies this
     * @effects The specified player is marked as not alive.
     *          If they were Hitler, advances to liberal / communist victory.
     *          Otherwise, once called, advances the state of the game to
     *          POST_LEGISLATIVE.
     */
    @Override
    public void executePlayer(String username) {
        if (state != GameState.PRESIDENTIAL_POWER_EXECUTION &&
                state != GameState.PRESIDENTIAL_POWER_CONFESSION) {
            throw new IllegalStateException("Cannot confess/execute a player when the power is not active.");
        }

        Player playerToKill = executionHelper(username, getPlayer(currentPresident));
        if(!playerToKill.isHitler()) {
            super.concludeBoardActions();
        }
    }


    @Override
    public void useAnarchistPower(String name){
        if (state != GameState.POST_LEGISLATIVE) {
            throw new IllegalStateException("Can call for use of anarchist's power in post legislative state.");
        } else if(!isAnarchistInGame || anarchist.isBlank()){
            throw new IllegalArgumentException("Cannot use anarchist's power when no anarchist in the game.");
        } else if(!anarchist.equals(name)){
            throw new IllegalArgumentException("Only anarchist can use their power.");
        } else if(usedAnarchistPower){
            throw new IllegalArgumentException("Anarchist's special power has already been used in the game.");
        }

        Player anarchistPlayer = getPlayer(name);
        anarchistPlayer.revealIdentity();
        usedAnarchistPower = true;
        setNewState(GameState.ANARCHIST_POWER_ASSASSINATION);
    }

    /**
     * Executes a given player by the anarchist.
     *
     * @param name the username of the player using assassination power.
     * @param toKill the username of the player being assassinated
     * @throws IllegalStateException    if called when state is not
     *                                  {@code ANARCHIST_POWER_ASSASSINATION} or {@code PRESIDENTIAL_POWER_CONFESSION}.
     * @throws IllegalArgumentException if the player is already dead or is not in
     *                                  the game, or when no anarchist in the game.
     * @modifies this
     * @effects The specified player is marked as not alive.
     *          If they were Hitler, advances to liberal / communist victory.
     *          Otherwise, once called, advances the state of the game to
     *          POST_LEGISLATIVE.
     */
    @Override
    public void assassinatePlayer(String name, String toKill) {
        if (state != GameState.ANARCHIST_POWER_ASSASSINATION) {
            throw new IllegalStateException("Cannot assassinate a player when the power is not active.");
        } else if(!isAnarchistInGame || anarchist.isBlank()){
            throw new IllegalArgumentException("Cannot assassinate a player when no anarchist in the game.");
        } else if(!anarchist.equals(name)){
            throw new IllegalArgumentException("Only anarchist can assassinate a player.");
        }

        Player anarchistPlayer = getPlayer(name);
        Player playerToKill = executionHelper(toKill, anarchistPlayer);
        if(!playerToKill.isHitler()) {
            super.concludeBoardActions();
        }
    }

    private Player executionHelper(String executionTarget, Player executioner){
        playerValidation(executionTarget);

        Player playerToKill = getPlayer(executionTarget);
        if(!playerToKill.isAlive()){
            throw new IllegalArgumentException("Cannot execute a dead player.");
        }
        target = executionTarget;
        playerToKill.kill();

        if (playerToKill.isHitler()) { // game ends in liberals or communist win.
            this.lastState = this.state;
            state = executioner.isCommunist()
                    ? GameState.COMMUNIST_VICTORY_EXECUTION
                    : GameState.LIBERAL_VICTORY_EXECUTION;
        } else if (playerToKill.isCommunist() && !playerToKill.isAnarchist()) {
            setCommunists();
        }

        return playerToKill;
    }

    private void setCommunists(){
        communist1 = communist2 = "";
        for(Player player : playerList){
            if(!player.isAlive()) {
                continue;
            } else if(player.isCommunist() && !player.isAnarchist()){
                if(communist1.isBlank()){
                    communist1 = player.getUsername();
                } else if(communist2.isBlank()){
                    communist2 = player.getUsername();
                }
            }
        }

        if (communist1.isBlank() && isAnarchistInGame && getPlayer(anarchist).isAlive()){
            communist1 = anarchist;
        }
    }

    @Override
    protected Identity investigationReturner(Player playerInvestigated){
        if (playerInvestigated.isFascist()) {
            return Identity.FASCIST;
        } else if(playerInvestigated.isCommunist()){
            return Identity.COMMUNIST;
        } else {
            return Identity.LIBERAL;
        }
    }

    @Override
    public void selectPlayerToBug(String username){
        if (state != GameState.PRESIDENTIAL_POWER_BUGGING) {
            throw new IllegalStateException("Cannot bug a player when the power is not active.");
        }
        validateBugging(username);

        buggingVetoRemaining++;
        target = username;
        setNewState(GameState.CHANCELLOR_POWER_BUGGING);
    }

    @Override
    public Identity acceptDenyBuggingChoice(boolean choice){
        String username = target;
        if (state != GameState.CHANCELLOR_POWER_BUGGING) {
            throw new IllegalStateException("Cannot bug a player when the power is not active.");
        }
        validateBugging(username);

        if(buggingVetoRemaining == 0 || choice) {
            buggingVetoList.clear();
            buggingVetoRemaining = MAX_BUGGING_VETO;
            setNewState(GameState.PRESIDENTIAL_POWER_GET_BUGGING_IDENTITY);
            return investigationReturner(investigationHelper(username));
        }

        buggingVetoList.add(username);
        setNewState(GameState.PRESIDENTIAL_POWER_BUGGING);
        return Identity.UNASSIGNED;
    }

    @Override
    public Identity getBuggingIdentity(){
        if (state != GameState.PRESIDENTIAL_POWER_GET_BUGGING_IDENTITY) {
            throw new IllegalStateException("Cannot bug a player when the power is not active.");
        }

        Player buggedPlayer = validateBugging(target);
        buggedPlayer.investigate();
        concludeBoardActions();
        return investigationReturner(buggedPlayer);
    }

    private Player validateBugging(String username){
        if (!hasPlayer(username)) {
            throw new IllegalArgumentException("Player " + username + " does not exist.");
        }
        Player player = getPlayer(username);
        if (!player.isAlive()) {
            throw new IllegalArgumentException("Cannot bug a dead player (" + username + ").");
        } else if (player.hasBeenInvestigated()) {
            throw new IllegalArgumentException("Cannot investigate / bug a player twice (" + username + ").");
        } else if (username.equals(currentPresident) || username.equals(currentChancellor)){
            throw new IllegalArgumentException("President or chancellor can't be chosen for bugging themselves.");
        } else if(buggingVetoList.contains(username)){
            throw new IllegalArgumentException("Bugging request for this player was already denied by the Chancellor.");
        }

        return player;
    }

    @Override
    public void registerRadicalisationChoice(String curPlayer, String username){
        Player playerToRadicalise = getPlayer(username);
        if (state != GameState.COMMUNIST_POWER_RADICALISATION) {
            throw new IllegalArgumentException("Cannot radicalise a player when power is not active.");
        } else if (!curPlayer.equals(communist1)){
            throw new IllegalArgumentException("Only the primary communist can begin radicalise.");
        } else if(playerToRadicalise.isCommunist()){
            throw new IllegalArgumentException("Cannot radicalise a player who is already communist.");
        } else if(radicalisationVetoList.contains(username)){
            throw new IllegalArgumentException("Radicalisation request for this player was already denied by the other communist.");
        }

        target = username;
        setNewState(GameState.COMMUNIST_POWER_RADICALISATION_ACCEPT_DENY);
        if(communist2.isEmpty()) {
            acceptDenyRadicalisation(curPlayer, true);
        }
    }

    @Override
    public void acceptDenyRadicalisation(String curPlayer, boolean choice){
        Player playerToRadicalise = getPlayer(target);
        if (state != GameState.COMMUNIST_POWER_RADICALISATION_ACCEPT_DENY) {
            throw new IllegalArgumentException("Cannot accept/deny radicalisation choice when power is not active.");
        } else if (!getPlayer(curPlayer).isCommunist()){
            throw new IllegalArgumentException("Only a communist can accept/deny radicalisation.");
        } else if(playerToRadicalise.isCommunist()){
            throw new IllegalArgumentException("Cannot radicalise a player who is already communist.");
        }

        if(!choice){
            radicalisationVetoList.add(target);
            setNewState(GameState.COMMUNIST_POWER_RADICALISATION);
            if(!communist2.isBlank()) {
                String temp = communist1;
                communist1 = communist2;
                communist2 = temp;
            }
            return;
        }

        if(!playerToRadicalise.isFascist()) {
            playerToRadicalise.setIdentity(Identity.COMMUNIST);
            radicalisationSuccess = true;
        }
        concludeBoardActions();
    }

    @Override
    public void policyRemovalSelection(String username, int index){
        if (state != GameState.POLICY_REMOVAL){
            throw new IllegalArgumentException("Cannot select a policy for removal when power is not active.");
        } else if(!currentPresident.equals(username) && !currentChancellor.equals(username)){
            throw new IllegalArgumentException("Only chancellor and president are allowed to select a policy for removal.");
        } else {
            policyRemovalMap.put(username, policyRemovalChoices.get(index));
        }

        if (policyRemovalMap.size() == 2){
            if (policyRemovalMap.get(currentPresident).getType() ==
                    policyRemovalMap.get(currentChancellor).getType()){
                index = 0;
                for (Policy policy : draw.getPolicies()){
                    if (policy.getType() == policyRemovalMap.get(currentPresident).getType()){
                        draw.remove(index);
                        draw.shuffle();
                        break;
                    }
                    index++;
                }
            }
            concludeBoardActions();
        }
    }

    @Override
    public void callForMonarchistElection(String name, String candidate){
        boolean denied = candidate == null || candidate.isEmpty();
        monarchistPowerValidation();
        if(state != GameState.MONARCHIST_POWER_ELECTION){
            throw new IllegalArgumentException("Cannot call for monarchist election when power is not active.");
        } else if(denied){
            setNewState(GameState.PRESIDENTIAL_POWER_ELECTION);
            return;
        } else if(!monarchist.equals(name)) {
            throw new IllegalArgumentException("Only Monarchist can call for monarchist election.");
        } else if(monarchist.equals(candidate) || currentPresident.equals(candidate) || currentChancellor.equals(candidate)){
           throw new IllegalArgumentException("Monarchist cannot select themselves or current president/chancellor as chancellor candidate.");
        } else if(!getPlayer(candidate).isAlive()){
            throw new IllegalArgumentException("Monarchist cannot select dead player as chancellor candidate.");
        }

        getPlayer(monarchist).revealIdentity();
        monarchistCandidate = target = candidate;
        setNewState(GameState.MONARCHIST_OPPOSITION_NOMINATION);
    }

    @Override
    public void nominateMonarchistsOpposition(String name, String candidate){
        monarchistPowerValidation();
        if(state != GameState.MONARCHIST_OPPOSITION_NOMINATION) {
            throw new IllegalArgumentException("Cannot nominate opposition when power is not active.");
        } else if(!currentPresident.equals(name) && !monarchist.equals(name)){
            throw new IllegalArgumentException("Only president / monarchist can nominate the opposition candidate.");
        } else if(currentChancellor.equals(candidate) || currentPresident.equals(candidate)){
            throw new IllegalArgumentException("Cannot select current president/chancellor as opposition candidate.");
        } else if(!getPlayer(candidate).isAlive()){
            throw new IllegalArgumentException("Cannot select dead player as opposition candidate.");
        } else if(monarchistCandidate.equals(candidate) || monarchist.equals(candidate)){
            throw new IllegalArgumentException("Cannot select Monarchist's candidate or Monarchist themselves as opposition candidate.");
        }

        monarchistOpposition = candidate;
        setNewState(GameState.MONARCHIST_ELECTION_VOTING);

    }

    private void monarchistPowerValidation(){
        if(!isMonarchistInGame) {
            throw new IllegalArgumentException("Cannot call for monarchist election when Monarchist is not in game.");
        } else if(!getPlayer(monarchist).isAlive()) {
            throw new IllegalArgumentException("Monarchist should be alive for monarchist special election.");
        }
    }

    @Override
    public void resolveVotes(boolean allPlayersHaveVoted, int totalVotes, int totalYesVotes){
        if(state == GameState.MONARCHIST_ELECTION_TIE){
            if (voteMap.containsKey(monarchist)){
                totalYesVotes = voteMap.get(monarchist) ? 1 : 0;
                totalVotes = 1;
                allPlayersHaveVoted = true;
            } else {
                return;
            }
        }
        if (!allPlayersHaveVoted) {
            return;
        }

        if(state == GameState.MONARCHIST_ELECTION_VOTING || state == GameState.MONARCHIST_ELECTION_TIE) {
            if (totalYesVotes == totalVotes - totalYesVotes) {
                setNewState(GameState.MONARCHIST_ELECTION_TIE);
                return;
            } else if(totalYesVotes > totalVotes - totalYesVotes){
                lastChancellor = currentChancellor = monarchistCandidate;
                lastPresident = currentPresident = monarchist;
            } else {
                lastChancellor = currentChancellor = monarchistOpposition;
                lastPresident = currentPresident = monarchist;
            }

            if (getPlayer(currentChancellor).isHitler() && board.fascistsCanWinByElection()) {
                this.lastState = this.state;
                state = GameState.FASCIST_VICTORY_ELECTION; // Fascists won by electing Hitler: game ends.
            } else {
                startLegislativeSession();
            }
        }
        else if (((float) totalYesVotes / (float) totalVotes) > VOTING_CUTOFF) { // vote passed successfully
                lastChancellor = currentChancellor;
                lastPresident = currentPresident;
            if (getPlayer(currentChancellor).isHitler() && board.fascistsCanWinByElection()) {
                this.lastState = this.state;
                state = GameState.FASCIST_VICTORY_ELECTION; // Fascists won by electing Hitler: game ends.
            } else {
                startLegislativeSession();
            }
        } else { // vote failed
            advanceElectionTracker();
        }
    }

    public Map<String, Policy> getPolicyRemovalMap() {
        return policyRemovalMap;
    }

    public List<Policy> getPolicyRemovalChoices(){
        return policyRemovalChoices;
    }

    private void setNewState(GameState newState){
        this.lastState = this.state;
        this.state = newState;
    }

    public boolean isAnarchistInGame(){
        return isAnarchistInGame;
    }

    public boolean isMonarchistInGame(){
        return isMonarchistInGame;
    }

    @Override
    public boolean doesAnarchistKnowCommunists(){
        return doesAnarchistKnowCommunists;
    }

    @Override
    public int buggingTries(){
        return buggingVetoRemaining;
    }

    public boolean getRadicalisationSuccess(){
        return radicalisationSuccess;
    }

    @Override
    public String getAnarchist(){
        return anarchist;
    }

    @Override
    public String getMonarchist(){
        return monarchist;
    }

    @Override
    public boolean isExpansionGame(){
        return true;
    }

    public boolean getUsedAnarchistPower(){
        return usedAnarchistPower;
    }

    public String getMonarchistCandidate(){ return monarchistCandidate; }

    public String getMonarchistOpposition() { return monarchistOpposition; }

    public int[] getAntiPolicyPlacement(){ return board.getAntiPolicyPlacement(); }

    public int[] getPolicyRemoved(){ return board.getPolicyRemoved();  }
}

