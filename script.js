document.addEventListener('DOMContentLoaded', async () => {
    const rightButtons = document.querySelectorAll('.right-buttons>button');
    const leftButtons = document.querySelectorAll('.left-buttons>button');

    const leftFooterWrapper = document.querySelector('.left-footer-wrapper');
    const rightFooterWrapper = document.querySelector('.right-footer-wrapper');

    const leftInput = document.querySelector('.left-input');
    const rightInput = document.querySelector('.right-input');

    const hamburgerButton = document.querySelector('.hamburger-button');
    const hamburgerWrapper = document.querySelector('.hamburger-wrapper');

    const API_KEY = "71f909d59a4634aaa7d37259441a9bb1";

    const errorWrapper = document.querySelector('.error-wrapper');
    let leftRate = 1, rightRate = 1;
    let activeInput = "left";

    function updateNetworkStatus() {
        if (!navigator.onLine) {
            errorWrapper.style.display = 'block';
            alert("İnternet bağlantısı yoxdur!");
        } else {
            errorWrapper.style.display = 'none';
        }
    }

    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    function updateDependentInput() {
        if (activeInput === "left" && leftInput.value !== "") {
            const calculatedValue = (parseFloat(leftInput.value) * leftRate).toFixed(5);
            if (!isNaN(calculatedValue)) {
                rightInput.value = calculatedValue;
            }
        } else if (activeInput === "right" && rightInput.value !== "") {
            const calculatedValue = (parseFloat(rightInput.value) * rightRate).toFixed(5);
            if (!isNaN(calculatedValue)) {
                leftInput.value = calculatedValue;
            }
        }
    }

    leftButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            button.classList.add('active');
            leftButtons.forEach((btn) => {
                if (btn !== button) btn.classList.remove('active');
            });
            await updateFooters();
            updateDependentInput();
        });
    });

    rightButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            button.classList.add('active');
            rightButtons.forEach((btn) => {
                if (btn !== button) btn.classList.remove('active');
            });
            await updateFooters();
            updateDependentInput();
        });
    });

    leftInput.addEventListener('input', (e) => {
        activeInput = "left";
        if (e.target.value.includes(',')) {
            e.target.value = e.target.value.replace(',', '.');
        }
        if (e.target.value === '0' || /^0{2,}$/.test(e.target.value)) {
            e.target.value = '0';
        }
        const calculatedValue = (parseFloat(e.target.value) * leftRate).toFixed(5);
        if (!isNaN(calculatedValue)) {
            rightInput.value = calculatedValue;
        } else {
            rightInput.value = "";
        }
    });

    rightInput.addEventListener('input', (e) => {
        activeInput = "right";
        if (e.target.value.includes(',')) {
            e.target.value = e.target.value.replace(',', '.');
        }

        if (e.target.value === '0' || /^0{2,}$/.test(e.target.value)) {
            e.target.value = '0';
        }
        const calculatedValue = (parseFloat(e.target.value) * rightRate).toFixed(5);
        if (!isNaN(calculatedValue)) {
            leftInput.value = calculatedValue;
        } else {
            leftInput.value = "";
        }
    });

    async function updateFooters() {
        const leftActive = document.querySelector('.left-buttons > button.active');
        const rightActive = document.querySelector('.right-buttons > button.active');

        if (leftActive && rightActive) {
            const leftCurrency = leftActive.textContent.trim();
            const rightCurrency = rightActive.textContent.trim();

            // Əgər valyutalar eynidirsə, həmişə işləsin
            if (leftCurrency === rightCurrency) {
                leftRate = 1;
                rightRate = 1;
                leftFooterWrapper.innerText = `1 ${leftCurrency} = 1 ${rightCurrency}`;
                rightFooterWrapper.innerText = `1 ${rightCurrency} = 1 ${leftCurrency}`;

                // Offline olsa belə, input dəyərlərini sinxron saxla
                if (activeInput === "left") {
                    rightInput.value = leftInput.value;
                } else {
                    leftInput.value = rightInput.value;
                }

                return;
            }

            // Valyutalar fərqlidir, ancaq online deyilsə, sorğu atma
            if (!navigator.onLine) {
                alert("İnternet bağlantısı yoxdur!");
                leftFooterWrapper.innerText = 'İnternet bağlantısı yoxdur';
                rightFooterWrapper.innerText = '';
                return;
            }

            // Valyutalar fərqlidir və internet var — API çağırışı
            console.log(leftCurrency, rightCurrency)
            const url = `https://api.exchangerate.host/live?access_key=${API_KEY}&source=${leftCurrency}&currencies=${rightCurrency}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                console.log(data)
                if (data.success==true
                ) {
                    leftRate = data.quotes[`${leftCurrency}${rightCurrency}`].toFixed(5);
                    rightRate = 1 / leftRate;
                    leftFooterWrapper.innerText = `1 ${leftCurrency} = ${leftRate} ${rightCurrency}`;
                    rightFooterWrapper.innerText = `1 ${rightCurrency} = ${rightRate} ${leftCurrency}`;
                } else {
                    console.error('Conversion error:', data['error-type']);
                    leftFooterWrapper.innerText = 'Valyuta məlumatı alınmadı';
                    rightFooterWrapper.innerText = '';
                }
            } catch (err) {
                console.error('Network error:', err);
                leftFooterWrapper.innerText = 'Şəbəkə xətası';
                rightFooterWrapper.innerText = '';
            }
        }
    }


    hamburgerButton.addEventListener('click', () => {
        hamburgerWrapper.classList.toggle('activee');
    });

    function updateNetworkStatus() {
        if (!navigator.onLine) {
            errorWrapper.style.display = 'block';
        } else {
            errorWrapper.style.display = 'none';
        }
    }

    updateNetworkStatus();
    await updateFooters();
});