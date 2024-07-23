const tokenRequestData = {
    url: 'https://api.ed-fi.org/v7.2/api',
    grant_type: 'client_credentials',
    client_id: 'RvcohKz9zHI4',
    client_secret: 'E1iEFusaNf81xzCxwHfbolkC'
}

const htmlHelper = new HtmlHelper();
htmlHelper.setDefaultValues(tokenRequestData);
const { button} = htmlHelper.getControls();

button.addEventListener('click', async () => {

    const { apiUrlElement, clientIdElement, clientSecretElement } = htmlHelper.getControls();
    const controls = {
        apiUrl : apiUrlElement.value,
        clientId : clientIdElement.value,
        clientSecret : clientSecretElement.value,
    };
    const certification = new Certification(controls);
    const { oauth, api, invalid } = await certification.getUrls(controls.apiUrl);
    if(invalid) {
        htmlHelper.showApiUrlError();
        throw new Error('invalid api url');
    }
    htmlHelper.hideApiUrlError();


    button.classList.add('is-loading');
    const { access_token, expires_in, token_type, error } = await certification.getAuthToken(oauth);
    if(error) {
        button.classList.remove('is-loading');
        htmlHelper.showLoginError();
        throw new Error('invalid authentication');
    }
    htmlHelper.hideLoginError();

    const packetSize = 5;
    const bunches = endpoints.length/packetSize;

    // let results = [];

    let processedCount = 0;

    htmlHelper.removeTableRows();

    for (let i = 0; i < bunches; i++) {
        const page = i*packetSize;
        const endpointToProcess = endpoints.slice(page, page+packetSize);
        let promises = [];
        endpointToProcess.forEach(endpoint => {
            promises.push(certification.getCount(api, endpoint, access_token));
        });

        const processed = await Promise.all(promises);
        processedCount += processed.length;
        htmlHelper.showProcessingInformation(`Processing ${processedCount} of ${endpoints.length}...`);
        htmlHelper.buildTableWithResults([...processed]);
        // results.push(...processed);
    }

    // htmlHelper.buildTableWithResults(results);

    button.classList.remove('is-loading');
});
