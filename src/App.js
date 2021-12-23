import React from 'react';
import './App.css';
import { buildIbans } from './mapp4';
import { createSteuerIdDigits } from './strId';

const gm = require('avris-generator');
const crypto = require('crypto');

var countriesForUmsatzID = [
  { value: 'HR', label: 'Kroatien' },
  { value: 'DK', label: 'Dänemark' },
  { value: 'FR', label: 'Frankreich' },
  { value: 'DE', label: 'Deutschland' },
  { value: 'IE', label: 'Ireland' },
  { value: 'IT', label: 'Italien' },
  { value: 'LU', label: 'Luxemburg' },
  { value: 'NL', label: 'Niederland' },
];

var countriesForIBAN = [
  { value: 'Croatia', label: 'Kroatien' },
  { value: 'Denmark', label: 'Dänemark' },
  { value: 'Germany', label: 'Deutschland' },
  { value: 'Greece', label: 'Griechenland' },
  { value: 'Ireland', label: 'Ireland' },
  { value: 'Italy', label: 'Italien' },
  { value: 'Luxembourg', label: 'Luxemburg' },
  { value: 'Switzerland', label: 'Schweiz' },
  { value: 'Turkey', label: 'Türkei' },
];

function buildUSTID(country) {
  const countryEntry = countriesForUmsatzID.find(obj => obj.label === country);
  var num = Math.random().toString().slice(2,11);
  while(num.toString().length < 9 || num.toString().charAt(0) === '0'){
    num =  Math.random().toString().slice(2,11);
  }
  const vatId= countryEntry.value + num;
  return vatId;
}

class App extends React.Component {

  constructor(props) {
    super(props);
    const newIban = buildIbans('Germany');
    const sha256Iban = crypto.createHash('sha256').update(newIban).digest('hex')
    this.state = {
      country: 'Germany',
      iban: newIban,
      taxIDNumber: createSteuerIdDigits(),
      bundesland: 'Alle Bundesländer',
      taxNumber: gm.generate('DE', 'stnr'),
      ustIDCountry: 'Deutschland',
      ustID: buildUSTID('Deutschland'),
      shaIban: sha256Iban,
    };

    this.bundeslandHandlerTaxNum = this.bundeslandHandlerTaxNum.bind(this);
    this.handleSubmitTaxNum = this.handleSubmitTaxNum.bind(this);
    this.handleSubmitTaxID = this.handleSubmitTaxID.bind(this);
    this.countryHandler = this.countryHandler.bind(this);
    this.handleSubmitIBAN = this.handleSubmitIBAN.bind(this);
    this.generateAllValues = this.generateAllValues.bind(this);
    this.handleSubmitUstID = this.handleSubmitUstID.bind(this);
    this.handleOnChangeUstID = this.handleOnChangeUstID.bind(this);
  }
  
  bundeslandHandlerTaxNum(e) {
    const bl = e.target.value === "all" ? 'Alle Bundesländer' : e.target.value
    const stnr = bl === 'Alle Bundesländer' ? gm.generate('DE', 'stnr') : gm.generate('DE', 'stnr', { state: bl });
    this.setState({ bundesland: bl , taxNumber: stnr});
    e.preventDefault();
  };
  handleSubmitTaxNum(e) {
    var bl = this.state.bundesland;
    const stnr = bl === 'Alle Bundesländer' ? gm.generate('DE', 'stnr') : gm.generate('DE', 'stnr', { state: bl });
    this.setState({ taxNumber: stnr });
    e.preventDefault();
  }
  handleSubmitTaxID(e) {
    this.setState({ taxIDNumber: createSteuerIdDigits() });
    e.preventDefault();
  }

  countryHandler(e) {
    const target = e.target;
    const value = target.value;
    const newIban = buildIbans(value);
    const sha256_hash =  crypto.createHash('sha256').update(newIban).digest('hex');
    this.setState({
      country: value,
      iban: newIban,
      shaIban : sha256_hash,
    });
    e.preventDefault();
  };

  handleSubmitIBAN(e) {
    const newIban = buildIbans(this.state.country)
    const sha256_hash =  crypto.createHash('sha256').update(newIban).digest('hex');
    this.setState({
      iban: newIban,
      shaIban: sha256_hash,
    });
    e.preventDefault();
  }

  generateAllValues(e) {
    var bl = this.state.bundesland;
    const stnr = bl === 'Alle Bundesländer' ? gm.generate('DE', 'stnr') : gm.generate('DE', 'stnr', { state: bl });
    const num = buildUSTID(this.state.ustIDCountry);
    const newIban = buildIbans(this.state.country)
    const sha256_hash =  crypto.createHash('sha256').update(newIban).digest('hex');
    console.log("sha256_hash", sha256_hash);
    this.setState({
      taxIDNumber: createSteuerIdDigits(),
      taxNumber: stnr,
      iban: newIban,
      ustID: num,
      shaIban: sha256_hash
    });

  }

  handleOnChangeUstID(e) {
    const num = buildUSTID(e.target.value);
    
    this.setState({
      ustID: num,
      ustIDCountry: e.target.value
    });
    e.preventDefault();
  }
  handleSubmitUstID(e) {

    const num = buildUSTID(this.state.ustIDCountry);
    this.setState({
      ustID: num,
    });

    e.preventDefault();
  }

  render() {
    return (
      <div className="App">
        <header >
          <h1>Generator for VAT ID, Tax ID, Tax Number and IBAN </h1>
        </header>

        <div>

          <form>
            <label className="label">Vat ID: &#160;</label>
            <input type="text" className="todo-input" disabled value={this.state.ustID} />
            <p>&#160;</p>
            <div className="select">

              <select value={this.state.ustIDCountry} className="filter-todo" name="ustid" onChange={this.handleOnChangeUstID}>
                {countriesForUmsatzID.map((option) => (
                  <option key={option.value} value={option.label}>{option.label}</option>
                ))}
              </select>

            </div>
            <button onClick={this.handleSubmitUstID} className="todo-button">
              <i className="fas fa-random"></i>
            </button>
          </form>
        </div>

        <div>
          <div className="mybutton">

          </div>
          <form>
            <label className="label">Tax ID: &#160;</label>
            <input type="text" className="inputResize" disabled value={this.state.taxIDNumber} />
            <p>&#160;</p>
            <button onClick={this.handleSubmitTaxID} className="todo-button">
              <i className="fas fa-random"></i>
            </button>
          </form>
        </div>

        <div>

          <form>
            <label className="label">Tax Nr: &#160;</label>
            <input type="text" className="todo-input" disabled value={this.state.taxNumber} />
            <div className="select">
              <select name="state" onChange={this.bundeslandHandlerTaxNum} className="filter-todo">
                <option key="0" value="all">Alle Bundesländer</option>
                <option key="1" value="BW">Baden-Württemberg</option>
                <option key="2" value="BY">Bayern</option>
                <option key="3" value="BE">Berlin</option>
                <option key="4" value="BB">Brandenburg</option>
                <option key="5" value="HB">Bremen</option>
                <option key="6" value="HH">Hamburg</option>
                <option key="7" value="HE">Hessen</option>
                <option key="8" value="MV">Mecklenburg-Vorponnern</option>
                <option key="9" value="NI">Niedersachsen</option>
                <option key="10" value="NW">Nordrhein-Westfalen</option>
                <option key="11" value="RP">Rheinland-Pfalz</option>
                <option key="12" value="SL">Saarland</option>
                <option key="13" value="SN">Sachsen</option>
                <option key="14" value="ST">Sachsen-Anhalt</option>
                <option key="15" value="SH">Schleswig-Holstein</option>
                <option key="16" value="TH">Thüringen</option>
              </select>
            </div>

            <button onClick={this.handleSubmitTaxNum} className="todo-button">
              <i className="fas fa-random"></i>
            </button>
          </form>

        </div>

        <div>
          <form>
            <label className="label">Ibans : &#160;</label>
            <input type="text" className="todo-input" disabled value={this.state.iban} />
            <div className="select">

              <select value={this.state.country} className="filter-todo" name="iban" onChange={this.countryHandler}>
                {countriesForIBAN.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

            </div>
            <button onClick={this.handleSubmitIBAN} className="todo-button">
              <i className="fas fa-random"></i>
            </button>
          </form>
        </div>

        <div>
          <center>
            <label className="label">SHA256 hash code for iban : &#160;</label>
          </center>
          <form>
            
            <input type="text" className="label_SHA" disabled value={this.state.shaIban} />
            
          </form>
        </div>


        <center>
          <div>
            <button  id="generatorAll" onClick={this.generateAllValues} className="buttontest">
            <i className="fas fa-random"></i> Generate 
            </button>
          </div>
          
        </center>
      </div>
    );
  }
}

export default App;

