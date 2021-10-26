export { parseCert, listCerts };

const RA_ORG_ID = '71790185';
const rootURL = location.host + (location.host.endsWith('github.io') ? '/certificates' : '');
const CERT_SITE_URL = `${location.protocol}//${rootURL}/certificate.html`;

let params = new URLSearchParams(document.location.search.substring(1));
const CERT_ID = params.get('id');
const [CERT_YEAR, CERT_NUM] = CERT_ID.split('-').map(v => parseInt(v));

const DATA_URL = `./data/${CERT_YEAR}.json`;

async function parseCert() {
    let response = await fetch(DATA_URL);
    if (!response.ok) {
        return;
    }
    let certs = await response.json();
    let cert = certs.find(cert => cert['id'] == CERT_NUM);
    console.log(cert);
    if (cert === undefined) {
        console.log(`Can't find certificate with id=${CERT_NUM}`);
        return;
    }
    document.body.className = 'cert';

    bindParams(cert);
}

function bindParams(data) {
    for (let prop in data) {
        if (prop.endsWith('-date')) {
            data[prop] = longDateString(data[prop]);
        }
        let spans = document.querySelectorAll(`#${prop}`);
        for (let span of spans) {
            span.textContent = data[prop];
        }
    }
}

let longDateFormat = new Intl.DateTimeFormat("en-us",
    {month: "long", day: "numeric", year: "numeric"});

function longDateString(dateString) {
    let d = Date.parse(dateString);
    return longDateFormat.format(d);
}

async function listCerts() {
    let response = await fetch(DATA_URL);
    if (!response.ok) {
        return;
    }
    let certs = await response.json();
    document.body.className = 'cert';

    let divList = document.getElementById('certs');

    for (let cert of certs) {
        const row = document.createElement('div');
        const certId = `${CERT_YEAR}-${cert.id}`;
        const certURL = `${CERT_SITE_URL}?id=${certId}`;
        row.innerHTML = `
            ${cert.id}. <a href="${certURL}">${cert.name}</a>
            <a href="https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${cert['cert-name']}&organizationId=${RA_ORG_ID}&issueYear=${CERT_YEAR}
&issueMonth=10&&certUrl=${encodeURIComponent(certURL)}&certId=${certId}">
                <img class="li-button" src="images/linkedin.png " alt="LinkedIn Add to Profile button">
            </a>
        `;
        divList.appendChild(row);
    }
}