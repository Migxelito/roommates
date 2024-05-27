const http = require('http');
const url = require('url');
const fs = require('fs');
const fsPromise = require('fs/promises');
const { createRoomie } = require('./roomies.js');
const {v4: uuidv4}= require ('uuid')

//const enviar = require('./mailer');

const PORT = 3000;

const server = http.createServer(async (req, res) => {

    if (req.url == "/" && req.method == 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html ; charset-utf8' });
        try {
            const dashboard = await fsPromise.readFile('www/index.html');
            res.write(dashboard);
            res.end();
        } catch (error) {
            console.log('Error al cargar el recurso', error);
        }
    }

    else if (req.url == "/roommate" && req.method == 'POST' ) {
        try {
            const rommie = await createRoomie()
            if (rommie) {
                res.end(JSON.stringify(rommie))
            }
        } catch (error) {
            console.log('error al obtener roomie', error)
        }

    }

    else if (req.url =="/roommates" && req.method == 'GET') {
        res.setHeader("Content-Type", "application/json")

        try {
            const roommies = await fsPromise.readFile("roommates.json", { encoding: "utf-8" })

            console.log(roommies)
            if (roommies) {
                res.end(roommies)
            }
        } catch (error) {
            console.log('error al obtener roomie', error)
        }
    }

    else if (req.url =="/gastos" && req.method == 'GET') {
        res.setHeader("Content-Type", "application/json")

        try {
            const gastosRoomies = await fsPromise.readFile("gastos.json", { encoding: "utf-8" })
            console.log(gastosRoomies)
            if (gastosRoomies) {
                res.end(gastosRoomies)
            }
        } catch (error) {
            console.log('error al obtener los gastos', error)
        }
    } 
    
    else if ((req.url.startsWith("/gasto")) && (req.method == "POST")) {
        res.setHeader("Content-Type", "application/json")
        let body = '';
        req.on("data", (chunck) => {
            body += chunck;
        })
        req.on('end', async () => {
            let datosgasto = JSON.parse(body);
            let gasto = {
                id: uuidv4().slice(30),
                roommate: datosgasto.roommate,
                descripcion: datosgasto.descripcion,
                monto: datosgasto.monto
            }
         
            const gastos = await fsPromise.readFile('gastos.json');
            console.log(gastos)
            const gastosJson = JSON.parse(gastos)
            gastosJson.gastos.push(gasto);
            await fsPromise.writeFile("gastos.json", JSON.stringify(gastosJson));
            return gasto
            res.end()
            
        })

    }

    else if (req.url.startsWith("/gasto") && req.method == "PUT") {
        try {
            res.setHeader("Content-Type", "application/json")
            let body = '';
            req.on("data", (chunck) => {
                body += chunck;
            });
            let gastos = JSON.parse(body);
            body.id = id;
            req.on("end", async () => {
                let body = JSON.parse(Buffer.concat(payloadBuffer));
                gastos = gastos.map((b) => {
                    if (b.id == body.id) {
                        return body;
                    }
                    return b;
                });
                await fsPromise.writeFile("gastos.json", JSON.stringify({ gastos }));
                res.writeHead(201).end();
            });
        } catch (error) {
            console.log('error :>> ', error);
            res.writeHead(500, { 'Content-Type': 'application/json' }).end(JSON.stringify({ status: "Error" }));
        }
    }

    else if (req.url.startsWith('/gasto') && req.method == 'DELETE') {
        try {
            const { id } = url.parse(req.url, true).query;
            console.log(id);
            gastos = gastos.filter((b) => b.id !== id);
            await fsPromise.writeFile("gastos.json", JSON.stringify({ gastos }));
            res.writeHead(201).end(); 
        } catch (error) {
            console.log('error :>> ', error);
            res.writeHead(500, { 'Content-Type': 'application/json' }).end(JSON.stringify({ status: "Error" }));
        }
    } else {
        res.writeHead(404).end("Recurso no encontrado");
    }

})


    

    .listen(PORT, () => console.log(`Iniciando en puerto ${PORT}`));