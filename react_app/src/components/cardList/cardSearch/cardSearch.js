import React from 'react'
import Form from 'react-bootstrap/Form';
import classes from './cardSearch.module.css'

export default function CardSeach({searchChange, searchString, handleMyAppsFilter,handlefseClsFilter, myAppsChecked, fseClsChecked}) {
  return (
    <div className={classes.container}>
        <Form className={`d-flex ${classes.form_container}`}>
            <Form.Control
                type="search"
                placeholder="Search"
                className={`me-2 ${classes.form_search}`}
                style={{width: "40%"}}
                aria-label="Search"
                onChange={searchChange}
                value={searchString}
            />
            <div className={classes.filters}>
              <div className={`mb-3 ${classes.filter_item}`}>
                <Form.Check // prettier-ignore
                  type="checkbox"
                  id="myApps"
                  label="ASU MyApps"
                  checked={myAppsChecked}
                  onChange={handleMyAppsFilter}
                />
              </div>
              <div className={`mb-3 ${classes.filter_item}`}>
                <Form.Check // prettier-ignore
                  type="checkbox"
                  id="fseClassroom"
                  label="FSE Cloud Classroom"
                  checked={fseClsChecked}
                  onChange={handlefseClsFilter}
                />
              </div>
            </div>
        </Form>
    </div>
  )
}
