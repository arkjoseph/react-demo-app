import React, { Component, propTypes } from 'react';
//import logo from './logo.svg';
import './App.css';
//import { findDOMNode } from 'react-dom';
import $ from 'jquery';
import { connect } from 'react-redux';
import { field, reduxForm } from 'redux-form';

/*
 * Build RecordBox Component
 */
class RecordBox extends Component {

  constructor() {
    super();

    this.state = {
      showResults: false,
      results: []
    };
  }

  componentWillMount(){
    this._fetchRecords();
  }

  render(){
    const records = this._getRecords();
    return (
      <div className="form-wrapper">
        <RecordFormFilters />
        <div className="company-filter">
        </div>
        {this._getPopularMessage(records.length)}
        <h4 className="comment-count">{this._getRecordsTitle(records.length)}</h4>
        <p><b>{this._getPopularMessage()}</b></p>
        <div className="comment-list">
          {records}
        </div>
      </div>
    );
  }

  // start polling process
  componentDidMount(){
    this._timer = setInterval(() => this._fetchRecords(), 5000);
  }


  componentWillUnmount() {
    clearInterval(this._timer);
  }


  _getPopularMessage(recordCount){
    const POPULAR_COUNT = 10;

    if (recordCount > POPULAR_COUNT) {
      return (
        <b>Post is popular!</b>
      );
    } else if (recordCount < POPULAR_COUNT) {
      return (
        <b>Post is average</b>
      );
    }
  }

  _getRecordsTitle(recordCount) {
    if (recordCount === 0) {
      return 'No Results.';
    } else if (recordCount === 1) {
      return '1 Result';
    } else {
      return `${recordCount} Results`;
    }
  }

  _addFilter(author,body) {
    // Create object
    const comment = {author,body};

    $.ajax({
      method: 'POST',
      url: 'http://apidata:8888/data.json',
      success: () => {
        this.setState({ records: this.state.records.concat([comment])  });
      },
      error: () => {
        console.log('error');
      }
    });
  }

  _deleteRecord(record){
    $.ajax({
      method: 'DELETE',
      url: `http://apidata:8888/data.json/${record.id}`
    })
  }

  // API Call
  _fetchRecords() {
    $.ajax({
      method: 'GET',
      url: 'https://inventory.data.gov/api/action/datastore_search?resource_id=6bee15c5-d9cb-412d-9523-ad8cf1e2801a&limit=25',
      success: (results) => {
        this.setState({ results: results.result.records });
      },
      error: () => {
        console.log('error');
      }
    });
  }

  _getRecords() {
    return this.state.results.map((item) => {
      return <Record
        state={item["state"]}
        phone={item["Vendor Phone Number"]}
        performance_city={item["Principal Place of Performance City Name"]}
        piid={item["PIID"]}
        performance_zip={item["Place of Performance Zip Code"]}
        zip={item["Zip"]}
        product_code={item["Product or Service Code"]}
        product_description={item["Product or Service Description"]}
        performance_state={item["Principal Place of Performance State Code"]}
        completion_date={item["Est. Ultimate Completion Date"]}
        action_obligation={item["Action Obligation"]}
        street={item["Street"]}
        duns_number={item["DUNS Number"]}
        contractor_name={item["Contractor Name"]}
        date_signed={item["Date Signed"]}
        vendor_city={item["Vendor City"]}
        naics_description={item["NAICS Description"]}
        effective_date={item["Effective Date"]}
        naics_code={item["NAICS Code"]}
        key={item["_id"]}
      />
    });
  }
}

/*
 * Build Record Component
 */
class Record extends Component {

  render() {
    let vendor_city = this.props.vendor_city,
        street = this.props.street,
        contractor_name = this.props.contractor_name,
        phone = this.props.phone,
        naics_code = this.props.naics_code,
        performance_city = this.props.performance_city,
        performance_state = this.props.performance_state,
        f_performance_zip = this._zipCodeFormating(this.props.performance_zip),
        f_zip = this._zipCodeFormating(this.props.zip),
        description = this.props.product_description,
        f_effective_date = this._dateFormating(this.props.effective_date),
        piid = this.props.piid,
        f_completion_date = this._dateFormating(this.props.completion_date),
        naics_description = this.props.naics_description,
        product_code = this.props.product_code,
        date_signed = this._dateFormating(this.props.date_signed);

    return (
      <div className="comment">
        <h4 className="comment-body">
         {contractor_name}
        </h4>
        <div className="vcard">
          <p className="street-address">
            {street}
          </p>
          <p className="vendor_city">
            {vendor_city}, {f_zip}
          </p>
          <p className="tel">
            {phone}
          </p>
        </div>
        <div className="naics-code">
          NAICS Code: {naics_code}
        </div>
        <div className="performance-region">
          Performance Region: [missing]
        </div>
        <div className="performance-place">
          Performance Place: {performance_city}, {performance_state} {f_performance_zip}
        </div>
        <hr />
        <div className="description">
          P/S Description: {description}
        </div>
        <div className="piid">
          PIID: {piid}
        </div>
        <div className="date">
          Effective Date: {f_effective_date}
        </div>
        <div className="date">
          Completion Date: {f_completion_date}
        </div>
        <div className="naics-description">
          NAICS Description: {naics_description}
        </div>
        <div className="product-code">
          Product Code: {product_code}
        </div>
        <div className="date-signed">
          Product Code: {date_signed}
        </div>
        <hr />
      </div>
    );
  }

  _dateFormating(item) {
    let f_date = item.split('T')[0];
    return f_date;
  }

  _zipCodeFormating(item){
    let f_zip = item.substr(0, 5)+"-"+item.substr(5);
    return f_zip;
  }

  _handleDelete(event){
    event.preventDefault();
    this.props.onDelete(this.props.comment);
    //var result = ("Are you sure?");
    //if (result) {
    //  this.props.onDelete(this.props.comment);
    //}

  }

  _toggleAbuse(event){
    event.preventDefault();
    this.state({
      isAbusive: !this.state.isAbusive
    });
  }

}

class RemoveRecordConfirmation extends Component {
  constructor() {
    super();

    this.state = {
      showConfirm: false
      }
  }
}

class RecordFormFilters extends Component {

  render(){
    return (
      <form className="record-form" onSubmit={this._handleSubmit.bind(this)}>

        <CompanyFilter companies={this._getCompanies.bind(this)} />

        <div className="naics-filter">
          <label>NAICS Code</label>
            <select>  </select>
        </div>
        <div className="hq-state-filter">
          <label>Company headquarters state</label>
          <select
            //ref=
            value=""
            type="select">
            <option value="">- Select State-</option>
          </select>
        </div>
        <div className="work-state">
          <label>Workplace State</label>
          <select
            //ref=
            value=""
            type="select">
            <option value="">- Select State-</option>
          </select>
        </div>
        <div className="comment-form-actions">
          <button type="submit">
            Post comment
            </button>
          </div>
      </form>
    );
  }

  _getCompanies() {
    return this.state.results.map(item => item["Contractor Name"]);
  }
  _getCharacterCount(){
    this.setState({
      characters: this._body.value.length
    });
  }

  _handleSubmit(event){
    event.preventDefault();

    if (!this._author.value || !this._body.value) {
      alert('Please enter your name and comment');
      return;
    }


    let author = this._author;
    let body = this._body;

    this.props.addFilter(author.value, body.value);
  }
}

class CompanyFilter extends Component {
  render() {

    const { companies = [] } = this.props;

    return (
      <div className="comment-avatars">
        <label>Companies</label>
        <select>
          {companies.map((contractor_name, i) => (
            <option value={contractor_name} key={i}>
              {contractor_name}
            </option>
          ))}
        </select>
      </div>
    )
  }
}

export default RecordBox;
