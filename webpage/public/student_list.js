async function DataBaseQuery(){
    const F = "F";
    const nume = 'Popescu'
    const response = await fetch("http://localhost:5500/server", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
        body: `{"query": "SELECT S.StudentID, S.Nume, S.Prenume, G.NumeGrupa, S.NumarTelefon, S.e_mail, Cu.MaterieCurs FROM Studenti S LEFT JOIN Grupe G ON S.GrupaID = G.GrupaID JOIN Catalog Ca ON Ca.StudentID = S.StudentID JOIN Cursuri Cu ON Cu.CursID = Ca.CursID ORDER BY G.NumeGrupa, S.Nume, Cu.CursID;"}`,
    })
    const text = await response.json();
    //console.log(text[0].<numeColoana>);
    var MBody = document.getElementById("mainBody");
    if(text.length > 0){
        var table = document.createElement("table");
        table.setAttribute("class", "StudentiTable");
        MBody.appendChild(table);
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
        newTH.innerHTML = "Discipline Alese";
        newTR.appendChild(newTH);
        var newTD;
        for(var i = 0; i < text.length; i++){
            newTR = document.createElement("tr");
            table.appendChild(newTR);
            newTD = document.createElement("td");
            newTD.innerHTML = text[i].Nume + " ";
            if(text[i].Prenume != null){
                newTD.innerHTML += text[i].Prenume;
            }
            newTR.appendChild(newTD);
            newTD = document.createElement("td");
            newTD.innerHTML = text[i].NumeGrupa;
            newTR.appendChild(newTD);
            newTD = document.createElement("td");
            newTD.innerHTML = text[i].NumarTelefon + "<br>" + text[i].e_mail;
            newTR.appendChild(newTD);
            newTD = document.createElement("td");
            newTD.innerHTML = text[i].MaterieCurs;
            while((i+1 < text.length)&&(text[i].StudentID == text[i+1].StudentID)){
                i++;
                newTD.innerHTML += "<br>" + text[i].MaterieCurs;
            }
            newTR.appendChild(newTD);
        }
    }else{
        MBody.innerHTML = "Eroare: Query Gresit!"
    }
}

window.addEventListener("load", (event) => {
    console.log("mornin'");
    DataBaseQuery().then();
})