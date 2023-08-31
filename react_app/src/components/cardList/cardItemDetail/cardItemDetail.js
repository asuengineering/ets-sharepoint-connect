import React from 'react'
import Modal from 'react-bootstrap/Modal';
import classes from './cardItemDetail.module.css'

export default function CardItemDetail({item, show, handleClose}) {
    let classrooms = null;
    if(item.classroom != "[]") {
        let classroom_array = item.classroom.trim().split(",");
        let classroom_obj = classroom_array.map((x,i) => {
            let a = x.toLowerCase().replace(/\s+/g, '-');
            if(i === classroom_array.length - 1){
                return (
                    <div key={i} style={{display: "inline"}}>
                        <a className={classes.classroom_link} href={`https://ets.engineering.asu.edu/${a}`} target="_blank">{x}</a>
                    </div>
                )
            }else {
                return (
                    <div key={i} style={{display: "inline"}}>
                        <a className={classes.classroom_link} href={`https://ets.engineering.asu.edu/${a}`} target="_blank">{x}</a>
                        <span>, </span>
                    </div>
                )
            }
            
        });

        classrooms = (
            <div style={{display: "inline", marginLeft: "4px"}}>
                {classroom_obj}
            </div>
        )
    }

    let online_softwares = [];

    // let myAppsLink = null;
    if(item.my_apps == "Yes") {
        let softwareTitle = item.software.toLowerCase().replace(/\s+/g, '-');
        // myAppsLink = (
        //     <a className={classes.classroom_link} href={`https://myapps.asu.edu/app/${softwareTitle}`} target="_blank">ASU MyApps</a>
        // )

        online_softwares.push({
            key: "myApps",
            view: (<a className={classes.classroom_link} href={`https://myapps.asu.edu/app/${softwareTitle}`} target="_blank">ASU MyApps</a>)
        });
    }

    if(item.fse_classroom !== "") {
        online_softwares.push({
            key: "fseClassroom",
            view: (
            <a  className={classes.classroom_link} href={`https://ets.engineering.asu.edu/fse-cloud-classroom/`} target="_blank">FSE Cloud Classroom</a>
            )
        })
    }

    let offCampusComments = null;
    if(item.available_offcampus == "Yes") {
        let s = item.offcampus_comments
        let i = 0,n = s.length;
        while(i+1<n){
            if(s[i]=='>' && s[i+1]!='<') break;
            i++;
        }
        if(i+1!=n) {
            i++;
            let si = i;
            while(i<n && s[i]!='<') i++;
            offCampusComments = s.substring(si,i);
        }

        let software_search_string = item.software.toLowerCase().replace(/\s+/g, '+');

        online_softwares.push({
            key: "offCampus",
            view: (
                <a key="offCampus" className={classes.classroom_link} href={`https://www.google.com/search?q=${software_search_string}`} target="_blank">Direct from Vendor</a>
            )
        })
        
    }

    let online_software_view = null;
    if(online_softwares.length > 0) {
        let online_obj = online_softwares.map((x,i) => {
            if(i === online_softwares.length - 1){
                return (
                    <div key={x.key} style={{display: "inline"}}>
                        {x.view}
                    </div>
                )
            }else {
                return (
                    <div key={x.key} style={{display: "inline"}}>
                        {x.view}
                        <span>, </span>
                    </div>
                )
            }
            
        });

        online_software_view = (
            <div style={{display: "inline", marginLeft: "4px"}}>
                {online_obj}
            </div>
        )
    }

    let stakeholders = null;
    if(item.stakeholders != "") {
        let s = item.stakeholders;
        s = s.substring(1, s.length - 1);
        let a = s.split(",");
        stakeholders = a.map(x => x.substring(1,x.length-1)).join(", "); 
    }

    let osSupported = null;
    if(item.os_supported != "") {
        let s = item.os_supported;
        s = s.substring(1, s.length - 1);
        let a = s.split(",");
        osSupported = a.map(x => x.substring(1,x.length-1)).join(", "); 
    }


    return (
        <Modal size="lg" style={{marginTop: "30px"}} show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>{item.software == "" ? "[No Software Title]" : item.software}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {item.software_description ? <div className={classes.body_div}> <b>Description</b>: {item.software_description}</div> : null }
                {item.about ? (<div className={classes.body_div}> <b>About</b>: {item.about}</div>) : null}
                {item.terms_of_use ? (<div className={classes.body_div}> <b>Terms Of use</b>: {item.terms_of_use}</div>) : null}
                <div className={classes.body_div}> <b>Current Version</b>: {item.current_version}</div>
                {item.category == "[]" ? null : <div className={classes.body_div}> <b>Category</b>: {item.category.split(",").join(", ")}</div>}
                {/* {item.support_contact ? (<div className={classes.body_div}> <b>Support Contact</b>: {item.support_contact}</div>) : null} */}
                {/* {myAppsLink ? (<div className={classes.body_div}> MyApps: {myAppsLink}</div>) : null} */}
                {/* {item.fse_classroom !== "" ? (<div className={classes.body_div}> FSE Cloud Classroom: <a className={classes.classroom_link} href={`https://ets.engineering.asu.edu/fse-cloud-classroom/`} target="_blank">Please visit this Link</a></div>) : null} */}
                {stakeholders ? (<div className={classes.body_div}> <b>Available to</b>: {stakeholders}</div>) : null }
                {osSupported ? (<div className={classes.body_div}> <b>OS Supported</b>: {osSupported}</div>) : null }
                {item.additional_notes ? (<div className={classes.body_div}> <b>Additional Notes</b>: {item.additional_notes}</div>) : null}
                {online_software_view ? <div className={[classes.body_div, classes.classroom_link_div].join(" ")}> <b>Online</b>: {online_software_view}</div> : null}
                {classrooms ? <div className={[classes.body_div, classes.classroom_link_div].join(" ")}> <b>On Campus</b>: &nbsp; {classrooms}</div> : null}
                {offCampusComments ? (<div className={classes.body_div}> <b>Comments From Vendor</b>: {offCampusComments}</div>) : null}
            </Modal.Body>
            <Modal.Footer style={{justifyContent: "flex-start"}}>
                <p>For questions, consultation, and guidance, please contact your School&nbsp;<a href="https://ets.engineering.asu.edu/about/school-it-teams/" target="_blank" rel="noreferrer noopener">IT Team</a>.</p>
            </Modal.Footer>
        </Modal>
    )
}
