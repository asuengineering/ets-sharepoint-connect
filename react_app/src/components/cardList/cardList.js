import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import CardItem from './cardItem/cardItem'
import CardSearch from './cardSearch/cardSearch'
import ItemPagination from './itemPagination/itemPagination'
import CardItemDetail from './cardItemDetail/cardItemDetail';
import classes from './cardList.module.css'
import axios from 'axios';

export default function CardList() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalItem, setModalItem] = useState({});
  const [searchString, setSearchString] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [myAppsChecked, setMyAppsChecked] = useState(false);
  const [fseClsChecked, setfseClsChecked] = useState(false);
  const [totalItems, setTotalItems] = useState(0);


  useEffect(() => {
    axios.get('http://10.220.67.187/wordpress/index.php/wp-json/get-data/v1/data')
    .then(body => {
      let dataJson = JSON.parse(body.data);
      let filteredData = dataJson.filter(x => (x.my_apps === "Yes" || x.available_offcampus === "Yes" || x.fse_classroom !== "" || x.classroom !== "[]") && x.software);
      setTotalPages(Math.ceil(filteredData.length/12));
      setTotalItems(filteredData.length);
      setItems([...filteredData]);
      setCurrentPage(1);
      setFilteredItems([...filteredData]);
      setLoading(false);
    })
    .catch(error => {
      console.error(error)
    })
  }, []);

  useEffect(() => {
    handleFilterItems();
  }, [searchString, myAppsChecked, fseClsChecked]);


  const searchStringChange = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setSearchString(e.target.value);
  }

  const handleMyAppsFilter = (e) => {
    e.preventDefault();
    setMyAppsChecked(e.target.checked)
  }

  const handlefseClsFilter = (e) => {
    e.preventDefault();
    setfseClsChecked(e.target.checked)
  }

  const paginationClicked = (e) => {
    setCurrentPage(e);
  }

  const handleShowModel = (item) => {
    setModalItem({...item});
    setShowModal(true);
  }

  const handleCloseModel = () => {
    setShowModal(false);
  }

  const handleFilterItems = _ => {
    setLoading(true);
    let newItems = items;
    newItems = [...newItems.filter(x => x.software.toLowerCase().includes(searchString.toLowerCase()))]

    if(myAppsChecked) {
      newItems = [...newItems.filter(x => x.my_apps === "Yes")];
    }

    if(fseClsChecked) {
      newItems = [...newItems.filter(x => x.fse_classroom !== "")];
    }

    setFilteredItems([...newItems])
    setTotalPages(Math.ceil(newItems.length/12));
    setTotalItems(newItems.length);
    setCurrentPage(1);
    setLoading(false);
  } 

  let itemsView = null;
  if(!loading){
    let currentPageItems = filteredItems;
    if(totalPages > 1) {
      let sPageNum = (currentPage-1)*12;
      currentPageItems = filteredItems.slice(sPageNum, sPageNum+12);
    }
    let itemsViewList = currentPageItems.map((x, i) => {
      return (
        <Col key={i} style={{width: 'auto'}}>
          <CardItem style={{height: '400px'}} handleClick={() => handleShowModel(x)} item={x} />
        </Col>
        );
    })

    itemsView = (
      <>
        <CardSearch searchChange={searchStringChange} searchString={searchString} handleMyAppsFilter={handleMyAppsFilter} myAppsChecked={myAppsChecked} handlefseClsFilter={handlefseClsFilter} fseClsChecked={fseClsChecked} />
        {showModal ? <CardItemDetail show={showModal} item={modalItem} handleClose={handleCloseModel} /> : null }
        <Row xs={1} md={2} className="g-4">
          {itemsViewList}
        </Row>
        {totalPages > 1 ? <ItemPagination totalItems={totalItems} changePage={paginationClicked} currentPage={currentPage} totalPages={totalPages}/> : null}
      </>
    );
  }

  return (
    <div className={`container ${classes.card_list_container}`}>
      {loading ? (<h4>Loading........</h4>) : itemsView}
    </div>
  )
}
