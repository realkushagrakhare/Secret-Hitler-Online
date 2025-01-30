package game.datastructures;

public class CommunistExpansionPlayer extends Player{

    private boolean knowsCommunists = false;

    /**
     * Constructs a new Player for Communist Expansion with the given username.
     * @param username The username of the player.
     */
    public CommunistExpansionPlayer(String username){
        super(username);
    }

    @Override
    public boolean isFascist() {
        return super.id.equals(Identity.HITLER)
                || super.id.equals(Identity.FASCIST)
                || super.id.equals(Identity.MONARCHIST);
    }

    @Override
    public boolean isCommunist() {
        return super.id.equals(Identity.COMMUNIST)
                || super.id.equals(Identity.ANARCHIST);
    }

    @Override
    public boolean isMonarchist() {
        return super.id.equals(Identity.MONARCHIST);
    }

    @Override
    public boolean isAnarchist() {
        return super.id.equals(Identity.ANARCHIST);
    }

    @Override
    public void recognizeCommunists() {
        knowsCommunists = true;
    }

    @Override
    public boolean knowsCommunists(){
        return knowsCommunists;
    }
}
