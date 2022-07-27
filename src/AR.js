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
    } else if (step == 4) {
      setfile4(f);
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
        console.log(element);
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
          IDCUST: element[0],
          NAMECUST: element[3],
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
        <div>
        <label>Select AR Invoices Sheet</label>
        <input
          type="file"
          onChange={(e) => {
            filePathset(e, 3);
          }}
        />
        </div>
       
<div>
<label>Select AR Mapping Sheet</label>
        <input
          type="file"
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
                      data3[item].IDCUST.trim()===element.NAMECUST.trim()||
                      data3[item].IDCUST.trim().includes(element.NAMECUST.trim()) 
                      || element.NAMECUST.trim().includes(data3[item].IDCUST.trim())
                       
                    );
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
          Process Sheets for Sage AR Import
        </Button>
      </div>
    </div>
    </Zoom>
  );
};

export default AR;
