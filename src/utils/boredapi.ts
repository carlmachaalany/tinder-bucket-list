
const API_URL = "http://www.boredapi.com/api/activity/";

export class BoredApi {

    public static getRandomEvent = async () => {
        const resp = await fetch(`${API_URL}`);
        if (!resp.ok) throw new Error(resp.statusText);
        const data = await resp.json();
        return data;
    }
    
}