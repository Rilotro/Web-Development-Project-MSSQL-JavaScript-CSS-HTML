var Profesor={
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
    DataAngajarii:"",
    Salariu:0
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
        Profesor.Nume = form.Nume.value
        console.log(Profesor.Nume);
    }else{
        document.getElementById("notes").innerHTML += `<br><font color="red">Unele spatii importante nu au fost completate</font>`
        return;
    }

    if(form.Prenume.value.length > 0){
        Profesor.Prenume = form.Prenume.value
        console.log(Profesor.Prenume);
    }else{
        Profesor.Prenume = 'NULL';
    }

    if(form.NumarTel.value.length > 0){
        Profesor.NumarTelefon = form.NumarTel.value
        console.log(Profesor.NumarTelefon);
    }else{
        Profesor.NumarTelefon = 'NULL';
    }

    if(form.e_mail.value.length > 0){
        Profesor.e_mail = form.e_mail.value
        console.log(Profesor.e_mail);
    }else{
        Profesor.e_mail = 'NULL';
    }

    if((form.Parola.value.length > 0)&&(form.REParola.value.length > 0)){
        if(form.Parola.value == form.REParola.value){
            Profesor.Parola = form.Parola.value;
            console.log(Profesor.Parola);
        }else{
            document.getElementById("notes").innerHTML += `<br><font color="red">Parolele nu se potrivesc!</font>`;
            return;
        }
    }else{
        document.getElementById("notes").innerHTML += `<br><font color="red">Unele spatii importante nu au fost completate</font>`;
        return;
    }

    if(form.CNP.value.length > 0){
        Profesor.CNP = form.CNP.value
        console.log(Profesor.CNP);
    }else{
        Profesor.CNP = 'NULL';
    }

    if(form.Strada.value.length > 0){
        Profesor.Strada = form.Strada.value
        console.log(Profesor.Strada);
    }else{
        document.getElementById("notes").innerHTML += `<br><font color="red">Unele spatii importante nu au fost completate</font>`
        return;
    }

    if(form.Numar.value.length > 0){
        Profesor.Numar = form.Numar.value
        console.log(Profesor.Numar);
    }else{
        document.getElementById("notes").innerHTML += `<br><font color="red">Unele spatii importante nu au fost completate</font>`
        return;
    }

    if(form.Oras.value.length > 0){
        Profesor.Oras = form.Oras.value
        console.log(Profesor.Oras);
    }else{
        document.getElementById("notes").innerHTML += `<br><font color="red">Unele spatii importante nu au fost completate</font>`
        return;
    }

    if(form.Judet.value.length > 0){
        Profesor.Judet = form.Judet.value
        console.log(Profesor.Judet);
    }else{
        document.getElementById("notes").innerHTML += `<br><font color="red">Unele spatii importante nu au fost completate</font>`
        return;
    }

    if(form.Tara.value.length > 0){
        Profesor.Tara = form.Tara.value
        console.log(Profesor.Tara);
    }else{
        document.getElementById("notes").innerHTML += `<br><font color="red">Unele spatii importante nu au fost completate</font>`
        return;
    }

    if(form.Sex.value.length > 0){
        Profesor.Sex = form.Sex.value
        console.log(Profesor.Sex);
    }

    Profesor.DataNasterii = form.an.value + "-" + form.luna.value + "-" + form.zi.value;
    console.log(Profesor.DataNasterii);

    var dataAzi = new Date();
    Profesor.DataAngajarii = dataAzi.getFullYear() + "-" + dataAzi.getMonth() + "-";
    if(dataAzi.getDay() < 10){
        Profesor.DataAngajarii += "0" + dataAzi.getDay();
    }else{
        Profesor.DataAngajarii += dataAzi.getDay();
    }
    console.log(Profesor.DataAngajarii);

    Profesor.Salariu = 100;

    if(form.materieM.checked == 1){
        Profesor.Salariu += 50;
    }
    if(form.materieF.checked == 1){
        Profesor.Salariu += 50;
    }
    if(form.materieC.checked == 1){
        Profesor.Salariu += 50;
    }
    if(form.materieI.checked == 1){
        Profesor.Salariu += 50;
    }
    if(form.materieA.checked == 1){
        Profesor.Salariu += 50;
    }
    if(Profesor.Salariu == 100){
        document.getElementById("notes").innerHTML += `<br><font color="red">Nu puteti primi bani pe degeaba, alegeti cel putin o materie de predat!</font>`
        return;
    }
    console.log(Profesor.Salariu);

    const res = await DataBaseQuery_Insert(`{"query": "INSERT INTO Profesori VALUES ('${Profesor.Nume}', '${Profesor.Prenume}', '${Profesor.Parola}', '${Profesor.NumarTelefon}', '${Profesor.e_mail}', ${Profesor.CNP}, '${Profesor.Strada}', ${Profesor.Numar}, '${Profesor.Oras}', '${Profesor.Judet}', '${Profesor.Tara}', '${Profesor.Sex}', '${Profesor.DataNasterii}', '${Profesor.DataAngajarii}', ${Profesor.Salariu});"}`);

    if(res == 'Succes!'){
        var ProfID = await DataBaseQuery_Select(`{"query": "SELECT TOP 1 ProfesorID FROM Profesori ORDER BY ProfesorID DESC;"}`);
        ProfID = ProfID[0].ProfesorID;
        if(form.materieM.checked == 1){
            await DataBaseQuery_Insert(`{"query": "INSERT INTO ProfesorCurs VALUES (${1}, ${ProfID});"}`);
            console.log("mate");
        }
        if(form.materieF.checked == 1){
            await DataBaseQuery_Insert(`{"query": "INSERT INTO ProfesorCurs VALUES (4, ${ProfID});"}`);
            console.log("fizica");
        }
        if(form.materieC.checked == 1){
            await DataBaseQuery_Insert(`{"query": "INSERT INTO ProfesorCurs VALUES (5, ${ProfID});"}`);
            console.log("chimie");
        }
        if(form.materieI.checked == 1){
            await DataBaseQuery_Insert(`{"query": "INSERT INTO ProfesorCurs VALUES (9, ${ProfID});"}`);
            console.log("info");
        }
        if(form.materieA.checked == 1){
            await DataBaseQuery_Insert(`{"query": "INSERT INTO ProfesorCurs VALUES (6, ${ProfID});"}`);
            console.log("oh no");
        }

        window.open("./welcome.html", "_self");
    }
}