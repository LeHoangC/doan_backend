const cloudinary = require('../configs/cloudinary.config')

class uploadMediaService {
    // static async uploadImageFromUrl() {
    //     try {
    //         const urlImage =
    //             'https://cdn2.cellphones.com.vn/1200x400/https://cdn.sforum.vn/sforum/wp-content/uploads/2023/12/hinh-nen-vu-tru-72.jpg'
    //         const folderName = 'post/userId',
    //             newFileName = 'name file'

    //         const result = await cloudinary.uploader.upload(urlImage, {
    //             folder: folderName,
    //             public_id: newFileName,
    //         })

    //         return result
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    static async uploadImageFromLocal({ path, folderName }) {
        try {
            const result = await cloudinary.uploader.upload(path, {
                folder: folderName,
            })

            return result.secure_url
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = uploadMediaService
