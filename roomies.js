const axios = require('axios');
const fsPromise = require ('fs/promises')
const {v4: uuidv4}= require ('uuid')


const createRoomie = async () => {

    try {
        const { data } = await axios.get('https://randomuser.me/api');
        const rommieData = data.results[0];
        let { first, last } = rommieData.name
        let roomie = {
            nombre: `${first} ${last}`,
            id: uuidv4().slice(30),
            correo: rommieData.email,
            debe:'',
            recibe:''
        }
        const roomies = await fsPromise.readFile('roommates.json');
        const dataJson = JSON.parse(roomies)
        dataJson.roommates.push(roomie);

        await fsPromise.writeFile("roommates.json",JSON.stringify(dataJson));
        return roomie

    } catch (error) {
        console.log('error createroomie', error)
    }

}



module.exports = {
    createRoomie
}