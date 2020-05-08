import React, { PureComponent } from 'react';
import { AreaChart, ResponsiveContainer, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Loader } from 'components';
import * as moment from 'moment/moment';

import './style.scss'


class RevenueChart extends PureComponent {

  render() {

    const { data, range } = this.props;

    if(!data.length) {
      return <Loader />
    }
    const days = data.map(({ day_value }) => day_value)
    const months = data.map(({ month }) => month)
    const years = data.map(({ year }) => year)
    const revenues = data.map(({ revenue }) => revenue)
    const orders = data.map(({ orders_count }) => orders_count)

    let dataset = [];

    days.map((day, key) => {
      dataset.push({
        day: day,
        revenue: revenues[key],
        month: months[key],
        year: years[key],
        order: orders[key],
      });
    });

    const CustomTooltip = ({ active, payload }) => {
      if (active) {

        let { day, month, year } = payload[0].payload;

        return (
            <div className={"custom-tooltip"}>
              <p className="label"><b>{day} {month} {year}</b></p>
              <p className="intro">Revenue: <b>{payload[1].value.toFixed(2)}</b></p>
              <p className="intro">Order: <b>{payload[0].value}</b></p>
            </div>
        );
      }

      return null;
    };

    const CustomizedAxisTick = ({ x, y, payload }) => {
        return (
            <text x={x} y={y} dy={16} dx={-6} fontSize={12} textAnchor="middle" fill="#666">
              {range === 'daily' ? dataset[payload.index].day : null}
              &nbsp;{dataset[payload.index].month}&nbsp;
              {range !== 'daily' ? dataset[payload.index].year : null}
            </text>
        );
    };

    return (
        <ResponsiveContainer width={"100%"} height={350}>
          <AreaChart height={350} data={dataset} margin={{ top: 10, right: 10, left: -30, bottom: 0 }} >
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
            <XAxis
                stroke={"#e8e8e8"}
                tick={CustomizedAxisTick}
                interval={dataset.length >= 14 ? 1 : 0}
            />
            <YAxis stroke={"#e8e8e8"} axisLine={{ stroke: "#666" }} tick={{ fontSize: 12, fill: '#666' }}  />
            <Tooltip cursor={{ stroke: '#666', strokeWidth: 1, strokeDasharray: "5 5" }} content={CustomTooltip}/>
            <Area
                strokeWidth={2}
                type="monotone"
                dataKey="order"
                stackId="2"
                stroke="#007eff"
                fill="url(#fillBlue)"
                fillOpacity={0.7}
                activeDot={{ r: 6, fill: '#007eff', fillOpacity: 1 }}
            />
            <Area
                strokeWidth={2}
                type="monotone"
                dataKey="revenue"
                stackId="2"
                stroke="#613BEA"
                fill="url(#fillPurple)"
                fillOpacity={0.4}
                activeDot={{ r: 6, fill: '#613BEA', fillOpacity: 1 }}
            />
          </AreaChart>
        </ResponsiveContainer>
    )
  }
}

export default RevenueChart