import React, { useState } from "react";
import "./App.css";
import * as XLSX from "xlsx";
import { Button, Divider, message,Menu, Dropdown } from "antd";
import "antd/dist/antd.css";
import moment from 'moment'
import { Zoom } from "react-reveal";
let AP = () => {
  let [file3, setfile3] = useState("");
  let [file4, setfile4] = useState("");
  let [file3Name, Setfile3Name] = useState("No file selected");
  let [file4Name, Setfile4Name] = useState("No file selected");
  let [CodeY,setCode]=useState('')    

  let Company=["01","02","03","04","05","07","08","09","10","11","12","13","14","15","16"]

  
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
    let dateIndex=3
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
              DATEINVC:moment(element[dateIndex].getFullYear()+"-"+(element[dateIndex].getMonth() + 1)+"-"+(element[dateIndex].getDate()),'YYYY-MM-DD').format('YYYY-MM-DD'),
              AMTDIST: element[5],
              DATEDUE: moment(
                element[dateIndex].getFullYear() +
                  "-" +
                  (element[dateIndex].getMonth() + 1) +
                  "-" +
                  element[dateIndex].getDate(),
                "YYYY-MM-DD"
              )
                .add(30, "days")
                .format("YYYY-MM-DD")
            });
          }
        }
      }
      if (element.length > 3 && element[1] === " Source") {
        element.map((item,index)=>{
          switch(item.trim()){
            case "Date":
              dateIndex=index
              break
          }
        })
        check = true;
      }
    });
    return processed; //JSON
  };
  
  let step4 = (csv) => {
    //return result; //JavaScript object
    let processed = [];
    let IDVENDOR=0
    let NAMEVENDOR=3
    csv.forEach((element, index) => {

      if(index==0){
        element?.map((item,index1)=>{
          if(item=="IDVENDOR" ||item=="VENDORID"){
            IDVENDOR=index1
          }
          if(item=="NAMEVENDOR" ||item=="VENDNAME"){
            NAMEVENDOR=index1
          }
        })
      }
      if (index !== 0) {

        processed.push({
          IDVENDOR: element[IDVENDOR],
          NAMEVENDOR: element[NAMEVENDOR],
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
        AP Sheet-Convertor
      </h1>
      <div
        className="convertor"
      >
        <div className="input">
        <label color="green" className="label"> Import AP Trial Balance</label>
        <label
        htmlFor="myInput3"
        className="inputLabel"

        >
       <img src="https://download.logo.wine/logo/Microsoft_Excel/Microsoft_Excel-Logo.wine.png" width="100" height="50" alt="submit" />
        <h4>{file3Name}</h4> 
        </label>
        <input
          id="myInput3"
          type="file"
          style={{ display: 'none' }}
          onChange={(e) => {
            filePathset(e, 3);
          }}
        />
        </div>
       <div  className="input">

       <label className="label"> Import Sage AP Vendors</label>
       <label
        htmlFor="myInput4"
        className="inputLabel"
        >
       <img src={process.env.PUBLIC_URL+'.//sage-logo.png'}width="100" height="50" alt="submit" />
        <h4>{file4Name}</h4>  
        </label>
        <input
          id="myInput4"
          type="file"
          style={{ display: 'none' }}
          onChange={(e) => {
            filePathset(e, 4);
          }}
        />
       </div>
         <div>
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
       
         </div>
   <div>
   <p>Company Code is {CodeY}</p>
   </div>
        <Button
         type="primary"
          onClick={() => {
            try {
               Promise.all([handleUpload(3, file3),handleUpload(4,file4)]).then(res=>{
                if(res.length>=1){
                  let sheet1=[]
                  let sheet2=[]
                  let sheet3=[]

                  let data3=res[0]
                  let data4=res[1]
                  let non_data = [];
                  let count=1
                  for (var item in data3) {
                    let found = data4.find(
                      (element) =>
                      String(data3[item].IDVENDOR).trim() === String(element.NAMEVENDOR).trim()||
                      String(data3[item].IDVENDOR).trim().includes(String(element.NAMEVENDOR).trim()) ||
                      (
                        String(data3[item].IDVENDOR).slice(0,4).toLocaleLowerCase()==
                        String(element.NAMEVENDOR).slice(0,4).toLocaleLowerCase()
                      )
                    );
                    if (found) {
                      console.log(data3[item].AMTDIST<0?-(data3[item].AMTDIST):data3[item].AMTDIST)
                      let invoiceAmount=data3[item].AMTDIST<0?-(data3[item].AMTDIST):data3[item].AMTDIST
                     
                      sheet1.push({
                        CNTBTCH: 1,
                        CNTITEM: count,
                        ORIGCOMP: '',
                        IDVEND: found.IDVENDOR,
                        IDINVC: data3[item].IDINVC,
                        IDRMITTO: '',
                        TEXTTRX:data3[item].AMTDIST<0?3:1,
                        IDTRX: data3[item].AMTDIST<0?32:12,
                        ORDRNBR: '',
                        PONBR: '',
                        INVCDESC: ' ',
                        IDACCTSET: 'APCAD',
                        DATEINVC: data3[item].DATEINVC,
                        DATEASOF: data3[item].DATEINVC,
                        FISCYR: "2023",
                        FISCPER: '02',
                        CODECURN: 'CAD',
                        RATETYPE: 'SP',
                        SWMANRTE: 0,
                        EXCHRATEHC:1,
                        ORIGRATEHC:0,
                        TERMCODE: 'NET30',
                        SWTERMOVRD: '0',
                        DATEDUE: data3[item].DATEDUE,
                        SWTAXBL: 1,
                        SWCALCTX:0,
                        CODETAXGRP: 'HSTONT',
                        CODETAX1: 'HSTON',
                        CODETAX2: '',
                        CODETAX3: '',
                        CODETAX4: '',
                        CODETAX5: '',
                        TAXCLASS1: 2,
                        TAXCLASS2: 0,
                        TAXCLASS3: 0,
                        TAXCLASS4: 0,
                        TAXCLASS5: 0,
                        BASETAX1: invoiceAmount,
                        BASETAX2: 0,
                        BASETAX3: 0,
                        BASETAX4: 0,
                        BASETAX5: 0,
                        AMTTAX1: 0,
                        AMTTAX2: 0,
                        AMTTAX3: 0,
                        AMTTAX4: 0,
                        AMTTAX5: 0,
                        AMT1099: 0,
                        AMTDISTSET: 0,
                        AMTTAXDIST: 0,
                        AMTINVCTOT: invoiceAmount,
                        AMTALLOCTX: 0,
                        CNTPAYMSCH: 1,
                        AMTTOTDIST: invoiceAmount,
                        AMTGROSDST: invoiceAmount,
                        AMTGROSTOT: invoiceAmount
                      })
                      sheet2.push({
                        CNTBTCH: 1,
                        CNTITEM: count,
                        CNTLINE: 20,
                        DESCOMP: '',
                        ROUTE: 0,
                        IDDIST: '',
                        TEXTDESC: '',
                        AMTTOTTAX: 0,
                        SWMANLTX: 0,
                        BASETAX1: invoiceAmount,
                        BASETAX2: 0,
                        BASETAX3: 0,
                        BASETAX4: 0,
                        BASETAX5: 0,
                        TAXCLASS1: 2,
                        TAXCLASS2: 0,
                        TAXCLASS3: 0,
                        TAXCLASS4: 0,
                        TAXCLASS5: 0,
                        SWTAXINCL1: 0,
                        SWTAXINCL2: 0,
                        SWTAXINCL3: 0,
                        SWTAXINCL4: 0,
                        SWTAXINCL5: 0,
                        RATETAX1: 0,
                        RATETAX2: 0,
                        RATETAX3: 0,
                        RATETAX4: 0,
                        RATETAX5: 0,
                        AMTTAX1: 0,
                        AMTTAX2: 0,
                        AMTTAX3: 0,
                        AMTTAX4: 0,
                        AMTTAX5:0,
                        IDGLACCT: "02-9999",
                        IDACCTTAX: "02-9999",
                        AMTDIST: invoiceAmount,
                        COMMENT: ''
                      })
                      sheet3.push({
                        CNTBTCH:1,
                        	CNTITEM:count,
                          	CNTPAYM	:1,
                            DATEDUE	:data3[item].DATEDUE,
                            AMTDUE:invoiceAmount
                      })
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
                        TAXCLASS1: 2,
                        TAXCLASS2: 0,
                        TAXCLASS3: 0,
                        TAXCLASS4: 0,
                        TAXCLASS5: 0,
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
                    count+=1
                  }
                    const ws = XLSX.utils.json_to_sheet(sheet1);
                    const ws1=XLSX.utils.json_to_sheet(sheet2);
                    const ws2=XLSX.utils.json_to_sheet(sheet3);
                    const ws3=XLSX.utils.json_to_sheet([{
                      CNTBTCH: '',
                      CNTITEM: '',
                      OPTFIELD: '',
                      VALUE: '',
                      TYPE: '',
                      LENGTH: '',
                      DECIMALS: '',
                      ALLOWNULL: '',
                      VALIDATE: '',
                      SWSET: '',
                      VALINDEX: '',
                      VALIFTEXT: '',
                      VALIFMONEY: '',
                      VALIFNUM: '',
                      VALIFLONG: '',
                      VALIFBOOL: '',
                      VALIFDATE: '',
                      VALIFTIME: '',
                      FDESC: '',
                      VDESC: ''
                    }]);
                    const ws4=XLSX.utils.json_to_sheet([{
                      CNTBTCH: '',
                      CNTITEM: '',
                      CNTLINE: '',
                      OPTFIELD: '',
                      VALUE: '',
                      TYPE: '',
                      LENGTH: '',
                      DECIMALS: '',
                      ALLOWNULL: '',
                      VALIDATE: '',
                      SWSET: '',
                      VALINDEX: '',
                      VALIFTEXT: '',
                      VALIFMONEY: '',
                      VALIFNUM: '',
                      VALIFLONG: '',
                      VALIFBOOL: '',
                      VALIFDATE: '',
                      VALIFTIME: '',
                      FDESC: '',
                      VDESC: ''
                    }]);

                    const wsUn = XLSX.utils.json_to_sheet(non_data);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Invoices");
                    XLSX.utils.book_append_sheet(wb, ws1, "Invoice_Details");
                    XLSX.utils.book_append_sheet(wb, ws2, "Invoice_Payment_Schedules");
                    XLSX.utils.book_append_sheet(wb, ws3, "Invoice_Optional_Fields");
                    XLSX.utils.book_append_sheet(wb, ws4, "Invoice_Detail_Optional_Fields");
                    XLSX.utils.book_append_sheet(wb, wsUn, "non match");
                    wb.Workbook={}
                    wb.Workbook['Names']=[{
                      Sheet:null,
                      Name:'Invoices',
                      Ref:`Invoices!$A$1:$BD$${sheet1.length+1}`
                    },
                    {
                      Sheet:null,
                      Name:'Invoice_Details',
                      Ref:`Invoice_Details!$A$1:$AL$${sheet1.length+1}`
                    },
                    {
                      Sheet:null,
                      Name:'Invoice_Detail_Optional_Fields',
                      Ref:'Invoice_Detail_Optional_Fields!$A$1:$U$1'
                    },
                    {
                      Sheet:null,
                      Name:'Invoice_Payment_Schedules',
                      Ref:`Invoice_Payment_Schedules!$A$1:$E$${sheet1.length+1}`
                    },
                    {
                      Sheet:null,
                      Name:'Invoice_Optional_Fields',
                      Ref:'Invoice_Optional_Fields!$A$1:$T$1'
                    }
                  ]
                    
                     XLSX.writeFile(wb, "AP.xlsx");
                    message.success("Success file being generated");
                  
                }
              }) 
             
            } catch (err) {
              message.error(err);
            }
          }}
        >
          Create Sage AP Import File
        </Button>
      </div>
      <a href="https://agsadvanced.com/">
       A Product of AGS Advanced Software Inc.
        
      </a>
    </div>
    </Zoom>
  );
};

export default AP;
