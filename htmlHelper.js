class HtmlHelper {

    setDefaultValues(data) {
        document.getElementById('apiUrl').value = data.url;
        document.getElementById('clientId').value = data.client_id;
        document.getElementById('clientSecret').value = data.client_secret;
    }

    getControls() {
        const button = document.getElementById('run');
        const apiUrlElement = document.getElementById('apiUrl');
        const clientIdElement = document.getElementById('clientId');
        const clientSecretElement = document.getElementById('clientSecret');

        return { button, apiUrlElement, clientIdElement, clientSecretElement };
    }

    showLoginError() {
        const section = document.getElementById('error');
        section.style = 'display: block'
    }

    hideLoginError() {
        const section = document.getElementById('error');
        section.style = 'display: none';
    }

    showApiUrlError() {
        const section = document.getElementById('apiUrlError');
        section.style = 'display: block'
    }

    hideApiUrlError() {
        const section = document.getElementById('apiUrlError');
        section.style = 'display: none';
    }

    removeTableRows() {
        const table = document.getElementById('tableBody');
        table.querySelectorAll('.divTableRow').forEach((row, index) => {
            if (index !== 0) {
                row.remove();
            }
        });
    }

    buildTableWithResults(results) {
        const table = document.getElementById('tableBody');
        const rowsCount = table.querySelectorAll('.divTableRow').length;
        results.forEach((result, index) => {
            const row = document.createElement('div');
            row.classList.add('divTableRow');
            if(result.total === 0) {
                row.classList.add('divTableRow-red');
            }

            const id = rowsCount + index;

            const idCell = this.#createCellTable('div', id);
            const resourceNameCell = this.#createCellTable('div', result.resourceName);
            const endpointCell = this.#createCellTable('div', result.endpoint);
            const totalCell = this.#createCellTable('div', result.total);

            row.appendChild(idCell);
            row.appendChild(resourceNameCell);
            row.appendChild(endpointCell);
            row.appendChild(totalCell);

           table.appendChild(row);
        });
    }

    #createCellTable(tagName, contentText){
        const cell = document.createElement(tagName);
        cell.className = 'divTableCell';
        const content = document.createTextNode(contentText);

        cell.appendChild(content);

        return cell;
    }

    showProcessingInformation(information) {
        const section = document.getElementById('processing');
        section.innerHTML = '';
        const label = document.createTextNode(information)
        section.appendChild(label);
    }
}
