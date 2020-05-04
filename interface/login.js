const username = document.getElementById("username");
const button = document.getElementById("submit");

button.addEventListener("click", () => {
  const user = username.value;
  fetch("/register", {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({
      username: user
    })
  })
    .then(res => res.json())
    .then(res => window.location.replace("./sendMessage.html"))
    .catch(console.log);

});
