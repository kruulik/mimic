# mimic

**make a face.**


mimic is an in-browser game built using Affectiva facial recognition SDK.


## How to play:

Press start, and __allow webcam access__.
Emoji will start falling from the top of the screen.
Try to make a face that matches that emoji as closely as possible.
Match as many as you can before time runs out.
The more you get in a row, the higher the score multiplier.

## Technical specs

Affectiva provides an incredibly powerful facial recognition tool that is able to detect various facial landmarks, which it uses to gauge expression and recognize emotion. It also provides an SDK which is loaded onto the local machine, crucial to providing the low latency needed for this game.

The game uses two canvases; one for the detector and webcam video, and another for the UI and falling emoji. When initialized, the detector creates a video and canvas element of its own, hiding the video element and feeding it to the visible canvas element. This is done so that facial landmarks can be painted on the canvas directly.

## Detector & UI canvas

### Diagram of callbacks

![diagram](https://github.com/kruulik/mimic/blob/master/assets/diagram.png)
