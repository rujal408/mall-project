import { firebaseFile } from "./config"

export const getFileUrl = async (data) => {
    
    const urls = await Promise.all(data.map(async (x) => {
        if (x.hasOwnProperty("url")) {
            return { ...x }
        } else {
            await firebaseFile.ref(x.id).put(x.file)
            const url = await firebaseFile.ref(x.id).getDownloadURL()
            return { url, image_name: x.image_name, id: x.id }
        }

    }))

    return urls
}

export const deleteFile = (id) => {
    const storageRef = firebaseFile.ref(id)
    storageRef.delete().then(() => {
        console.log("File Deleted Successfully");
    }).catch(err => {
        console.log("Error Deleting File");
    })

}