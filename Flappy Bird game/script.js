let move_speed = 3,
gravity = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds/point.mp3');
let sound_die = new Audio('sounds/die.mp3');
// getting bird element properties
let bird_props = bird.getBoundingClientRect();
// This method returns DOMRect -> top, right, bottom, left, x, y, width, and height
let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');
let high_score_val = document.querySelector('.high_score_val');
let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');
// Add this variable to store the score and high score
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
document.addEventListener('keydown', (e) => {
if (e.key == 'Enter' && game_state != 'Play') {
document.querySelectorAll('.pipe_sprite').forEach((e) => {
e.remove();
});
img.style.display = 'block';
bird.style.top = '40vh';
game_state = 'Play';
message.innerHTML = '';
score_title.innerHTML = 'Score: ';
score_val.innerHTML = '0';
high_score_val.innerHTML = highScore;
message.classList.remove('messageStyle');
play();
}
});
function play() {
function move() {
if (game_state != 'Play') return;
let pipe_sprite = document.querySelectorAll('.pipe_sprite');
pipe_sprite.forEach((element) => {
let pipe_sprite_props = element.getBoundingClientRect();
bird_props = bird.getBoundingClientRect();
if (pipe_sprite_props.right <= 0) {
element.remove();
// Increase score by 1 for overcoming a step
score_val.innerHTML = parseInt(score_val.innerHTML) + 1;
if (parseInt(score_val.innerHTML) > highScore) {
highScore = parseInt(score_val.innerHTML);
localStorage.setItem('highScore', highScore);
high_score_val.innerHTML = highScore;
}
sound_point.play();
} else {
if (
bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
bird_props.left + bird_props.width > pipe_sprite_props.left &&
bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
bird_props.top + bird_props.height > pipe_sprite_props.top
) {
game_state = 'End';
message.innerHTML =
'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
message.classList.add('messageStyle');
img.style.display = 'none';
sound_die.play();
return;
}
element.style.left = pipe_sprite_props.left - move_speed + 'px';
}
});
// Check for collision with the food (red dot)
let foodBounds = document.querySelector('.food').getBoundingClientRect();
if (
bird_props.left < foodBounds.right &&
bird_props.right > foodBounds.left &&
bird_props.top < foodBounds.bottom &&
bird_props.bottom > foodBounds.top
) {
// If collision detected, increase score by 5 and respawn food
score += 5;
score_val.innerHTML = score;
if (score > highScore) {
highScore = score;
localStorage.setItem('highScore', highScore);
high_score_val.innerHTML = highScore;
}
sound_point.play();
respawnFood();
}
requestAnimationFrame(move);
}
requestAnimationFrame(move);
let bird_dy = 0;
function apply_gravity() {
if (game_state != 'Play') return;
bird_dy = bird_dy + gravity;
document.addEventListener('keydown', (e) => {
if (e.key == 'ArrowUp' || e.key == ' ') {
img.src = 'images/Bird-2.png';
bird_dy = -7.6;
}
});
document.addEventListener('keyup', (e) => {
if (e.key == 'ArrowUp' || e.key == ' ') {
img.src = 'images/Bird.png';
}
});
if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
game_state = 'End';
message.style.left = '28vw';
window.location.reload();
message.classList.remove('messageStyle');
return;
}
bird.style.top = bird_props.top + bird_dy + 'px';
bird_props = bird.getBoundingClientRect();
requestAnimationFrame(apply_gravity);
}
requestAnimationFrame(apply_gravity);
let pipe_separation = 0;
let pipe_gap = 35;
function create_pipe() {
if (game_state != 'Play') return;
if (pipe_separation > 115) {
pipe_separation = 0;
let pipe_posi = Math.floor(Math.random() * 43) + 8;
let pipe_sprite_inv = document.createElement('div');
pipe_sprite_inv.className = 'pipe_sprite';
pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
pipe_sprite_inv.style.left = '100vw';
document.body.appendChild(pipe_sprite_inv);
let pipe_sprite = document.createElement('div');
pipe_sprite.className = 'pipe_sprite';
pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
pipe_sprite.style.left = '100vw';
pipe_sprite.increase_score = '1';
document.body.appendChild(pipe_sprite);
}
pipe_separation++;
requestAnimationFrame(create_pipe);
}
requestAnimationFrame(create_pipe);
// Call respawnFood() to spawn initial food
respawnFood();
function moveFood() {
// Move the food along with the background
let food = document.querySelector('.food');
food.style.left = parseInt(food.style.left) - move_speed + 'px';
// Check if food goes beyond the left edge, then respawn it
if (parseInt(food.style.left) + 30 < 0) {
respawnFood();
}
requestAnimationFrame(moveFood);
}
requestAnimationFrame(moveFood);
}
// Add this function to respawn food at random position
function respawnFood() {
let maxX = window.innerWidth - 30; // Adjust if needed
let maxY = window.innerHeight - 30; // Adjust if needed
let food = document.querySelector('.food');
let x = Math.random() * maxX;
let y = Math.random() * maxY;
food.style.left = x + 'px';
food.style.top = y + 'px';
}
