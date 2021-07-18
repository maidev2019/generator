import React from 'react';
import './App.css';
import ReactModal from 'react-modal';
import { Form } from 'react-bootstrap'; 
import { CSVLink } from "react-csv";

import { buildIbans } from './mapp4';
import { createSteuerIdDigits } from './strId';


ReactModal.setAppElement('#main');

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

const csvHeaders = [
  { label: "Environment", key: "environment" },  
  { label: "Program", key: "program" },
  { label: "TaxNumber", key: "taxnumber" },
  { label: "TaxID", key: "taxid" },
  { label: "IBAN", key: "iban" },
  { label: "RequestNumber", key: "requestnumber" },
  { label: "ProcessNumber", key: "processnumber" },
];
 
const csvData = [];

function buildUSTID(country) {
  const countryEntry = countriesForUmsatzID.find(obj => obj.label === country);
  const num = countryEntry.value + Math.floor(Math.random() * (999999999 - 100000000));
  return num;
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      country: 'Germany',
      iban: buildIbans('Germany'),
      taxIDNumber: createSteuerIdDigits(),
      bundesland: 'Alle Bundesländer',
      taxNumber: gm.generate('DE', 'stnr'),
      ustIDCountry: 'Deutschland',
      ustID: buildUSTID('Deutschland'),

      showModal: false,
      environment:'STAGE',
      programm:'NSH',
      request: 'NSH1p-',
      process:'',
      requestTaxNum:'',
      requestTaxID: '',
      requestIban: ''
    };

    this.bundeslandHandlerTaxNum = this.bundeslandHandlerTaxNum.bind(this);
    this.handleSubmitTaxNum = this.handleSubmitTaxNum.bind(this);
    this.handleSubmitTaxID = this.handleSubmitTaxID.bind(this);
    this.countryHandler = this.countryHandler.bind(this);
    this.handleSubmitIBAN = this.handleSubmitIBAN.bind(this);
    this.generateAllValues = this.generateAllValues.bind(this);
    this.handleSubmitUstID = this.handleSubmitUstID.bind(this);
    this.handleOnChangeUstID = this.handleOnChangeUstID.bind(this);
    // CSV and Modal handler 
    this.handleCSVData = this.handleCSVData.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleSaveData = this.handleSaveData.bind(this);
    
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
    this.setState({
      country: value,
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
    const num = buildUSTID(this.state.ustIDCountry);
    
    this.setState({
      taxIDNumber: createSteuerIdDigits(),
      taxNumber: stnr,
      iban: buildIbans(this.state.country),
      ustID: num
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

// CSV and Modal handler BEGIN
  handleCSVData(e){
    console.log("Click");
  }
  handleOpenModal () {
    this.setState({ showModal: true });
  }
  
  handleCloseModal () {
    this.setState({ showModal: false });
  }
  handleSaveData(){
   
    csvData.push({  environment: this.state.environment, 
                    program: this.state.programm, 
                    taxnumber: this.state.requestTaxNum === '' ? this.state.taxNumber : this.state.requestTaxNum,
                    taxid: this.state.requestTaxID === '' ? this.state.taxIDNumber:this.state.requestTaxID, 
                    iban: this.state.requestIban === '' ? this.state.iban :this.state.requestIban, 
                    requestnumber: this.state.request, 
                    processnumber: this.state.process,  });
    this.handleCloseModal();
  }
// CSV and Modal handler END


  render() {
    return (
      <div className="App">
        <header >
          <h1>Generator for VAT ID, Tax ID, Tax Number and IBAN </h1>
        </header>

        <div>

          <form>
            <label className="label">VAT ID: &#160;</label>
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
          <div>
            <button  id="generatorAll" onClick={this.generateAllValues} className="buttontest">
            <i className="fas fa-random"></i> Generate 
            </button>
          </div>
          
        </center>
        <div>.</div>
        <center>
          <div>
            <button className="buttontest Spacing" onClick={this.handleOpenModal}> <i class="fas fa-plus-square"></i> Add to CSV</button>
            <CSVLink  className="buttontest Decoration Spacing Spacing" data={csvData} headers={csvHeaders} filename={"UBHData.csv"}><i class="fas fa-cloud-download-alt"></i> Download CSV</CSVLink>
            
            <ReactModal isOpen={this.state.showModal} 
                        contentLabel="onRequestClose Example"
                        onRequestClose={this.handleCloseModal}
                        className="Modal"
                        overlayClassName="Overlay">
              <p className="ModalText" >Save the information about NSH1P for testing NSHXP cases! </p>
              <br></br>
              <Form>
                <Form.Group size="lg">
                <Form.Label className="ModalLabel" >Environment</Form.Label>
                  <Form.Label className="ModalLabel" >Program</Form.Label>
                  <Form.Label className="ModalLabel" >RequestID</Form.Label>
                  <Form.Label className="ModalLabel" >ProcessID</Form.Label>
                  <Form.Label className="ModalLabel" >TaxID</Form.Label>
                  <Form.Label className="ModalLabel" >TaxNumber</Form.Label>
                  <Form.Label className="ModalLabel" >Iban</Form.Label>
                </Form.Group>
                <Form.Group size="lg">
                <Form.Control className = "ModalInput" type="text" defaultValue="STAGE" onInput={e => this.setState({environment: e.target.value})} />
                  <Form.Control className = "ModalInput" type="text" defaultValue="NSH" onInput={e => this.setState({programm: e.target.value})} />
                  <Form.Control className = "ModalInput" type="text" defaultValue="NSH1P-" onInput={e => this.setState({request: e.target.value})}/>
                  <Form.Control className = "ModalInput" type="text" defaultValue="" onInput={e => this.setState({process: e.target.value})}/>
                  <Form.Control className = "ModalInput" type="text" defaultValue={this.state.taxNumber} onInput={e => this.setState({requestTaxNum: e.target.value})}/>
                  <Form.Control className = "ModalInput" type="text" defaultValue={this.state.taxIDNumber} onInput={e => this.setState({requestTaxID: e.target.value})}/>
                  <Form.Control className = "ModalInput" type="text" defaultValue={this.state.iban} onInput={e => this.setState({requestIban: e.target.value})} />
                </Form.Group>                
              </Form>

              <br></br>
              <center>
                <button className="ModalCloseButton" onClick={this.handleCloseModal}>Close</button>
              
                <button className="Spacing ButtonModal" onClick={this.handleSaveData}>Save Changes</button>
              </center>
              
            </ReactModal>
          </div>
          
        </center>
      
      </div>
    );
  }
}

export default App;

