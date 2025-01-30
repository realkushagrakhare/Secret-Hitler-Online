package game.datastructures.board;

import game.datastructures.Policy;
import java.io.Serializable;

public abstract class Board implements Serializable {

    final int FASCIST_POLICIES_TO_WIN = 6;
    final int LIBERAL_POLICIES_TO_WIN = 5;

    // The minimum number of fascist policies required before
    // fascists can win by electing Hitler chancellor
    final int MIN_POLICIES_FOR_CHANCELLOR_VICTORY = 3;

    protected int numFascistPolicies;
    protected int numLiberalPolicies;

    protected Policy lastEnacted;

    protected int[] antiPolicyPlacement;
    protected int[] policyRemoved;


    /** Constructs a new board.
     * @modifies this
     * @effects this is a new, empty board.
     */
    public Board() {
        numFascistPolicies = 0;
        numLiberalPolicies = 0;
        antiPolicyPlacement = new int[]{-1, -1, -1};
        policyRemoved = new int[]{-1, -1, -1};
    }

    /**
     * Enacts the given policy.
     * @param policy the Policy to enact.
     * @throws IllegalStateException if the liberals or fascists have already won.
     *                               (isLiberalVictory() or isFascistVictory() is true)
     * @modifies this
     * @effects adds {@code policy} to the count of liberal and fascist policies.
     */
    public void enactPolicy(Policy policy) {
        if (isLiberalVictory() || isFascistVictory()) {
            throw new IllegalStateException("Cannot enact a policy when victory conditions were already reached.");
        }
        if (policy.getType() == Policy.Type.FASCIST) {
            numFascistPolicies++;
        } else {
            numLiberalPolicies++;
        }
        lastEnacted = policy;
    }


    /**
     * Gets the type of the last enacted policy.
     * @throws NullPointerException if no policy has been enacted yet.
     * @return the Policy.Type of the last policy enacted.
     */
    public Policy.Type getLastEnactedType() {
        if (lastEnacted == null) {
            throw new NullPointerException("No policy has been enacted yet");
        }
        return lastEnacted.getType();
    }


    /**
     * Gets the count of fascist policies.
     * @return the number of fascist policies enacted.
     */
    public int getNumFascistPolicies() {
        return numFascistPolicies;
    }


    /**
     * Gets the count of liberal policies.
     * @return the number of liberal policies enacted.
     */
    public int getNumLiberalPolicies() {
        return numLiberalPolicies;
    }

    /**
     * Gets the count of communist policies.
     * @return the number of communist policies enacted.
     */
    public int getNumCommunistPolicies() {
        throw new UnsupportedOperationException(
                "Checking for communist number of policies is allowed only in communist expansion.");
    }


    /**
     * Determines whether the liberal party won by policy count.
     * @return true if the number of Liberal Policies {@literal >=} {@code LIBERAL_POLICIES_TO_WIN}
     */
    public boolean isLiberalVictory() {
        return getNumLiberalPolicies() >= LIBERAL_POLICIES_TO_WIN;
    }


    /**
     * Determines whether the fascist party won by policy count.
     * @return true if the number of Fascist Policies {@literal >=} {@code FASCIST_POLICIES_TO_WIN}
     */
    public boolean isFascistVictory() {
        return getNumFascistPolicies() >= FASCIST_POLICIES_TO_WIN;
    }

    /**
     * Determines whether the communist party won by policy count.
     * Will be used in the communist board.
     */
    public boolean isCommunistVictory() {
        throw new UnsupportedOperationException(
                "Checking for communist victory is allowed only in communist expansion.");
    }

    /**
     * Gets whether the last policy activated a power.
     * @requires a policy has already been enacted.
     * @return true if the last enacted policy activated a presidential power.
     */
    public boolean hasActivatedPower() {
        return getActivatedPower() != BoardPower.NONE;
    }

    /**
     * Gets the presidential power (if any) that was activated by the last policy.
     * @requires a policy has already been enacted.
     * @return If no presidential power was unlocked from the last policy enacted, returns NONE. Otherwise, returns the
     *         last activated presidential power.
     */
    public BoardPower getActivatedPower() {
        return BoardPower.NONE;
    }

    public boolean fascistsCanWinByElection() {
        return (getNumFascistPolicies() >= MIN_POLICIES_FOR_CHANCELLOR_VICTORY);
    }

    public int[] getAntiPolicyPlacement(){ return antiPolicyPlacement; }

    public int[] getPolicyRemoved(){ return policyRemoved;  }

}
