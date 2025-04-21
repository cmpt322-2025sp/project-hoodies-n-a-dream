// gameAnimation.js
// Author: Rasheed & Keli'i
// Created: 2025-02-17
// Updated: 2025-02-25
// Purpose: Returns the HTML structure for Nitro Racing game view

// Import route-scoped styles
import './general.css';
import './countDown.css';
import './answerStreak.css';

/**
 * Returns the HTML markup for the game animation view.
 * @returns {string} HTML string for injection into the SPA container
 */
export default function gameAnimation() {
    return `
    <div id="carShield"></div>

    <div id="carStreak"></div>

    <div id="map1"></div>
    <div id="map2"></div>
    <div id="map3"></div>
    <div id="track"></div>

    <div id="transition">
      <img src="https://i.pinimg.com/474x/df/65/67/df6567a6fa06656d909980e6fbdcfdf1.jpg" />
      <img src="https://th.bing.com/th/id/R.602b95bb0daec842b69c42e007d79026?rik=%2bprgNhkUS1OsvA&pid=ImgRaw&r=0" />
      <img src="https://th.bing.com/th/id/R.1f4a53e7d20f061e3ac2616988fc024b?rik=Em5fLqVRGqZukQ&pid=ImgRaw&r=0" />
      <img src="https://th.bing.com/th/id/R.1f4a53e7d20f061e3ac2616988fc024b?rik=Em5fLqVRGqZukQ&pid=ImgRaw&r=0" />
      <img src="https://i.pinimg.com/474x/df/65/67/df6567a6fa06656d909980e6fbdcfdf1.jpg" />
      <img src="https://th.bing.com/th/id/R.602b95bb0daec842b69c42e007d79026?rik=%2bprgNhkUS1OsvA&pid=ImgRaw&r=0" />
      <img src="https://th.bing.com/th/id/R.1f4a53e7d20f061e3ac2616988fc024b?rik=Em5fLqVRGqZukQ&pid=ImgRaw&r=0" />
    </div>

    <div id="overlay"></div>
    <button id="startGame" onclick="Lights()">Start Race</button>
    <div id="countDown"></div>

    <div id="answerStreak"></div>

    <div>
      <img id="car" class="car" src="../assets/Car1.png" alt="Car" />
    </div>

    <div class="players">
      <div class="player1">
        <img id="car1-model" src="../assets/Car1.png" alt="Player Car" />
        <h1 id="player-border">Player 1</h1>
        <img class="fireStreak" src="../assets/fireStreak1.png" alt="streak#1" />
        <img class="fireStreak" src="../assets/fireStreak1.png" alt="streak#2" />
        <img class="fireStreak" src="../assets/fireStreak1.png" alt="streak#3" />
        <img class="fireStreak" src="../assets/fireStreak1.png" alt="streak#4" />
        <img class="fireStreak" src="../assets/fireStreak1.png" alt="streak#5" />
      </div>
    </div>

    <div>
      <h1 id="clock">00:00</h1>
    </div>

    <div class="equation-container">
      <h1 id="equation"></h1>
      <div class="button-container">
        <button id="bt1" class="buttons" onclick="checkAnswer(this)"><span id="bt1span"></span></button>
        <button id="bt2" class="buttons" onclick="checkAnswer(this)"><span id="bt2span"></span></button>
        <button id="bt3" class="buttons" onclick="checkAnswer(this)"><span id="bt3span"></span></button>
        <button id="bt4" class="buttons" onclick="checkAnswer(this)"><span id="bt4span"></span></button>
      </div>
    </div>

    <div id="room-code">Game ID: Loading...</div>

    <div id="game-border"></div>

    <div class="traffic-light-box">
      <div id="red" class="light red"></div>
      <div id="yellow" class="light yellow"></div>
      <div id="green" class="light green"></div>
    </div>

    <audio id="countSound" src="../audio/countdown_Bell2.wav" preload="auto"></audio>
    <audio id="rightSound" src="../audio/rightSound.wav" preload="auto"></audio>
    <audio id="wrongSound" src="../audio/wrongSound2.mp3" preload="auto"></audio>
    <audio id="soundTrack" src="../audio/soundtrack.wav" preload="auto" loop></audio>
    <audio id="streakSound" src="../audio/streakSound.wav" preload="auto"></audio>
  `;
}
