import mongoose from 'mongoose'

const MONGODB_URI=process.env.MONGODB_URI

export default function connectMongoDB() {

    return mongoose.connect(MONGODB_URI)
        .then(
            () => {
                console.log('Connection to MONGODB server successfull')
            }
        )
        .catch(
            (error) => {
                console.log("Error while Connecting to MONGODB server")
            }
        )

}