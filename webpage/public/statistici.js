async function DataBaseQuery_Insert(q){

    const response = await fetch("http://localhost:5500/server", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: q,
    })
    const text = await response.text();
    return text;
}

async function DataBaseQuery_Select(q){

    const response = await fetch("http://localhost:5500/server", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: q,
    })
    const text = await response.json();
    return text;
}

window.addEventListener("load", (event) => {
    CreateMeanTable().then();
})

async function CreateMeanTable(){
    var par = document.getElementById("MG");

    var GAverages = await DataBaseQuery_Select(`{"query": "SELECT G1.NumeGrupa, AVG(Ca1.Punctaj) AS Medie FROM Grupe G1 LEFT JOIN Studenti S1 ON S1.GrupaID = G1.GrupaID JOIN Catalog Ca1 ON Ca1.StudentID = S1.StudentID GROUP BY G1.NumeGrupa"}`)

    par.innerHTML += "Media generala a grupelor semestrul acesta: <br>";

    if(GAverages.length > 0){
        for(var i = 0; i < GAverages.length; i++){
            par.innerHTML += GAverages[i].NumeGrupa + ": " + GAverages[i].Medie + "<br>";
        }
    }

    var CAverages = await DataBaseQuery_Select(`{"query": "SELECT C.MaterieCurs, AVG(Ca.Punctaj) AS Medie FROM Cursuri C LEFT JOIN Catalog Ca ON C.CursID = Ca.CursID WHERE C.MaterieCurs != 'Chimie' AND C.MaterieCurs != 'Informatica' GROUP BY C.MaterieCurs"}`)

    par.innerHTML += "<br>Media generala punctajelor luate la fiecare materie: <br>";

    if(CAverages.length > 0){
        for(var i = 0; i < CAverages.length; i++){
            par.innerHTML += CAverages[i].MaterieCurs + ": " + CAverages[i].Medie + "<br>";
        }
    }

    var HAverages = await DataBaseQuery_Select(`{"query": "SELECT M.NumeGrupa, M.MaterieCurs, M.Medie FROM (SELECT C1.MaterieCurs, G1.NumeGrupa, AVG(Ca1.Punctaj) AS Medie, ROW_NUMBER() OVER(PARTITION BY C1.MaterieCurs ORDER BY AVG(Ca1.Punctaj) DESC) rn FROM Grupe G1 LEFT JOIN Studenti S1 ON S1.GrupaID = G1.GrupaID JOIN Catalog Ca1 ON Ca1.StudentID = S1.StudentID JOIN Cursuri C1 ON C1.CursID = Ca1.CursID WHERE C1.MaterieCurs != 'Chimie' GROUP BY G1.NumeGrupa, C1.MaterieCurs) AS M WHERE rn = 1 ORDER BY M.NumeGrupa;"}`);

    par.innerHTML += "<br>Grupele care au luat cea mai mare medie la fiecare materie pe semestrul acesta:<br>"

    if(HAverages.length > 0){
        for(var i = 0; i < HAverages.length; i++){
            par.innerHTML += HAverages[i].MaterieCurs + ": " + HAverages[i].NumeGrupa + " - " + HAverages[i].Medie + "<br>";
        }
    }

    var SAverages = await DataBaseQuery_Select(`{"query": "SELECT S.Nume, S.Prenume, G.NumeGrupa, C.MaterieCurs, Ca.Punctaj FROM (SELECT G1.NumeGrupa, C1.MaterieCurs, AVG(Ca1.Punctaj) AS Medie, ROW_NUMBER() OVER(PARTITION BY C1.MaterieCurs ORDER BY AVG(Ca1.Punctaj) DESC) rn FROM Grupe G1 LEFT JOIN Studenti S1 ON S1.GrupaID = G1.GrupaID JOIN Catalog Ca1 ON Ca1.StudentID = S1.StudentID JOIN Cursuri C1 ON C1.CursID = Ca1.CursID WHERE C1.MaterieCurs != 'Chimie' GROUP BY G1.NumeGrupa, C1.MaterieCurs) AS M, Studenti S LEFT JOIN Catalog Ca ON S.StudentID = Ca.StudentID JOIN Cursuri C ON C.CursID = Ca.CursID JOIN Grupe G ON S.GrupaID = G.GrupaID WHERE G.NumeGrupa = M.NumeGrupa AND C.MaterieCurs = M.MaterieCurs AND M.rn = 1 ORDER BY G.NumeGrupa"}`);

    par.innerHTML += "<br> participantii acestor materii din grupele respective si notele lor din catalog la aceasta materie:<br>";

    if(SAverages.length > 0){
        for(var i = 0; i < SAverages.length; i++){
            par.innerHTML += SAverages[i].Nume + " " + SAverages[i].Prenume + ", " + SAverages[i].NumeGrupa + " - " + SAverages[i].MaterieCurs + " - " + SAverages[i].Punctaj + "<br>";
        }
    }

    par.innerHTML += "<br>Nume si Prenumele, grupa din care fac parte si datele lor de contact a elevilor care au media mai mare decat media grupei din care fac parte si sunt inrolati la un numar de materii sau mai multe: <br>Alegeti numarul de materii de comparat:<br>";

    var radio = document.createElement("INPUT");
    radio.setAttribute("type", "radio");
    radio.setAttribute("name", "NrMaterii");
    radio.setAttribute("value", "1");
    radio.setAttribute("onclick", "submitClick(value)");
    par.appendChild(radio);
    par.innerHTML += "1<br>";

    var radio = document.createElement("INPUT");
    radio.setAttribute("type", "radio");
    radio.setAttribute("name", "NrMaterii");
    radio.setAttribute("value", "2");
    radio.setAttribute("onclick", "submitClick(value)");
    par.appendChild(radio);
    par.innerHTML += "2<br>";

    var radio = document.createElement("INPUT");
    radio.setAttribute("type", "radio");
    radio.setAttribute("name", "NrMaterii");
    radio.setAttribute("value", "3");
    radio.setAttribute("onclick", "submitClick(value)");
    par.appendChild(radio);
    par.innerHTML += "3<br>";

    var varPar = document.createElement("p");
    varPar.setAttribute("id", "varPar");
    par.appendChild(varPar);

    var HTeachers = await DataBaseQuery_Select(`{"query": "SELECT G.NumeGrupa, C.MaterieCurs, P.Nume, P.Prenume, AVG(Ca.Punctaj) AS Medie FROM (SELECT C.MaterieCurs, AVG(Ca.Punctaj) AS Medie FROM Cursuri C LEFT JOIN Catalog Ca ON C.CursID = Ca.CursID WHERE C.MaterieCurs != 'Chimie' AND C.MaterieCurs != 'Informatica' GROUP BY C.MaterieCurs) AS MC, Orar O LEFT JOIN Grupe G ON O.GrupaID = G.GrupaID JOIN Cursuri C ON C.CursID = O.CursID JOIN Profesori P ON P.ProfesorID = O.ProfesorCursantID JOIN Studenti S ON S.GrupaID = G.GrupaID JOIN Catalog Ca ON S.StudentID = Ca.StudentID AND Ca.CursID = C.CursID WHERE C.MaterieCurs != 'Chimie' GROUP BY G.NumeGrupa, C.MaterieCurs, P.Nume, P.Prenume, MC.MaterieCurs, MC.Medie HAVING MC.MaterieCurs = C.MaterieCurs AND AVG(Ca.Punctaj) > MC.Medie ORDER BY C.MaterieCurs DESC, G.NumeGrupa;"}`);

    par.innerHTML += "<br> Profesorii si grupele la care preda a caror medie la materia predata de profesorul respectiv este mai mare decat media generala a materiei: <br><br>";
    if(HTeachers.length > 0){
        for(var i = 0; i < HTeachers.length; i++){
            par.innerHTML += HTeachers[i].Nume + " " + HTeachers[i].Prenume + " - " + HTeachers[i].NumeGrupa + ", " + HTeachers[i].MaterieCurs + " - " + HTeachers[i].Medie + "<br>";
        }
    }
}

async function submitClick(value){
    var par = document.getElementById("varPar");
    par.innerHTML = "";
    var HStudents = await DataBaseQuery_Select(`{"query": "SELECT S.StudentID, S.Nume, S.Prenume, G.NumeGrupa, S.NumarTelefon, S.e_mail, COUNT(Cu.MaterieCurs) AS NrMateriiInrolate, AVG(Ca.Punctaj) AS MedieGenerala FROM (SELECT G1.NumeGrupa, AVG(Ca1.Punctaj) AS Medie FROM Grupe G1 LEFT JOIN Studenti S1 ON S1.GrupaID = G1.GrupaID JOIN Catalog Ca1 ON Ca1.StudentID = S1.StudentID GROUP BY G1.NumeGrupa) AS GM, Studenti S LEFT JOIN Grupe G ON S.GrupaID = G.GrupaID JOIN Catalog Ca ON Ca.StudentID = S.StudentID JOIN Cursuri Cu ON Cu.CursID = Ca.CursID GROUP BY S.StudentID, S.Nume, S.Prenume, G.NumeGrupa, S.NumarTelefon, S.e_mail, GM.NumeGrupa, GM.Medie HAVING GM.NumeGrupa = G.NumeGrupa AND AVG(Ca.Punctaj) > GM.Medie AND COUNT(Cu.MaterieCurs) >= '${value}';"}`);

    if(HStudents.length > 0){
        for(var i = 0; i < HStudents.length; i++){
            var table = document.createElement("table");
            table.setAttribute("class", "HStudentiTable");
            par.appendChild(table);
            var newTR = document.createElement("tr");
            table.appendChild(newTR);
            var newTH = document.createElement("th");
            newTH.innerHTML = "Nume si Prenume";
            newTR.appendChild(newTH);
            newTH = document.createElement("th");
            newTH.innerHTML = "Grupa";
            newTR.appendChild(newTH);
            newTH = document.createElement("th");
            newTH.innerHTML = "Date contact";
            newTR.appendChild(newTH);
            newTH = document.createElement("th");
            newTH.innerHTML = "Numar Discipline Alese";
            newTR.appendChild(newTH);
            newTH = document.createElement("th");
            newTH.innerHTML = "Media Generala";
            newTR.appendChild(newTH);
            var newTD;
            for(var i = 0; i < HStudents.length; i++){
                newTR = document.createElement("tr");
                table.appendChild(newTR);
                newTD = document.createElement("td");
                newTD.innerHTML = HStudents[i].Nume + " ";
                if(HStudents[i].Prenume != null){
                    newTD.innerHTML += HStudents[i].Prenume;
                }
                newTR.appendChild(newTD);
                newTD = document.createElement("td");
                newTD.innerHTML = HStudents[i].NumeGrupa;
                newTR.appendChild(newTD);
                newTD = document.createElement("td");
                newTD.innerHTML = HStudents[i].NumarTelefon + "<br>" + HStudents[i].e_mail;
                newTR.appendChild(newTD);
                newTD = document.createElement("td");
                newTD.innerHTML = HStudents[i].NrMateriiInrolate;
                newTR.appendChild(newTD);
                newTD = document.createElement("td");
                newTD.innerHTML = HStudents[i].MedieGenerala;
                newTR.appendChild(newTD);
            }
        }
    }
}