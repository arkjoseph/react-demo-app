import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
//import { findDOMNode } from 'react-dom';
import $ from 'jquery';
//import { connect } from 'react-redux';
//import { field, reduxForm } from 'redux-form';

/*
 * Build Wrapper Component
 */

class AppWrapper extends Component {
  constructor() {
    super();
    this.state = {
      showResults: false,
      results: []
    }
  }

  render(){
    return (
      <div className="app-wrapper">
        <AppContainer />
      </div>
    )
  };
}

class AppContainer extends Component {
  constructor() {
    super();
    this.state = { results: [] }
  }
// REACT Life Cycles
  componentWillMount(){
    this._fetchData();
  }
  componentDidMount(){
    this._timer = setInterval(() => this._fetchData(), 5000);
  }
  componentWillUnmount() {
    clearInterval(this._timer);
  }
  render() {
    const ResultRows = this._mapFields();
    return (
      <div>
        <form className="react-form">
          <SearchBar
            names={this.state.results.map(item => item["Contractor Name"])}
            naics_codes={this.state.results.map(item => item["NAICS Code"])}
          />
        </form>
        <div className="filtered-results">
          {ResultRows}
        </div>
      </div>      
    )
  };

  // API Call
  _fetchData() {
    $.ajax({
      cache: 'true',
      method: 'GET',
      url: 'http://apidata:8888/inventory.json',
      //url: 'https://inventory.data.gov/api/action/datastore_search?resource_id=6bee15c5-d9cb-412d-9523-ad8cf1e2801a&limit=25',
      success: (results) => {
        this.setState({ results: results.result.records });
      }, error: () => {
        console.log('$ ajax error');
      }
    });
  }
  _fetchStates() {
    $.ajax({
      cache: 'true',
      method: 'GET',
      url: 'http://apidata:8888/states.json',
      success: (states) => {
        this.setState({ states: states.region.state });
      }, error: () => {
        console.log('$ ajax error');
      }
    });
  }

  _mapFields(){
    return this.state.results.map((item) => {
      return <ResultRow
        state               ={item["state"]}
        phone               ={item["Vendor Phone Number"]}
        performance_city    ={item["Principal Place of Performance City Name"]}
        piid                ={item["PIID"]}
        performance_zip     ={item["Place of Performance Zip Code"]}
        zip                 ={item["Zip"]}
        product_code        ={item["Product or Service Code"]}
        product_description ={item["Product or Service Description"]}
        performance_state   ={item["Principal Place of Performance State Code"]}
        completion_date     ={item["Est. Ultimate Completion Date"]}
        action_obligation   ={item["Action Obligation"]}
        street              ={item["Street"]}
        duns_number         ={item["DUNS Number"]}
        contractor_name     ={item["Contractor Name"]}
        date_signed         ={item["Date Signed"]}
        vendor_city         ={item["Vendor City"]}
        naics_description   ={item["NAICS Description"]}
        effective_date      ={item["Effective Date"]}
        naics_code          ={item["NAICS Code"]}
        key                 ={item["_id"]}
      />
    });
  }
}

class ResultRow extends Component {
  render(){
    //let filter            = this.props.filter,
    //    filteredData      = this.props.filter((item) => {
    //                          return (!filter || item.value == filter)
    //
    //                        });

    let vendor_city       = this.props.vendor_city,
      street              = this.props.street,
      contractor_name     = this.props.contractor_name,
      phone               = this.props.phone,
      naics_code          = this.props.naics_code,
      performance_city    = this.props.performance_city,
      performance_state   = this.props.performance_state,
      f_performance_zip   = this._zipCodeFormating(this.props.performance_zip),
      f_zip               = this._zipCodeFormating(this.props.zip),
      description         = this.props.product_description,
      f_effective_date    = this._dateFormating(this.props.effective_date),
      piid                = this.props.piid,
      f_completion_date   = this._dateFormating(this.props.completion_date),
      naics_description   = this.props.naics_description,
      product_code        = this.props.product_code,
      date_signed         = this._dateFormating(this.props.date_signed);

    return(
      <div className="well">
        <div className="contractor-name"><b>{contractor_name}</b></div>
        <div className="vcard">
          <p className="street-address">{street}</p>
          <p className="vendor_city">{vendor_city}, {f_zip}</p>
          <p className="tel">{phone}</p>
        </div>
      </div>
    )
  };

  _dateFormating(item) {
    let f_date = item.split('T')[0];
    return f_date;
  }

  _zipCodeFormating(item){
    let f_zip = item.substr(0, 5)+"-"+item.substr(5);
    return f_zip;
  }
}

class SearchBar extends Component {
  constructor(props){
    super(props);
  }
  render(){

    const { names       = [] } = this.props,
          { naics_codes = [] } = this.props;

    return (
      <div className="filters">
        <div className="filters-by-name">
          <label name="names">Filter by Name</label>
            <select name="names" onChange={this._handleChange.bind(this)} >
              <option value=""> - Make a Selection - </option>
              {names.map((contractor_name, index) => (
                <option value={contractor_name} key={index}>
                  {contractor_name}
                </option>
              ))}
            </select>
          </div>
        <div className="filter-by-naics-code">
          <label name="names">Filter by NAICS Code</label>
          <select name="names">
            <option value=""> - Make a Selection - </option>
            {naics_codes.map((naics_code, i) => (
              <option value={naics_code} key={i}>
                {naics_code}
              </option>
            ))}
          </select>
        </div>
      </div>

    )
  };

  _getInitialState(){
    return {value: ""}
  }
  _handleChange(event){
    this.setState({value: event.target.value});

    console.log(event.target.value);

    return;
  }
}

export default AppWrapper;