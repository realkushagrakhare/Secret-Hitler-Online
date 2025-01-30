package game.datastructures.board;

import game.datastructures.Policy;

public class SevenToEightPlayerBoard extends Board{

    @Override
    public BoardPower getActivatedPower() {
        if (getLastEnactedType() == Policy.Type.FASCIST) {
            switch (getNumFascistPolicies()) {
                case 2:
                    return BoardPower.INVESTIGATE;
                case 3:
                    return BoardPower.ELECTION;
                case 4:
                case 5:
                    return BoardPower.EXECUTION;
            }
        }
        return BoardPower.NONE;
    }

}
