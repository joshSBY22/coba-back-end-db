const express = require("express");
const router = express.Router();
const sequelize = require("../config/sequelize");
const { QueryTypes } = require("sequelize");

router.get("/test", function(req, res){
    return res.status(200).send("Testing");
});

/*
    Syntax untuk melakukan query dengan MySQL
    await <Sequelize object>.query("<string query>", {
        type: QueryTypes.<tipe_query>
        replacements: {} / []
    })

    Bagian string query akan diisi perintah query MySQL
    Contoh: "SELECT * FROM users"

    Perintah pada string query juga bisa menerima parameter dengan memberi "?" 
    pada query string. 
    Contoh:
    "select * from users where username = ?"
    Kemudian untuk mengisi parameternya dilakukan dengan cara mengisi replacements dengan
    ["test"]


    Selain dengan "?", parameter pada query string juga dapat diterima dengan format :<nama_argumen>
    Contoh: 
    "insert into users values (:id_user, :username, :age)"
    Kemudian cara mengirim nilainya dengan mengisi replacements dengan {
        id_user: "US001",
        username: "test",
        age: 20
    }
    Value pada replacements akan menggantikan parameter dengan nama key sesuai dengan yang ada pada query string.


    Bind Parameter

    Bind Parameter mirip dengan replacements. Perbedaannya adalah nilai replacement yang diberikan dimasukkan ke dalam query sebelum dikirim ke database sedangkan bind parameter dikirimkan diluar querynya.
    Bind parameter bisa dilakukan dengan menggunakan "$"
    Contoh: 
    await sequelize.query("SELECT * FROM users WHERE id = $id", {
        bind: {id: req.params.id},
        type: QueryTypes.SELECT
    })

*/

//Karena method query sequelize bersifat asynchronous maka perlu diawali keyword await supaya program menunggu hasil query sebelum melanjutkan program
//Ketika menggunakan keyword await dalam sebuah function, function tersebut harus async untuk mendukung penggunaan await

//Endpoint add user
router.post("/", async function(req, res){
    let {nama, umur, email} = req.body;

    if(nama && umur && email){
        // let result = await sequelize.query("INSERT INTO users (nama, umur, email, saldo) VALUES (:nama, :umur, :email, :saldo)", {
        //     replacements: {
        //         umur: umur,
        //         nama: nama,
        //         saldo: 0,       
        //         email: email,
        //     },
        //     type: QueryTypes.INSERT
        // });

        //Dengan bind
        // let result = await sequelize.query("INSERT INTO users (nama, umur, email, saldo) VALUES ($nama, $umur, $email, $saldo)", {
        //     bind: {
        //         umur: umur,
        //         nama: nama,
        //         saldo: 0,       
        //         email: email,
        //     },
        //     type: QueryTypes.INSERT
        // });

        //Alternatif dengan "?"
        // let result = await sequelize.query("INSERT INTO users (nama, umur, email, saldo) VALUES (?,?,?,?)", {
        //     replacements: [//urutan parameter yang diberikan harus urut
        //         nama, 
        //         umur, 
        //         email, 
        //         0
        //     ],
        //     type: QueryTypes.INSERT
        // });

        return res.status(201).send({message: "User added successfully"});
    }else{
        return res.status(400).send({message: "Ada Field Kosong"});
    }
});

//Endpoint get all user
router.get("/", async function(req, res){
    let result = await sequelize.query("SELECT * FROM users", {
        type: QueryTypes.SELECT 
    })
    
    return res.status(200).send(result);
});

//Endpoint get user by id
router.get("/:id", async function(req, res){
    let id = req.params.id;

    let user = await sequelize.query("SELECT * FROM users WHERE id = ?",{
        replacements: [id],
        type: QueryTypes.SELECT
    })

    //Jika menggunakan parameter bind
    // user = await sequelize.query("SELECT * FROM users WHERE id = $id", {
    //     bind: {id: req.params.id},
    //     type: QueryTypes.SELECT
    // })
    // console.log(user);
    if(user.length > 0){
        return res.status(200).send(user[0]);
    }else{
        return res.status(404).send({message: "User tidak ditemukan"});
    }

});

//Endpoint delete user
router.delete("/:id", async function(req, res){
    let id = req.params.id;

    let user = await sequelize.query("SELECT * FROM users WHERE id = ?",{
        replacements: [id],
        type: QueryTypes.SELECT
    })

    if(user.length > 0){
        await sequelize.query("DELETE FROM users WHERE id = ?", {
            replacements: [id],
            type: QueryTypes.DELETE
        });

        return res.status(200).send({
            message: "User deleted successfully",
            user: user[0] //menampilkan data user yang baru saja dihapus
        });
    }else{
        return res.status(404).send({message: "User tidak ditemukan"});
    }

});

//Endpoint top up saldo user
router.put("/topup/:id", async function(req, res){
    let nominal = req.body.nominal;
    let id = req.params.id;

    let user = await sequelize.query("SELECT * FROM users WHERE id = ?",{
        replacements: [id],
        type: QueryTypes.SELECT
    })

    // console.log(user);
    // console.log(user[0]);

    if(user.length > 0){//jika user dengan id tersebut ditemukan
        if(isNaN(nominal)){
            return res.status(400).send({message: "Nominal harus angka!"});
        }else{
            if(nominal <= 0){
                return res.status(400).send({message: "Nominal top up harus lebih besar dari 0"});
            }else{
                let newSaldo = user[0].saldo + parseInt(nominal);
                await sequelize.query("UPDATE users SET saldo = :newSaldo WHERE id = :id", {
                    replacements: {
                        newSaldo: newSaldo,
                        id: id
                    }
                })
    
                return res.status(200).send({
                    message: "Top up sebesar "+nominal+" berhasil",
                    id: id,
                    nama: user[0].nama,
                    saldo: newSaldo
                });
            }
        }

    }else{
        return res.status(404).send({message: "User tidak ditemukan"});
    }
});


module.exports = router;