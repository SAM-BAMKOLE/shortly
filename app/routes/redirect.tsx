import {ClientLoaderFunctionArgs} from "react-router"

export async function clientLoader({ request}: ClientLoaderFunctionArgs) {
    const getIp = await fetch("https://api.ipify.org/?format=json");
    const ipData = await getIp.json();
    const ipAddress = ipData.ip; 

    console.log(ipData)

    const redirect = await fetch(`${import.meta.env.VITE_BASE_URL}/redirect/${ipAddress}`)
}

export default function Redirect() {
    return <></>
}