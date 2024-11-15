            // Handle snake growth
            const headRounded = { x: Math.round(head.x), y: Math.round(head.y) };
            if (headRounded.x === food.x && headRounded.y === food.y) {
                food = { x: getRandomInt(0, cols), y: getRandomInt(0, rows) };
                snake.push({ ...snake[snake.length - 1] });
            }
        }

        function drawSnake() {
            snake.forEach((segment, index) => {
                ctx.fillStyle = index === 0 ? "#2ed573" : "#61dafb"; // Head and body color
                ctx.beginPath();
                ctx.arc(
                    segment.x * tileSize + tileSize / 2,
                    segment.y * tileSize + tileSize / 2,
                    tileSize / 2.2,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            });
        }

        function checkCollision() {
            const head = snake[0];
            const headRounded = { x: Math.round(head.x), y: Math.round(head.y) };

            // Check wall collisions
            if (headRounded.x < 0 || headRounded.y < 0 || headRounded.x >= cols || headRounded.y >= rows) {
                triggerGameOver();
            }

            // Check self-collision
            for (let i = 1; i < snake.length; i++) {
                const segmentRounded = { x: Math.round(snake[i].x), y: Math.round(snake[i].y) };
                if (headRounded.x === segmentRounded.x && headRounded.y === segmentRounded.y) {
                    triggerGameOver();
                }
            }
        }

        function triggerGameOver() {
            isGameOver = true;
            document.getElementById("game-over").style.display = "block";
            createExplosion(snake[0].x * tileSize, snake[0].y * tileSize);
            cancelAnimationFrame(animationFrameId);
        }

        function createExplosion(x, y) {
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement("div");
                particle.classList.add("explosion");
                particle.style.background = randomColor();
                particle.style.width = particle.style.height = `${getRandomInt(5, 15)}px`;
                particle.style.left = `${x + getRandomInt(-10, 10)}px`;
                particle.style.top = `${y + getRandomInt(-10, 10)}px`;
                document.body.appendChild(particle);

                setTimeout(() => particle.remove(), 1000);
            }
        }

        function randomColor() {
            const colors = ["#ff4757", "#ffa502", "#3742fa", "#2ed573", "#ff6b81"];
            return colors[getRandomInt(0, colors.length)];
        }

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        document.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "ArrowUp":
                    if (direction.y === 0) nextDirection = { x: 0, y: -1 };
                    break;
                case "ArrowDown":
                    if (direction.y === 0) nextDirection = { x: 0, y: 1 };
                    break;
                case "ArrowLeft":
                    if (direction.x === 0) nextDirection = { x: -1, y: 0 };
                    break;
                case "ArrowRight":
                    if (direction.x === 0) nextDirection = { x: 1, y: 0 };
                    break;
                case "r":
                    if (isGameOver) restartGame();
                    break;
            }
        });

        function restartGame() {
            snake = [{ x: 10, y: 10 }];
            direction = { x: 1, y: 0 };
            nextDirection = { x: 1, y: 0 };
            food = { x: getRandomInt(0, cols), y: getRandomInt(0, rows) };
            isGameOver = false;
            document.getElementById("game-over").style.display = "none";
            gameLoop();
        }

        gameLoop();
    </script>
</body>
</html>
