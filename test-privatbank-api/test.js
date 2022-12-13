const Merchant = require('privatbank-api');

const merchant = new Merchant({
    id: '244614',
    password: 'UIREsmn0m2p5P5Y9dwr1LF8vx43iGZQg',
    country: 'UA'
});

merchant._request('/pay_ua',
`<oper>cmt</oper>
  <wait>90</wait>
  <test>0</test>
  <payment id="">
    <prop name="b_card_or_acc" value="5168752006178886" />
    <prop name="amt" value="5" />
    <prop name="ccy" value="UAH" />
    <prop name="b_name" value="vadim_baranivsky" />
    <prop name="b_crf" value="283123814" />
    <prop name="b_bic" value="336310" />
    <prop name="details" value="testUkr" />
  </payment>`

).then((data) => console.log(data))

// merchant.balance('5512123466651234')
//     .then((balance) => console.log('Balance', balance));

// merchant.statement('5512123466651234', '01.01.2017', '15.03.2017')
//     .then((statements) => console.log('Statements', statements));