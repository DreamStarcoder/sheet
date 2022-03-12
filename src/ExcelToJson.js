import React, { useState } from "react";
import "./App.css";
import * as XLSX from "xlsx";

class ExcelToJson extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      file: "",
    };
  }

  handleClick(e) {
    this.refs.fileUploader.click();
  }

  filePathset(e) {
    e.stopPropagation();
    e.preventDefault();
    var file = e.target.files[0]
    this.setState({ file });

  }

  readFile() {
    var f = this.state.file;
    var name = f.name;
    const reader = new FileReader();
    reader.onload = (evt) => {
      // evt = on_file_select event
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      /* Update state */
      let arr=(this.convertToJson(data)); // shows data in json format
      console.log(arr)

    };
    reader.readAsBinaryString(f);
  }

  convertToJson(csv) {
    
    
    //return result; //JavaScript object
    let processed=[]

    csv.forEach((element,index) => {
      if(index!=0 ){
       let obj={}
      if(element[2]!==0 ||element[3]!==0){
       obj['ACCID']=element[0]
       obj['ACCDESC']=element[1]
       obj['Amounts']=element[2]!==0?element[2]:-element[3]
       processed.push(obj)
      }
      }
      
    });
    return processed; //JSON
  }

  render() {
    return (
      <div>
        <input
          type="file"
          id="file"
          ref="fileUploader"
          onChange={this.filePathset.bind(this)}
        />
        <button
          onClick={() => {
            this.readFile();
          }}
        >
          Read File
        </button>
      </div>
    );
  }
}

export default ExcelToJson;