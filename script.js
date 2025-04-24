document.addEventListener('DOMContentLoaded', async () => {
    const rightButtons = document.querySelectorAll('.right-buttons>button');
    const leftButtons = document.querySelectorAll('.left-buttons>button');
    const leftFooterWrapper = document.querySelector('.left-footer-wrapper');
    const rightFooterWrapper = document.querySelector('.right-footer-wrapper');
    const leftInput = document.querySelector('.left-input');
    const rightInput = document.querySelector('.right-input');
    const hamburgerButton = document.querySelector('.hamburger-button');
    const hamburgerWrapper = document.querySelector('.hamburger-wrapper');
    const API_KEY = "6bfbf7c927973f66d254bc66da6347c1";
    const errorWrapper = document.querySelector('.error-wrapper');
    let leftRate, rightRate;
    let activeInput = "left";


    function updateDependentInput() {
        if (activeInput === "left" && leftInput.value !== "") {
            const calculatedValue = (leftInput.value * leftRate).toFixed(5);
            if (!isNaN(calculatedValue)) {
                rightInput.value = calculatedValue;
            }
        } else if (activeInput === "right" && rightInput.value !== "") {
            const calculatedValue = (rightInput.value * rightRate).toFixed(5);
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
        const calculatedValue = (e.target.value * leftRate).toFixed(5);
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
        console.log(e.target.value);
        const calculatedValue = (e.target.value * rightRate).toFixed(5);
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
            if (leftActive.innerText !== rightActive.innerText) {
                const leftCurrency = leftActive.textContent.trim();
                const rightCurrency = rightActive.textContent.trim();

                const leftURL = `https://api.exchangerate.host/live?access_key=${API_KEY}&source=${leftCurrency}&currencies=${rightCurrency}`;
                try {
                    const response = await fetch(leftURL);
                    const leftData = await response.json();

                    if (leftData.success) {
                        leftRate = leftData.quotes[`${leftCurrency}${rightCurrency}`].toFixed(5);
                        rightRate = (1 / leftRate).toFixed(5);
                        leftFooterWrapper.innerText = `1 ${leftCurrency} = ${leftRate} ${rightCurrency}`;
                        rightFooterWrapper.innerText = `1 ${rightCurrency} = ${rightRate} ${leftCurrency}`;
                    } else {
                        console.error('Error fetching left data:', leftData.error);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                leftRate = 1;
                rightRate = 1;
                leftFooterWrapper.innerText = `1 ${leftActive.innerText} = 1 ${rightActive.innerText}`;
                rightFooterWrapper.innerText = `1 ${rightActive.innerText} = 1 ${leftActive.innerText}`;
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