export { parseCert, listCerts };

const RA_ORG_ID = '71790185';
const rootURL = location.host + (location.host.endsWith('github.io') ? '/certificates' : '');
const CERT_SITE_URL = `${location.protocol}//${rootURL}/certificate.html`;

let params = new URLSearchParams(document.location.search.substring(1));
const CERT_ID = params.get('id');
const [CERT_YEAR, CERT_NUM] = CERT_ID.split('-');

const DATA_URL = `./data/${CERT_YEAR}.json`;

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

async function listCerts() {
    let response = await fetch(DATA_URL);
    if (!response.ok) {
        return;
    }
    let certs = await response.json();
    document.body.className = 'cert';

    let divList = document.getElementById('certs');

    for (let num in certs) {
        let cert = certs[num];
        const row = document.createElement('div');
        const certId = `${CERT_YEAR}-${num}`;
        const certURL = `${CERT_SITE_URL}?id=${certId}`;
        row.innerHTML = `
            ${num}. <a href="${certURL}">${cert.name}</a>
            <a href="https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${cert['cert-name']}&organizationId=${RA_ORG_ID}&issueYear=${CERT_YEAR}
&issueMonth=10&&certUrl=${encodeURIComponent(certURL)}&certId=${certId}">
                <img class="li-button" src="images/linkedin.png " alt="LinkedIn Add to Profile button">
            </a>
        `;
        divList.appendChild(row);
    }
}