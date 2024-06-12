const express = require("express");
const app = express();
const db = require("./config/sequelize");
const userRouter = require("./routes/user");

app.use(express.urlencoded({extended: true}));

/*
    Langkah-langkah menjalankan api
    - Lakukan npm install untuk menginstall library yang akan digunakan 
    - Sebelum menjalankan file index.js pastikan service Apache dan MySQL di xampp sudah menyala
    - Kemudian import file sql menggunakan phpMyAdmin
    - Setelah berhasil mengimport database, jalankan index.js
*/


app.use("/api/user", userRouter);


const port = 5001;
const init = async () => { 
    console.log("Testing connection to database");
    try {
        await db.authenticate(); 
        console.log("Database Successfully connected!");
        app.listen(port, function(){
            console.log(`Application is running at http://localhost:${port}`);
        })
    } catch (error) { 
        console.log(error);
    }
}

init()

