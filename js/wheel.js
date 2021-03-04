// --------
// Colores
// --------

let colores = ["#D98880","#F1948A","#C39BD3","#BB8FCE","#7FB3D5","#85C1E9","#76D7C4","#45B39D","#52BE80","#82E0AA","#F7DC6F","#F8C471","#F0B27A","#E59866","#D7DBDD","#BFC9CA","#B2BABB","#85929E","#808B96"]


// ------------------------
// Firebase data to Ruleta
// ------------------------
let ruletaNames = [];

const setNames = data =>{
    if (data.length) {

        data.forEach(doc => {
            person = doc.data();
            let name = person.nickname
            ruletaNames.push({
                'fillStyle' : colores[getRandomInt(0,colores.length)],
                'text' : name
            });
        });
        console.log("ruleta name length: ", ruletaNames.length);
    }
}

function getPersonasRuleta(){
    var user = firebase.auth().currentUser;
    var db = firebase.firestore();
    
    db.collection("person").where("author", "==", user.uid).orderBy("score","desc")
        .get().then((querySnapshot) => {
        
        //Reload names
        ruletaNames = [];
        setNames(querySnapshot.docs);
    
    });
}


// -------------------------------------------------------
// Main Principal Modal
// -------------------------------------------------------

const btnRuletaModal = document.querySelector("#btnRuletaModal");
btnRuletaModal.addEventListener('click',()=>{
    console.log("Modal Ruleta");
    // getPersonasRuleta();
    // --------------------
    // Ruleta Personas: no actualiza al instante, colocarlo en una funcion de validacion de login user
    // --------------------
    // Create new wheel object specifying the parameters at creation time.
    let theWheel = new Winwheel({
        'canvasId'     : 'canvasPersonas',
        'numSegments'  : ruletaNames.length,     // Specify number of segments.
        'outerRadius'  : 212,   // Set outer radius so wheel fits inside the background.
        'textFontSize' : 28,    // Set font size as desired.
        'segments'     : ruletaNames,
        'animation' :           // Specify the animation to use.
        {
            'type'     : 'spinToStop',
            'duration' : 5,     // Duration in seconds.
            'spins'    : 9,     // Number of complete spins.
            'callbackFinished' : alertPrize,
            'callbackSound'    : playSound,   // Function to call when the tick sound is to be triggered.
            'soundTrigger'     : 'pin'        // Specify pins are to trigger the sound, the other option is 'segment'.
        },
        'pins' :
        {
            'number' : ruletaNames.length   // Number of pins. They space evenly around the wheel.
        }
    });
    const btn_girar_personas = document.querySelector("#canvasPersonas");
    btn_girar_personas.addEventListener('click',()=>{
        let wheelSpinning = false;
        wheelSpinning = reIniciarRuleta(theWheel, wheelSpinning);
        wheelSpinning = IniciarRuleta(theWheel,wheelSpinning);
        console.log("girando");
    });

    // --------------------
    // Ruleta Personas
    // --------------------
    // Create new wheel object specifying the parameters at creation time.
    let theWheelActions = new Winwheel({
        'canvasId'     : 'canvasAcciones',
        'numSegments'  : 3,     // Specify number of segments.
        'outerRadius'  : 212,   // Set outer radius so wheel fits inside the background.
        'textFontSize' : 28,    // Set font size as desired.
        'segments'     :        // Define segments including colour and text.
        [
        {'fillStyle' : '#eae56f', 'text' : 'Familia'},
        {'fillStyle' : '#89f26e', 'text' : 'Amigos'},
        {'fillStyle' : '#7de6ef', 'text' : 'Colegio'},
        ],
        'animation' :           // Specify the animation to use.
        {
            'type'     : 'spinToStop',
            'duration' : 5,     // Duration in seconds.
            'spins'    : 9,     // Number of complete spins.
            'callbackFinished' : alertPrize,
            'callbackSound'    : playSound,   // Function to call when the tick sound is to be triggered.
            'soundTrigger'     : 'pin',        // Specify pins are to trigger the sound, the other option is 'segment'.
        },
        'pins' :
        {
            'number' : 3 ,  // Number of pins. They space evenly around the wheel.
        }
    });
    const btn_girar_acciones = document.querySelector("#canvasAcciones");
    btn_girar_acciones.addEventListener('click',()=>{
        let wheelSpinning = false;
        wheelSpinning = reIniciarRuleta(theWheelActions, wheelSpinning);
        wheelSpinning = IniciarRuleta(theWheelActions,wheelSpinning);
        console.log("girando");
    });


});
// -------------------------------------------------------
// Iniciar Ruleta
// -------------------------------------------------------
function IniciarRuleta(wheel,wheelSpinning){

    if (wheelSpinning == false) {
        // Based on the power level selected adjust the number of spins for the wheel, the more times is has
        // to rotate with the duration of the animation the quicker the wheel spins.
        var wheelPower = 3;
        if (wheelPower == 1) {
            wheel.animation.spins = 3;
        } else if (wheelPower == 2) {
            wheel.animation.spins = 8;
        } else if (wheelPower == 3) {
            wheel.animation.spins = 15;
        }

        // Begin the spin animation by calling startAnimation on the wheel object.
        wheel.startAnimation();

        // Set to true so that power can't be changed and spin button re-enabled during
        // the current animation. The user will have to reset before spinning again.
        wheelSpinning = true;
    }
    return wheelSpinning;
}

function reIniciarRuleta(wheel,wheelSpinning){
    wheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
    wheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
    wheel.draw();                // Call draw to render changes to the wheel.
    wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
    return wheelSpinning;
}
function alertPrize(indicatedSegment)
            {
                // Do basic alert of the segment text. You would probably want to do something more interesting with this information.
                // alert("You have won " + indicatedSegment.text);
                playSoundClick(); // click sound 
                swal({
                    title: indicatedSegment.text,
                  });
            }

let audio = new Audio('./media/tick.mp3');

function playSound()
            {
                // Stop and rewind the sound if it already happens to be playing.
                audio.pause();
                audio.currentTime = 0;

                // Play the sound.
                audio.play();
                console.log("sonando");
            }
let audioClick = new Audio('./media/click.mp3');

function playSoundClick()
                        {
                            // Stop and rewind the sound if it already happens to be playing.
                            audioClick.pause();
                            audioClick.currentTime = 0;
            
                            // Play the sound.
                            audioClick.play();
                        }