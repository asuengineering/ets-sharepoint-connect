import React from 'react'
import Button from 'react-bootstrap/Button';
import classes from './button.module.css'

export default function CustomButton({children, onClick, parentClasses, variant}) {
  return (
    <div className={[classes.button_div, "btn"].join(" ")}>
        <button className={[...parentClasses, classes.asu_button].join(" ")} onClick={onClick}>{children}</button>
    </div>
  )
}
