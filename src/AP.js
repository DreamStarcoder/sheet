import React, { useState } from "react";
import "./App.css";
import * as XLSX from "xlsx";
import { Button, Divider, message,Menu, Dropdown } from "antd";
import "antd/dist/antd.css";

let AP = () => {
  let [file3, setfile3] = useState("");
  let [file4, setfile4] = useState("");
  let [CodeY,setCode]=useState('')    

  let Company=["01","02","03","04","05","07","08","09","10","11","12","13","14","15","16"]

  
  let filePathset = (e, step) => {
    e.stopPropagation();
    e.preventDefault();
    var f = e.target.files[0];
    if (step == 3) {
      setfile3(f);
    } else if (step == 4) {
      setfile4(f);
    }
  };

  const handleUpload = (step, f) => {
    var reader = new FileReader();
    return new Promise((resolve,reject)=>{
      reader.onload = function (e) {
        var data = e.target.result;
        let readedData = XLSX.read(data, {
          type: "binary",
          cellDates: true,
          raw: false,
        });
        const wsname = readedData.SheetNames[0];
        const ws = readedData.Sheets[wsname];
        /* Convert array to json*/
        const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
        if (step == 3) {
          resolve(step3(dataParse));
        } else {
          resolve(step4(dataParse));
        }
      };
      reader.readAsBinaryString(f);
    })
   
  };

  let step3 = (csv) => {
    //return result; //JavaScript object
    let processed = [];
    let check = false;
    let vendor = "";
    csv.map((element) => {
      if (check) {
        if (element.length == 1) {
          if (element[0].length > 0 && !element[0].includes("Generated On")) {
            vendor = element[0];
          }
        } else {
          if (!element[0] && element[1]) {
            processed.push({
              IDVENDOR: vendor,
              IDINVC: element[1],
              DATEINVC:
              element[3].getFullYear()+"-" +
              (element[3].getMonth()+1) +
              "-" +(element[3].getDate()+1),
              AMTDIST: element[5],
            });
          }
        }
      }
      if (element.length > 3 && element[1] === " Source") {
        check = true;
      }
    });
    return processed; //JSON
  };
  let step4 = (csv) => {
    //return result; //JavaScript object
    let processed = [];
    csv.forEach((element, index) => {
      if (index !== 0) {
        processed.push({
          IDVENDOR: element[0],
          NAMEVENDOR: element[3],
        });
      }
    });
    return processed; //JSON
  };

  return (
    <div>
      <h1
        style={{
          backgroundColor: "beige",
          margin: "2%",
          fontFamily: "fantasy",
          padding: 4,
          color: "blueviolet",
        }}
      >
        AP Sheet-Convertor
      </h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "30%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <label color="green">Select AP Invoices Sheet </label>
        <input
          type="file"
          onChange={(e) => {
            filePathset(e, 3);
          }}
        />
        <label>Select AP Mapping Vendors Sheet</label>
        <input
          type="file"
          onChange={(e) => {
            filePathset(e, 4);
          }}
        />
          <Dropdown.Button
        style={{ float: 'right' }}
        overlay={<Menu>
          {
            Company.map(element=>{
              return <Menu.Item onClick={()=>{
                setCode(element)
              }}>{element}</Menu.Item>
            })
          }
        </Menu>}
      >
        Company Code
      </Dropdown.Button>
       <Divider/>
        <Button
          style={{width:200,marginRight:'auto',marginLeft:'auto'}}
          onClick={() => {
            try {
               Promise.all([handleUpload(3, file3),handleUpload(4,file4)]).then(res=>{
                console.log(res)
                if(res.length>=1){
                  let data1 = [];
                  let data3=res[0]
                  let data4=res[1]
                  let non_data = [];
                  for (var item in data3) {
                    let found = data4.find(
                      (element) =>
                        data3[item].IDVENDOR.trim() === element.NAMEVENDOR.trim()
                    );
                    if (found) {
                      data1.push({
                        IDVEND: found.IDVENDOR,
                        IDINVC: data3[item].IDINVC,
                        TEXTTRX:data3[item].AMTDIST<0?3:1,
                        IDTRX: data3[item].AMTDIST<0?32:12,
                        VALUE: "",
                        AMTDIST:data3[item].AMTDIST<0?-(data3[item].AMTDIST):data3[item].AMTDIST,
                        DATEINVC: data3[item].DATEINVC,
                        DATEDUE: data3[item].DATEINVC,
                        ACCTFMTTD: CodeY+"-9999",
                        CODETAXGRP: "HSTONT",
                        CODETAX1: "HSTON",
                        CODETAX2: "",
                        CODETAX3: "",
                        CODETAX4: "",
                        CODETAX5: "",
                        TAXCLASS1: "",
                        TAXCLASS2: "",
                        TAXCLASS3: "",
                        TAXCLASS4: "",
                        TAXCLASS5: "HSTON",
                        AccountingCode: "",
                        PONUMBER: "",
                        TAXBASE1: "",
                        TAXBASE2: "",
                        TAXBASE3: "",
                        TAXBASE4: "",
                        TAXBASE5: "",
                        TAXAMT1: "",
                        TAXAMT2: "",
                        TAXAMT3: "",
                        TAXAMT4: "",
                        TAXAMT5: "",
                        DIVISION: "",
                        TEXTDESC: "",
                      });
                    } else {
                      non_data.push({
                        IDVEND: data3[item].IDVENDOR,
                        IDINVC: data3[item].IDINVC,
                        TEXTTRX:data3[item].AMTDIST<0?3:1,
                        IDTRX: data3[item].AMTDIST<0?32:12,
                        VALUE: "",
                        AMTDIST:data3[item].AMTDIST<0?-(data3[item].AMTDIST):data3[item].AMTDIST,
                        DATEINVC: data3[item].DATEINVC,
                        DATEDUE: data3[item].DATEINVC,
                        ACCTFMTTD: CodeY+"-9999",
                        CODETAXGRP: "HSTONT",
                        CODETAX1: "HSTON",
                        CODETAX2: "",
                        CODETAX3: "",
                        CODETAX4: "",
                        CODETAX5: "",
                        TAXCLASS1: "",
                        TAXCLASS2: "",
                        TAXCLASS3: "",
                        TAXCLASS4: "",
                        TAXCLASS5: "HSTON",
                        AccountingCode: "",
                        PONUMBER: "",
                        TAXBASE1: "",
                        TAXBASE2: "",
                        TAXBASE3: "",
                        TAXBASE4: "",
                        TAXBASE5: "",
                        TAXAMT1: "",
                        TAXAMT2: "",
                        TAXAMT3: "",
                        TAXAMT4: "",
                        TAXAMT5: "",
                        DIVISION: "",
                        TEXTDESC: "",
                      });
                    }
                  }
    
                    const ws = XLSX.utils.json_to_sheet(data1);
                    const ws1 = XLSX.utils.json_to_sheet(non_data);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "payable");
                    XLSX.utils.book_append_sheet(wb, ws1, "non match");
      
                    XLSX.writeFile(wb, "AP.xlsx");
                    message.success("Success file being generated");
                  
                }
              }) 
             
            } catch (err) {
              message.error(err);
            }
          }}
        >
          Process Sage AP Import
        </Button>
      </div>
    </div>
  );
};

export default AP;
