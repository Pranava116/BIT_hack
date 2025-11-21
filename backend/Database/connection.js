import mongoose from 'mongoose'


export default function connectMongoDB() {

const MONGODB_URI=process.env.MONGODB_URI

    return mongoose.connect(MONGODB_URI)
        .then(
            () => {
                console.log('Connection to MONGODB server successfull')
            }
        )
        .catch(
            (error) => {
                console.log(`Error connecting to MONGODB server: ${error.message}`);
            }
        )

}