import { firebase } from '../tools/config.js'
import 'firebase/storage'

class Database {

    async getAllFiles(page) {
        var files = [];
        await firebase.database().ref(page).orderByChild("timestamp").once('value').then(async function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                files.push({
                    name: childSnapshot.val()["name"],
                    description: childSnapshot.val()["description"],
                    username: childSnapshot.val()["username"],
                    size: childSnapshot.val()["size"],
                    ref: childSnapshot.val()["ref"],
                    date: childSnapshot.val()["date"],
                    email: childSnapshot.val()["email"],
                    lastModified: childSnapshot.val()["lastModified"],
                })
            })
        })
        return files;
    }

    async add(page, files, email, uid, fileName, fileDescription) {
        var date = await this.setDate();
        for (var i = 0; i < files.length; i++) {
            await firebase.storage().ref(page).child(fileName + '_' + files[i].name).put(files[i])
            await firebase.database().ref(page + '/' + files[i].lastModified + uid).set({
                name: fileName || files[i].name,
                description: fileDescription || '',
                size: files[i].size,
                timestamp: (+ new Date) * -1,
                date: date,
                ref: fileName + '_' + files[i].name,
                email: email,
                lastModified: files[i].lastModified,
            }, async function (error) {
                if (error) {
                    // Upload failed
                } else {
                    // Upload success
                }
            })
        }
    }

    async erase(page, file, uid) {
        await firebase.storage().ref(page + '/' + file.ref).delete();
        await firebase.database().ref(page + '/' + file.lastModified + uid).remove();
        await this.getAllFiles(page)
    }

    async setDate() {
        const today = new Date();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = months[today.getMonth()];
        const day = today.getDate();
        const year = today.getFullYear();
        return `${month} ${day < 10 ? '0' + day : day}, ${year}`;
    }
}

let database = new Database;
export { database };