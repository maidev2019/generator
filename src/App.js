import React, { useState } from 'react';
import './App.css';

import { buildIbans } from './mapp4';
import { createSteuerIdDigits } from './strId';
const gm = require('avris-generator');

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
  { value: 'Egypt', label: 'Ägypten' },
  { value: 'France', label: 'Frankreich' },
  { value: 'Germany', label: 'Deutschland' },
  { value: 'Greece', label: 'Griechenland' },
  { value: 'Iran', label: 'Iran' },
  { value: 'Ireland', label: 'Ireland' },
  { value: 'Italy', label: 'Italien' },
  { value: 'Luxembourg', label: 'Luxemburg' },
  { value: 'Netherlands', label: 'Niederland' },
  { value: 'Switzerland', label: 'Schweiz' },
  { value: 'Turkey', label: 'Türkei' },
  { value: 'UK', label: 'Großbritanien' },
];

function getIndex(country) {
  return countriesForIBAN.findIndex(obj => obj.value === country);
}
function buildUSTID(country) {

  return '0';
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      country: 'Germany',
      selected: getIndex('Germany'),
      iban: buildIbans('Germany'),
      taxIDNumber: createSteuerIdDigits(),
      bundesland: 'Alle Bundesländer',
      taxNumber: gm.generate('DE', 'stnr'),
      ustIDCountry: 'Deutschland',
      ustID: 'DE' + Math.floor(Math.random() * (999999999 - 100000000)),
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
    
    this.setState({ bundesland: e.target.value === "all" ? 'Alle Bundesländer' : e.target.value });
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
    this.setState({
      country: value,
      selected: countriesForIBAN.indexOf(value),
      iban: buildIbans(value)
    });
    e.preventDefault();
  };

  handleSubmitIBAN(e) {
    this.setState({
      iban: buildIbans(this.state.country)
    });
    e.preventDefault();
  }

  generateAllValues(e) {
    var bl = this.state.bundesland;
    const stnr = bl === 'Alle Bundesländer' ? gm.generate('DE', 'stnr') : gm.generate('DE', 'stnr', { state: bl });

    this.setState({
      taxIDNumber: createSteuerIdDigits(),
      taxNumber: stnr,
      iban: buildIbans(this.state.country)
    });

  }

  handleOnChangeUstID(e) {
    const country = countriesForUmsatzID.find(obj => obj.label === e.target.value);    
    const num = country.value + Math.floor(Math.random() * (999999999 - 100000000));
    this.setState({
      ustID: num,
      ustIDCountry: e.target.value
    });
    e.preventDefault();
  }
  handleSubmitUstID(e) {
    const country = countriesForUmsatzID.find(obj => { console.log('country: ', this.state.ustIDCountry); return obj.label === this.state.ustIDCountry });
    const num = country.value + Math.floor(Math.random() * (999999999 - 100000000));
    this.setState({
      ustID: num
    });
    e.preventDefault();
  }



  render() {
    return (
      <div className="App">
        <header >
          <h1>Generator for IBAN, Tax ID and Tax Numbers </h1>
        </header>

        <div>

          <form>
            <label className="label">USt ID: &#160;</label>
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
        <center>
          <button onClick={this.generateAllValues} id="buttontest" >
            Generate <i className="fas fa-random"></i>
          </button>
        </center>
      </div>
    );
  }
}

export default App;
