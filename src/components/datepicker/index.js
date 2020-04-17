import React, { Component } from 'react'
import { ButtonDropdown, DropdownToggle } from 'reactstrap'
import moment from 'moment';

import { DateRangePicker }  from 'react-bootstrap-daterangepicker'

import 'bootstrap-daterangepicker/daterangepicker.css'

class DateRangePicker2 extends Component{

  constructor(props) {
    super(props);

    this.state = {
      startDate: moment(),
      endDate: moment()
    }
  }

  componentDidMount() {
    const { ranges } = this.props;

    if(ranges) {
      Object.keys(ranges).map((key, index) => {
        if(index === 0) {
          this.setState({
            startDate: ranges[key][0],
            endDate: ranges[key][1]
          })
        }
      })
    }
  }

  handleEvent = (event, picker) => {
    event.preventDefault();
    this.setState({
      ...picker
    })

    this.props.getDate(picker)
  }

  setCustomAttribs = () => {
    document.querySelector('.daterangepicker').classList.add(window.localStorage.getItem('theme') || 'light')
  }

  render() {
    let nick_key = null;
    let { ranges, opens, getDate, className, showCustomRangeLabel=true } = this.props;
    let { startDate, endDate } = this.state;

    if(ranges) {
      Object.keys(ranges).map((key) => {
        if(startDate.format('YYYY-MM-DD') === ranges[key][0].format('YYYY-MM-DD') && endDate.format('YYYY-MM-DD') === ranges[key][1].format('YYYY-MM-DD')) {
          nick_key = key;
        }
      })
    }

    if(startDate !== null && nick_key === null) {
      nick_key = startDate.format('ll') + ' - ' + endDate.format('ll')
    }

    return (
        <div className={"datepicker2 " + className || ''}>
          <i className="fas fa-calendar mr-2"/>
          <DateRangePicker
              onShow={this.setCustomAttribs}
              startDate={startDate}
              showCustomRangeLabel={showCustomRangeLabel}
              endDate={endDate}
              showDropdowns
              showClearDates
              opens={opens || 'right'}
              ranges={ranges}
              getDate={getDate}
              onApply={this.handleEvent}
              locale={{
                format: "MMM DD, YYYY",
                daysOfWeek: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                monthNames: moment().localeData('en').months(),
                firstDay: 0
              }}
          >
            <ButtonDropdown className="date-select" toggle={()=>{}}>
              <DropdownToggle caret>
                {nick_key}
              </DropdownToggle>
            </ButtonDropdown>
          </DateRangePicker>

        </div>

    );
  }
}

export default DateRangePicker2