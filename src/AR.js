import React, { useState } from "react";
import "./App.css";
import * as XLSX from "xlsx";
import { Button, Divider, Menu, Dropdown } from "antd";
import "antd/dist/antd.css";
import moment from "moment";

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
      Setfile3Name(f.name);
    } else if (step == 4) {
      setfile4(f);
      Setfile4Name(f.name);
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
    let dateIndex=3
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
              DATEINVC: moment(
                element[dateIndex].getFullYear() +
                  "-" +
                  (element[dateIndex].getMonth() + 1) +
                  "-" +
                  element[dateIndex].getDate(),
                "YYYY-MM-DD"
              ).format("YYYY-MM-DD"),
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
                .format("YYYY-MM-DD"),
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
    let IDCUST = 0;
    let NAMECUST = 3;

    csv.forEach((element, index) => {
      if (index == 0) {
        element?.map((item, index1) => {
          if (item == "IDCUST") {
            IDCUST = index1;
          }
          if (item == "NAMECUST") {
            NAMECUST = index1;
          }
        });
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
        <h1 className="title">AR Sheet-Convertor</h1>
        <div className="convertor">
          <div className="input">
            <label className="label">Import AR Trial Balance</label>
            <label htmlFor="Input5" className="inputLabel">
              <img
                src="https://download.logo.wine/logo/Microsoft_Excel/Microsoft_Excel-Logo.wine.png"
                width="100"
                height="50"
                alt="submit"
              />
              <h4>{file3Name}</h4>
            </label>
            <input
              id="Input5"
              style={{ display: "none" }}
              type="file"
              onChange={(e) => {
                filePathset(e, 3);
              }}
            />
          </div>

          <div className="input">
            <label className="label">Import Sage AR Customers</label>
            <label htmlFor="Input6" className="inputLabel">
              <img
                src={process.env.PUBLIC_URL + ".//sage-logo.png"}
                width="100"
                height="50"
                alt="submit"
              />
              <h4>{file4Name}</h4>
            </label>
            <input
              id="Input6"
              type="file"
              style={{ display: "none" }}
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
                    //tab
                    let data1 = [];
                    let tab2=[]
                    let tab3=[]
                    let data3 = res[0];
                    let data4 = res[1];
                    let non_data = [];
                    let count = 1;
                    for (var item in data3) {
                      let found = data4.find((element) => {
                        if (
                          String(data3[item].IDCUST).trim() ===
                            String(element.NAMECUST).trim() ||
                          String(data3[item].IDCUST)
                            .trim()
                            .includes(String(element.NAMECUST).trim()) ||
                          String(element.NAMECUST)
                            .trim()
                            .includes(String(data3[item].IDCUST).trim())
                            ||
                            (
                              String(data3[item].IDCUST).slice(0,4).toLocaleLowerCase()==
                              String(element.NAMECUST).slice(0,4).toLocaleLowerCase()
                            )
                        ) {
                          return element;
                        }
                      });
                      if (found) {
                        //sheet1
                        let invoiceAmount =
                          data3[item].AMTDIST < 0
                            ? -data3[item].AMTDIST
                            : data3[item].AMTDIST;
                        console.log(invoiceAmount)    
                        data1.push({
                          CNTBTCH: 1,
                          CNTITEM: count,
                          IDCUST: found.IDCUST,
                          IDINVC: data3[item].IDINVC,
                          IDSHPT: "",
                          SPECINST: " ",
                          TEXTTRX: data3[item].AMTDIST < 0 ? 3 : 1,
                          IDTRX: data3[item].AMTDIST < 0 ? 32 : 12,
                          ORDRNBR: "",
                          CUSTPO: " ",
                          INVCDESC: " ",
                          SWPRTINVC: 0,
                          INVCAPPLTO: " ",
                          IDACCTSET: "ARCAD",
                          DATEINVC: data3[item].DATEINVC,
                          DATEASOF: data3[item].DATEINVC,
                          FISCYR: "2023",
                          FISCPER: "02",
                          CODECURN: "CAD",
                          RATETYPE: "SP",
                          SWMANRTE: 0,
                          EXCHRATEHC: 1,
                          ORIGRATEHC: 0,
                          TERMCODE: data3[item].AMTDIST < 0 ?"":"NET30",
                          SWTERMOVRD: 0,
                          DATEDUE: data3[item].DATEDUE,
                          // DATEDISC: " ",
                          // PCTDISC: 0,
                          // AMTDISCAVL: 0,
                          // LASTLINE: 1,
                          CODESLSP1: "",
                          CODESLSP2: " ",
                          CODESLSP3: " ",
                          CODESLSP4: " ",
                          CODESLSP5: " ",
                          PCTSASPLT1: 0,
                          PCTSASPLT2: 0,
                          PCTSASPLT3: 0,
                          PCTSASPLT4: 0,
                          PCTSASPLT5: 0,
                          SWTAXBL: 1,
                          SWMANTX: 1,
                          CODETAXGRP: "CANADA",
                          CODETAX1: "CANADA",
                          CODETAX2: "",
                          CODETAX3: "",
                          CODETAX4: "",
                          CODETAX5: "",
                          TAXSTTS1: 2,
                          TAXSTTS2: 0,
                          TAXSTTS3: 0,
                          TAXSTTS4: 0,
                          TAXSTTS5: 0,
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
                          AMTTXBL: invoiceAmount,
                          AMTNOTTXBL: 0,
                          AMTTAXTOT: 0,
                          AMTINVCTOT: invoiceAmount,
                          AMTPPD: 0,
                          AMTPAYMTOT: 1,
                          AMTPYMSCHD: invoiceAmount,
                          AMTNETTOT: invoiceAmount,
                          IDSTDINVC: "",
                          DATEPRCS: "",
                          IDPPD: "",
                          IDBILL: "",
                          SHPTOLOC: "",
                          SHPTOSTE1: " ",
                          SHPTOSTE2: "",
                          SHPTOSTE3: "",
                          SHPTOSTE4: "",
                          SHPTOCITY: "",
                          SHPTOSTTE: "",
                          SHPTOPOST: "",
                          SHPTOCTRY: "CANADA",
                          SHPTOCTAC: " ",
                          SHPTOPHON: "",
                          SHPTOFAX: "",
                          DATERATE: "2021-12-22",
                          SWPROCPPD: 0,
                          AMTDUE: invoiceAmount,
                          CUROPER: 1,
                          DRILLAPP: "",
                          DRILLTYPE: 0,
                          DRILLDWNLK: 0,
                          GETIBSINFO: 0,
                          PROCESSCMD: 0,
                          SHPVIACODE: "",
                          SHPVIADESC: "",
                          PRPTYCODE: 1,
                          PRPTYVALUE: 1,
                          SWJOB: 0,
                          ERRBATCH: 0,
                          ERRENTRY: 0,
                          EMAIL: "",
                          CTACPHONE: "",
                          CTACFAX: "",
                          CTACEMAIL: "",
                          AMTDSBWTAX: invoiceAmount,
                          AMTDSBNTAX: invoiceAmount,
                          AMTDSCBASE: invoiceAmount,
                          INVCTYPE: 2,
                          // SWRTGINVC: 0,
                          // RTGAPPLYTO: "",
                          // SWRTG: 0,
                          // RTGAMT: 0,
                          // RTGPERCENT: 0,
                          // RTGDAYS: 0,
                          // RTGDATEDUE: "",
                          // RTGTERMS: "",
                          // SWRTGDDTOV: 0,
                          // SWRTGAMTOV: 0,
                          // SWRTGRATE: 0,
                          // VALUES: 2,
                          // SRCEAPPL: "AR",
                          // ARVERSION: "69A",
                          // TAXVERSION: 1,
                          // SWTXRTGRPT: 0,
                          // CODECURNRC: "CAD",
                          // SWTXCTLRC: 1,
                          // RATERC: 1,
                          // RATETYPERC: "",
                          // RATEDATERC: "",
                          // RATEOPRC: 1,
                          // SWRATERC: 0,
                          // TXAMT1RC: 0,
                          // TXAMT2RC: 0,
                          // TXAMT3RC: 0,
                          // TXAMT4RC: 0,
                          // TXAMT5RC: 0,
                          // TXTOTRC: 0,
                          // TXBSERT1TC: 0,
                          // TXBSERT2TC: 0,
                          // TXBSERT3TC: 0,
                          // TXBSERT4TC: 0,
                          // TXBSERT5TC: 0,
                          // TXAMTRT1TC: 0,
                          // TXAMTRT2TC: 0,
                          // TXAMTRT3TC: 0,
                          // TXAMTRT4TC: 0,
                          // TXAMTRT5TC: 0,
                          // TXBSE1HC: invoiceAmount,
                          // TXBSE2HC:0,
                          // TXBSE3HC: 0,
                          // TXBSE4HC: 0,
                          // TXBSE5HC: 0,
                          // TXBSE1HC: 0,
                          // TXAMT1HC: 0,
                          // TXAMT2HC: 0,
                          // TXAMT3HC: 0,
                          // TXAMT4HC: 0,
                          // TXAMT5HC: 0,
                          // AMTGROSHC: invoiceAmount,
                          // RTGAMTHC: 0,
                          // AMTDISCHC: 0,
                          // DISTNETHC: invoiceAmount,
                          // AMTPPDHC: 0,
                          // AMTDUEHC: invoiceAmount,
                          // SWPRTLBL: 0,
                          // TXTOTRTTC: 0,
                          // TXTOTAMT1: 0,
                          // TXTOTAMT2: 0,
                          // TXTOTAMT3: 0,
                          // TXTOTAMT4: 0,
                          // TXTOTAMT5: 0,
                          // RTGAMTDTL: 0,
                          // IDSHIPNBR: "",
                          // SWOECOST: 0,
                          // ENTEREDBY: "ADMIN",
                          // DATEBUS: "2022/10/30",
                          // EDN: "",
                          // AMTWHT1TC:0,
                          // AMTWHT2TC:0,
                          // AMTWHT3TC:0,
                          // AMTWHT4TC:0,
                          // AMTWHT5TC:0,
                          // SFPAURL:0,
                          // SFPAID: "",
                          // TXTOTWHT: 0,
                          // AMTDUEWHT:invoiceAmount,
                          // AMTDUEWHDS:invoiceAmount
                        });
                         tab2.push({
                          CNTBTCH: 1,
                          CNTITEM: count,
                          CNTLINE: '20',
                          IDITEM: '',
                          IDDIST: '',
                          TEXTDESC: '',
                          UNITMEAS: '',
                          QTYINVC: 0,
                          AMTCOST: 0,
                          AMTPRIC: 0,
                          AMTEXTN: invoiceAmount,
                          AMTCOGS: 0,
                          AMTTXBL: invoiceAmount,
                          TOTTAX: 0,
                          BASETAX1: invoiceAmount,
                          BASETAX2: 0,
                          BASETAX3: 0,
                          BASETAX4: 0,
                          BASETAX5: 0,
                          TAXSTTS1: 1,
                          TAXSTTS2: 0,
                          TAXSTTS3: 0,
                          TAXSTTS4: 0,
                          TAXSTTS5: 0,
                          SWTAXINCL1:0,
                          SWTAXINCL2:0,
                          SWTAXINCL3:0,
                          SWTAXINCL4:0,
                          SWTAXINCL5:0,
                          RATETAX1: 0,
                          RATETAX2: 0,
                          RATETAX3: 0,
                          RATETAX4: 0,
                          RATETAX5: 0,
                          AMTTAX1: 0,
                          AMTTAX2: 0,
                          AMTTAX3: 0,
                          AMTTAX4: 0,
                          AMTTAX5: 0,
                          IDACCTREV:CodeY + "-9999",
                          IDACCTINV: '',
                          IDACCTCOGS: '',
                          // COMMENT: '',
                          // SWPRTSTMT:0,
                          // ITEMCOST: 0,
                          // CONTRACT: '',
                          // PROJECT: '',
                          // CATEGORY: '',
                          // RESOURCE: '',
                          // TRANSNBR: 0,
                          // COSTCLASS: 0,
                          // BILLDATE: '',
                          // SWIBT: 0,
                          // SWDISCABL: 1,
                          // OCNTLINE: '0',
                          // RTGAMT: '0',
                          // RTGPERCENT: '0',
                          // RTGDAYS: '0',
                          // RTGDATEDUE: '',
                          // SWRTGDDTOV: 0,
                          // SWRTGAMTOV: 0,
                          // VALUES: 2,
                          // PROCESSCMD:0,
                          // RTGDISTTC: 0,
                          // RTGCOGSTC: 0,
                          // RTGALTBTC: 0,
                          // RTGINVDIST: 0,
                          // RTGINVCOGS: 0,
                          // RTGINVALTB: 0,
                          // TXAMT1RC: 0,
                          // TXAMT2RC: 0,
                          // TXAMT3RC: 0,
                          // TXAMT4RC: 0,
                          // TXAMT5RC: 0,
                          // TXTOTRC: 0,
                          // TXBSERT1TC: 0,
                          // TXBSERT2TC: 0,
                          // TXBSERT3TC: 0,
                          // TXBSERT4TC:  0,
                          // TXBSERT5TC:  0,
                          // TXAMTRT1TC:  0,
                          // TXAMTRT2TC:  0,
                          // TXAMTRT3TC:  0,
                          // TXAMTRT4TC:  0,
                          // TXAMTRT5TC:  0,
                          // TXBSE1HC: invoiceAmount,
                          // TXBSE2HC:  0,
                          // TXBSE3HC:  0,
                          // TXBSE4HC:  0,
                          // TXBSE5HC:  0,
                          // TXAMT1HC:  0,
                          // TXAMT2HC:  0,
                          // TXAMT3HC:  0,
                          // TXAMT4HC:  0,
                          // TXAMT5HC:  0,
                          // TXAMTRT1HC:  0,
                          // TXAMTRT2HC:  0,
                          // TXAMTRT3HC: 0,
                          // TXAMTRT4HC: 0,
                          // TXAMTRT5HC: 0,
                          // DISTNETHC: invoiceAmount,
                          // RTGAMTHC:  0,
                          // AMTCOGSHC:  0,
                          // AMTCOSTHC:  0,
                          // AMTPRICHC: 0,
                          // AMTEXTNHC: invoiceAmount,
                          // TXTOTRTTC: 0,
                          // TXTOTAMT1: 0,
                          // TXTOTAMT2: 0,
                          // TXTOTAMT3: 0,
                          // TXTOTAMT4: 0,
                          // TXTOTAMT5: 0,
                          // RTGAMTOTC: 0,
                          // RTGDISTOTC: 0,
                          // RTGCOGSOTC: 0,
                          // RTGALTBOTC: 0,
                          // EDN: '',
                          // AMTWHT1TC: 0,
                          // AMTWHT2TC: 0,
                          // AMTWHT3TC: 0,
                          // AMTWHT4TC: 0,
                          // AMTWHT5TC: 0
                        })
                        tab3.push({
                          CNTBTCH: 1,
                          CNTITEM: count,
                          CNTPAYM: 1,
                          DATEDUE: data3[item].DATEDUE,
                          AMTDUE: invoiceAmount,
                          // DATEDISC: '',
                          // AMTDISC: 0,
                          // AMTDUEHC: invoiceAmount,
                          // AMTDISCHC: 0
                        })
                        count+=1
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
                          IDINVC: data3[item].IDINVC,
                          DIVISION: "",
                          TEXTDESC: "",
                        });
                      }
                    }
                    //final
                    
                    const ws = XLSX.utils.json_to_sheet(data1);
                    const ws2 = XLSX.utils.json_to_sheet(tab2);
                    const ws3 = XLSX.utils.json_to_sheet(tab3);
                    const ws4=XLSX.utils.json_to_sheet([{
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
                    }])
                    const ws5=XLSX.utils.json_to_sheet([{
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
                    }])
                    const ws1 = XLSX.utils.json_to_sheet(non_data);
                    const wb = XLSX.utils.book_new();
                   
                    XLSX.utils.book_append_sheet(wb, ws, "Invoices");
                    XLSX.utils.book_append_sheet(wb, ws2, "Invoice_Details");
                    XLSX.utils.book_append_sheet(wb, ws3, "Invoice_Payment_Schedules");
                    XLSX.utils.book_append_sheet(wb, ws4, "Invoice_Optional_Fields");
                    XLSX.utils.book_append_sheet(wb, ws5, "Invoice_Detail_Optional_Fields");
                    XLSX.utils.book_append_sheet(wb, ws1, "non match");
                    wb.Workbook={}
                    wb.Workbook['Names']=[{
                      Sheet:null,
                      Name:'Invoices',
                      Ref:`Invoices!$A$1:$DC$${data1.length+1}`
                    },
                    {
                      Sheet:null,
                      Name:'Invoice_Payment_Schedules',
                      Ref:`Invoice_Payment_Schedules!$A$1:$E$${data1.length+1}`
                    },
                    {
                      Sheet:null,
                      Name:'Invoice_Detail_Optional_Fields',
                      Ref:'Invoice_Detail_Optional_Fields!$A$1:$U$1'
                    },
                    {
                      Sheet:null,
                      Name:'Invoice_Details',
                      Ref:`Invoice_Details!$A$1:$AP$${data1.length+1}`
                    },
                    {
                      Sheet:null,
                      Name:'Invoice_Optional_Fields',
                      Ref:'Invoice_Optional_Fields!$A$1:$T$1'
                    }
                  ]
                    
                
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
