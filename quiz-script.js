//+++Game Logic+++
gameRounds = [];

function startGame() {
    
    const gameRound = { //Round and Properties
        roundNumber: 0,
        timeStampRaw: new Date(),
        timeStamp: "",
        userNameF: document.getElementById('userNameF').value,
        userNameL: document.getElementById('userNameL').value,
        userId: "",
        score: 0,
        roundStatus: "gestartet",
        documentation: []
    };

    gameRounds.push(gameRound); //Initiliazing Game-Round by pushing gameRound-Object to gameRoundsArray

    currentRound = gameRounds.length -1; //Set the current Round by Number of Rounds and make it match with Object Number in Array
    gameRound.roundNumber = currentRound; //declaring the Round Number as Object Number in Array

    //Building ID
    userId = gameRounds[currentRound].userNameF + "." + gameRounds[currentRound].userNameL + "@wimail.de"; //Building ID
    gameRounds[currentRound].userId = userId; //writing ID into Round

    document.getElementById('userName').textContent = gameRounds[currentRound].userId; //Display the ID

    //Building Log (++toISOString++ switches to UTC-Time -> To validate correct time, add 2 hours)
    timeStamp = gameRounds[currentRound].timeStampRaw.toISOString().slice(0, 16).replace(":", "-");
    gameRounds[currentRound].timeStamp = timeStamp;

    //Switch to Quiz-Screen 
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('leaderboard').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';

    //call Question-Building
    buildQuestion();

    console.log("Starbildschirm");
    console.log("Aktive Runde:", gameRounds[currentRound]);
    console.log(userId);
    console.log(timeStamp);
}


function abortGame() {
   
    gameRounds[currentRound].roundStatus = "abgebrochen"; //Change the State
    
    //Switch to End-Screen
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('leaderboard').style.display = 'block';
    
    //write the Game-Data
    updateTable();

    alert("Die Runde wurde vorzeitig beendet. Bitte starte eine neue.");

    console.log("Spiel abgebrochen");
    console.log("Aktive Runde:", gameRounds[currentRound]);
}

function endGame () { 

    gameRounds[currentRound].roundStatus = "abgeschlossen"; //Change the State

    //Switch to End-Screen
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('leaderboard').style.display = 'block';

    //write the Game-Data
    updateTable();

    console.log("Spiel beendet");
    console.log("Aktive Runde:", gameRounds[currentRound]);

}

function startOver() {

    currentQuestion = 0; //Reset the Question Display Order

    //Reset Inputs
    document.getElementById('userNameF').value = '';
    document.getElementById('userNameL').value = '';
    document.getElementById('userName').textContent = '';

    //Switch to Start-Screen
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('leaderboard').style.display = 'none';


    console.log("Aktive Runde:", gameRounds[currentRound]);
    console.log("ein neues Spiel");

}

//+++Game Functions+++
function updateTable () {

    const tableBody = document.getElementById('leaderboard-body'); //Assign Table to Table-Div

    //const round = gameRounds[currentRound]; 

    const row = document.createElement('tr');

    //Table Data
        //Number
        const roundNumberCell = document.createElement('td');
        roundNumberCell.textContent = gameRounds[currentRound].roundNumber;
        row.appendChild(roundNumberCell);

        //Timestamp
        const timeStampCell = document.createElement('td');
        timeStampCell.textContent = gameRounds[currentRound].timeStamp; 
        row.appendChild(timeStampCell);

        //Name
        const userNameCell = document.createElement('td');
        userNameCell.textContent = gameRounds[currentRound].userId;
        row.appendChild(userNameCell);

        //Points
        const scoreCell = document.createElement('td');
        scoreCell.textContent = gameRounds[currentRound].score;
        row.appendChild(scoreCell);

        //Status
        const statusCell = document.createElement('td');
        statusCell.textContent = gameRounds[currentRound].roundStatus;
        row.appendChild(statusCell);

        //Antworten
        const answersCell = document.createElement('td');
        answersCell.textContent = gameRounds[currentRound].documentation;
        row.appendChild(answersCell);

    tableBody.appendChild(row);


}

function downloadCSV() {
    const header = ["Runde", "Spieler", "Punkte", "Gespielte Fragen", "Status"];

    // Mappe die Runden-Daten
    const rows = gameRounds.map(round => [
        round.roundNumber,
        round.timeStamp,
        round.userId,
        round.score,
        round.roundStatus,
        round.documentation.join(" | ")  // Damit die Fragen richtig angezeigt werden
    ]);

    // Kombiniere Header und Rows zu einem CSV-Content
    const csvContent = [header, ...rows]
        .map(row => row.map(field => `"${field}"`).join(";"))
        .join("\n");

    // Erstelle den Dateinamen
    const fileName = `Runde_${gameRounds[currentRound].roundNumber}_${gameRounds[currentRound].timeStamp}.csv`;

    // Erstelle den Blob und den Download-Link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Erstelle den Download-Link und simuliere einen Klick
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

//+++Questions+++
let currentQuestion = 0;

const questions = [
    {//Frage 1
    type: 'multichoice', 
    question: 'CAFM steht für Computer Aided Facility Management. Aber was kann man darunter verstehen?', answer: 0,
    options: [
    'Ein digitales Werkzeug zur Verwaltung gebäudebezogener Daten und Prozesse', 
    'Eine Software zur CAD-Modellierung von Fassaden', 
    'Eine Methode zur Bewertung von Immobilienpreisen', 
    'Ein Ausschreibungsverfahren für Facility-Dienstleister'
    ]},

    {//Frage 2
    type: 'multichoice', 
    question: 'Welche Information wird typischerweise in einem CAFM-System gespeichert?', answer: 1,
    options: [
    'WLAN-Passwörter der Hausmeister', 
    'Standorte von Brandschutztechnik und Wartungsterminen', 
    'Private Telefonnummern von Nutzer:innen', 
    'Aktenzeichen von Bauanträgen aus der 80er-Jahre'
    ]},

    {//Frage 3
    type: 'multichoice', 
    question: 'Wie hilft CAFM im Alltag eines Hochbauamts?', answer: 2,
    options: [
    'Es ersetzt die Bauleitung auf der Baustelle',
    'Es ist ein Tool für die Öffentlichkeitsarbeit',
    'Es unterstützt bei Wartungsplanung, Flächennutzung und Dokumentation',
    'Es ist hauptsächlich für IT-Dokumentation zuständig'
    ]},

    {//Frage 4
    type: 'multichoice', 
    question: 'Wer trägt typischerweise zur Datenpflege im CAFM-System bei?', answer: 2,
    options: [
    'Nur das IT-Team des Hauses',
    'Architekt:innen und Ingenieur:innen nur während der Bauphase',
    'Ein Zusammenspiel aus Technik, Verwaltung, Planung und externen Dienstleistern',
    'Ausschließlich der/die Facility Manager'
    ]},

    {//Frage 5
    type: 'multichoice', 
    question: 'Welche der folgenden Aussagen ist KEIN Vorteil von CAFM?', answer: 2,
    options: [
    'Übersicht über technische Anlagen und Wartung',
    'Planung von Reinigungsintervallen',
    'Automatisiertes Erstellen von Bauanträgen',
    'Verknüpfung von Grundrissplänen mit Raumdaten'
    ]},
      
    {//Frage 6
    type: 'multichoice', 
    question: 'Was ist eine typische Information im Raumbuch eines CAFM-Systems?', answer: 1,
    options: [
    'Lieblingsfarbe der Raumnutzer:innen',
    'Fläche, Nutzung, Geschoss, Raumtyp, Bodenbelag etc.',
    'Energieverbrauch der Heizanlage',
    'Aktuelle Anzahl der Mülleimer im Raum'
    ]},

    {//Frage 7
    type: 'multichoice', 
    question: 'Was ist ein typischer Anwendungsfall für ein CAFM-System nach Fertigstellung eines Neubaus?', answer: 0,
    options: [
    'Die Integration von Gebäudeplänen, Technikdaten und Wartungsintervallen',
    'Die Baustellenabrechnung',
    'Der Abriss des Bestandsgebäudes',
    'Die Auswahl von Möbeln für den Konferenzraum'
    ]},

    {//Frage 8
    type: 'guess',
    question: 'Wie viele Quadratmeter Bruttogrundfläche (m²/BGF) werden aktuell in unserem CAFM-System erfasst?',
    correctValue: 568304
    },

     {//Frage 9 
    type: 'guess',
    question: 'Wie viele Tickets wurden seit Inbetriebnahme über das Modul Störungsmanagement erfasst?',
    correctValue: 1605
    },

    {//Frage 10 
    type: 'guess',
    question: 'Wie viele Benutzerprofile sind innerhalb der LHW im CAFM-System registriert? ',
    correctValue: 4080
    },

    {//Frage 11 
    type: 'guess',
    question: 'Wie viel % der Lebenszykluskosten entfallen ca. auf die Betriebs- und Nutzungsphase eines Gebäudes?',
    correctValue: 80
    },

    {//Frage 12
    type: 'guess',
    question: 'Bis zu ca. wie viel % der Kosten für Instandhaltungs- und Wartung können durch konsistente Gebäudedaten eingespart werden?',
    correctValue: 30
    }

    //Question-Layouts
    /*
        {//Frage X
        type: 'multichoice', 
        question: 'Welcher Planet ist der dritte von der Sonne?', answer: 1,
        options: [
        'Venus',
        'Erde',
        'Mars',
        'Jupiter'
        ]}
    */
    /*
        {//Frage Y
        type: 'guess',
        question: 'Wie viel ist 100?',
        correctValue: 100
    }
    */
];

function buildQuestion() {

    //Parameters to build Questions in DOM
    const queFrame = document.getElementById('questionId'); //Assign variable to Question-Div
    const ansFrame = document.getElementById('answersId'); //Assign variable to Answers-Div

    const myQuest = questions[currentQuestion]; //Assign varoiable to the current Question

    queFrame.innerHTML = myQuest.question; //Write the actual Question-Content in the Question-Div

    ansFrame.innerHTML = ''; //clear previous answers, to handle different Answer-Types 
    
    //build the Answers by Type and handle Point-Awarding
    if (myQuest.type === 'multichoice') {
        
        myQuest.options.forEach((option, index) => {//pulli for every Entry in options the value und index-number..
                
            const answerButton = document.createElement('button'); //..and generate a Button..

            answerButton.textContent = option; //..with the content of option

            answerButton.onclick = () => { //submit Answer Eventlistener
            
                if (index === myQuest.answer) { //if the Answer-Index matches the chosen Answer..

                    gameRounds[currentRound].score += 100; //add 100 Points to score
                }

                docuAnswer(index); //pushing the Answer-Index to documentation

                nextQuestion(); //build next Question after User gave Answer
            };
    
            ansFrame.appendChild(answerButton); //Write the actual Answer-Content in the Answer-Div
        });
    } 
    
    if (myQuest.type === 'guess') {

        const inputField = document.createElement('input'); //create new Input-Field
            inputField.type = 'number';
            inputField.placeholder = 'Deine Schätzung';

        const submitButton = document.createElement('button'); //create Button to submit the Input-Value
            submitButton.textContent = 'Antwort einreichen';

            submitButton.onclick = () => { //submit Answer Eventlistener
                const myGuess = parseFloat(inputField.value); //catch the Value from Input

                if (isNaN(myGuess) || myGuess <= 0) { //if the value is nan or below 0..
                    alert("Bitte eine gültige Schätzung eingeben."); //..demand a valid Answer
                    return;
                }

                let ratio = myGuess / myQuest.correctValue; //set the Answer relative to the correct Value
                
                    if (ratio > 1) { //if the Answer is bigger than the correct Value..
                        ratio = 1 / ratio; //..build the return value
                    }

                    const addingNumber = Math.round(ratio * 100); //calculate the points for given Answer
                    
                    gameRounds[currentRound].score += addingNumber; //add calculated Points to score

                    docuAnswer(myGuess); //pushing the Guess to documentation

                    nextQuestion(); //build next Question after User gave Answer
            };

            ansFrame.appendChild(inputField); //Write the Input to Answer-Div
            ansFrame.appendChild(submitButton); //Write the Button to Answer-Div
    };
}

function docuAnswer(answerValue) {

    const myAnswer = `${currentQuestion}-${answerValue}`;
    gameRounds[currentRound].documentation.push(myAnswer);

}

function nextQuestion() {
    
    currentQuestion++; //count up to trigger the next Question

    if (currentQuestion < questions.length) { //if there are Questions left..
        
        buildQuestion(); //build it

        console.log("Nächste Frage");

    } else { //if not..
        
        alert("Super, Du hast alle Fragen beantwortet. Danke für's Mitspielen - hier geht es zur Auswertung :)")

        endGame(); //..end the Game
    }
}