
import './App.css';

import { useEffect, useState } from 'react';
import * as XLSX from "xlsx";
import { Zoom } from 'react-reveal';
import moment from 'moment';

function PayRoll() {
  let [file4Name,setFileName4]=useState('No File Selected')
let [file5Name,setFile2Name5]=useState('No File Selected')
const [selectedValue, setSelectedValue] = useState('Ontario');
const handleSelectChange = (event) => {
  setSelectedValue(event.target.value);
};


let [data4,setData] = useState([])
let [nameData,setNameData] = useState([])
let [maxCpp,setMaxCpp] = useState(64900)
let [maxEI,setMaxEI] = useState(60300)
let  filePathset3=(e)=> {
  e.stopPropagation();
  e.preventDefault();

  var f = e.target.files[0]

  setFileName4(f.name)
    var reader = new FileReader();
   let p=new Promise((resolve, reject) => {
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
        resolve(true)
      }
      reader.readAsBinaryString(f)
  
    })
    p.then(p=>{
      console.log(p)
     }).catch(err=>{
      console.log(err)
     })
   
}
let  filePathset2=(e)=> {
  e.stopPropagation();
  e.preventDefault();
  var f = e.target.files[0]
  
    setFile2Name5(f.name)
    var reader = new FileReader();
   let p=new Promise((resolve, reject) => {
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
       
        setNameData(temp)
        resolve(true)
      }
      reader.readAsBinaryString(f)
    })
     p.then(p=>{
     
     }).catch(err=>{
      console.log(err)
     })
}
useEffect(()=>{
  if(localStorage.getItem('mc')){
    setMaxCpp(localStorage.getItem('mc'))
  }
  if(localStorage.getItem('me')){
    setMaxEI(localStorage.getItem('me'))
  }
},[])

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
       <div className="input2">
      
        <div>
        <label className="label">Max CPP</label>
        <label
        htmlFor="myInput"
        className="inputLabel2"
        >
       
        </label>
       <input
          id="myInput"
          type="number"
          value={maxCpp}
          onChange={(e)=>{
            localStorage.setItem('mc',e.target.valueAsNumber)
            setMaxCpp(e.target.valueAsNumber)
          }}
        />
        </div>
        <div>
        <label className="label">Max EI</label>
        <label
        htmlFor="myInput"
        className="inputLabel2"
        >
       
        </label>
       <input
          id="myInput"
          type="number"
          value={maxEI}
          onChange={(e)=>{
            setMaxEI(e.target.valueAsNumber)
            localStorage.setItem('me',e.target.valueAsNumber)
          }}
          
        />
        </div>
       </div>
       <div className="input3">
       <div>
       <label>Select an option for Sheet Type</label>
       </div>
        <div>
        <select className=".select-container" value={selectedValue} onChange={handleSelectChange}>
        
        <option value="Ontario">Ontario</option>
        <option value="Quebec">Quebec</option>
      </select>
        </div>
       </div>
       <p style={{backgroundColor:'red',width:100,margin:20,textAlign:'center'
       ,borderRadius:10,cursor:'pointer'}} onClick={()=>{
        
        if(selectedValue=="Ontario"){
          let object=[]
        let sheet2=[]
        let grossIndex=4
        let DPSPIndex=14
        let RSSPIndex=16
        let CPPIndex=10
        let TaxIndex=11
        let vacationIndex=12
        let EIR1=9
      
        data4.sort((a,b)=>{
          return a.Name-b.Name && a.Date-b.Date
        })

       let pre=[]
       
       let newData=data4
       let p1=new Promise((res,rej)=>{
      let temp=  newData.map((cur,index)=>{
        
          if(pre.length>0 && pre[0]!="Name"){
          
            if(cur[0]==pre[0] && moment(cur[2]).isSame(moment(pre[2]))){
         
              cur[grossIndex]=cur[grossIndex]+pre[grossIndex]
              cur[DPSPIndex]=cur[DPSPIndex]+pre[DPSPIndex]
              cur[DPSPIndex+1]=cur[grossIndex+1]+pre[DPSPIndex+1]
              cur[RSSPIndex]=cur[RSSPIndex]+pre[RSSPIndex]
              cur[CPPIndex]=cur[CPPIndex]+pre[CPPIndex]
              cur[TaxIndex]=cur[TaxIndex]+pre[TaxIndex]
              cur[EIR1]=cur[EIR1]+pre[EIR1]
              cur[vacationIndex]=cur[vacationIndex]+pre[vacationIndex]
              cur[vacationIndex+1]=cur[vacationIndex+1]+pre[vacationIndex+1]
              newData.splice(index-1,1)
            }
          }
          pre=cur
          return cur
        })
        console.log(temp)
      if(temp){
        
        res(true)
      }   
       })
      p1.then(res=>{
        
        if(res){
       
         let p2=new Promise((res,rej)=>{
          let wages={}
          let previous={}
          let cppMax={}
          let IMax={}
         
          newData.map((item,index)=>{
            
            let found=   nameData.find(element=>{ 
             
              if(item[0]==element[6]||item[0].split(',')[0]==element[6].split(',')[0]){
                  
                  return element 
                 }
               })
               if(found){
                let element=found
                let cppWage=0
                let IWage=0
                let wage=Number(item[grossIndex])+Number(item[DPSPIndex])
                previous[element[0]]=wages[element[0]]
                wages[element[0]]?wages[element[0]]=wages[element[0]]+wage:
                wages[element[0]]=wage
                if(wages[element[0]]>maxCpp && !cppMax[element[0]]){
                 cppWage=maxCpp-previous[element[0]]
                 cppMax[element[0]]=true
                //  console.log("CPP Diff",previous[element[0]],"max",wages[element[0]])
                }
                if(wages[element[0]]>maxEI && !IMax[element[0]]){
                  IWage=maxEI-previous[element[0]]
                  IMax[element[0]]=true
                  // console.log("EIR1 Diff",previous[element[0]],"max",wages[element[0]])
                 } 
                
                 object.push({
                   EMPLOYEE:element[0],
                   PEREND:moment(item[2]).format('YYYY-MM-DD'),
                   ENTRYSEQ:0,
                   CLASS1:"",
                   CLASS2:"",
                   CLASS3:"",
                   CLASS4:"",
                   WORKPROV:8,
                   SWEXTERNTC:0,
                   EXRATEDATE:moment(item[2]).format('YYYY-MM-DD'),
                   ORGTYPE:1,
                   CSEFTSTAT:0,
                   USERSEC:0
                 })
                 if(Number(item[vacationIndex])>0){
                   sheet2.push({
                     EMPLOYEE:element[0],	
                     PEREND:moment(item[2]).format('YYYY-MM-DD')	,
                     ENTRYSEQ:0	,
                     CATEGORY:1	,
                     EARNDED	:'VACACR',
                     LINETYPE:1	,
                     LINENO:5	,
                     EARDEDDATE:moment(item[2]).format('YYYY-MM-DD'),
                     HOURS:0,	
                     ECNTBASE:0,
                     ERATE:0	,
                     EEXTEND:Number(item[vacationIndex]),
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
                     CHECKDATE:moment(item[2]).format('YYYY-MM-DD')
                   })
                 }
                 if(Number(item[vacationIndex+1])>0){
                   sheet2.push({
                     EMPLOYEE:element[0],	
                     PEREND:moment(item[2]).format('YYYY-MM-DD')	,
                     ENTRYSEQ:0	,
                     CATEGORY:1	,
                     EARNDED	:'VACACR',
                     LINETYPE:2	,
                     LINENO:6	,
                     EARDEDDATE:moment(item[2]).format('YYYY-MM-DD'),
                     HOURS:0,	
                     ECNTBASE:0,
                     ERATE:0	,
                     EEXTEND:Number(item[vacationIndex+1]),
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
                     CHECKDATE:moment(item[2]).format('YYYY-MM-DD')
                   })
                 }
                 sheet2.push({
                   EMPLOYEE:element[0],	
                   PEREND:moment(item[2]).format('YYYY-MM-DD')	,
                   ENTRYSEQ:0	,
                   CATEGORY:2	,
                   EARNDED	:'HOURLY',
                   LINETYPE:3	,
                   LINENO:0	,
                   EARDEDDATE:moment(item[2]).format('YYYY-MM-DD'),
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
                   CHECKDATE:moment(item[2]).format('YYYY-MM-DD')
                 })
                 
                 if(Number(item[RSSPIndex])>0){
                   sheet2.push({
                     EMPLOYEE:element[0],	
                     PEREND:moment(item[2]).format('YYYY-MM-DD')	,
                     ENTRYSEQ:0	,
                     CATEGORY:4	,
                     EARNDED	:'RRSP',
                     LINETYPE:6	,
                     LINENO:4,
                     EARDEDDATE:moment(item[2]).format('YYYY-MM-DD'),
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
                     CHECKDATE:moment(item[2]).format('YYYY-MM-DD')
                   })
                 }
                 if(Number(item[DPSPIndex])>0){
                  
                   sheet2.push({
                       EMPLOYEE:element[0],	
                       PEREND:moment(item[2]).format('YYYY-MM-DD')	,
                       ENTRYSEQ:0	,
                       CATEGORY:4	,
                       EARNDED	:'DPSP',
                       LINETYPE:6	,
                       LINENO:4,
                       EARDEDDATE:moment(item[2]).format('YYYY-MM-DD'),
                       HOURS:0,	
                       ECNTBASE:0,
                       ERATE:0	,
                       EEXTEND: 0,
                       EREGRATE:0,	
                       RRATE:0,
                       RCNTBASE:0,
                       REXTEND:item[DPSPIndex],
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
                       CHECKDATE:moment(item[2]).format('YYYY-MM-DD')
                     })
                 }
                 
                 sheet2.push({
                   EMPLOYEE:element[0],	
                   PEREND:moment(item[2]).format('YYYY-MM-DD')	,
                   ENTRYSEQ:0	,
                   CATEGORY:7	,
                   EARNDED	:'CPP',
                   LINETYPE:7	,
                   LINENO:1	,
                   EARDEDDATE:moment(item[2]).format('YYYY-MM-DD'),
                   HOURS:0,	
                   ECNTBASE:0,
                   ERATE:0	,
                   EEXTEND: item[CPPIndex],
                   EREGRATE:0,	
                   RCNTBASE:0,
                   RRATE:0,
                   REXTEND:item[CPPIndex],
                   WCC:'',
                   TAXWEEKS:0,
                   TAXEARNS:wage,
                   TXEARNCEIL:wages[element[0]]>maxCpp?cppWage:wage,
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
                   CHECKDATE:moment(item[2]).format('YYYY-MM-DD')
                 })
                 sheet2.push({
                   EMPLOYEE:element[0],	
                   PEREND:moment(item[2]).format('YYYY-MM-DD')	,
                   ENTRYSEQ:0	,
                   CATEGORY:7	,
                   EARNDED	:'EIR1',
                   LINETYPE:7	,
                   LINENO:2	,
                   EARDEDDATE:moment(item[2]).format('YYYY-MM-DD'),
                   HOURS:0,	
                   ECNTBASE:0,
                   ERATE:0	,
                   EEXTEND: item[9],
                   EREGRATE:0,	
                   RRATE:0,
                   RCNTBASE:0,
                   REXTEND:item[9]*1.4,
                   WCC:'',
                   TAXWEEKS:0,
                   TAXEARNS:wage,
                   TXEARNCEIL:wages[element[0]]>maxEI?IWage:wage,
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
                   CHECKDATE:moment(item[2]).format('YYYY-MM-DD')
                 })
                 sheet2.push({
                   EMPLOYEE:element[0],	
                   PEREND:moment(item[2]).format('YYYY-MM-DD')	,
                   ENTRYSEQ:0	,
                   CATEGORY:7	,
                   EARNDED	:'INCTAX',
                   LINETYPE:7	,
                   LINENO:3,
                   EARDEDDATE:moment(item[2]).format('YYYY-MM-DD'),
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
                   TAXEARNBD:wage	,
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
                   CHECKDATE:moment(item[2]).format('YYYY-MM-DD')
                 })
               
               }
               
               if(newData.length-1==index){
               
                res(true)
              }
             })
           
         })
         p2.then(res=>{
            if(res){
              
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
            }
         })
          
        }
      })
        }else{
          let object=[]
        let sheet2=[]
        let grossIndex=4
        let loannnpaidIndex=6
        let AdvancedpayIndex=5
        let withheldIndex=7
        let netpay=8
        let EIR1=9
        let Qpip=10
        let CPPIndex=11
        let qppIndex=12
        let INCTAX=13
        let qitax=14
      
        data4.sort((a,b)=>{
          return a.Name-b.Name && a.Date-b.Date
        })

       let pre=[]
      
       let newData=data4
       let p1=new Promise((res,rej)=>{
      let temp=  newData.map((cur,index)=>{
        
          if(pre.length>0 && pre[0]!="Name"){
          
            if(cur[0]==pre[0] && moment(cur[2]).isSame(moment(pre[2]))){
         
              cur[grossIndex]=cur[grossIndex]+pre[grossIndex]
              cur[EIR1]=cur[EIR1]+pre[EIR1]
              cur[Qpip]=cur[Qpip]+pre[Qpip]
              cur[CPPIndex]=cur[CPPIndex]+pre[CPPIndex]
              cur[qppIndex]=cur[qppIndex]+pre[qppIndex]
              cur[INCTAX]=cur[INCTAX]+pre[INCTAX]
              cur[qitax]=cur[qitax]+pre[qitax]
             
              newData.splice(index-1,1)
            }
          }
          pre=cur
          return cur
        })
        console.log(temp)
      if(temp){
        
        res(true)
      }   
       })
      p1.then(res=>{
        
        if(res){
       
         let p2=new Promise((res,rej)=>{
          let wages={}
          let previous={}
          let cppMax={}
          let IMax={}
         
          newData.map((item,index)=>{
            
            let found=   nameData.find(element=>{ 
             
              if(item[0]==element[6]||item[0].split(',')[0]==element[6].split(',')[0]){
                  
                  return element 
                 }
               })
               if(found){
                let element=found
                let cppWage=0
                let IWage=0
                let wage=Number(item[grossIndex])
                previous[element[0]]=wages[element[0]]
                wages[element[0]]?wages[element[0]]=wages[element[0]]+wage:
                wages[element[0]]=wage
                if(wages[element[0]]>maxCpp && !cppMax[element[0]]){
                 cppWage=maxCpp-previous[element[0]]
                 cppMax[element[0]]=true
                //  console.log("CPP Diff",previous[element[0]],"max",wages[element[0]])
                }
                if(wages[element[0]]>maxEI && !IMax[element[0]]){
                  IWage=maxEI-previous[element[0]]
                  IMax[element[0]]=true
                  // console.log("EIR1 Diff",previous[element[0]],"max",wages[element[0]])
                 } 
                
                 object.push({
                   EMPLOYEE:element[0],
                   PEREND:moment(item[2]).format('YYYY-MM-DD'),
                   ENTRYSEQ:0,
                   CLASS1:"",
                   CLASS2:"",
                   CLASS3:"",
                   CLASS4:"",
                   WORKPROV:11,
                   SWEXTERNTC:0,
                   EXRATEDATE:moment(item[2]).format('YYYY-MM-DD'),
                   ORGTYPE:1,
                   CSEFTSTAT:0,
                   USERSEC:0
                 })
                 sheet2.push({
                  EMPLOYEE:element[0],	
                  PEREND:moment(item[2]).format('YYYY-MM-DD')	,
                  ENTRYSEQ:0	,
                  CATEGORY:2	,
                  EARNDED	:'OREG',
                  LINETYPE:3	,
                  LINENO:0	,
                  EARDEDDATE:moment(item[2]).format('YYYY-MM-DD'),
                  HOURS:0,	
                  ECNTBASE:0,
                  ERATE:0	,
                  EEXTEND:Number(item[grossIndex]),
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
                  CHECKDATE:moment(item[2]).format('YYYY-MM-DD')
                })
                 sheet2.push({
                   EMPLOYEE:element[0],	
                   PEREND:moment(item[2]).format('YYYY-MM-DD')	,
                   ENTRYSEQ:0	,
                   CATEGORY:7	,
                   EARNDED	:'QEIR1',
                   LINETYPE:7	,
                   LINENO:1	,
                   EARDEDDATE:moment(item[2]).format('YYYY-MM-DD'),
                   HOURS:0,	
                   ECNTBASE:0,
                   ERATE:0	,
                   EEXTEND:Number(item[EIR1]),
                   EREGRATE:0,	
                   RCNTBASE:0,
                   RRATE:0,
                   REXTEND:(Number(item[EIR1])*1.4).toFixed(2),
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
                   CHECKDATE:moment(item[2]).format('YYYY-MM-DD')
                 })
                
                 sheet2.push({
                   EMPLOYEE:element[0],	
                   PEREND:moment(item[2]).format('YYYY-MM-DD')	,
                   ENTRYSEQ:0	,
                   CATEGORY:7	,
                   EARNDED	:'QPIP',
                   LINETYPE:7	,
                   LINENO:2	,
                   EARDEDDATE:moment(item[2]).format('YYYY-MM-DD'),
                   HOURS:0,	
                   ECNTBASE:0,
                   ERATE:0	,
                   EEXTEND: item[Qpip],
                   EREGRATE:0,	
                   RCNTBASE:0,
                   RRATE:0,
                   REXTEND:(Number(item[Qpip])*1.4).toFixed(2),
                   WCC:'',
                   TAXWEEKS:0,
                   TAXEARNS:wage,
                   TXEARNCEIL:wages[element[0]]>maxCpp?cppWage:wage,
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
                   CHECKDATE:moment(item[2]).format('YYYY-MM-DD')
                 })
                 sheet2.push({
                   EMPLOYEE:element[0],	
                   PEREND:moment(item[2]).format('YYYY-MM-DD')	,
                   ENTRYSEQ:0	,
                   CATEGORY:7	,
                   EARNDED	:'QPP',
                   LINETYPE:7	,
                   LINENO:3	,
                   EARDEDDATE:moment(item[2]).format('YYYY-MM-DD'),
                   HOURS:0,	
                   ECNTBASE:0,
                   ERATE:0	,
                   EEXTEND: item[qppIndex],
                   EREGRATE:0,	
                   RRATE:0,
                   RCNTBASE:0,
                   REXTEND:Number(item[qppIndex]).toFixed(2),
                   WCC:'',
                   TAXWEEKS:0,
                   TAXEARNS:wage,
                   TXEARNCEIL:wages[element[0]]>maxEI?IWage:wage,
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
                   CHECKDATE:moment(item[2]).format('YYYY-MM-DD')
                 })
                 sheet2.push({
                   EMPLOYEE:element[0],	
                   PEREND:moment(item[2]).format('YYYY-MM-DD')	,
                   ENTRYSEQ:0	,
                   CATEGORY:7	,
                   EARNDED	:'INCTAX',
                   LINETYPE:7	,
                   LINENO:4,
                   EARDEDDATE:moment(item[2]).format('YYYY-MM-DD'),
                   HOURS:0,	
                   ECNTBASE:0,
                   ERATE:0	,
                   EEXTEND: item[INCTAX],
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
                   TAXEARNBD:wage	,
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
                   CHECKDATE:moment(item[2]).format('YYYY-MM-DD')
                 })
                 sheet2.push({
                  EMPLOYEE:element[0],	
                  PEREND:moment(item[2]).format('YYYY-MM-DD')	,
                  ENTRYSEQ:0	,
                  CATEGORY:7	,
                  EARNDED	:'QITAX',
                  LINETYPE:7	,
                  LINENO:5,
                  EARDEDDATE:moment(item[2]).format('YYYY-MM-DD'),
                  HOURS:0,	
                  ECNTBASE:0,
                  ERATE:0	,
                  EEXTEND: item[qitax],
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
                  TAXEARNBD:wage	,
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
                  CHECKDATE:moment(item[2]).format('YYYY-MM-DD')
                })
               }
               
               if(newData.length-1==index){
               
                res(true)
              }
             })
           
         })
         p2.then(res=>{
            if(res){
              
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
            }
         })
          
        }
      })
        }
      
       
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
