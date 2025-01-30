package game.datastructures;

import java.io.Serializable;

/**
 * Holds the data for an individual player.
 * A player has a username and identity associated with them.
 */
public class Player implements Serializable {

    final private String username;
    protected Identity id;
    private boolean isAlive;
    private boolean investigated;
    private boolean isRoleRevealed;

    private boolean isCPU = false;

    /**
     * Constructs a new Player with the given username.
     * @param username The username of the player.
     * @modifies this
     * @effects this is a new Player that is alive, has an unassigned Identity,
     *          and has not been investigated.
     */
    public Player(String username) {
        this.username = username;
        id = Identity.UNASSIGNED;
        isAlive = true;
        investigated = false;
    }

    public String getUsername() {
        return this.username;
    }

    /**
     * Sets the player's identity.
     * @param id the Identity of the player.
     * @throws IllegalArgumentException if {@code id} is null
     * @modifies this
     * @effects sets the player's identity to {@code id}.
     */
    public void setIdentity(Identity id) {
        this.id = id;
    }

    public Identity getIdentity() {
      return id;
    }

    public void markAsCpu() {
      isCPU = true;
    }

    public boolean isCpu() {
      return isCPU;
    }

    public boolean isHitler() {
        return this.id.equals(Identity.HITLER);
    }

    public void kill() {
        isAlive = false;
    }

    public boolean isAlive() { return this.isAlive; }

    public void investigate() { investigated = true; }

    public boolean hasBeenInvestigated() { return this.investigated; }

    public void revealIdentity() { isRoleRevealed = true; }

    public boolean hasRevealed() { return isRoleRevealed; }

    public boolean isAnarchist() {
        throw new UnsupportedOperationException(
                "Checking for anarchist is not allowed when playing without the expansion and "
                + "in more than 10 player count.");
    }

    public boolean isMonarchist() {
        throw new UnsupportedOperationException(
                "Checking for monarchist is not allowed when playing without the expansion and "
                        + "in more than 10 player count.");
    }

    /**
     * @return true if the player is fascist or hitler.
     */
    public boolean isFascist() {
        return this.id.equals(Identity.HITLER) || this.id.equals(Identity.FASCIST);
    }

    public boolean isCommunist() { throw new UnsupportedOperationException(
            "Checking for communist is not allowed when playing without the expansion.");
    }

    public void recognizeCommunists() {
        throw new UnsupportedOperationException(
                "Recognizing communists is allowed when playing with the expansion.");
    }

    public boolean knowsCommunists(){
        return false;
    }
}
