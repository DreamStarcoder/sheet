import React, { useState } from "react";
import "./App.css";
import * as XLSX from "xlsx";
import { Button,Menu, Dropdown, message, Divider  } from 'antd';
import 'antd/dist/antd.css';


let GL=()=>  {
let [fsY,setfsY]=useState('')    
let [CodeY,setCode]=useState('')    
let [PeriodF,setPeriodF]=useState('')    
let Company=["01","02","03","04","05","07","08","09","10","11","12","13","14","15","16"]
let Period=["01","02","03","04","05","06","07","08","09","10","11","12"]
let FiscalYear=["2023","2022","2021","2022","2019"]
let [file,setfile] = useState('')
let [file2,setfile2] = useState('')

let count=(rng)=>{
  let data='00000000'+rng
  if(data.length>10){
    data=data.substring(data.length-10,data.length)
  }
  return data
}
let  filePathset=(e,step)=> {
    e.stopPropagation();
    e.preventDefault();
    var f = e.target.files[0]
    if(step==1){
      setfile(f);
    }else if(step==2){
     setfile2(f)
    }
  }

const handleUpload = (step,f) => {
    var reader = new FileReader();
    return new Promise((resolve, reject) => {
    reader.onload = function (e) {
        var data = e.target.result;
        let readedData = XLSX.read(data, {type: 'binary', cellDates: true,raw:false});
        const wsname = readedData.SheetNames[0];
        const ws = readedData.Sheets[wsname];
        /* Convert array to json*/
        const dataParse = XLSX.utils.sheet_to_json(ws, {header:1});
        if(step==1){
        resolve(step1(dataParse))
        }else if(step==2){  
        resolve(step2(dataParse))
        }
    };
    reader.readAsBinaryString(f)
  })
}

let step1=(csv)=> {
    //return result; //JavaScript object
    let processed=[]
    let check=false
    csv.map((element,index) => {
     try {
      if(check){
        let obj={}
        if(element[0] || element[2]!==0 ||element[3]!==0){ 
         obj['ACCTID']=element[0]
         obj['ACCTDESC']=element[1]
         obj['Amounts']=element[2]!==0?element[2]:-element[3]
         processed.push(obj)
        }
    }
    if(element[0]==='Account Number'){
      check=true
    } 
     } catch (error) {
       
     }
       
    });
    return processed
  }
let step2=(csv)=> {
    //return result; //JavaScript object
    let processed=[]
    let check=false

    csv.map((element,index) => {
        if(index!==0){
          processed.push({
            ACCTID:element[0],
            ACCTDESC:element[2],
          })
        }
    })
    return processed
  } 
 
    return (
      <div>
        <h1 style={{backgroundColor:'beige',margin:'2%',fontFamily:'fantasy',padding:4,color:'blueviolet'}}>GL Sheet-Convertor</h1>
        <div 
           style={{
            display: "flex",
            flexDirection: "column",
            width: "30%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
        <label>Select GL Balances Sheet</label>
        <input
          type="file"
          onChange={(e)=>{filePathset(e,1)}}
        />
        <label>Select GL Account Sheet</label>
        <input
          type="file"
          onChange={(e)=>{filePathset(e,2)}}
        />
         <br />
        <Dropdown.Button
        style={{ float: 'right' }}
        overlay={<Menu>
          {
            FiscalYear.map((element)=>{
              return <Menu.Item onClick={()=>{
               setfsY(element)
              }}>{element}</Menu.Item>
            })
          }
        </Menu>}
      >Fiscal Year</Dropdown.Button>
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
      <Dropdown.Button
        style={{ float: 'right' }}
        overlay={<Menu>
          {
            Period.map(element=>{
              return <Menu.Item onClick={()=>{
                setPeriodF(element)
              }}>{element}</Menu.Item>
            })
          }
        </Menu>}
      >
        Fiscal Period
      </Dropdown.Button>
      <br/>
      <p>Company-Code {CodeY} ______ Fiscal-Year {fsY}___ Fiscal-Period {PeriodF}</p>
        </div>
        <Divider />
        <Button onClick={()=>{
        try {
            Promise.all([handleUpload(1,file),handleUpload(2,file2)]).then(res=>{
              if(res.length>=1){
                console.log('done')
                let data1=res[0]
                let data2=res[1]
                let data=[] 
                let rng=0
                for (var item in data1) {
                if(data1[item].ACCTDESC && data1[item].Amounts!=-0){
                let found= data2.find(element=>data1[item].ACCTDESC.trim()==element.ACCTDESC.trim())
                rng+=20
                if(found){
                 data.push({
                  BATCHNBR:'000100',
                  JOURNALID:'00001',
                  TRANSNBR:count(rng), 
                  ACCTID:CodeY+found.ACCTID.slice(2),
                  TRANSAMT:data1[item].Amounts,
                  TRANSDESC:'Opening Balances',
                  TRANSREF:'Opening Balances'
                })
                }else{
                  data.push({
                    BATCHNBR:'000100',
                    JOURNALID:'00001',
                    TRANSNBR:count(rng),
                    ACCTID:`${CodeY}${data1[item].ACCTID}`,
                    TRANSAMT:data1[item].Amounts,
                    TRANSDESC:'Opening Balances',
                    TRANSREF:'Opening Balances'
                  })
                }
                }
              }
          let date=new Date()
          const ws = XLSX.utils.json_to_sheet([{
            BATCHID:'000100',BTCHENTRY:"00001",
            SRCELEDGER:"GL",SRCETYPE:"JE",FSCSYR:fsY,FSCSPERD:PeriodF,JRNLDESC:"Ship asap",
            DOCDATE:`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
          }])

          const ws1 = XLSX.utils.json_to_sheet(data)
          const ws2 = XLSX.utils.json_to_sheet([{
            BATCHNBR:"",JOURNALID:"",	
            TRANSNBR:"",OPTFIELD:"",VALUE:"",TYPE:"",LENGTH:"",
            DECIMALS:"",ALLOWNULL:"",VALIDATE:"",SWSET:"",VALINDEX:"",VALIFTEXT:"",
            VALIFMONEY:"",VALIFNUM:"",VALIFLONG:"",VALIFBOOL:"",VALIFDATE:"",VALIFTIME:"",FDESC:"",VDESC:""
          }])
          const wb = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, "Journal_Headers");
          XLSX.utils.book_append_sheet(wb, ws1, "Journal_Details");
          XLSX.utils.book_append_sheet(wb, ws2, "Journal_Detail_Optional_Fields");
          XLSX.writeFile(wb,'GL.xlsx')
          message.success('Successful')
              }
            })
             
        } catch (error) {
          message.error('Failed')
        }
        }} >
          GL import
        </Button>

      </div>
     
    );
}

export default GL;