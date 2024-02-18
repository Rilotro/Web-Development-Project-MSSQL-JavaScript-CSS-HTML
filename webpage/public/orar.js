async function DataBaseQuery(){
    const Zi = ["LUNI", "MARTI", "MIERCURI", "JOI", "VINERI"];
    const response = await fetch("http://localhost:5500/server", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
        body: `{"query": "SELECT  G.NumeGrupa, O.ZiProgram, O.OraProgram, Cu.MaterieCurs, Cu.DurataOre, P.Nume, P.Prenume FROM Grupe G LEFT JOIN Orar O ON G.GrupaID = O.GrupaID JOIN Cursuri Cu ON Cu.CursID = O.CursID JOIN Profesori P ON O.ProfesorCursantID = P.ProfesorID ORDER BY G.NumeGrupa, Cu.CursID;"}`,
    })
    const text = await response.json();
    //console.log(text[0].<numeColoana>);
    var MBody = document.getElementById("mainBody");
    if(text.length > 0){
        var table = document.createElement("table");
        table.setAttribute("class", "OrarTable");
        table.setAttribute("allign", "center");
        MBody.appendChild(table);

        var newTR = document.createElement("tr");
        table.appendChild(newTR);

        var newTH = document.createElement("th");
        newTH.innerHTML = "Ziua";
        newTR.appendChild(newTH);

        newTH = document.createElement("th");
        newTH.innerHTML = "Ora";
        newTR.appendChild(newTH);

        var grupe = [];
        for(var i = 0; i < text.length; i++){
            newTH = document.createElement("th");
            newTH.innerHTML = text[i].NumeGrupa;
            grupe.push(text[i].NumeGrupa);
            newTR.appendChild(newTH);
            while((i+1 < text.length)&&(text[i].NumeGrupa == text[i+1].NumeGrupa)){
                i++;
            }
        }

        var newTD;
        var subTR;
        var subTD;
        for(var i = 0; i < 5; i++){
            newTR = document.createElement("tr");
            table.appendChild(newTR);

            newTD = document.createElement("td");
            newTD.setAttribute("rowspan", "14");
            newTD.innerHTML = Zi[i];
            newTR.appendChild(newTD);

            
            for(var j = 7; j < 21; j++){
                newTD = document.createElement("td");
                newTD.innerHTML = j+":00";
                newTR.appendChild(newTD);

                for(k = 0; k < grupe.length; k++){
                    newTD = document.createElement("td");
                    for(var l = 0; l < text.length; l++){
                        if((text[l].NumeGrupa == grupe[k])&&(text[l].ZiProgram.includes(Zi[i]))&&(text[l].OraProgram == j)){
                            newTD.setAttribute("rowspan", text[l].DurataOre);
                            //j += text[l].DurataOre-1;
                            newTD.innerHTML = text[l].MaterieCurs + "<br>" + text[l].Nume + " " + text[l].Prenume;
                        }
                    }
                    newTR.appendChild(newTD);
                }

                if(j+1 < 21){
                    newTR = document.createElement("tr");
                    table.appendChild(newTR);
                }
            }
            
        }
        
    }else{
        MBody.innerHTML = "Eroare: Query Gresit!"
    }
}

window.addEventListener("load", (event) => {
    console.log("mornin'");
    DataBaseQuery().then();
})