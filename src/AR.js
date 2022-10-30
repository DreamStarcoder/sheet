import React, { useState } from "react";
import "./App.css";
import * as XLSX from "xlsx";
import { Button, Divider, Menu, Dropdown } from "antd";
import "antd/dist/antd.css";
import moment from 'moment'
import { Zoom } from "react-reveal";
let AR = () => {
  let [file3, setfile3] = useState("");
  let [file4, setfile4] = useState("");
  let [CodeY, setCode] = useState("");
  let [file3Name, Setfile3Name] = useState("No file selected");
  let [file4Name, Setfile4Name] = useState("No file selected");
  let Company = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
  ];

  let filePathset = (e, step) => {
    e.stopPropagation();
    e.preventDefault();
    var f = e.target.files[0];
    if (step == 3) {
      setfile3(f);
      Setfile3Name(f.name)
    } else if (step == 4) {
      setfile4(f);
      Setfile4Name(f.name)

    }
  };

  const handleUpload = (step, f) => {
    var reader = new FileReader();
    return new Promise((resolve, reject) => {
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
    });
  };

  let step3 = (csv) => {
    //return result; //JavaScript object
    let processed = [];
    let check = false;
    let customer = "";
    csv.map((element) => {
      if (check) {
        if (element.length == 1) {
          if (element[0].length > 0 && !element[0].includes("Generated On")) {
            customer = element[0];
          }
        } else {
          if (!element[0] && element[1]) {
            processed.push({
              IDCUST: customer,
              IDINVC: element[1],
              DATEINVC:moment(element[3].getFullYear()+"-"+(element[3].getMonth() + 1)+"-"+(element[3].getDate()),'YYYY-MM-DD').format('YYYY-MM-DD'),
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
    let IDCUST=0
    let NAMECUST=3
   
    csv.forEach((element, index) => {
      if(index==0){
        element?.map((item,index1)=>{
          if(item=="IDCUST"){
               IDCUST=index1
          }
          if(item=="NAMECUST"){
            NAMECUST=index1
          }
        })
      }
      if (index !== 0) {
        processed.push({
          IDCUST: element[IDCUST],
          NAMECUST: element[NAMECUST],
        });
      }
    });
    return processed; //JSON
  };

  return (
    <Zoom>
    <div>
      <h1
      className="title"
      >
        AR Sheet-Convertor
      </h1>
      <div
        className="convertor"
      >
        <div className="input">
        <label className="label">Import AR Trial Balance</label>
        <label
        htmlFor="Input5"
        className="inputLabel"

        >
       <img src="https://download.logo.wine/logo/Microsoft_Excel/Microsoft_Excel-Logo.wine.png" width="100" height="50" alt="submit" />
        <h4>{file3Name}</h4> 
        </label>
        <input
          id="Input5"
          style={{display:'none'}}
          type="file"
          onChange={(e) => {
            filePathset(e, 3);
          }}
        />
        </div>
       
<div className="input">
<label className="label">Import Sage AR Customers</label>
<label
        htmlFor="Input6"
        className="inputLabel"
        >
       <img src={process.env.PUBLIC_URL+'.//sage-logo.png'}width="100" height="50" alt="submit" />
        <h4>{file4Name}</h4>  
        </label>
        <input
          id="Input6"
          type="file"
          style={{display:'none'}}
          onChange={(e) => {
            filePathset(e, 4);
          }}
        />
</div>
        <div>
        <Dropdown.Button
          style={{ float: "right" }}
          overlay={
            <Menu>
              {Company.map((element) => {
                return (
                  <Menu.Item
                    onClick={() => {
                      setCode(element);
                    }}
                  >
                    {element}
                  </Menu.Item>
                );
              })}
            </Menu>
          }
        >
          Company Code
        </Dropdown.Button>
        </div>
      <div>
      <p>Company Code is {CodeY}</p>
      </div>
       
        <Button
          type="primary"
          onClick={() => {
            try {
              Promise.all([
                handleUpload(3, file3),
                handleUpload(2, file4),
              ]).then((res) => {
                if (res.length >= 1) {
                  let data1 = [];
                  let data3 = res[0];
                  let data4 = res[1];
                  let non_data = [];
                  for (var item in data3) {
                    
                    let found = data4.find(
                      (element) =>
                    {
                      if(  String(data3[item].IDCUST).trim()===String(element.NAMECUST).trim()||
                      String(data3[item].IDCUST).trim().includes(String(element.NAMECUST).trim()) 
                      || String(element.NAMECUST).trim().includes(String(data3[item].IDCUST).trim())
                    ){
                      return element
                    }
                    })
                    if (found) {
                      data1.push({
                        REQUESTID: "9999",
                        IDCUST: found.IDCUST,
                        TEXTTRX: data3[item].AMTDIST < 0 ? 3 : 1,
                        IDTRX: data3[item].AMTDIST < 0 ? 32 : 12,
                        VALUE: "",
                        AMTDIST:
                          data3[item].AMTDIST < 0
                            ? -data3[item].AMTDIST
                            : data3[item].AMTDIST,
                        DATEINVC: data3[item].DATEINVC,
                        ACCTFMTTD: CodeY + "-9999",
                        IDCUSTSHPT: "",
                        PONUMBER: "",
                        IDINVC: data3[item].IDINVC,
                        DIVISION: "",
                        TEXTDESC:""
                      });
                    } else {
                      non_data.push({
                        REQUESTID: "9999",
                        IDCUST: data3[item].IDCUST,
                        TEXTTRX: data3[item].AMTDIST < 0 ? 3 : 1,
                        IDTRX: data3[item].AMTDIST < 0 ? 32 : 12,
                        VALUE: "",
                        AMTDIST:
                          data3[item].AMTDIST < 0
                            ? -data3[item].AMTDIST
                            : data3[item].AMTDIST,
                        DATEINVC: data3[item].DATEINVC,
                        ACCTFMTTD: CodeY + "-9999",
                        IDCUSTSHPT: "",
                        PONUMBER: "",
                        IDINVC:data3[item].IDINVC,
                        DIVISION: "",
                        TEXTDESC:""
                      });
                    }
                  }

                  const ws = XLSX.utils.json_to_sheet(data1);
                  const ws1 = XLSX.utils.json_to_sheet(non_data);
                  const wb = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(wb, ws, "match");
                  XLSX.utils.book_append_sheet(wb, ws1, "non match");
                  XLSX.writeFile(wb, "AR.xlsx");
                }
              });
            } catch (err) {}
          }}
        >
          Create Sage AR Import File 
        </Button>
      </div>
      <a href="https://agsadvanced.com/">
       A Product of AGS Advanced Software Inc.
        
      </a>
    </div>
    </Zoom>
  );
};

export default AR;
