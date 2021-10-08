let params = new URLSearchParams(document.location.search.substring(1));
const CERT_ID = params.get('id');
const [CERT_YEAR, CERT_NUM] = CERT_ID.split('-');

DATA_URL = `./data/${CERT_YEAR}.json`;

async function parseCert() {
    let response = await fetch(DATA_URL);
    if (!response.ok) {
        return;
    }
    let certs = await response.json();
    if (certs[CERT_NUM] === undefined) {
        return;
    }
    document.body.className = 'cert';
    bindParams(certs[CERT_NUM]);
}

function bindParams(data) {
    for (let prop in data) {
        let span = document.getElementById(prop);
        if (span !== null) {
            span.textContent = data[prop];
        }
    }
}


parseCert();
