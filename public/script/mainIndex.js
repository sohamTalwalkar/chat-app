const signup = document.querySelectorAll(".signup");
const login = document.querySelector("#log-btn");
const loginCard = document.querySelector(".login-card");
const signupCard = document.querySelector(".signup-card");
const colors = document.querySelectorAll(".header>div");
const allBtns = document.querySelectorAll("button");
const span = document.querySelector("span");
const goback = document.querySelector("#goback");
const logEmail = document.querySelector("#log-email");
const logPassword = document.querySelector("#log-password");
const Name = document.querySelector("#name");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const rePassword = document.querySelector("#re-password");
const doSignUp = document.querySelector("#do-signup");

signup.forEach(element => {
    element.addEventListener("click", () => {
        if (signupCard.style.display === "none" || !signupCard.style.display) {
            loginCard.style.display = "none";
            signupCard.style.display = "flex";
        }
    });
})

doSignUp.addEventListener("click", (e) => {
    e.preventDefault();
    if (password.value === rePassword.value) {
        axios.post("/signup", {
            name: Name.value,
            email: email.value,
            password: password.value
        })
            .then(res => {
                showStatus(res.data, "green");
            })
            .catch(err => {
                showStatus("Signup failed", "red");
            });
    } else {
        showStatus("Passwords don't match", "red");
    }
});

function showStatus(message, color) {
    signupCard.querySelectorAll(".status").forEach(e => e.remove());
    let status = document.createElement("p");
    status.classList.add(".status");
    status.style.color = color;
    status.style.margin = "5px";
    status.innerText = message;
    signupCard.appendChild(status);
}

function showSt(message) {
    loginCard.querySelectorAll(".statusLog").forEach(e => e.remove());
    let status = document.createElement("p");
    status.classList.add(".statusLog");
    status.style.color = "red";
    status.style.marginTop = "-10px";
    status.innerText = message;
    loginCard.appendChild(status);
}

login.addEventListener("click", (e) => {
    e.preventDefault();
    axios.post("/login", {
        email: logEmail.value,
        password: logPassword.value
    })
        .then(Res => {
            let res = Res.data;
            if (res.success === true) {
                window.location.href = `/chat?email=${res.email}`;
            } else {
                showSt(res.message);
            }
        })
        .catch(
            () => {
                showSt("User not found");
            }
        );
});

colors.forEach((elm, i) => {
    elm.addEventListener("click", () => {
        colors.forEach(e => {
            e.style.border = "none";
        });
        elm.style.border = "solid 1px white";
        switch (i) {
            case 0:
                allBtns.forEach(elem => {
                    elem.style.backgroundColor = "#ff3030";
                    elem.style.color = "white";
                });
                span.style.color = "#ff3030";
                break;
            case 1:
                allBtns.forEach(elem => {
                    elem.style.backgroundColor = "#3030ff";
                    elem.style.color = "white";
                });
                span.style.color = "#3030ff";
                break;
            case 2:
                allBtns.forEach(elem => {
                    elem.style.backgroundColor = "#30ff30";
                    elem.style.color = "#1d901dff";
                });
                span.style.color = "#30ff30";
                break;
            case 3:
                allBtns.forEach(elem => {
                    elem.style.backgroundColor = "#ffff30";
                    elem.style.color = "#ff9900ff";
                });
                span.style.color = "#ffff30";
                break;
            case 4:
                allBtns.forEach(elem => {
                    elem.style.backgroundColor = "#ff6530";
                    elem.style.color = "white";
                });
                span.style.color = "#ff6530";
                break;
            case 5:
                allBtns.forEach(elem => {
                    elem.style.backgroundColor = "#8d30ff";
                    elem.style.color = "white";
                });
                span.style.color = "#8d30ff";
                break;
        }
        allBtns[allBtns.length - 1].style.backgroundColor = "white";
        allBtns[allBtns.length - 1].style.color = "black";
    });
});

login

goback.addEventListener("click", () => {
    loginCard.style.display = "flex";
    signupCard.style.display = "none";
});
