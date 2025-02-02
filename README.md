# Secret-Hitler-Online
![](https://i.postimg.cc/zvnLRbqq/place-policy.gif)

A fan-made web adaptation of Secret Hitler (with communist expansion) for up to 15 players.

### The Game
In the game, players are divided into Liberals, Fascists, Communists, Anarchist, Monarchist and Hitler. The Liberals must work together (or not) to discover the secret Hitler, the communists try to figure out the Hitler before the liberals, while the Fascists try to elevate the secret Hitler to power. Pass policies to achieve victory and unlock board powers. 

Can you find and stop the Secret Hitler?

### How to Play: 
Go to [secret-hitler.org](https://secret-hitler.org) and open a new lobby! Use the lobby's code or the provided link to invite your friends. You can play with up to 10 players at once!

There are instructions on how to play the game provided on the website, and plenty of helpful tips are provided for first-time players. The game takes care of rules for you, making it easy to pick up and play. 

## About this project
### Technical Details
The Java server is divided into the [game simulation](src/main/java/game) and the [REST API](src/main/java/server). Communication between the server and client is done via websocket and HTTP requests, using the [Javalin library](https://javalin.io/).

The [webpage](/secret-hitler-org-interface) is written in [React](https://reactjs.org/), and features animations created with CSS. Assets were either adapted from the original board game or created using [Inkscape](https://inkscape.org/).

### Creative Commons License and Credit
Secret Hitler Online is licensed under [Creative Commons BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), and is adapted from the original board game released by Goat, Wolf & Cabbage (© 2016-2020). 


#### What's changed from the original?
- Added a new faction called communists, who have their own board and policies. Also added new roles of monarchist and anarchist, with their own special powers.
- Custom assets specific to communist expansion were added based on the style of the original, most notably for the election tracker, policy reveal popup windows, and the player icons and tiles.
- The web interface, animations, and server for expansion are new additions.

### Report problems or suggest features on the [Issues page](https://github.com/realkushagrakhare/Secret-Hitler-Online/issues).
