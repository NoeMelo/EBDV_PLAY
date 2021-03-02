//check login

const LoggedOutLinks = document.querySelectorAll(".logged-out");
const LoggedInLinks = document.querySelectorAll(".logged-in");

const loginCheck = user => {
    if (user) {
        LoggedOutLinks.forEach(link => link.style.display = "none");
        LoggedInLinks.forEach(link => link.style.display = "block");

        // var name, email, photoUrl, uid, emailVerified;
        // name = user.displayName;
        // email = user.email;
        // photoUrl = user.photoURL;
        // emailVerified = user.emailVerified;
        // uid = user.uid;
        // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
        
    }else{
        LoggedOutLinks.forEach(link => link.style.display = "block");
        LoggedInLinks.forEach(link => link.style.display = "none");
    }
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var emojis          = "🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐽 🐸 🐵 🙈 🙉 🙊 🐒 🐔 🐧 🐦 🐤 🐣 🐥 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🐛 🦋 🐌 🐞 🐜 🦟 🦗 🕷 🕸 🦂 🐢 🐍 🦎 🦖 🦕 🐙 🦑 🦐 🦞 🦀 🐡 🐠 🐟 🐬 🐳 🐋 🦈 🐊 🐅 🐆 🦓 🦍 🦧 🐘 🦛 🦏 🐪 🐫 🦒 🦘 🐃 🐂 🐄 🐎 🐖 🐏 🐑 🦙 🐐 🦌 🐕 🐩 🦮 🐕‍🦺 🐈 🐓 🦃 🦚 🦜 🦢 🦩 🐇 🦝 🦨 🦡 🦦 🦥 🐁 🐀 🦔".split(" ");

/*
==============================
LOGING: In Up Out
==============================
*/

/* Sign Up*/
const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit',(e)=>{
    
    e.preventDefault();

    const signupEmail = document.querySelector('#signup-email').value;
    const signupPassword = document.querySelector('#signup-password').value;

    firebase.auth().createUserWithEmailAndPassword(signupEmail, signupPassword)
    .then((user) => {
      // Signed in
      // ...
      console.log("Sign Up");

      signupForm.reset();
      
      $("#ModalSignup").modal("hide");

    })  
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ..
    });
});

/* Sign In*/
const signinForm = document.querySelector('#signin-form');

signinForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    const signinEmail = document.querySelector('#signin-email').value;
    const signinPassword = document.querySelector('#signin-password').value;

    firebase.auth().signInWithEmailAndPassword(signinEmail, signinPassword)
    .then((user) => {
        // Signed in
        // ...
        console.log("Signed In");
        
        signinForm.reset();
      
        $("#ModalSignIn").modal("hide");
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
    });

});

  // Login With Google
  const googleLogin = document.querySelector("#googleLogin");
  
  googleLogin.addEventListener('click',(e)=>{
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...

        console.log("Sign In With Google");
        
        signinForm.reset();
        $("#ModalSignIn").modal("hide");

    }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        console.log("Error Sign In With Google");
    });

  });


/* Logout*/
const logout = document.querySelector('#logout');

logout.addEventListener('click',(e)=>{
    e.preventDefault();

    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("sign out");

      }).catch((error) => {
        // An error happened.
      });
})


/*
==============================
FIRESTORE: CRUD
==============================
*/

/*persons */

const persons = document.querySelector("#persons");

function deletePersonFirebase(id){
    var user = firebase.auth().currentUser;
    var db = firebase.firestore();
    db.collection('person').doc(id).delete();
    getPersonsFirebase(user.uid);
    getPersonasRuleta();//wheel.js reload person
}

function addPuntos(puntos, id){
    var user = firebase.auth().currentUser;
    var db = firebase.firestore();
    var person = db.collection("person").doc(id);

    person.get().then((doc) => {
        if (doc.exists) {
            current = doc.data().score;
            console.log("current score",current);

             // Set the "capital" field of the city 'DC'
            return person.update({
                score: current + puntos,
            })
            .then(() => {
                console.log("Document successfully updated!");
                getPersonsFirebase(user.uid);
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
            
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

}

let puntos = [200,100,300,150,150,100];

const setPersons = data => {
    if (data.length){
        let html = '';
        let index = 1;
        data.forEach(doc => {
            person = doc.data();
            person.id = doc.id;
            const li = `
            <tr>
                <th scope="row">${index} <span class="btn_delete fa fa-trash" data-id = "${person.id}"></span></th>
                <td class="table-Light"> <p class = "nickname_item">${person.icon} ${person.nickname}</p></td>
                <td class="table-danger item_table"><button type="button" class="btn btn-info btn1" data-id = "${person.id}">+${puntos[0]}</button></td>
                <td class="table-danger item_table"><button type="button" class="btn btn-info btn2" data-id = "${person.id}">+${puntos[1]}</button></td>
                <td class="table-danger item_table"><button type="button" class="btn btn-info btn3" data-id = "${person.id}">+${puntos[2]}</button></td>
                <td class="table-warning item_table"><button type="button" class="btn btn-info btn4" data-id = "${person.id}">+${puntos[3]}</button></td>
                <td class="table-warning item_table"><button type="button" class="btn btn-info btn5" data-id = "${person.id}">+${puntos[4]}</button></td>
                <td class="table-warning item_table"><button type="button" class="btn btn-info btn6" data-id = "${person.id}">+${puntos[5]}</button></td>
                <td class="item_table"> <p class = "score_item">${person.score}</p></td>
            </tr>
            `;
            html +=li;
            index +=1;
        });
        persons.innerHTML = html;

        //1
        const btn1 = document.querySelectorAll(".btn1");
        btn1.forEach(btn=>{
            btn.addEventListener('click',(e)=>{
                let id = e.target.dataset.id;
                addPuntos(puntos[0], id);
            });
        })
        //2
        const btn2 = document.querySelectorAll(".btn2");
        btn2.forEach(btn=>{
            btn.addEventListener('click',(e)=>{
                let id = e.target.dataset.id;
                addPuntos(puntos[1], id);
            });
        })
        //3
        const btn3 = document.querySelectorAll(".btn3");
        btn3.forEach(btn=>{
            btn.addEventListener('click',(e)=>{
                let id = e.target.dataset.id;
                addPuntos(puntos[2], id);
            });
        })
        //4
        const btn4 = document.querySelectorAll(".btn4");
        btn4.forEach(btn=>{
            btn.addEventListener('click',(e)=>{
                let id = e.target.dataset.id;
                addPuntos(puntos[3], id);
            });
        })
        //5
        const btn5 = document.querySelectorAll(".btn5");
        btn5.forEach(btn=>{
            btn.addEventListener('click',(e)=>{
                let id = e.target.dataset.id;
                addPuntos(puntos[4], id);
            });
        })
        //6
        const btn6 = document.querySelectorAll(".btn6");
        btn6.forEach(btn=>{
            btn.addEventListener('click',(e)=>{
                let id = e.target.dataset.id;
                addPuntos(puntos[5], id);
            });
        })

        const BtnDelete = document.querySelectorAll(".btn_delete");
        BtnDelete.forEach(btn =>{
            btn.addEventListener('click',(e)=>{
                let id = e.target.dataset.id;
                
                /** *SWEET ALERT* */
                swal({
                    title: "¿Estás seguro?",
                    text: "Una vez eliminado, no podrás recuperalo!",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                  })
                  .then((willDelete) => {
                    if (willDelete) {
                        
                    deletePersonFirebase(id);

                    swal("¡El registro fue eliminado!", {
                        icon: "success",
                      });
                    } else {
                      swal("¡Este registro está seguro!");
                    }
                  });
                /** *SWEET ALERT* END */
            });
        })
    }else{
        persons.innerHTML = "";
    }
}

/*list persons*/

function getPersonsFirebase(userId){    
    var db = firebase.firestore();
   //config index before orderBy comand
    db.collection("person").where("author", "==", userId).orderBy("score","desc")
        .get().then((querySnapshot) => {
    
        setPersons(querySnapshot.docs);
    
    });
}
/*add persons*/
const addPersonButton = document.querySelector("#add-person");//button
const personPopup = document.querySelector(".add-person-popup");

addPersonButton.addEventListener('click',()=>{
    personPopup.style.display = "block";
    const icon= document.querySelector("#rand-icon");
    icon.value = emojis[getRandomInt(0,emojis.length)]
});

function setPersonsFirebase(icon, nickname, score, userId){
    var db = firebase.firestore();
    db.collection("person").add({
        icon: icon,
        nickname: nickname,
        score: parseInt(score),
        author: userId
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}

const addPersonOk = document.querySelector(".ok");
const addPersonCancel = document.querySelector(".cancel");

addPersonOk.addEventListener('click',()=>{
    const icon= document.querySelector("#rand-icon");
    const nickname = document.querySelector("#nickname");
    const score = document.querySelector("#score");
    
    var user = firebase.auth().currentUser;
    setPersonsFirebase(icon.value, nickname.value, score.value, user.uid)
    
    //reset
    nickname.value = "";
    score.value = "";


    personPopup.style.display = "none";
    
    getPersonsFirebase(user.uid);
    getPersonasRuleta();//wheel.js reload person
});

addPersonCancel.addEventListener('click',()=>{
    personPopup.style.display = "none";
});


//MAIN

firebase.auth().onAuthStateChanged(function(user) {

    loginCheck(user);

    if (user) {
      // User is signed in.
      console.log("User is signed in");
      getPersonsFirebase(user.uid);
      getPersonasRuleta();//wheel.js reload person

    } else {
      // No user is signed in.
      console.log("No user is signed in");
      persons.innerHTML = "<p class = 'text-center'> LogIn</p>";
    }
});
