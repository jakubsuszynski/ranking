import React from "react"
import "./record.css"

const Record = ({singleRecord}) => (
    <div className="single-record">
        <div style={{width: "100px", height: "100px", backgroundColor: "red"}}>
            Pic
        </div>
        <div>
            <p>{singleRecord.employee_name}</p>
        </div>
        <div>
            <p>45</p>
        </div>
        <div style={{width: "50px", height: "50px", backgroundColor: "red"}}>
            Like
        </div>
    </div>
);

export default Record
