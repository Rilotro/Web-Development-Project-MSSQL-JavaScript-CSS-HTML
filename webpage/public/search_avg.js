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

async function submitTest(form){
    var body = document.getElementById("mainBody");
    var par = document.createElement("p");

    body.appendChild(par);

    var medie = await DataBaseQuery_Select(`{"query": "SELECT S.StudentID, AVG(Ca.Punctaj) AS Medie FROM Studenti S LEFT JOIN Catalog Ca ON S.StudentID = Ca.StudentID WHERE S.Nume = '${form.Nume.value}' AND S.Prenume = '${form.Prenume.value}' GROUP BY S.StudentID ORDER BY AVG(Ca.Punctaj)"}`)

    par.innerHTML = "Media Studentului cautat: " + medie[0].Medie;
}