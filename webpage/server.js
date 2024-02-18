const express = require('express');
const app = express();
const mssql = require("mssql");
const sql = require("mssql/msnodesqlv8");

var config ={
    server: "DESKTOP-TS3B83R\\SQLEXPRESS",
    database: "Cursuri_Online",
    driver: "msnodesqlv8",
    options:{
        trustedConnection: true
    }
}

const pool = new sql.ConnectionPool(config);

async function Select_Query(q){
    var returnRec = "blank";
    try{
        await pool.connect();
        let result = await pool.request().query(q);
        console.log("result.recordset");
        return result.recordset;
    }catch(err){
        return err;
    }finally{
        pool.close();
    }
}

app.use(express.static('public'))

app.use(express.json())

app.post('/server', async function(req, res){
    const q = req.body.query;
    console.log(q);
    var quaery = await Select_Query(q);
    if((q.includes("INSERT"))&&(quaery == null)){
        quaery = "Succes!";
    }
    console.log(quaery);
    return res.status(200).send(quaery);
})

app.get('/api', function (req, res) { return res.status(200).send("bla");
})

let server = app.listen(5500, function () {
    console.log('Server is listening at port 5500...');
});


