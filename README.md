# mimic

make a face.

mimic is an in-browser game built using Kairos facial recognition api, used for analyzing features and judging emotion from expression. The game closely resembles 'horse'.

Challenge another player or ...face... the computer! Here's how it works:  

### PvP
1. mimic pics a basic emotion and displays it to the screen to start the game.
2. player 1 makes a facial expression, attempting to represent the given 'emotion', and captures it using their built-in webcam.
3. Kairos API analyzes the emotions it sees in the image and returns a graphically represented accuracy score.
4. player 2 attempts to match the same expression.
5. The player with the lower score gets gets a letter ('m', 'i', 'm', 'i', 'c'), while the other is allowed to make a new face/expression and restart the round.

### PvC
1. A portrait is presented to the screen
2. The user must try to match the emotion they perceive in the image

(Bonus?) Images are stored until the end of the game; at the end, the players are given the option to send themselves an email with the images attached.


### Implementation Timeline
** Day 1 **: Set up all necessary dependencies and gather a collection of images for testing. Learn how to capture camera events in the browser.  Objectives:
- Be able to render a live image to the screen, using built-in webcam
** Day 2 **: Learn Kairos API. Objectives:
- Successfully make an API call to Kairos
- Successfully receive and print digested data, at least to console.
- Create UI (minimal/no styling) to represent data.
- Create a button to first capture an image, then send the API request, then receive & display the data.
** Day 3 ** Gamaify! Set up turn-based logic and comparison of scores and prompts / errors. Objectives:
- Game should store previous player's scores
- Game should be able to return a boolean indicating whether second player beat first player. 
