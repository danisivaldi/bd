var toBRL = function (number) {
    var currencyOptions = {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    }

    return new Intl.NumberFormat('pt-BR', currencyOptions).format(number);
};

module.exports = toBRL;