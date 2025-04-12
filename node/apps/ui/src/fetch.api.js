import config from "@/config";

class FetchApi {
    constructor(abortController) {
        this.abortController = abortController;

        this.error = null
        this.isLoading = null;
    }

    async doRequest(url, method, body, headers = {}) {
        url = `${config.baseApiUrl}${url}`

        const isFormData = body instanceof FormData
        if (!isFormData) {
            headers["Accept"] = "application/json"
            headers["Content-Type"] = "application/json"
        }
        if (window.user) {
            headers["user_id"] = window.user.id
        }

        if (method.toLowerCase() === "get" && body) {
            url = `${url}?${new URLSearchParams(body)}`
            console.log("url")
            body = null
        } else if (!isFormData) {
            body = JSON.stringify(body)
        }

        // const token = tryGetAuthToken()

        // if(token) {
        //     headers["Authorization"] = `Bearer ${token}`
        // }

        const errorStack = new Error()
        try {
            this.isLoading = true

            const res = await fetch(url, {
                method: method.toUpperCase(),
                credentials: "include",
                headers,
                body,
                signal: this.abortController.signal,
            })
            if (res.status === 403) {
                sessionStorage.clear()
                localStorage.clear()
                window.location.href = "auth/login"
                return
            }
            if (res.ok) {
                if ((/json/).test(headers.Accept || "")) {
                    const json = await res.json()
                    // if(json['jwt-token']) {
                    //     trySetToken(json["jwt-token"])
                    // }

                    return json
                }
                return res
            }
            throw res
        } catch (e) {
            this.error = e

            if (e instanceof Response) {
                try {
                    if (e.status === 401) {
                        const json = await e.json();
                        e.message = json.message
                    } else {
                        e.message = e.statusText + " " + e.status
                    }
                } catch (e) {
                    console.log(e)
                }
            }

            if (e.status === 401) {
                sessionStorage.clear()
                localStorage.clear()
                window.location.href = "/login"
            }
            console.log("oi", e)
            errorStack.message = e.message
            throw errorStack;
        } finally {
            this.isLoading = false
        }
    }

}

export default function fetchApi(url, method, body, headers) {
    const abortController = new AbortController()
    const fetchApi = new FetchApi(abortController)
    return fetchApi.doRequest(url, method, body, headers)
}