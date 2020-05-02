import React from 'react'


const renderShowsTotal = (start, to, total) => <p className={'total-items'}>Show { start } to { to } of { total } entries</p>

export const tableOptions = (params={}) => ({
    page: 1,
    sizePerPage: 5,
    pageStartIndex: 1,
    paginationSize: 3,
    prePage: <span><i className={'fas fa-caret-left'} />&nbsp;&nbsp;Prev</span>,
    nextPage: <span>Next&nbsp;&nbsp;<i className={'fas fa-caret-right'} /></span>,
    firstPage: 'First',
    lastPage: 'Last',
    paginationShowsTotal: renderShowsTotal,
    paginationPosition: 'bottom',
    hideSizePerPage: true,
    ...params
})