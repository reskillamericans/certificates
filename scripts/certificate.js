export { parseCert, listCerts };

const RA_ORG_ID = '71790185';
const rootURL = location.host + (location.host.endsWith('github.io') ? '/certificates' : '');
const CERT_SITE_URL = `${location.protocol}//${rootURL}/certificate.html`;

let params = new URLSearchParams(document.location.search.substring(1));
const ID_PARTS = params.get('id').split('-');
const CERT_YEAR = ID_PARTS[0];
const CERT_ID = ID_PARTS.slice(1).join('-');
const showButton = params.get('button') === "true";

const DATA_URL = `./data/${CERT_YEAR}.json`;

async function parseCert() {
    let response = await fetch(DATA_URL);
    if (!response.ok) {
        return;
    }
    let certs = await response.json();
    let cert = certs.find(cert => cert['id'] == CERT_ID);
    console.log(cert);
    if (cert === undefined) {
        console.log(`Can't find certificate with id=${CERT_ID}`);
        return;
    }
    document.body.className = 'cert';

    bindParams(cert);

    if (showButton) {
        document.body.insertAdjacentHTML('beforeend',
        `<div>Add this certificate to your LinkedIn profile by
        clicking here: ` + linkedInButton(cert) + '</div>');
    }
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


    // Alphabetical by name (case sensitive).
    certs.sort((a, b) => a.name < b.name ? -1 : 1);

    let groups = groupArrayBy(certs, 'cert-name');

    document.body.className = 'cert';
    let divList = document.getElementById('certs');

    for (let [certName, certs] of Object.entries(groups)) {
        const heading = document.createElement('h4');
        heading.textContent = certName;
        divList.appendChild(heading);

        appendList(divList, certs);
    }


}

// Add ordered list of cert links to div
function appendList(div, certs) {
    const ol = document.createElement('ol');
    for (let cert of certs) {
        const row = document.createElement('div');
        const certId = `${CERT_YEAR}-${cert.id}`;
        const certURL = `${CERT_SITE_URL}?id=${certId}`;
        row.innerHTML = `
            <li><a href="${certURL}&button=true">${cert.name}</a></li>`;
        ol.appendChild(row);
    }
    div.appendChild(ol);
}

function linkedInButton(cert) {
    const certId = `${CERT_YEAR}-${cert.id}`;
    const certURL = `${CERT_SITE_URL}?id=${certId}`;
    return `
        <a href="https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${cert['cert-name']}&organizationId=${RA_ORG_ID}&issueYear=${CERT_YEAR}&issueMonth=10&&certUrl=${encodeURIComponent(certURL)}&certId=${certId}">
            <img class="li-button" src="images/linkedin.png " alt="LinkedIn Add to Profile button">
        </a>`;

}

// Given array of objects, grop by unique value of a prop.
// Retain stable ordering within group.
function groupArrayBy(objects, prop) {
    let groups = {};

    for (let obj of objects) {
        let key = obj[prop];
        if (groups[key] === undefined) {
            groups[key] = [];
        }
        groups[key].push(obj);
    }

    console.log(`Groups: ${Object.keys(groups)}`);
    return groups;
}
