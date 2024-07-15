const apiKey = 'SM8WN786VO24QGCK';


function fetchExchangeRate() {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
        .then(response => response.json())
        .then(data => {
            if (!data || !data.rates) {
                console.error('Error al obtener datos de la API de tipo de cambio.');
                return;
            }
            const mxnRate = data.rates.MXN;
            const labels = ['USD'];
            const rates = [mxnRate];
            
            new Chart(document.getElementById('exchangeRateChart'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'USD to MXN',
                        data: rates,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error al obtener datos de tipo de cambio:', error));
}

function fetchMarketIndicators() {
    fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=SPY&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (!data || !data['Time Series (Daily)']) {
                console.error('Error al obtener datos de la API de Alpha Vantage.');
                return;
            }
            const timeSeries = data['Time Series (Daily)'];
            const labels = Object.keys(timeSeries).slice(0, 30).reverse();
            const closePrices = labels.map(date => timeSeries[date]['4. close']);
            
            new Chart(document.getElementById('marketIndicatorsChart'), {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'S&P 500 Daily Close Prices',
                        data: closePrices,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error al obtener datos de Alpha Vantage:', error));
}


function fetchMarketComparison() {
    Promise.all([
        fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=^MXX&apikey=${apiKey}`).then(response => response.json()),
        fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=SPY&apikey=${apiKey}`).then(response => response.json())
    ])
    .then(([bmvData, sp500Data]) => {
        console.log('BMV Data:', bmvData);
        console.log('SP500 Data:', sp500Data);
        
        if (!bmvData || !bmvData['Time Series (Daily)']) {
            console.error('Error al obtener datos de la API de Alpha Vantage para BMV.');
            return;
        }
        if (!sp500Data || !sp500Data['Time Series (Daily)']) {
            console.error('Error al obtener datos de la API de Alpha Vantage para SP500.');
            return;
        }
        
        const bmvTimeSeries = bmvData['Time Series (Daily)'];
        const sp500TimeSeries = sp500Data['Time Series (Daily)'];
        
        const labels = Object.keys(bmvTimeSeries).slice(0, 30).reverse();
        const bmvClosePrices = labels.map(date => bmvTimeSeries[date]['4. close']);
        const sp500ClosePrices = labels.map(date => sp500TimeSeries[date]['4. close']);
        
        new Chart(document.getElementById('comparisonChart'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'BMV',
                    data: bmvClosePrices,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }, {
                    label: 'S&P 500',
                    data: sp500ClosePrices,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error al obtener datos de comparación de mercados:', error));
}


fetchExchangeRate();
fetchMarketIndicators();
fetchMarketComparison();


