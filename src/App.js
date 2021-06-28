import React, { useState } from 'react';
import './App.css';

import { buildIbans } from './mapp4';
import { createSteuerIdDigits } from './strId';
const gm = require('avris-generator');

var countriesForIBAN = [
  { value: 'Croatia', label: 'Kroatien', select: false },
  { value: 'Denmark', label: 'Dänemark', select: false },
  { value: 'Egypt', label: 'Ägypten', select: false },
  { value: 'France', label: 'Frankreich', select: false },
  { value: 'Germany', label: 'Deutschland', select: true },
  { value: 'Greece', label: 'Griechenland', select: false },
  { value: 'Iran', label: 'Iran', select: false },
  { value: 'Ireland', label: 'Ireland', select: false },
  { value: 'Italy', label: 'Italien', select: false },
  { value: 'Luxembourg', label: 'Luxemburg', select: false },
  { value: 'Netherlands', label: 'Niederland', select: false },
  { value: 'Switzerland', label: 'Schweiz', select: false },
  { value: 'Turkey', label: 'Türkei', select: false },
  { value: 'UK', label: 'Großbritanien', select: false },
];

function getIndex(country) {
  return countriesForIBAN.findIndex(obj => obj.value === country);
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
      taxNumber: gm.generate('DE', 'stnr')
    };
    this.bundeslandHandlerTaxNum = this.bundeslandHandlerTaxNum.bind(this);
    this.handleSubmitTaxNum = this.handleSubmitTaxNum.bind(this);
    this.handleSubmitTaxID = this.handleSubmitTaxID.bind(this);
    this.countryHandler = this.countryHandler.bind(this);
    this.handleSubmitIBAN = this.handleSubmitIBAN.bind(this);
    this.generateAllValues = this.generateAllValues.bind(this);
  }

  bundeslandHandlerTaxNum(e) {   
    console.log("e.target.value: ", e.target.value);
    this.setState({ bundesland: e.target.value});
    e.preventDefault();
  };
  handleSubmitTaxNum(e) {
    var bl = this.state.bundesland;
    const stnr = bl === 'all' ? gm.generate('DE', 'stnr') : gm.generate('DE', 'stnr', {state:bl});
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
    const stnr = bl === 'all' ? gm.generate('DE', 'stnr') : gm.generate('DE', 'stnr', {state:bl});
  
    this.setState({
      taxIDNumber: createSteuerIdDigits(),
      taxNumber: stnr,
      iban: buildIbans(this.state.country)
    });

  }

  render() {
    return (
      <div className="App">
        <header >
          <h1>Generator for IBAN, Tax ID and Tax Numbers </h1>
        </header>

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
                  <option value={option.value}>{option.label}</option>
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
