class Certification {
    #apiUrl = '';
    #clientId = '';
    #clientSecret = '';

    constructor({ apiUrl, clientId, clientSecret }) {
        this.#apiUrl = apiUrl;
        this.#clientId = clientId;
        this.#clientSecret = clientSecret;
    }

    async getUrls(apiUrl) {
        try {
            const data = await fetch(apiUrl);
            const response = await data.json();
            return {
                oauth: response.urls['oauth'],
                api: response.urls['dataManagementApi'],
                invalid: false
            }
        } catch (e) {
            return {
                oauth: '',
                api: '',
                invalid: true
            }
        }
    }

    async getAuthToken(authUrl) {
        const grant_type = 'client_credentials';
        const body = `client_id=${this.#clientId}&client_secret=${this.#clientSecret}&grant_type=${grant_type}`
        try {
            const data = await fetch(authUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'accept': '*/*'
                },
                body: body
            });

            return await data.json();
        } catch (e) {
            return {
                access_token: '',
                expires_in: 0,
                token_type: '',
                error: true
            }
        }
    }

    async getCount(apiUrl, resource, token) {
        const offset = '?offset=0&limit=1&totalCount=true';
        const url = `${apiUrl}${resource.endpoint}${offset}`;
        const data = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*',
                'Use-Snapshot': 'false',
                'Authorization': `Bearer ${token}`
            }
        });

        const headers = await data.headers;

        const totalItems = parseInt(headers.get('total-count'));
        return { ...resource, total: totalItems };
    }
}
