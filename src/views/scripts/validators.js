document.addEventListener('DOMContentLoaded', () => {
    const contactsContainer = document.getElementById('contactsContainer');
    const addContactButton = document.getElementById('addContactButton');
    const submitButton = document.getElementById('submitButton');
    const errorContainer = document.getElementById('errorContainer');

    function addContactRow() {
        const contactRow = document.createElement('div');
        contactRow.className = 'contactRow';

        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.placeholder = 'Email';
        emailInput.className = 'contactInput';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Name';
        nameInput.className = 'contactInput';

        contactRow.appendChild(emailInput);
        contactRow.appendChild(nameInput);
        contactsContainer.appendChild(contactRow);
    }

    addContactRow();
    addContactRow();

    addContactButton.addEventListener('click', addContactRow);

    submitButton.addEventListener('click', () => {
        const contactRows = document.querySelectorAll('.contactRow');
        const contacts = [];
        let hasError = false;

        contactRows.forEach(row => {
            const emailInput = row.querySelector('input[type="email"]');
            const nameInput = row.querySelector('input[type="text"]');
            const email = emailInput.value.trim();
            const name = nameInput.value.trim();

            if ((email && !name) || (!email && name)) {
                hasError = true;
                emailInput.classList.add('error');
                nameInput.classList.add('error');
            } else {
                emailInput.classList.remove('error');
                nameInput.classList.remove('error');
            }

            if (email && name) {
                contacts.push({ email, name });
            }
        });

        if (hasError) {
            errorContainer.textContent = 'Please fill out both the name and email for all contacts.';

        } else {
            errorContainer.textContent = '';
            console.log('Contacts:', contacts);

            const urlParams = new URLSearchParams(window.location.search);
            const claimId = urlParams.get('claimId');
            console.log('Claim ID:', claimId);

            const formData = {
                claimId,
                contacts
            };

            console.log('Form Data:', formData);


            // other logic related to the endpoint from Omar
        }
    });
});


