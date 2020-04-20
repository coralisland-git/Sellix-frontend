import React, { PureComponent } from 'react';
import { AreaChart, ResponsiveContainer, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

import './style.scss'


export default class Charts extends PureComponent {

  render() {

    const { data, height, isRevenue, isQuery, isView } = this.props

    const days = data.map(({ day_value }) => day_value)
    const revenues = data.map(({ revenue }) => revenue)
    const orders = data.map(({ orders_count }) => orders_count)
    const views = data.map(({ views_count }) => views_count)
    const queries = data.map(({ queries_count }) => queries_count)
    const months = data.map(({ month }) => month)
    const years = data.map(({ year }) => year)

    let dataset = [];

    days.map((day, key) => {
      dataset.push({
        day: day,
        year: years[key],
        month: months[key],
        revenue: revenues[key],
        order: orders[key],
        view: views[key],
        query: queries[key],
        // yaxis: revenues.length > ,
      })
    });

    const CustomTooltip = ({ active, payload }) => {
      if (active) {
        return (
            <div className={"custom-tooltip"}>
              <p className="label"><b>{`${payload[0].payload.day} ${payload[0].payload.month} ${payload[0].payload.year}`}</b></p>
              {
                isRevenue &&
                    <>
                      <p className="intro">Revenue: <b>{payload[1].value}</b></p>
                      <p className="intro">Order: <b>{payload[0].value}</b></p>
                    </>
              }
              {
                isView && <p className="intro">View: <b>{payload[0].value}</b></p>
              }
              {
                isQuery && <p className="intro">Query: <b>{payload[0].value}</b></p>
              }
            </div>
        );
      }

      return null;
    };

    return (
        <div className={'charts-container'}>
          <ResponsiveContainer width={"100%"} height={height}>
            <AreaChart height={height} data={dataset} margin={{ top: 10, right: 0, left: -30, bottom: 0 }} >
              <defs>
                <linearGradient id="fillPurple" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0" stopColor="#613BEA" stopOpacity={1} />
                  <stop offset="100%" stopColor="#613BEA" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillBlue" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0" stopColor="#007eff" stopOpacity={1} />
                  <stop offset="100%" stopColor="#007eff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0 0" vertical={false} />
              <XAxis stroke={"#e8e8e8"} axisLine={{ stroke: "#666" }} tick={{ fontSize: 12, fill: '#666' }} dataKey="day" />
              <YAxis stroke={"#e8e8e8"} axisLine={{ stroke: "#666" }} tick={{ fontSize: 12, fill: '#666' }}  />
              <Tooltip cursor={{ stroke: '#666', strokeWidth: 1, strokeDasharray: "5 5" }} content={CustomTooltip}/>

              {isRevenue &&
              <Area
                  isAbove
                  strokeWidth={2}
                  type="monotone"
                  dataKey="order"
                  stackId="3"
                  stroke="#007eff"
                  fill="url(#fillBlue)"
                  fillOpacity={0.7}
                  activeDot={{ r: 6, fill: '#007eff', fillOpacity: 1 }}
              />
              }
              {isRevenue &&
                <Area
                    strokeWidth={2}
                    type="monotone"
                    dataKey="revenue"
                    stackId="3"
                    stroke="#613BEA"
                    fill="url(#fillPurple)"
                    fillOpacity={0.4}
                    activeDot={{ r: 6, fill: '#613BEA', fillOpacity: 1 }}
                />
              }

              {isView &&
              <Area
                  strokeWidth={2}
                  type="monotone"
                  dataKey="view"
                  stackId="3"
                  stroke="#613BEA"
                  fill="url(#fillPurple)"
                  fillOpacity={0.7}
                  activeDot={{ r: 6, fill: '#613BEA', fillOpacity: 1 }}
              />
              }
              {isQuery &&
              <Area
                  strokeWidth={2}
                  type="monotone"
                  dataKey="query"
                  stackId="4"
                  stroke="#613BEA"
                  fill="url(#fillPurple)"
                  fillOpacity={0.7}
                  activeDot={{ r: 6, fill: '#613BEA', fillOpacity: 1 }}
              />
              }
            </AreaChart>
          </ResponsiveContainer>
        </div>
    );
  }
}

