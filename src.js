let stor = window.localStorage;

function uploadMainRes(data) {
    document.getElementById('property_price').value = data['property_price'];
    document.getElementById('first_installment').value = data['first_installment'];
    document.getElementById('credit_span').value = data['credit_span'];
    document.getElementById('credit_percentage').value = data['credit_percentage'];
}


function uploadAdditionalRes(data) {
    document.getElementById('monthly_payment').value = data['monthly_payment'];
    document.getElementById('monthly_payment').innerText = data['monthly_payment'];

    document.getElementById('required_income').value = data['required_income'];
    document.getElementById('required_income').innerText = data['required_income'];

    document.getElementById('overpayment').value = data['overpayment'];
    document.getElementById('overpayment').innerText = data['overpayment'];

    document.getElementById('loan_body').value = data['loan_body'];
    document.getElementById('loan_body').innerText = data['loan_body'];
}


function calculateAdditionalCreditInfo(data) {

    let property_price = data['property_price'];
    let first_installment = data['first_installment'];
    let credit_span = data['credit_span'];
    let credit_percentage = data['credit_percentage'];

    let loan_body = property_price - first_installment;
    let monthly_payment = loan_body *
        (credit_percentage / 1200 +
            (credit_percentage / 1200)/((1 + (credit_percentage / 1200)) ** (credit_span * 12) - 1));
    let required_income = 5 * monthly_payment / 3;
    let overpayment = monthly_payment * credit_span * 12 - property_price + first_installment;

    return {
        'loan_body': Math.round(loan_body),
        'monthly_payment': Math.round(monthly_payment),
        'required_income': Math.round(required_income),
        'overpayment': Math.round(overpayment)
    }
}

function custom_string_format(num) {
    num = num.toString().split('').reverse().join('');
    let cnt = 0, i = 0;

    while(i < num.length) {
        if (cnt === 3) {
            cnt = 0;
            num = num.slice(0, i) + ' ' + num.slice(i, num.length);
        }
        if (num[i] !== ' ') {
            cnt++;
        }
        i++;
    }

    return num.toString().split('').reverse().join('');
}



function getData() {
    let property_price_cont = document.getElementById('property_price');
    let property_price = property_price_cont.value.split(' ').join('');

    let first_installment_cont = document.getElementById('first_installment');
    let first_installment = first_installment_cont.value.split(' ').join('');

    let credit_span_cont = document.getElementById('credit_span');
    let credit_span = credit_span_cont.value.split(' ').join('');

    let credit_percentage_cont = document.getElementById('credit_percentage');
    let credit_percentage = credit_percentage_cont.value.split(' ').join('');

    return {
        'property_price': property_price,
        'first_installment': first_installment,
        'credit_span': credit_span,
        'credit_percentage': credit_percentage
    };
}



function recalculate() {
    let res = getData();
    document.getElementById('property_price').value = custom_string_format(res['property_price']);
    document.getElementById('first_installment').value = custom_string_format(res['first_installment']);

    uploadAdditionalRes(
        calculateAdditionalCreditInfo(res)
    );


}


function changeColor(percentage) {
    let buttons = window.document.getElementsByClassName('percent-box');
    for (let b of buttons[0].childNodes) {
        if (b.id !== undefined) {
            let curB = window.document.getElementById(b.id);
            curB.className = 'percent-cell inactive';
        }
    }

    let button = document.getElementById(percentage);
    button.className = 'percent-cell active';
    return false;
}


function setPercent(percentage) {
    changeColor(percentage);
    let property_price = document.getElementById('property_price').value.split(' ').join('');
    document.getElementById('first_installment').value = Math.round(property_price * percentage / 100);
    recalculate();
    return false; //not to refresh form
}



function clearInputs() {
    document.getElementById('property_price').value = 0;
    document.getElementById('first_installment').value = 0;
    document.getElementById('credit_span').value = 0;
    document.getElementById('credit_percentage').value = 0;

    document.getElementById('monthly_payment').value = 0;
    document.getElementById('monthly_payment').innerText = 0;

    document.getElementById('required_income').value = 0;
    document.getElementById('required_income').innerText = 0;

    document.getElementById('overpayment').value = 0;
    document.getElementById('overpayment').innerText = 0;

    document.getElementById('loan_body').value = 0;
    document.getElementById('loan_body').innerText = 0;

    stor.clear();
}


function save() {
    console.log("here");
    let res = getData();
    stor.setItem('property_price', res['property_price']);
    stor.setItem('first_installment', res['first_installment']);
    stor.setItem('credit_span', res['credit_span']);
    stor.setItem('credit_percentage', res['credit_percentage']);
    console.log(stor);
}


function retrieve_saved() {
    if (stor.length === 0) {
        recalculate();
        return 0;
    }
    console.log("now here");
    let s = {
        'property_price': stor.getItem('property_price'),
        'first_installment': stor.getItem('first_installment'),
        'credit_span': stor.getItem('credit_span'),
        'credit_percentage': stor.getItem('credit_percentage')
    };

    console.log(s['property_price']);
    uploadMainRes(s);
    recalculate();
}