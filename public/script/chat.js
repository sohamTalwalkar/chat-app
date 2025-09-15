////////////////////////////////////
//Global variables
////////////////////////////////////

const userEmail = document.querySelector("#user-email").innerText;
const search = document.querySelector(".profile-settings > i + i");
const CHO = document.querySelector(".contact-head-options");
const searchIn = document.querySelector(".search-in");
const CHOChild = document.querySelector(".people-groups");
const goBack = document.querySelector("#go-back");
const enterSearch = document.querySelector("#enter-search");
const searchBar = document.querySelector("#search-input");
const searchContact = document.querySelector(".search-contact");
const defaultContact = document.querySelector(".default-contact");
const defaultContactList = document.querySelector(".default-contact > ul");
const contactBlock = document.querySelector(".contact-block");
const profileImg = document.querySelector(".profile-img");
const contactName = document.querySelector(".contact-name");
const options = document.querySelector(".options");
const contactHead = document.querySelector(".contact-head");
const searchInInput = document.querySelector(".search-in>input");
const groups = document.querySelector(".groups");
const people = document.querySelector(".people");
const contactPeople = document.querySelector(".contact-people");
//Chat part
const displayMessage = document.querySelector(".chat-body");
const inputMessage = document.querySelector("#message-input");
const chatFooterSend = document.querySelector(".chat-footer-send");
const sendMessage = document.querySelector("#send");
const chatHead = document.querySelector(".chat-header");
//settings
const contactArea = document.querySelector(".contact");
const chatArea = document.querySelector(".chat");
const altChatArea = document.querySelector(".alt-chat");
const settingsArea = document.querySelector(".settings");
const goSettings = document.getElementById("go-to-settings");
const backBtn = document.querySelector("#back");
const profilePhoto = document.querySelector(".profile-photo-div > img");
const profilePhotoInput = document.querySelector(".profile-photo-div > input");
const profileNameDiv = document.querySelector(".profile-name-div");
const username = document.querySelector(".profile-name-div > p");
const editUsername = document.querySelector(".profile-name-div > i");
const backImg = document.querySelector(".change-background-image > img");
const clickBackImg = document.querySelector(".change-background-image > input");
const uploadStatus = document.querySelector("#status");
const mainProfilePhoto = document.querySelector(".profile-photo>img");
const socket = io();
const chatService = {
    register(){
        socket.emit("register", { email: userEmail });
    },
    sendMessage(content, sender, receiver){
        socket.emit("chat message", { content: content, sender: sender, receiver: receiver});
    }
};
chatService.register();

/////////////////////////////////////////
//Other variables
////////////////////////////////////////

let pImg = document.createElement("img");
let cName = document.createElement("p");
let contactsArray = [];
let currentChat = userEmail;
let currentChatColor = "#ff6530";
let onContact = false;

////////////////////////////////////////////
//Theme setting
////////////////////////////////////////////

function initTheme(theme) {
    function colorIt(ch, ppl, grp, sii, cfs, ccc) {
        chatHead.style.background = `linear-gradient(270deg, ${ch[0]}, ${ch[1]}, ${ch[2]}, ${ch[3]}, ${ch[4]})`;
        chatHead.style.backgroundSize = `300% 300%`;
        chatHead.style.animation = "colorMovement 8s infinite linear";
        contactHead.style.background = `linear-gradient(270deg, ${ch[0]}, ${ch[1]}, ${ch[2]}, ${ch[3]}, ${ch[4]})`;
        contactHead.style.backgroundSize = `400% 400%`;
        contactHead.style.animation = "colorMovement 8s infinite linear";
        people.addEventListener("mouseover", () => {
            people.style.backgroundColor = ppl;
        });
        people.addEventListener("mouseout", () => {
            people.style.backgroundColor = "";
        });
        groups.addEventListener("mouseover", () => {
            groups.style.backgroundColor = grp;
        });
        groups.addEventListener("mouseout", () => {
            groups.style.backgroundColor = "";
        });
        searchInInput.style.color = sii;
        chatFooterSend.style.backgroundColor = cfs;
        currentChatColor = ccc;
    }
    switch (theme) {
        case "red":
            {
                let ch = ["#ff3030ff", "#ff3a30ff", "#ff4a3dff", "#ff6948ff", "#ff3730ff"];
                let ppl = "#ff8876ff";
                let grp = "#ff8876ff";
                let sii = "#ff3030ff";
                let cfs = "#ff3030ff";
                let ccc = "#ff3030ff";
                colorIt(ch, ppl, grp, sii, cfs, ccc);
            }
            break;
        case "blue":
            {
                let ch = ["#3033ffff", "#303affff", "#3d7affff", "#487cffff", "#3041ffff"];
                let ppl = "#768bffff";
                let grp = "#768bffff";
                let sii = "#3033ffff";
                let cfs = "#3033ffff";
                let ccc = "#3033ffff";
                colorIt(ch, ppl, grp, sii, cfs, ccc);
            }
            break;
        case "green":
            {
                let ch = ["#00c100ff", "#38d300ff", "#37ec00ff", "#82e600ff", "#03cf00ff"];
                let ppl = "#37eb00ff";
                let grp = "#37eb00ff";
                let sii = "#24b101ff";
                let cfs = "#2feb00ff";
                let ccc = "#00c100ff";
                colorIt(ch, ppl, grp, sii, cfs, ccc);
            }
            break;
        case "yellow":
            {
                let ch = ["#c18400ff", "#d2a100ff", "#dab200ff", "#e3c100ff", "#cbb700ff"];
                let ppl = "#f7bc1aff";
                let grp = "#f7bc1aff";
                let sii = "#c1a400ff";
                let cfs = "#c1a400ff";
                let ccc = "#c17a00ff";
                colorIt(ch, ppl, grp, sii, cfs, ccc);
            }
            break;
        case "orange":
            {
                let ch = ["#ff6530", "#ff8530", "#ff9530", "#ff8530", "#ff6530"];
                let ppl = "#ff8530";
                let grp = "#ff8530";
                let sii = "#ff6530";
                let cfs = "#ff6530";
                let ccc = "#ff6530";
                colorIt(ch, ppl, grp, sii, cfs, ccc);
            }
            break;
        case "violet":
            {
                let ch = ["#8d30ffff", "#7c30ffff", "#a13dffff", "#9a48ffff", "#4830ffff"];
                let ppl = "#9476ffff";
                let grp = "#9476ffff";
                let sii = "#5930ffff";
                let cfs = "#5930ffff";
                let ccc = "#5930ffff";
                colorIt(ch, ppl, grp, sii, cfs, ccc);
            }
            break;
    }
}

function loadTheme() {
    axios.post("/loadTheme", { userEmail })
        .then(
            Res => {
                let theme = Res.data;
                console.log(theme);
                initTheme(theme);
            }
        );
}

loadTheme();

///////////////////////////////////////
//Contacts and messages
///////////////////////////////////////

function scrollToBottom() {
    displayMessage.scrollTop = displayMessage.scrollHeight;
}

function displayChatBody() {
    if (inputMessage.value.length !== 0) {
        let step = document.createElement("div");
        displayMessage.appendChild(step);
        step.classList.add("step");

        let chatCard = document.createElement("div");
        step.appendChild(chatCard);
        chatCard.classList.add("chatCard");

        let cnt = document.createElement("p");
        cnt.innerText = inputMessage.value;
        chatCard.appendChild(cnt);
        cnt.classList.add("cnt");

        scrollToBottom();
    }

    inputMessage.value = "";
}

function isContactThere() {
    if (onContact === false) {
        chatArea.style.display = "none";

        let aLine = document.createElement("h1");
        altChatArea.appendChild(aLine);
        aLine.innerText = "Select a contact to chat with or else add new contacts";
        aLine.style.margin = "50px 20px 15px 20px";
        aLine.style.color = "white";

        let aButton = document.createElement("button");
        altChatArea.appendChild(aButton);
        aButton.innerText = "+ Add new contacts";
        aButton.classList.add("aButton");

        aButton.addEventListener("click", () => {
            search.click();
        });
    } else {
        altChatArea.style.display = "none";
        chatArea.style.display = "block";
    }
}

function displayChats() {
    chatService.sendMessage(inputMessage.value, userEmail, currentChat);
    displayChatBody();
}

function loadContacts(elm) {
    let li = document.createElement("li");
    defaultContactList.appendChild(li);

    let divLi = document.createElement("div");
    li.appendChild(divLi);
    divLi.classList.add("dpText");
    divLi.addEventListener("click", () => {
        onContact = true;

        if (window.innerWidth <= 1000) {
            contactArea.style.display = "none";
            chatArea.classList.add("chatInPhone");
        }

        isContactThere();

        pImg.src = "";
        pImg.src = (elm.dp) ? elm.dp : "/default/Unknown_person.jpg";
        pImg.classList.add("pImg");
        profileImg.appendChild(pImg);

        cName.innerHTML = "";
        cName.innerHTML = elm.name;
        cName.classList.add("cName");
        contactName.appendChild(cName);

        currentChat = elm.email;

        displayMessage.innerHTML = "";

        axios.post("/getMessages", { userEmail, currentChat })
            .then(
                response => {
                    let res = response.data;
                    res.forEach((mess, index, arr) => {
                        scrollToBottom();
                        //date
                        function getDate(date) {
                            let d1 = new Date(date);
                            return d1.toLocaleDateString("en-IN");
                        }

                        //time
                        function getTime(date) {
                            let t1 = new Date(date);
                            return t1.toLocaleTimeString("en-IN");
                        }

                        if (index === 0 || getDate(mess.time) !== getDate(arr[index - 1].time)) {
                            let dateStep = document.createElement("div");
                            displayMessage.appendChild(dateStep);
                            dateStep.classList.add("dateStep");

                            let dateDisplay = document.createElement("p");
                            dateDisplay.innerText = getDate(mess.time);
                            dateStep.appendChild(dateDisplay);
                            dateDisplay.style.color = "white";
                            dateDisplay.style.fontWeight = "600";
                        }

                        if (mess.content !== null) {
                            let step = document.createElement("div");
                            displayMessage.appendChild(step);

                            let chatCard = document.createElement("div");
                            step.appendChild(chatCard);
                            if (mess.sender !== userEmail) {
                                step.classList.add("S-step");
                                chatCard.classList.add("S-chatCard");
                                chatCard.style.backgroundColor = currentChatColor;
                            } else {
                                step.classList.add("step");
                                chatCard.classList.add("chatCard");
                            }

                            let messOpt = document.createElement("div");
                            step.appendChild(messOpt);
                            messOpt.classList.add("messOpt");
                            let del = document.createElement("i");
                            del.className = "fa-solid fa-trash";
                            messOpt.appendChild(del);
                            del.style.marginRight = "10px";
                            let time = document.createElement("i");
                            time.className = "fa-solid fa-clock";
                            messOpt.appendChild(time);

                            messOpt.style.display = "none";

                            let optOpen = false;
                            chatCard.addEventListener("click", () => {
                                if (!optOpen) {
                                    optOpen = true;
                                    messOpt.style.display = "block";
                                } else {
                                    optOpen = false;
                                    messOpt.style.display = "none";
                                }
                            });

                            del.addEventListener("click", () => {
                                axios.post("/deleteMessage", { messg: mess.id })
                                    .then(
                                        () => {
                                            chatCard.style.display = "none";
                                            messOpt.style.display = "none";
                                        }
                                    );
                            });

                            let timeOn = false;
                            let timeText = document.createElement("p");
                            timeText.style.display = "none";
                            messOpt.appendChild(timeText);
                            time.addEventListener("click", () => {
                                if (timeOn === false) {
                                    timeOn = true;
                                    timeText.style.display = "block";
                                    timeText.innerText = getTime(mess.time);
                                } else {
                                    timeOn = false;
                                    timeText.style.display = "none";
                                }
                            });

                            let cnt = document.createElement("p");
                            cnt.innerText = mess.content;
                            chatCard.appendChild(cnt);
                            cnt.classList.add("cnt");
                        }
                    }
                    );
                }
            );
    });

    let imgDivLi = document.createElement("img");
    divLi.appendChild(imgDivLi);
    imgDivLi.src = (elm.dp) ? elm.dp : "/default/Unknown_person.jpg";
    imgDivLi.classList.add("search-dp");

    let divDivLi = document.createElement("div");
    divLi.appendChild(divDivLi);
    divDivLi.classList.add("searchClassText");

    let uname = document.createElement("h3");
    divDivLi.appendChild(uname);
    uname.innerHTML = elm.name;

    let uemail = document.createElement("p");
    divDivLi.appendChild(uemail);
    uemail.innerHTML = elm.email;
};

//Chat section
sendMessage.addEventListener("click", displayChats);

inputMessage.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        displayChats();
    }
});

socket.on("then message", (msg) => {
    let step = document.createElement("div");
    displayMessage.appendChild(step);
    step.classList.add("S-step");

    let chatCard = document.createElement("div");
    step.appendChild(chatCard);
    chatCard.classList.add("S-chatCard");
    chatCard.style.backgroundColor = currentChatColor;

    let cnt = document.createElement("p");
    cnt.innerHTML = msg.content;
    chatCard.appendChild(cnt);
    cnt.classList.add("cnt");
});

//Contacts

axios.post("/getContacts", { userEmail })
    .then(
        Res => {
            let res = Res.data;
            res.forEach(
                elm => {
                    loadContacts(elm);
                    contactsArray.push(elm.email);
                }
            );
        }
    );


///////////////////////////////////////////
//Search contacts to add in your list
///////////////////////////////////////////

search.addEventListener("click", () => {
    CHOChild.style.display = "none";
    search.style.display = "none";
    searchIn.style.display = "flex";
});

goBack.addEventListener("click", () => {
    searchIn.style.display = "none";
    search.style.display = "flex";
    CHOChild.style.display = "flex";

    searchContact.style.display = "none";
    searchContact.innerHTML = "";
    defaultContact.style.display = "block";
});

enterSearch.addEventListener("click", () => {
    let query = searchBar.value;

    axios.post("/search", { query: query.trim() })
        .then(
            Response => {
                let response = Response.data;
                searchContact.innerHTML = "";
                defaultContact.style.display = "none";
                searchContact.style.display = "flex";
                let ul = document.createElement("ul");
                searchContact.appendChild(ul);
                ul.style.width = "100%";
                response.forEach(element => {
                    if(element.email === userEmail) return;
                    let li = document.createElement("li");
                    ul.appendChild(li);

                    let div = document.createElement("div");
                    li.appendChild(div);

                    let dpText = document.createElement("div");
                    div.appendChild(dpText);

                    let dp = document.createElement("img");
                    dpText.appendChild(dp);
                    if (element.dp) {
                        dp.src = element.dp;
                    } else {
                        dp.src = `/default/Unknown_person.jpg`;
                    }
                    dp.classList.add("search-dp");

                    let nameEmail = document.createElement("div");
                    dpText.appendChild(nameEmail);

                    let name = document.createElement("h2");
                    nameEmail.appendChild(name);
                    name.innerHTML = element.name;

                    let email = document.createElement("p");
                    nameEmail.appendChild(email);
                    email.innerHTML = element.email;

                    let add = document.createElement("button");
                    div.appendChild(add);
                    add.innerHTML = " + Add";

                    add.classList.add("add-btn");
                    nameEmail.classList.add("searchClassText");
                    dpText.classList.add("dpText");
                    div.classList.add("searchClass");

                    if (contactsArray.includes(element.email)) {
                        add.style.display = "none";
                        let added = document.createElement("p");
                        added.innerHTML = "Added";
                        added.classList.add("add-btn");
                        div.appendChild(added);
                    }

                    add.addEventListener("click", () => {
                        axios.post("/contacts", { userEmail: userEmail, contactEmail: element.email })
                            .then(
                                Res => {
                                    add.style.display = "none";
                                    let added = document.createElement("p");
                                    added.innerHTML = "Added";
                                    added.classList.add("add-btn");
                                    div.appendChild(added);
                                    loadContacts(element);
                                }
                            )
                    });
                });
            }
        );
});

/////////////////////////////////////////
//Settings
/////////////////////////////////////////

goSettings.addEventListener("click", () => {
    chatArea.style.display = "none";
    contactArea.style.display = "none";
    altChatArea.style.display = "none";
    settingsArea.style.display = "flex";
});

backBtn.addEventListener("click", () => {
    location.reload();
});

profilePhoto.addEventListener("click", () => {
    profilePhotoInput.click();
});

profilePhotoInput.addEventListener("change", () => {
    if (profilePhotoInput.files.length > 0) {
        let selectedFile = profilePhotoInput.files[0];

        let formData = new FormData();
        formData.append("dp image", selectedFile);
        formData.append("userEmail", userEmail);

        axios.post("/uploadDp", formData)
            .then(
                Res => {
                    let res = Res.data;
                    uploadStatus.innerText = res.message;

                    profilePhoto.src = res.filePath;
                    mainProfilePhoto.src = res.filePath;
                }
            );
    }
});

editUsername.addEventListener("click", () => {
    username.style.display = "none";
    editUsername.style.display = "none";

    let changeName = document.createElement("input");
    profileNameDiv.appendChild(changeName);
    changeName.placeholder = "Enter new name";
    changeName.classList.add("changeName");

    let saveChangeName = document.createElement("button");
    profileNameDiv.appendChild(saveChangeName);
    saveChangeName.classList.add("changeNameBtn");
    saveChangeName.innerHTML = `Save`;

    let backChangeName = document.createElement("button");
    profileNameDiv.appendChild(backChangeName);
    backChangeName.classList.add("changeNameBtn");
    backChangeName.innerHTML = `Back`;

    backChangeName.addEventListener("click", () => {
        changeName.style.display = "none";
        saveChangeName.style.display = "none";
        backChangeName.style.display = "none";
        username.style.display = "block";
        editUsername.style.display = "block";
    });

    saveChangeName.addEventListener("click", () => {
        let newName = changeName.value;

        if (newName) {
            axios.post("/changeName", { userEmail, newName })
                .then(() => {
                    location.reload();
                });
        }

        changeName.style.display = "none";
        saveChangeName.style.display = "none";
        backChangeName.style.display = "none";
        username.style.display = "block";
        editUsername.style.display = "block";
    });
});

//colors themes
let colorsDiv = ["red", "blue", "green", "yellow", "orange", "violet"];
let colors = [];
for (let i = 0; i < colorsDiv.length; i++) {
    colors[i] = document.getElementById(colorsDiv[i]);
}

colors.forEach((color) => {
    color.addEventListener("click", () => {
        let name = color.id;

        axios.post("/setTheme", { name, userEmail })
            .then(
                () => {
                    location.reload();
                }
            );
    });
});


backImg.addEventListener("click", () => {
    clickBackImg.click();
});

clickBackImg.addEventListener("change", () => {
    if (clickBackImg.files.length > 0) {
        let selectedFile = clickBackImg.files[0];

        let formData = new FormData();
        formData.append("Image", selectedFile);
        formData.append("userEmail", userEmail);

        axios.post("/bgUpload", formData)
            .then(
                Res => {
                    let res = Res.data;
                    uploadStatus.innerText = res.message;

                    backImg.src = res.filePath;
                    displayMessage.style.backgroundImage = `url("${res.filePath}")`;
                }
            );
    }
});

//log out
const logOutDiv = document.querySelector(".log-out-div > button");

logOutDiv.addEventListener("click", () => {
    window.location.href = "/logout";
});

///////////////////////////////////////////////
// People and Groups (Yet to be implemented)
///////////////////////////////////////////////
let selectedPeople = true;

let defaultGroup = document.createElement("div");
contactPeople.appendChild(defaultGroup);
defaultGroup.style.display = "none";
let groupText = document.createElement("h2");
defaultGroup.appendChild(groupText);
groupText.innerText = "Functionality yet to be added";
groupText.style.padding = "20px";

groups.addEventListener("click", () => {
    selectedPeople = false;
    defaultContact.style.display = "none";
    defaultGroup.style.display = "block";
});

people.addEventListener("click", () => {
    if (!selectedPeople) {
        selectedPeople = true;
        defaultGroup.style.display = "none";
        defaultContact.style.display = "block";
    }
});

isContactThere();

//phone configuration
const backToContacts = document.querySelector(".back-to-contacts");

backToContacts.addEventListener("click", () => {
    chatArea.style.display = "none";
    contactArea.style.display = "block";
});