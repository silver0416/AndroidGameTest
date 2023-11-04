var gameListing = document.getElementById("diff-list");

games().then(function(gamePaths) {
    gamePaths.forEach(function(gamePath) {
        const imgElement = document.createElement('img');
        imgElement.src = "level_img/" + gamePath + ".png";

        var gameLink = document.createElement("a");
        gameLink.classList.add("game");
        gameLink.href = "./" + gamePath + "/index.html";
        gameLink.textContent = gamePath;

        gameLink.insertBefore(imgElement, gameLink.firstChild);

        var gameElement = document.createElement("div");
        gameElement.classList.add("game-dox");
        gameElement.appendChild(gameLink);

        gameListing.appendChild(gameElement);
    });
});

async function games() {
    return [
        "初級模式",
        "中等模式",
        "困難模式",
        "超難模式"
    ];
}
