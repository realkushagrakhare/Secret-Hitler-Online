package game.datastructures.board;

import game.datastructures.Policy;

public class CommunistExpansionBoard extends Board{

    final int COMMUNIST_POLICIES_TO_WIN = 6;

    private int maxFascistSoFar = 0;
    private int maxCommunistSoFar = 0;
    protected int numCommunistPolicies = 0;

    /**
     * Enacts the given policy.
     * @param policy the Policy to enact.
     * @throws IllegalStateException if the liberals or fascists have already won.
     *                               (isLiberalVictory() or isFascistVictory() or isCommunistVictory() is true)
     * @modifies this
     * @effects  {@code policy} to the count of liberal, communist and fascist policies.
     */
    public void enactPolicy(Policy policy) {
        if (isLiberalVictory() || isFascistVictory()) {
            throw new IllegalStateException("Cannot enact a policy when victory conditions were already reached.");
        }
        policyRemoved = new int[]{-1, -1, -1};
        if (policy.getType() == Policy.Type.FASCIST) {
            numFascistPolicies++;
        } else if(policy.getType() == Policy.Type.ANTICOMMUNIST){
            antiPolicyPlacement[1] = numFascistPolicies;
            policyRemoved[1] = numCommunistPolicies -1;
            numCommunistPolicies = Math.max(numCommunistPolicies-1, 0);
            numFascistPolicies++;
        } else if(policy.getType() == Policy.Type.COMMUNIST) {
            numCommunistPolicies++;
        } else if(policy.getType() == Policy.Type.ANTIFASCIST){
            antiPolicyPlacement[2] = numCommunistPolicies;
            policyRemoved[2] = numFascistPolicies -1;
            numFascistPolicies = Math.max(numFascistPolicies-1, 0);
            numCommunistPolicies++;
        } else if(policy.getType() == Policy.Type.SOCIALDEMOCRATIC){
            antiPolicyPlacement[0] = numLiberalPolicies;
            numLiberalPolicies++;
        } else {
            numLiberalPolicies++;
        }
        lastEnacted = policy;
    }

    @Override
    public BoardPower getActivatedPower() {
        if (getLastEnactedType() == Policy.Type.FASCIST
                || getLastEnactedType() == Policy.Type.ANTICOMMUNIST) {
            if(maxFascistSoFar < getNumFascistPolicies()) {
                switch (getNumFascistPolicies()) {
                    case 1:
                        return BoardPower.ELECTION;
                    case 2:
                        return BoardPower.INVESTIGATE;
                    case 3:
                        return BoardPower.ELECTION;
                    case 4:
                    case 5:
                        return BoardPower.EXECUTION;
                }
            }
            maxFascistSoFar = getNumFascistPolicies();
        } else if (getLastEnactedType() == Policy.Type.COMMUNIST
                || getLastEnactedType() == Policy.Type.ANTIFASCIST) {
            if(maxCommunistSoFar < getNumCommunistPolicies()) {
                switch (getNumCommunistPolicies()) {
                    case 1:
                        return BoardPower.BUGGING;
                    case 2:
                        return BoardPower.RADICALISATION;
                    case 3:
                        return BoardPower.FIVEYEARPLAN;
                    case 4:
                        return BoardPower.CONGRESS;
                    case 5:
                        return BoardPower.CONFESSION;
                }
            }
            maxCommunistSoFar = getNumCommunistPolicies();
        } else if (getLastEnactedType() == Policy.Type.SOCIALDEMOCRATIC){
            return BoardPower.POLICYREMOVAL;
        }
        return BoardPower.NONE;
    }

    /**
     * Determines whether the communist party won by policy count.
     * @return true if the number of Communist Policies {@literal >=} {@code COMMUNIST_POLICIES_TO_WIN}
     */
    @Override
    public boolean isCommunistVictory() {
        return getNumCommunistPolicies() >= COMMUNIST_POLICIES_TO_WIN;
    }

    /**
     * Gets the count of communist policies.
     * @return the number of communist policies enacted.
     */
    @Override
    public int getNumCommunistPolicies() {
        return numCommunistPolicies;
    }

}
