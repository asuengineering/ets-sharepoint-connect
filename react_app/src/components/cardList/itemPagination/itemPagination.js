import React from 'react'
import Pagination from 'react-bootstrap/Pagination';
import classes from './itemPagination.module.css'

export default function ItemPagination({changePage, currentPage, totalPages, totalItems}) {

    let previousEllipse = false;
    if(currentPage-2 > 1) {
        previousEllipse = true;
    }

    let nextEllipse = false;
    if(currentPage+2 < totalPages) {
        nextEllipse = true;
    }

    let displayPageItems = [];
    for(let i = Math.max(1, currentPage-2); i <= Math.min(totalPages, currentPage+2); i++){
        displayPageItems.push((
            <Pagination.Item 
                key={i}
                active={currentPage === i}
                onClick={() => changePage(i)}
                >{i}
            </Pagination.Item>
        ))
    }

    return (
        <div className={classes.container}>
            <div className={classes.pag_div}>
                <Pagination>
                    <Pagination.First onClick={() => changePage(1)} />
                    <Pagination.Prev disabled={currentPage === 1} onClick={() => changePage(currentPage-1)} />
                    {previousEllipse ? <Pagination.Ellipsis /> : null}
                    {displayPageItems}
                    {nextEllipse ? <Pagination.Ellipsis /> : null}
                    <Pagination.Next disabled={currentPage === totalPages} onClick={() => changePage(currentPage+1)}/>
                    <Pagination.Last onClick={() => changePage(totalPages)}/>
                </Pagination>
                <div className={classes.total_items_div}>
                    ({totalItems} items showing)
                </div>
            </div>
        </div>
    )
}
