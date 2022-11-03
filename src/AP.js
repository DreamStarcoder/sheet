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
                  let data1 = [];
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
                      String(data3[item].IDVENDOR).trim().includes(String(element.NAMEVENDOR).trim())
                    );
                    if (found) {
                      let invoiceAmount=data3[item].AMTDIST<0?-(data3[item].AMTDIST):data3[item].AMTDIST
                      // data1.push({
                      //   IDVEND: found.IDVENDOR,
                      //   IDINVC: data3[item].IDINVC,
                      //   TEXTTRX:data3[item].AMTDIST<0?3:1,
                      //   IDTRX: data3[item].AMTDIST<0?32:12,
                      //   VALUE: "",
                      //   AMTDIST:data3[item].AMTDIST<0?-(data3[item].AMTDIST):data3[item].AMTDIST,
                      //   DATEINVC: data3[item].DATEINVC,
                      //   DATEDUE: data3[item].DATEINVC,
                      //   ACCTFMTTD: CodeY+"-9999",
                      //   CODETAXGRP: "HSTONT",
                      //   CODETAX1: "HSTON",
                      //   CODETAX2: "",
                      //   CODETAX3: "",
                      //   CODETAX4: "",
                      //   CODETAX5: "",
                      //   TAXCLASS1: "1",
                      //   TAXCLASS2: "0",
                      //   TAXCLASS3: "0",
                      //   TAXCLASS4: "0",
                      //   TAXCLASS5: "0",
                      //   AccountingCode: "",
                      //   PONUMBER: "",
                      //   TAXBASE1: "",
                      //   TAXBASE2: "",
                      //   TAXBASE3: "",
                      //   TAXBASE4: "",
                      //   TAXBASE5: "",
                      //   TAXAMT1: "",
                      //   TAXAMT2: "",
                      //   TAXAMT3: "",
                      //   TAXAMT4: "",
                      //   TAXAMT5: "",
                      //   DIVISION: "",
                      //   TEXTDESC: "",
                      // });
                      sheet1.push({
                        CNTBTCH: 1,
                        CNTITEM: count,
                        ORIGCOMP: '',
                        IDVEND: found.IDVENDOR,
                        IDINVC: data3[item].IDINVC,
                        IDRMITTO: '',
                        TEXTTRX: 1,
                        IDTRX: 12,
                        ORDRNBR: '',
                        PONBR: '',
                        INVCDESC: '',
                        INVCAPPLTO: '',
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
                        DATEDISC: '',
                        PCTDISC: 0,
                        AMTDISCAVL: 0,
                        LASTLINE: 1,
                        SWTAXBL: 1,
                        SWCALCTX: 1,
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
                        IDPPD: '',
                        TEXTRMIT: '',
                        TEXTSTE1: '',
                        TEXTSTE2: "Succursale Centre-Ville",
                        TEXTSTE3: '',
                        TEXTSTE4: '',
                        NAMECITY: '',
                        CODESTTE: '',
                        CODEPSTL: '',
                        CODECTRY: "Canada",
                        NAMECTAC: '',
                        TEXTPHON: '',
                        TEXTFAX: '',
                        DATERATE: '',
                        AMTRECTAX: '',
                        CODEVNDGRP: "APCAD",
                        TERMSDESC: "Net 30 Days",
                        IDDISTSET: '',
                        ID1099CLAS: '',
                        AMTDUE: invoiceAmount,
                        CREATESCHD: 0,
                        AMTTAXTOT: 0,
                        AMTGROSTOT: invoiceAmount,
                        AMTUNDISTR: 0,
                        SWTAXINCL1: 0,
                        SWTAXINCL2: 0,
                        SWTAXINCL3: 0,
                        SWTAXINCL4: 0,
                        SWTAXINCL5: 0,
                        AMTEXPTAX: 0,
                        AMTAXTOBE: 0,
                        CODEOPER: 1,
                        ACCTREC1: CodeY+"-2420",
                        ACCTREC2: '',
                        ACCTREC3: '',
                        ACCTREC4: '',
                        ACCTREC5: '',
                        ACCTEXP1: '',
                        ACCTEXP2: '',
                        ACCTEXP3: '',
                        ACCTEXP4: '',
                        ACCTEXP5: '',
                        DRILLAPP: '',
                        DRILLTYPE: 0,
                        DRILLDWNLK: 0,
                        PRPTYCODE: 1,
                        PRPTYVALUE: 1,
                        PROCESSCMD: 1,
                        SWJOB: 0,
                        AMTRECDIST: 0,
                        AMTEXPDIST: 0,
                        ERRBATCH: 0,
                        ERRENTRY: 0,
                        EMAIL: '',
                        CTACPHONE: '',
                        CTACFAX: '',
                        CTACEMAIL: '',
                        AMTPPD: 0,
                        IDSTDINVC: '',
                        DATEPRCS: '',
                        AMTDSBWTAX: invoiceAmount,
                        AMTDSBNTAX: invoiceAmount,
                        AMTDSCBASE: invoiceAmount,
                        SWRTGINVC: 0,
                        SWRTG: 0,
                        RTGAPPLYTO: '',
                        RTGAMT: 0,
                        RTGPERCENT: 0,
                        RTGDAYS: 0,
                        RTGDATEDUE: '',
                        RTGTERMS: '',
                        SWRTGDDTOV: 0,
                        SWRTGAMTOV: 0,
                        SWRTGRATE: 0,
                        SWTXBSECTL: 1,
                        VALUES: 2,
                        DETAILCNT: 1,
                        SRCEAPPL: "AP",
                        SWHOLD: 0,
                        APVERSION: "69A",
                        TAXVERSION: 1,
                        SWTXRTGRPT: 0,
                        CODECURNRC: "CAD",
                        SWTXCTLRC: 1,
                        RATERC: 1,
                        RATETYPERC: '',
                        RATEDATERC: '',
                        RATEOPRC: 1,
                        SWRATERC: 0,
                        TXAMT1RC: 0,
                        TXAMT2RC: 0,
                        TXAMT3RC: 0,
                        TXAMT4RC: 0,
                        TXAMT5RC: 0,
                        TXTOTRC: 0,
                        TXALLRC: 0,
                        TXEXPRC: 0,
                        TXRECRC: 0,
                        TXBSERT1TC: 0,
                        TXBSERT2TC: 0,
                        TXBSERT3TC: 0,
                        TXBSERT4TC: 0,
                        TXBSERT5TC: 0,
                        TXAMTRT1TC: 0,
                        TXAMTRT2TC: 0,
                        TXAMTRT3TC: 0,
                        TXAMTRT4TC: 0,
                        TXAMTRT5TC: 0,
                        TXBSE1HC: invoiceAmount,
                        TXBSE2HC: 0,
                        TXBSE3HC: 0,
                        TXBSE4HC: 0,
                        TXBSE5HC: 0,
                        TXAMT1HC: 0,
                        TXAMT2HC: 0,
                        TXAMT3HC: 0,
                        TXAMT4HC: 0,
                        TXAMT5HC: 0,
                        AMTGROSHC: invoiceAmount,
                        RTGAMTHC: 0,
                        AMTDISCHC: 0,
                        AMT1099HC: 0,
                        AMTPPDHC: 0,
                        AMTDUETC: invoiceAmount,
                        AMTDUEHC: invoiceAmount,
                        TEXTVEN: '',
                        TXTOTRTTC: 0,
                        TXTOTAMT1: 0,
                        TXTOTAMT2: 0,
                        TXTOTAMT3: 0,
                        TXTOTAMT4: 0,
                        TXTOTAMT5: 0,
                        RTGAMTDTL: 0,
                        ENTEREDBY: "ADMIN",
                        DATEBUS: '',
                        IDN: '',
                        AMTWHT1TC: 0,
                        AMTWHT2TC: 0,
                        AMTWHT3TC: 0,
                        AMTWHT4TC: 0,
                        AMTWHT5TC: 0,
                        AMTCXBS1TC: 0,
                        AMTCXBS2TC: 0,
                        AMTCXBS3TC: 0,
                        AMTCXBS4TC: 0,
                        AMTCXBS5TC: 0,
                        AMTCXTX1TC: 0,
                        AMTCXTX2TC: 0,
                        AMTCXTX3TC: 0,
                        AMTCXTX4TC: 0,
                        AMTCXTX5TC: 0,
                        AMTCXTXTCN: 0,
                        AMTTXNETCX: 0,
                        AMTCXTXTC: 0,
                        TXTOTWHT: 0,
                        AMTDUEWHT: invoiceAmount,
                        AMTDUEWHDS: invoiceAmount
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
                        TAXCLASS1: 0,
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
                        COMMENT: '',
                        AMTDISTNET: invoiceAmount,
                        AMTINCLTAX: 0,
                        AMTGLDIST: invoiceAmount,
                        AMTTAXREC1: 0,
                        AMTTAXREC2: 0,
                        AMTTAXREC3: 0,
                        AMTTAXREC4: 0,
                        AMTTAXREC5: 0,
                        AMTTAXEXP1: 0,
                        AMTTAXEXP2: 0,
                        AMTTAXEXP3: 0,
                        AMTTAXEXP4: 0,
                        AMTTAXEXP5: 0,
                        AMTTAXTOBE: 0,
                        CONTRACT: '',
                        PROJECT: '',
                        CATEGORY: '',
                        RESOURCE: '',
                        TRANSNBR: 0,
                        COSTCLASS: 0,
                        BILLTYPE: 0,
                        IDITEM: '',
                        UNITMEAS: '',
                        QTYINVC: 0,
                        AMTCOST: 0,
                        BILLDATE: '',
                        BILLRATE: 0,
                        BILLCURN: '',
                        SWIBT: 0,
                        SWDISCABL: 1,
                        OCNTLINE: 0,
                        RTGAMT: 0,
                        RTGPERCENT: 0,
                        RTGDAYS: 0,
                        RTGDATEDUE: '',
                        SWRTGDDTOV: 0,
                        SWRTGAMTOV: 0,
                        VALUES: 3,
                        PROCESSCMD: 0,
                        RTGDISTTC: 0,
                        RTGINVDIST: 0,
                        TXAMT1RC: 0,
                        TXAMT2RC: 0,
                        TXAMT3RC: 0,
                        TXAMT4RC: 0,
                        TXAMT5RC: 0,
                        TXTOTRC: 0,
                        TXALLRC: 0,
                        TXEXP1RC: 0,
                        TXEXP2RC: 0,
                        TXEXP3RC: 0,
                        TXEXP4RC: 0,
                        TXEXP5RC: 0,
                        TXREC1RC: 0,
                        TXREC2RC: 0,
                        TXREC3RC: 0,
                        TXREC4RC: 0,
                        TXREC5RC: 0,
                        TXBSERT1TC: 0,
                        TXBSERT2TC: 0,
                        TXBSERT3TC: 0,
                        TXBSERT4TC: 0,
                        TXBSERT5TC: 0,
                        TXAMTRT1TC: 0,
                        TXAMTRT2TC: 0,
                        TXAMTRT3TC: 0,
                        TXAMTRT4TC: 0,
                        TXAMTRT5TC: 0,
                        TXBSE1HC: invoiceAmount,
                        TXBSE2HC: 0,
                        TXBSE3HC: 0,
                        TXBSE4HC: 0,
                        TXBSE5HC: 0,
                        TXAMT1HC: 0,
                        TXAMT2HC: 0,
                        TXAMT3HC: 0,
                        TXAMT4HC: 0,
                        TXAMT5HC: 0,
                        TXAMTRT1HC: 0,
                        TXAMTRT2HC: 0,
                        TXAMTRT3HC: 0,
                        TXAMTRT4HC: 0,
                        TXAMTRT5HC: 0,
                        TXREC1HC: 0,
                        TXREC2HC: 0,
                        TXREC3HC: 0,
                        TXREC4HC: 0,
                        TXREC5HC: 0,
                        TXEXP1HC: 0,
                        TXEXP2HC: 0,
                        TXEXP3HC: 0,
                        TXEXP4HC: 0,
                        TXEXP5HC: 0,
                        TXALLHC: 0,
                        TXALL1HC: 0,
                        TXALL2HC: 0,
                        TXALL3HC: 0,
                        TXALL4HC: 0,
                        TXALL5HC: 0,
                        TXALL1TC: 0,
                        TXALL2TC: 0,
                        TXALL3TC: 0,
                        TXALL4TC: 0,
                        TXALL5TC: 0,
                        AMTCOSTHC: 0,
                        AMTDISTHC: invoiceAmount,
                        DISTNETHC: invoiceAmount,
                        RTGAMTHC: 0,
                        TXALLRTHC: 0,
                        TXALLRTTC: 0,
                        TXEXPRTHC: 0,
                        TXEXPRTTC: 0,
                        TXTOTRTTC: 0,
                        TXTOTAMT1: 0,
                        TXTOTAMT2: 0,
                        TXTOTAMT3: 0,
                        TXTOTAMT4: 0,
                        TXTOTAMT5: 0,
                        RTGAMTOTC: 0,
                        RTGDISTOTC: 0,
                        SWFAS: 0,
                        FAORGID: '',
                        FADATABASE: '',
                        FACOMPANY: '',
                        FATEMPLATE: '',
                        FADESC: '',
                        FASWSEPQTY: 0,
                        FAQTY: 0,
                        FAUOM: '',
                        FAAMTTC: 0,
                        FAAMTHC: 0,
                        AMTWHT1TC: 0,
                        AMTWHT2TC: 0,
                        AMTWHT3TC: 0,
                        AMTWHT4TC: 0,
                        AMTWHT5TC: 0,
                        AMTCXTX1TC: 0,
                        AMTCXTX2TC: 0,
                        AMTCXTX3TC: 0,
                        AMTCXTX4TC: 0,
                        AMTCXTX5TC: 0,
                        SWCAXABLE1: 0,
                        SWCAXABLE2: 0,
                        SWCAXABLE3: 0,
                        SWCAXABLE4: 0,
                        SWCAXABLE5: 0
                      })
                      sheet3.push({
                        CNTBTCH:1,
                        	CNTITEM:count,
                          	CNTPAYM	:1,
                            DATEDUE	:data3[item].DATEDUE,
                            AMTDUE:invoiceAmount,
                            	DATEDISC:"",
                              	AMTDISC:0	,
                                AMTDUEHC:invoiceAmount,
                                AMTDISCHC:0
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
                        TAXCLASS1: "1",
                        TAXCLASS2: "0",
                        TAXCLASS3: "0",
                        TAXCLASS4: "0",
                        TAXCLASS5: "0",
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
