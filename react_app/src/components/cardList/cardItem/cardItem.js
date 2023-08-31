import React from 'react'
import Card from 'react-bootstrap/Card';
import Button from '../../../ui/button/button';

export default function CardItem({item, handleClick}) {

  let descp = "";
  if(item.software_description !== "") {
    let d = item.software_description;
    if(d.length>=50){
      d = d.substring(0,48) + "...";
    }
    descp = d;
  }

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img style={{height: "250px"}} variant="top" src={item.image_link ? item.image_link : "https://2.img-dpreview.com/files/p/E~TS940x788~articles/2988339509/BlogHeader_150-1-1800x0-c-default_copy.jpeg"} />
      <Card.Body>
        <Card.Title style={{height: "50px"}}>{item.software == "" ? "[No Software Title]" : item.software}</Card.Title>
        <Card.Text style={{height: "75px"}}>{descp}</Card.Text>
        <div>
          <Button parentClasses={[]} variant="primary" onClick={handleClick} >More Details</Button>
        </div>
        
      </Card.Body>
    </Card>
  )
}
