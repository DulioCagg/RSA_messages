const dropdown = document.getElementById("listUsers");
const encrypted = document.getElementById("encrypted");
const text = document.getElementById("message");
const button = document.getElementById("send");
const check = document.getElementById("check");
const table = document.getElementById("table");

fetch("/users")
  .then(res => res.json())
  .then(users => {
    users.forEach(user => {
      const opt = document.createElement("option");
      opt.value = user;
      opt.innerHTML = user;
      opt.className = "dropdown-item";
      dropdown.appendChild(opt);
    })
    console.log(users)
  })

fetch("/messages")
  .then(res => res.json())
  .then(messages => {
    console.log(messages);
    if (messages.length > 0) {
      messages.forEach(message => {
        const tr = document.createElement("tr");
        const from = document.createElement("td");
        const original = document.createElement("td");
        const encr = document.createElement("td");
        const decr = document.createElement("td");

        from.innerHTML = message.from;
        original.innerHTML = message.message;
        encr.innerHTML = message.encrypted;
        decr.innerHTML = message.decoded;

        tr.appendChild(from);
        tr.appendChild(original);
        tr.appendChild(encr);
        tr.appendChild(decr);
        table.appendChild(tr);
      });
    }
  })

button.addEventListener("click", () => {
  const message = text.value;
  const to = dropdown.options[dropdown.selectedIndex].value;

  fetch("/send", {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({
      message,
      to
    })
  })
    .then(res => res.json())
    .then(res => encrypted.innerText = res.encrypted)
    .catch(console.log);
});

check.addEventListener("click", () => {
  window.location.replace("./message.html")
});