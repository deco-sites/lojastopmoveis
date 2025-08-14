import { Handlers } from "$fresh/server.ts";
import { getCookies } from "std/http/cookie.ts";

const URL_SEND_REVIEW = "https://topmoveis.myvtex.com";

export const handler: Handlers = {
    POST: async (req) => {
        const data = await req.json();
        const cookies = getCookies(req.headers);
        const authCookie = cookies["VtexIdclientAutCookie"] || cookies["VtexIdclientAutCookie_topmoveis"];

        console.log("authCookie: ", authCookie)
        console.log("data: ", data)

        const response = await fetch(`${URL_SEND_REVIEW}/reviews-and-ratings/api/review`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "VtexIdclientAutCookie": authCookie,
            },
            body: JSON.stringify(data),
        });

        const headers = new Headers(response.headers);

        headers.set("access-control-allow-origin", "*");

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers,
        });
    }
}