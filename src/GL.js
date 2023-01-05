import React, { useEffect, useState } from "react";
import "./App.css";
import * as XLSX from "xlsx";
import { Button, Menu, Dropdown, message, Divider } from "antd";
import "antd/dist/antd.css";
import { Zoom } from "react-reveal";

let GL = () => {
  let [fsY, setfsY] = useState("");
  let [CodeY, setCode] = useState(9999);
  let [PeriodF, setPeriodF] = useState("");
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
  let Period = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  let FiscalYear = ["2028","2027","2026",
  "2025","2024","2023", "2022", "2021", "2020"].reverse();
  let [file, setfile] = useState("");
  let [file2, setfile2] = useState("");
  let [file1Name, setFile1Name] = useState("No File Selected");
  let [file2Name, setFile2Name] = useState("No File Selected");
  let count = (rng) => {
    let data = "00000000" + rng;
    if (data.length > 10) {
      data = data.substring(data.length - 10, data.length);
    }
    return data;
  };
  let filePathset = (e, step) => {
    console.log("GL");
    e.stopPropagation();
    e.preventDefault();
    var f = e.target.files[0];
    if (step == 1) {
      setFile1Name(f.name);
      setfile(f);
    } else if (step == 2) {
      setFile2Name(f.name);
      setfile2(f);
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
        if (step == 1) {
          resolve(step1(dataParse));
        } else if (step == 2) {
          resolve(step2(dataParse));
        }
      };
      reader.readAsBinaryString(f);
    });
  };
  useEffect(()=>{
    if(localStorage.getItem("code")){
      setCode(localStorage.getItem("code"))
    }
  },[])
  let step1 = (csv) => {
    //return result; //JavaScript object
    let processed = [];
    let check = false; 
    

    csv.map((element, index) => {
      try {
        if (check) {
          let obj = {};
          if (element[0] || element[2] !== 0 || element[3] !== 0) {
            obj["ACCTID"] = element[0];
            obj["ACCTDESC"] = element[1];
            obj["Amounts"] = element[2] !== 0 ? element[2] : -element[3];
            processed.push(obj);
          }
        }
        if (element[0] === "Account Number") {
          check = true;
        }
      } catch (error) {}
    });
    return processed;
  };
  let step2 = (csv) => {
    //return result; //JavaScript object
    let processed = [];
    

    csv.map((element, index) => {
      if (index !== 0) {
        processed.push({
          ACCTID: element[0],
          ACCTDESC: element[2],
        });
      }
    });
    return processed;
  };

  return (
    <Zoom>
      <div>
        <h1 className="title">GL Sheet-Convertor</h1>
        <div className="convertor">
          <div>
            <div className="input">
              <label className="label">Import GL TB 3rd Party</label>
              <label htmlFor="myInput" className="inputLabel">
                <img
                  src="https://download.logo.wine/logo/Microsoft_Excel/Microsoft_Excel-Logo.wine.png"
                  width="100"
                  height="50"
                  alt="submit"
                ></img>

                <h4>{file1Name}</h4>
              </label>
              <input
                id="myInput"
                type="file"
                onChange={(e) => {
                  filePathset(e, 1);
                }}
                style={{ display: "none" }}
              />
            </div>
          </div>
          <div className="input">
            <label className="label">Import Sage GL Accounts</label>
            <label htmlFor="myInput1" className="inputLabel">
              <img
                src={process.env.PUBLIC_URL + ".//sage-logo.png"}
                width="100"
                height="50"
                alt="submit"
              />
              <h4>{file2Name}</h4>
            </label>
            <input
              id="myInput1"
              type="file"
              onChange={(e) => {
                filePathset(e, 2);
              }}
              style={{ display: "none" }}
            />
          </div>
          <div>
            <Dropdown.Button
              style={{ float: "right" }}
              overlay={
                <Menu>
                  {FiscalYear.map((element,i) => {
                    return (
                      <Menu.Item
                        onClick={() => {
                          setfsY(element);
                        }}
                        key={i}
                      >
                        {element}
                      </Menu.Item>
                    );
                  })}
                </Menu>
              }
            >
              Fiscal Year
            </Dropdown.Button>
            {/* <Dropdown.Button
              style={{ float: "right" }}
              overlay={
                <Menu>
                  {Company.map((element) => {
                    return (
                      <Menu.Item
                        onClick={() => {
                        
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
            </Dropdown.Button> */}
      
            <Dropdown.Button
              style={{ float: "right" }}
              overlay={
                <Menu>
                  {Period.map((element,index) => {
                    return (
                      <Menu.Item
                        onClick={() => {
                          setPeriodF(element);
                        }}
                        key={index}
                      >
                        {element}
                      </Menu.Item>
                    );
                  })}
                </Menu>
              }
            >
              Fiscal Period
            </Dropdown.Button>
            
          </div>
          <div className="input" style={{justifyContent:'normal'}}>
          <label className="label">Company Code</label>
        <label
        htmlFor="myInput"
        className="inputLabel2"
        >
       
        </label>
       <input
          id="myInput"
          type="number"
          value={CodeY}
          onChange={(e)=>{
            setCode(e.target.valueAsNumber)
            localStorage.setItem('code',e.target.valueAsNumber)
          }}
          />
          </div>
          <div>
            <p>
              Company-Code {CodeY}
              <br />
              Fiscal-Year {fsY}
              <br />
              Fiscal-Period {PeriodF}
            </p>
          </div>

          <Button
            type="primary"
            onClick={() => {
              try {
                Promise.all([
                  handleUpload(1, file),
                  handleUpload(2, file2),
                ]).then((res) => {
                  if (res.length >= 1) {
                    console.log("done");
                    let data1 = res[0];
                    let data2 = res[1];
                    let data = [];
                    let unmatched=[]
                    let rng = 0;
                    for (var item in data1) {
                      if (data1[item].ACCTDESC && data1[item].Amounts != -0) {
                        let found = data2.find(
                          (element) =>
                           String(data1[item].ACCTDESC).trim() ==
                           String(element.ACCTDESC).trim() ||
                           String(data1[item].ACCTDESC).trim().slice(0,6)==
                           String(element.ACCTDESC).trim().slice(0,6)
                        );
                        rng += 20;
                        if (found) {
                          data.push({
                            BATCHNBR: "000100",
                            JOURNALID: "00001",
                            TRANSNBR: count(rng),
                            ACCTID: CodeY + found.ACCTID.slice(2),
                            TRANSAMT: data1[item].Amounts,
                            TRANSDESC: "Opening Balances",
                            TRANSREF: "Opening Balances",
                          });
                        } else {
                          data.push({
                            BATCHNBR: "000100",
                            JOURNALID: "00001",
                            TRANSNBR: count(rng),
                            ACCTID: ` `,
                            TRANSAMT: data1[item].Amounts,
                            TRANSDESC: "Opening Balances",
                            TRANSREF: "Opening Balances",
                          });
                          unmatched.push({
                            ACCTID: `${CodeY}${data1[item].ACCTID}`,
                            ACCTDESC:data1[item].ACCTDESC
                          })
                        }
                      }
                    }
                    if(data.length!=0){
                      let data2=[]
                      data.forEach(item=>{
                           let element=structuredClone(item)
                           element["JOURNALID"]="00002"
                           data2.push(element)
                      })
                     let dataNew=data.concat(data2)
                      data=dataNew
                    }
                    let date = new Date();
                    let headers = [
                      {
                        BATCHID: "000100",
                        BTCHENTRY: "00001",
                        SRCELEDGER: "GL",
                        SRCETYPE: "JE",
                        FSCSYR: fsY,
                        FSCSPERD: PeriodF,
                        JRNLDESC: "Ship asap",
                        DOCDATE: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
                      },
                      {
                        BATCHID: "000100",
                        BTCHENTRY: "00002",
                        SRCELEDGER: "GL",
                        SRCETYPE: "JE",
                        FSCSYR: fsY,
                        FSCSPERD: PeriodF,
                        JRNLDESC: "Ship asap",
                        DOCDATE: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
                      },
                    ];
                    const ws = XLSX.utils.json_to_sheet(headers);

                    const ws1 = XLSX.utils.json_to_sheet(data);
                    const ws2 = XLSX.utils.json_to_sheet([
                      {
                        BATCHNBR: "",
                        JOURNALID: "",
                        TRANSNBR: "",
                        OPTFIELD: "",
                        VALUE: "",
                        TYPE: "",
                        LENGTH: "",
                        DECIMALS: "",
                        ALLOWNULL: "",
                        VALIDATE: "",
                        SWSET: "",
                        VALINDEX: "",
                        VALIFTEXT: "",
                        VALIFMONEY: "",
                        VALIFNUM: "",
                        VALIFLONG: "",
                        VALIFBOOL: "",
                        VALIFDATE: "",
                        VALIFTIME: "",
                        FDESC: "",
                        VDESC: "",
                      },
                    ]);
                    const wb = XLSX.utils.book_new();
                    const wbUnmatched = XLSX.utils.book_new();
                    const wsUnmatch = XLSX.utils.json_to_sheet(unmatched);
                    XLSX.utils.book_append_sheet(wbUnmatched,wsUnmatch,"unmatch")
                    
                    XLSX.utils.book_append_sheet(wb, ws, "Journal_Headers");
                    XLSX.utils.book_append_sheet(wb, ws1, "Journal_Details");
                    XLSX.utils.book_append_sheet(
                      wb,
                      ws2,
                      "Journal_Detail_Optional_Fields"
                    );
                    wb.Workbook={}
                    wb.Workbook['Names']=[{
                      Sheet:null,
                      Name:'Journal_Headers',
                      Ref:`Journal_Headers!$A$1:$H$3`
                    },
                    {
                      Sheet:null,
                      Name:'Journal_Details',
                      Ref:`Journal_Details!$A$1:$G$${data.length+1}`
                    },
                    {
                      Sheet:null,
                      Name:'Journal_Detail_Optional_Fields',
                      Ref:'Journal_Detail_Optional_Fields!$A$1:$U$1'
                    }
                  ]
                  XLSX.writeFile(wbUnmatched, "unmatchedGL.xlsx");
                   XLSX.writeFile(wb, "GL.xlsx");
                    message.success("Successful");
                  }
                });
              } catch (error) {
                message.error("Failed");
              }
            }}
          >
            Create Sage GL Import File
          </Button>
        </div>
        <a href="https://agsadvanced.com/">
          A Product of AGS Advanced Software Inc.
        </a>
      </div>
    </Zoom>
  );
};

export default GL;
