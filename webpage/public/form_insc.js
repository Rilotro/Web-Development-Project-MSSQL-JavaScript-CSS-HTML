var Student={
    Grupa: 0,
    Nume:"",
    Prenume:"",
    Parola:"",
    NumarTelefon:"",
    e_mail:"",
    CNP:0,
    Strada:"",
    Numar:0,
    Oras:"",
    Judet:"",
    Tara:"",
    Sex:"",
    DataNasterii:"",
    AnIncepereCursuri:"",
}

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
    console.log("mornin'");
    var select = document.getElementById("an");
    var opt;
    for(var i = 1922; i < 1995; i++){
        opt = document.createElement("option");
        opt.setAttribute("value", i);
        opt.innerHTML = i;
        select.appendChild(opt);
    }
    select = document.getElementById("zi");
    for(var i = 1; i < 32; i++){
        opt = document.createElement("option");
        if(i < 10){
            opt.setAttribute("value", "0"+i);
        }else{
            opt.setAttribute("value", i);
        }
        opt.innerHTML = i;
        select.appendChild(opt);
    }

})

async function submitTest(form){
    if(form.Nume.value.length > 0){
        Student.Nume = form.Nume.value
        console.log(Student.Nume);
    }else{
        document.getElementById("notes").innerHTML += `<br><font color="red">Unele spatii importante nu au fost completate</font>`
        return;
    }

    if(form.Prenume.value.length > 0){
        Student.Prenume = form.Prenume.value
        console.log(Student.Prenume);
    }else{
        Student.Prenume = 'NULL';
    }

    if(form.NumarTel.value.length > 0){
        Student.NumarTelefon = form.NumarTel.value
        console.log(Student.NumarTelefon);
    }else{
        Student.NumarTelefon = 'NULL';
    }

    if(form.e_mail.value.length > 0){
        Student.e_mail = form.e_mail.value
        console.log(Student.e_mail);
    }else{
        Student.e_mail = 'NULL';
    }

    if((form.Parola.value.length > 0)&&(form.REParola.value.length > 0)){
        if(form.Parola.value == form.REParola.value){
            Student.Parola = form.Parola.value;
            console.log(Student.Parola);
        }else{
            document.getElementById("notes").innerHTML += `<br><font color="red">Parolele nu se potrivesc!</font>`;
            return;
        }
    }else{
        document.getElementById("notes").innerHTML += `<br><font color="red">Unele spatii importante nu au fost completate</font>`;
        return;
    }

    if(form.CNP.value.length > 0){
        Student.CNP = form.CNP.value
        console.log(Student.CNP);
    }else{
        Student.CNP = 'NULL';
    }

    if(form.Strada.value.length > 0){
        Student.Strada = form.Strada.value
        console.log(Student.Strada);
    }else{
        document.getElementById("notes").innerHTML += `<br><font color="red">Unele spatii importante nu au fost completate</font>`
        return;
    }

    if(form.Numar.value.length > 0){
        Student.Numar = form.Numar.value
        console.log(Student.Numar);
    }else{
        document.getElementById("notes").innerHTML += `<br><font color="red">Unele spatii importante nu au fost completate</font>`
        return;
    }

    if(form.Oras.value.length > 0){
        Student.Oras = form.Oras.value
        console.log(Student.Oras);
    }else{
        document.getElementById("notes").innerHTML += `<br><font color="red">Unele spatii importante nu au fost completate</font>`
        return;
    }

    if(form.Judet.value.length > 0){
        Student.Judet = form.Judet.value
        console.log(Student.Judet);
    }else{
        document.getElementById("notes").innerHTML += `<br><font color="red">Unele spatii importante nu au fost completate</font>`
        return;
    }

    if(form.Tara.value.length > 0){
        Student.Tara = form.Tara.value
        console.log(Student.Tara);
    }else{
        document.getElementById("notes").innerHTML += `<br><font color="red">Unele spatii importante nu au fost completate</font>`
        return;
    }

    if(form.Sex.value.length > 0){
        Student.Sex = form.Sex.value
        console.log(Student.Sex);
    }

    Student.DataNasterii = form.an.value + "-" + form.luna.value + "-" + form.zi.value;
    console.log(Student.DataNasterii);

    var dataAzi = new Date();
    Student.AnIncepereCursuri = dataAzi.getFullYear();
    console.log(Student.AnIncepereCursuri);

    const grupe = await DataBaseQuery_Select(`{"query": "SELECT G.GrupaID, COUNT(S.StudentID) AS NrStudenti FROM Grupe G LEFT JOIN Studenti S ON S.GrupaID = G.GrupaID GROUP BY G.GrupaID, G.NumeGrupa;"}`);
    for(var i = 0; i < grupe.length; i++){
        if(grupe[i].NrStudenti < 25){
            Student.Grupa = grupe[i].GrupaID;
        }
    }

    const res = await DataBaseQuery_Insert(`{"query": "INSERT INTO Studenti VALUES (${Student.Grupa}, '${Student.Nume}', '${Student.Prenume}', '${Student.Parola}', '${Student.NumarTelefon}', '${Student.e_mail}', ${Student.CNP}, '${Student.Strada}', ${Student.Numar}, '${Student.Oras}', '${Student.Judet}', '${Student.Tara}', '${Student.Sex}', '${Student.DataNasterii}', '${Student.AnIncepereCursuri}');"}`);

    if(res == 'Succes!'){
        var StudID = await DataBaseQuery_Select(`{"query": "SELECT TOP 1 StudentID FROM Studenti ORDER BY StudentID DESC;"}`);
        StudID = StudID[0].StudentID;
        if(form.materieM.checked == 1){
            await DataBaseQuery_Insert(`{"query": "INSERT INTO Catalog VALUES (1, ${StudID}, 0);"}`);
            console.log("mate");
        }
        if(form.materieF.checked == 1){
            await DataBaseQuery_Insert(`{"query": "INSERT INTO Catalog VALUES (4, ${StudID}, 0);"}`);
            console.log("fizica");
        }
        if(form.materieC.checked == 1){
            await DataBaseQuery_Insert(`{"query": "INSERT INTO Catalog VALUES (5, ${StudID}, NULL);"}`);
            console.log("chimie");
        }
        if(form.materieI.checked == 1){
            await DataBaseQuery_Insert(`{"query": "INSERT INTO Catalog VALUES (9, ${StudID}, 0);"}`);
            console.log("info");
        }
        if(form.materieA.checked == 1){
            await DataBaseQuery_Insert(`{"query": "INSERT INTO Catalog VALUES (6, ${StudID}, 0);"}`);
            console.log("oh no");
        }

        window.open("./welcome.html", "_self");
    }
}