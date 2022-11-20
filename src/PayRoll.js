
import './App.css';

import { useState } from 'react';
import * as XLSX from "xlsx";
import { Zoom } from 'react-reveal';

function PayRoll() {
  let [file4Name,setFileName4]=useState('No File Selected')
let [file5Name,setFile2Name5]=useState('No File Selected')


let [data4,setData] = useState([])
let [nameData,setNameData] = useState([])
let  filePathset3=(e)=> {
    console.log(e)
  e.stopPropagation();
  e.preventDefault();
  var f = e.target.files[0]
  console.log(f.name)
  setFileName4(f.name)
    var reader = new FileReader();
    reader.onload=function(e){
      var data4 = e.target.result;
      let readedData = XLSX.read(data4, {type: 'binary', cellDates: true,raw:false});
      const wsname = readedData.SheetNames[0];
      const ws = readedData.Sheets[wsname];
      /* Convert array to json*/
      const dataParse = XLSX.utils.sheet_to_json(ws, {header:1});
      let getHeader=[]
      dataParse.map((item,index)=>{
        if(item.find(item=>item=="Date")){
          getHeader= dataParse.slice(index,dataParse.length)
        }
      })
      let name="Name"
      let cleanData=[]
      getHeader.map((item,index)=>{
        if(item.length==1){
          if(item[0]){
            name=item[0]
          }
        }else{
          if(item.find(element=>element=="Total" || element=="Grand Total" ) || item.length==0){
            getHeader.splice(index,1)
          }else{
           
           item.unshift(name)
            cleanData.push(item)
          }
        }
      })
      setData(cleanData)
    }
    reader.readAsBinaryString(f)

}
let  filePathset2=(e)=> {
  e.stopPropagation();
  e.preventDefault();
  var f = e.target.files[0]
    setFile2Name5(f.name)
    var reader = new FileReader();
    reader.onload=function(e){
      var data4 = e.target.result;
        let readedData = XLSX.read(data4, {type: 'binary', cellDates: true,raw:false});
        const wsname = readedData.SheetNames[0];
        const ws = readedData.Sheets[wsname];
        /* Convert array to json*/
      const dataParse = XLSX.utils.sheet_to_json(ws, {header:1});
      let temp=[]
      dataParse.map(element=>{
        temp.push(element)
      })
      console.table(temp)
      setNameData(temp)
    }
    reader.readAsBinaryString(f)
}


  return (
    <Zoom className="App">
        <div>
      <h1 className="title">PayRoll Sheet-Convertor</h1>
        <div className="convertor">
    <div className="input">
       <label className="label">Import Employee YTD Sheet</label>
        <label
        htmlFor="myInput4"
        className="inputLabel"
        >
       <img src="https://download.logo.wine/logo/Microsoft_Excel/Microsoft_Excel-Logo.wine.png" width="100" height="50" alt="submit" >
       </img>
       
      {file4Name}
        </label>
       <input
          id="myInput4"
          type="file"
          onChange={(e)=>{filePathset3(e)}}
          style={{ display: 'none' }}
        />
       </div>
       <div className="input">
       <label className="label">Import Employee Name list</label>
        <label
        htmlFor="myInput2"
        className="inputLabel"
        >
       <img src="https://download.logo.wine/logo/Microsoft_Excel/Microsoft_Excel-Logo.wine.png" width="100" height="50" alt="submit" >
       </img>
       
        {file5Name}
        </label>
       <input
          id="myInput2"
          type="file"
          onChange={(e)=>{filePathset2(e)}}
          style={{ display: 'none' }}
        />
       </div>
       <p style={{backgroundColor:'red',width:100,margin:20,textAlign:'center'
       ,borderRadius:10,cursor:'pointer'}} onClick={()=>{
        let object=[]
        let sheet2=[]
        let grossIndex=2
        let DPSPIndex=14
        let RSSPIndex=-1
        let CPPIndex=10
        let TaxIndex=10
        console.log(data4[0])
        data4.map((item,index)=>{
           
          if(item.indexOf("Gross")!==-1){
             grossIndex=item.indexOf("Gross")
             console.log("gross index",grossIndex)
          }
          if(item.indexOf("Tax")!==-1){
            TaxIndex=item.indexOf("Tax")
            console.log("Tax index",TaxIndex)
         }
          if(item.indexOf("DPSP")!==-1){
            DPSPIndex=item.indexOf("DPSP") 
         }
         if(item.indexOf("RRSP")!==-1){
          RSSPIndex=item.indexOf("RRSP") 
          console.log() 
       }
       if(item.indexOf("CPP")!==-1){
        CPPIndex=item.indexOf("CPP")
        console.log("CPP",CPPIndex)  
     }
       
          nameData.find(element=>{ 
            
            if(item[0]==element[6]||item[0].split(',')[0]==element[6].split(',')[0]){
             
              object.push({
                EMPLOYEE:element[0],
                PEREND:item[2],
                ENTRYSEQ:0,
                CLASS1:"",
                CLASS2:"",
                CLASS3:"",
                CLASS4:"",
                WORKPROV:8,
                SWEXTERNTC:0,
                EXRATEDATE:item[2],
                ORGTYPE:1,
                CSEFTSTAT:0,
                USERSEC:0
              })
              sheet2.push({
                EMPLOYEE:element[0],	
                PEREND:item[2]	,
                ENTRYSEQ:0	,
                CATEGORY:2	,
                EARNDED	:'HOURLY',
                LINETYPE:3	,
                LINENO:0	,
                EARDEDDATE:item[2],
                HOURS:0,	
                ECNTBASE:0,
                ERATE:0	,
                EEXTEND:Number(item[grossIndex])+Number(item[DPSPIndex]),
                EREGRATE:0,	
                RCNTBASE:0,
                RRATE:0,
                REXTEND:0,
                WCC:'',
                TAXWEEKS:0,
                TAXEARNS:0,
                TXEARNCEIL:0,
                TAXTIPS:0,
                TXTIPSCEIL:0,
                TAXONTIPS:0,
                UNCOLLTAX:0	,
                TAXNONPER:0	,
                TAXEARNBD:0	,
                POOLEDTIPS:0 ,
                STARTTIME:0,
                STOPTIME:0,
                WCCGROUP:""	,
                LOCTAXCODE:"",
                WCBASE:0,
                WCRATE:0,
                WCEXTEND:0,
                CSEFTSTAT:0,
                DISTCODE:""	,
                DISTRNAME:"",
                TAXNONDED:0,
                TAXREPAY:0	,
                CHECKDATE:item[2]
              })
              if(Number(item[DPSPIndex+1])>0){
                sheet2.push({
                    EMPLOYEE:element[0],	
                    PEREND:item[2]	,
                    ENTRYSEQ:0	,
                    CATEGORY:4	,
                    EARNDED	:'DPSPEM',
                    LINETYPE:6	,
                    LINENO:4,
                    EARDEDDATE:item[2],
                    HOURS:0,	
                    ECNTBASE:0,
                    ERATE:0	,
                    EEXTEND: item[DPSPIndex+1],
                    EREGRATE:0,	
                    RRATE:0,
                    RCNTBASE:0,
                    REXTEND:0,
                    WCC:'',
                    TAXWEEKS:0,
                    TAXEARNS:0,
                    TXEARNCEIL:0,
                    TAXTIPS:0,
                    TXTIPSCEIL:0,
                    TAXONTIPS:0,
                    UNCOLLTAX:0	,
                    TAXNONPER:0	,
                    TAXEARNBD:0	,
                    POOLEDTIPS:0 ,
                    STARTTIME:0,
                    STOPTIME:0,
                    WCCGROUP:""	,
                    LOCTAXCODE:"",
                    WCBASE:0,
                    WCRATE:0,
                    WCEXTEND:0,
                    CSEFTSTAT:0,
                    DISTCODE:""	,
                    DISTRNAME:"",
                    TAXNONDED:0,
                    TAXREPAY:0	,
                    CHECKDATE:item[2]
                  })
              }
              if(Number(item[RSSPIndex])>0){
                sheet2.push({
                  EMPLOYEE:element[0],	
                  PEREND:item[2]	,
                  ENTRYSEQ:0	,
                  CATEGORY:4	,
                  EARNDED	:'RRSP',
                  LINETYPE:6	,
                  LINENO:4,
                  EARDEDDATE:item[2],
                  HOURS:0,	
                  ECNTBASE:0,
                  ERATE:0	,
                  EEXTEND: item[RSSPIndex],
                  EREGRATE:0,	
                  RRATE:0,
                  RCNTBASE:0,
                  REXTEND:0,
                  WCC:'',
                  TAXWEEKS:0,
                  TAXEARNS:0,
                  TXEARNCEIL:0,
                  TAXTIPS:0,
                  TXTIPSCEIL:0,
                  TAXONTIPS:0,
                  UNCOLLTAX:0	,
                  TAXNONPER:0	,
                  TAXEARNBD:0	,
                  POOLEDTIPS:0 ,
                  STARTTIME:0,
                  STOPTIME:0,
                  WCCGROUP:""	,
                  LOCTAXCODE:"",
                  WCBASE:0,
                  WCRATE:0,
                  WCEXTEND:0,
                  CSEFTSTAT:0,
                  DISTCODE:""	,
                  DISTRNAME:"",
                  TAXNONDED:0,
                  TAXREPAY:0	,
                  CHECKDATE:item[2]
                })
              }
              if(Number(item[DPSPIndex])>0){
                sheet2.push({
                    EMPLOYEE:element[0],	
                    PEREND:item[2]	,
                    ENTRYSEQ:0	,
                    CATEGORY:4	,
                    EARNDED	:'DPSP',
                    LINETYPE:6	,
                    LINENO:4,
                    EARDEDDATE:item[2],
                    HOURS:0,	
                    ECNTBASE:0,
                    ERATE:0	,
                    EEXTEND: item[DPSPIndex],
                    EREGRATE:0,	
                    RRATE:0,
                    RCNTBASE:0,
                    REXTEND:0,
                    WCC:'',
                    TAXWEEKS:0,
                    TAXEARNS:0,
                    TXEARNCEIL:0,
                    TAXTIPS:0,
                    TXTIPSCEIL:0,
                    TAXONTIPS:0,
                    UNCOLLTAX:0	,
                    TAXNONPER:0	,
                    TAXEARNBD:0	,
                    POOLEDTIPS:0 ,
                    STARTTIME:0,
                    STOPTIME:0,
                    WCCGROUP:""	,
                    LOCTAXCODE:"",
                    WCBASE:0,
                    WCRATE:0,
                    WCEXTEND:0,
                    CSEFTSTAT:0,
                    DISTCODE:""	,
                    DISTRNAME:"",
                    TAXNONDED:0,
                    TAXREPAY:0	,
                    CHECKDATE:item[2]
                  })
              }
              
              sheet2.push({
                EMPLOYEE:element[0],	
                PEREND:item[2]	,
                ENTRYSEQ:0	,
                CATEGORY:7	,
                EARNDED	:'CPP',
                LINETYPE:7	,
                LINENO:1	,
                EARDEDDATE:item[2],
                HOURS:0,	
                ECNTBASE:0,
                ERATE:0	,
                EEXTEND: item[CPPIndex],
                EREGRATE:0,	
                RCNTBASE:0,
                RRATE:0,
                REXTEND:0,
                WCC:'',
                TAXWEEKS:0,
                TAXEARNS:0,
                TXEARNCEIL:0,
                TAXTIPS:0,
                TXTIPSCEIL:0,
                TAXONTIPS:0,
                UNCOLLTAX:0	,
                TAXNONPER:0	,
                TAXEARNBD:0	,
                POOLEDTIPS:0 ,
                STARTTIME:0,
                STOPTIME:0,
                WCCGROUP:""	,
                LOCTAXCODE:"",
                WCBASE:0,
                WCRATE:0,
                WCEXTEND:0,
                CSEFTSTAT:0,
                DISTCODE:""	,
                DISTRNAME:"",
                TAXNONDED:0,
                TAXREPAY:0	,
                CHECKDATE:item[2]
              })
              sheet2.push({
                EMPLOYEE:element[0],	
                PEREND:item[2]	,
                ENTRYSEQ:0	,
                CATEGORY:7	,
                EARNDED	:'EIR1',
                LINETYPE:7	,
                LINENO:2	,
                EARDEDDATE:item[2],
                HOURS:0,	
                ECNTBASE:0,
                ERATE:0	,
                EEXTEND: item[9],
                EREGRATE:0,	
                RRATE:0,
                RCNTBASE:0,
                REXTEND:0,
                WCC:'',
                TAXWEEKS:0,
                TAXEARNS:0,
                TXEARNCEIL:0,
                TAXTIPS:0,
                TXTIPSCEIL:0,
                TAXONTIPS:0,
                UNCOLLTAX:0	,
                TAXNONPER:0	,
                TAXEARNBD:0	,
                POOLEDTIPS:0 ,
                STARTTIME:0,
                STOPTIME:0,
                WCCGROUP:""	,
                LOCTAXCODE:"",
                WCBASE:0,
                WCRATE:0,
                WCEXTEND:0,
                CSEFTSTAT:0,
                DISTCODE:""	,
                DISTRNAME:"",
                TAXNONDED:0,
                TAXREPAY:0	,
                CHECKDATE:item[2]
              })
              sheet2.push({
                EMPLOYEE:element[0],	
                PEREND:item[2]	,
                ENTRYSEQ:0	,
                CATEGORY:7	,
                EARNDED	:'INCTAX',
                LINETYPE:7	,
                LINENO:3,
                EARDEDDATE:item[2],
                HOURS:0,	
                ECNTBASE:0,
                ERATE:0	,
                EEXTEND: item[TaxIndex],
                EREGRATE:0,	
                RRATE:0,
                RCNTBASE:0,
                REXTEND:0,
                WCC:'',
                TAXWEEKS:0,
                TAXEARNS:0,
                TXEARNCEIL:0,
                TAXTIPS:0,
                TXTIPSCEIL:0,
                TAXONTIPS:0,
                UNCOLLTAX:0	,
                TAXNONPER:0	,
                TAXEARNBD:0	,
                POOLEDTIPS:0 ,
                STARTTIME:0,
                STOPTIME:0,
                WCCGROUP:""	,
                LOCTAXCODE:"",
                WCBASE:0,
                WCRATE:0,
                WCEXTEND:0,
                CSEFTSTAT:0,
                DISTCODE:""	,
                DISTRNAME:"",
                TAXNONDED:0,
                TAXREPAY:0	,
                CHECKDATE:item[2]
              })
              
            }
          })
        })

        const ws = XLSX.utils.json_to_sheet(object)
       
       //  ws['!ref'] = `A1:M${object.length}`
        const ws2 = XLSX.utils.json_to_sheet(sheet2,)
        // ws2['!ref'] = `A1:AN${sheet2.length}`
        const ws3=XLSX.utils.json_to_sheet([{
          EMPLOYEE:"",	
          PEREND:""	,
          ENTRYSEQ:"",	
          UNIQUE:""	,
          COMMENT:""
        }])
        // ws3['!ref'] = `A1:E1}`
        const ws4=XLSX.utils.json_to_sheet([{
          EMPLOYEE:"",
          PEREND:"",
          ENTRYSEQ:"",
          OPTFIELD:"",
          VALUE:"",
          SWSET:""
        }])
        // ws4['!ref'] = `A1:F1}`
        const ws5=XLSX.utils.json_to_sheet([{
          EMPLOYEE:"",
          PEREND:"",
          ENTRYSEQ:"",
          CATEGORY:"",
          EARNDED:"",
          LINETYPE:"",
          LINENO:"",
          OPTFIELD:"",
          VALUE:"",
          SWSET:""
        }],)
        // ws4['!ref'] = `A1:J1}`
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Cheque_Header");
        XLSX.utils.book_append_sheet(wb, ws2, "Cheque_Details");
        XLSX.utils.book_append_sheet(wb,ws3,'Cheque_Comment_Detail')
        XLSX.utils.book_append_sheet(wb,ws4,'Cheque_Header_Optional_Field_Va')
        XLSX.utils.book_append_sheet(wb,ws5,'Cheque_Details_Optional_Fields')
        wb.Workbook={}
                    wb.Workbook['Names']=[{
                      Sheet:null,
                      Name:'Cheque_Header',
                      Ref:`Cheque_Header!$A$1:$M$${object.length+1}`
                    },
                    {
                      Sheet:null,
                      Name:'Cheque_Details',
                      Ref:`Cheque_Details!$A$1:$AN$${sheet2.length+1}`
                    },
                    {
                      Sheet:null,
                      Name:'Cheque_Comment_Detail',
                      Ref:`Cheque_Comment_Detail!$A$1:$E$1`
                    } ,
                    {
                      Sheet:null,
                      Name:'Cheque_Header_Optional_Field_Val',
                      Ref:`Cheque_Header_Optional_Field_Va!$A$1:$F$1`
                    },
                    {
                      Sheet:null,
                      Name:'Cheque_Details_Optional_Fields',
                      Ref:`Cheque_Details_Optional_Fields!$A$1:$J$1`
                    }
                  ]
                  
        XLSX.writeFile(wb,'employeeHistory.xlsx')
       }}>Process</p>
       </div>
       <a href="https://agsadvanced.com/">
          A Product of AGS Advanced Software Inc.
        </a>
       </div>
    </Zoom>
  );
}

export default PayRoll;
