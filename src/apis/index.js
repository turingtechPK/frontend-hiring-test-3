import { ENDPOINTS } from "./endpoints";
import axios from "axios";

const serverURL = process.env.REACT_APP_API_URL

const getRequest = async (endPoint) => {
    try {
        const data = await axios.get(`${serverURL}${endPoint}`)
        console.log(data)
        return data
    } catch (error) {
        console.log(error)
        return error
    }
}