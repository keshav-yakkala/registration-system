"use strict";

const form = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');
const geoData = {
    USA: { California: ["Los Angeles", "San Francisco"], Texas: ["Houston", "Austin"] },
    UK: { England: ["London", "Manchester"], Scotland: ["Glasgow", "Edinburgh"] },
    IN: { Karnataka: ["Bangalore", "Mysore"], Maharashtra: ["Mumbai", "Pune"] }
};

const fields = ["firstName", "lastName", "email", "phone", "country", "state", "city", "password", "confirmPassword", "terms", "gender"];
const disposableDomains = ['tempmail.com', 'mailinator.com', 'yopmail.com', 'dispostable.com'];
const phoneRules = {
    USA: { length: 10, placeholder: '1234567890' },
    UK: { length: 11, placeholder: '07123456789' },
    IN: { length: 10, placeholder: '9876543210' }
};

// Init
document.addEventListener('DOMContentLoaded', () => {
    setupListeners();
});

function setupListeners() {
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        el.addEventListener('input', () => {
            validateSingle(id);
            checkFormValidity();
        });

        el.addEventListener('blur', () => {
            validateSingle(id);
        });

        if (id === 'country') el.addEventListener('change', () => {
            handleCountryChange();
            updatePhonePlaceholder();
        });
        if (id === 'state') el.addEventListener('change', handleStateChange);
        if (id === 'password') el.addEventListener('input', updateStrength);
        if (id === 'gender') {
            document.querySelectorAll('input[name="gender"]').forEach(cb => {
                cb.addEventListener('change', () => {
                    validateSingle('gender');
                    checkFormValidity();
                });
            });
        }
    });
}

function handleCountryChange() {
    const country = document.getElementById('country').value;
    const stateSel = document.getElementById('state');
    const citySel = document.getElementById('city');

    stateSel.innerHTML = '<option value="">Select State</option>';
    citySel.innerHTML = '<option value="">Select City</option>';
    citySel.disabled = true;

    if (country && geoData[country]) {
        stateSel.disabled = false;
        Object.keys(geoData[country]).forEach(s => {
            const opt = document.createElement('option');
            opt.value = opt.textContent = s;
            stateSel.appendChild(opt);
        });
    } else {
        stateSel.disabled = true;
    }
}

function updatePhonePlaceholder() {
    const country = document.getElementById('country').value;
    const phoneInput = document.getElementById('phone');
    if (phoneRules[country]) {
        phoneInput.placeholder = phoneRules[country].placeholder;
    } else {
        phoneInput.placeholder = '1234567890';
    }
    validateSingle('phone');
}

function handleStateChange(e) {
    const country = document.getElementById('country').value;
    const state = e.target.value;
    const citySel = document.getElementById('city');

    citySel.innerHTML = '<option value="">Select City</option>';

    if (state && geoData[country][state]) {
        citySel.disabled = false;
        geoData[country][state].forEach(c => {
            const opt = document.createElement('option');
            opt.value = opt.textContent = c;
            citySel.appendChild(opt);
        });
    } else {
        citySel.disabled = true;
    }
}

function validateSingle(id) {
    const el = document.getElementById(id);
    const err = document.getElementById(id + 'Error');
    let isValid = true;
    let msg = "";

    if (id === 'gender') {
        const checked = document.querySelectorAll('input[name="gender"]:checked').length > 0;
        if (!checked) {
            isValid = false;
            msg = "Please select at least one gender";
        }
    } else {
        const val = el.type === 'checkbox' ? el.checked : el.value.trim();
        if (!val) {
            isValid = false;
            msg = "Field is required";
        } else if (id === 'email') {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                isValid = false;
                msg = "Invalid email format";
            } else {
                const domain = val.split('@')[1];
                if (disposableDomains.includes(domain)) {
                    isValid = false;
                    msg = "Disposable emails are not allowed";
                }
            }
        } else if (id === 'phone') {
            const country = document.getElementById('country').value;
            const rule = phoneRules[country];
            if (rule && val.length !== rule.length) {
                isValid = false;
                msg = `Phone must be ${rule.length} digits for ${country}`;
            } else if (!/^\d+$/.test(val)) {
                isValid = false;
                msg = "Phone must be numeric";
            }
        } else if (id === 'confirmPassword') {
            const pass = document.getElementById('password').value;
            if (val !== pass) {
                isValid = false;
                msg = "Passwords do not match";
            }
        }
    }

    if (err) err.textContent = msg;
    const target = id === 'gender' ? document.querySelector('.checkbox-group') : el;
    if (target.classList) target.classList.toggle('invalid', !isValid);
    return isValid;
}

function updateStrength() {
    const val = document.getElementById('password').value;
    const bar = document.getElementById('strengthBar');
    const txt = document.getElementById('strengthText');

    let score = 0;
    if (val.length > 0) {
        score = 1;
        if (val.length > 6) {
            if (/[A-Z]/.test(val)) score++;
            if (/[0-9]/.test(val)) score++;
            if (/[^A-Za-z0-9]/.test(val)) score++;
        }
    }
    score = Math.min(score, 4);

    const colors = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
    const labels = ["Weak", "Fair", "Good", "Strong"];

    bar.style.width = (score * 25) + "%";
    bar.style.backgroundColor = colors[score - 1] || "#e2e8f0";
    txt.textContent = labels[score - 1] || "Empty";
}

function checkFormValidity() {
    const allValid = fields.every(id => {
        if (id === 'gender') {
            return document.querySelectorAll('input[name="gender"]:checked').length > 0;
        }
        const el = document.getElementById(id);
        if (id === 'terms') return el.checked;
        if (id === 'confirmPassword') return el.value === document.getElementById('password').value;
        return el.value.trim().length > 0;
    });
    submitBtn.disabled = !allValid;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('successMessage').classList.remove('hidden');
    form.reset();
    submitBtn.disabled = true;
    // Clear validation styles
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('invalid');
        const err = document.getElementById(id + 'Error');
        if (err) err.textContent = '';
    });
    document.querySelector('.checkbox-group').classList.remove('invalid');
    updateStrength(); // reset bar
});
