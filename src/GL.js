import React, { useState } from "react";
import "./App.css";
import * as XLSX from "xlsx";
import { Button,Steps } from 'antd';
import 'antd/dist/antd.css';
import { UploadOutlined } from '@ant-design/icons';
const { Step } = Steps;
let GL=()=>  {
let [file,setfile] = useState('')
let [file2,setfile2] = useState('')
let [data1,setData1] = useState([])
let [data2,setData2] = useState([])
let [filtered,setfilterd] = useState([])
      
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
    reader.onload = function (e) {
        var data = e.target.result;
        let readedData = XLSX.read(data, {type: 'binary', cellDates: true,raw:false});
        const wsname = readedData.SheetNames[0];
        const ws = readedData.Sheets[wsname];
        /* Convert array to json*/
        const dataParse = XLSX.utils.sheet_to_json(ws, {header:1});
        if(step==1){
          console.log(step1(dataParse))
        }else if(step==2){  
          console.log(step2(dataParse))
        }
    };
    reader.readAsBinaryString(f)
}

let step1=(csv)=> {
    //return result; //JavaScript object
    let processed=[]
    let check=false
    csv.forEach((element,index) => {
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
    setData1(processed)
    return processed; //JSON
  }
let step2=(csv)=> {
    //return result; //JavaScript object
    let processed=[]
    let check=false

    csv.forEach((element,index) => {
        if(index!==0){
          processed.push({
            ACCTID:element[0],
            ACCTDESC:element[2],
          })
        }
    })
    setData2(processed)
    return processed; //JSON
  } 
 
    return (
      <div className="">
        <input
          type="file"
          onChange={(e)=>{filePathset(e,1)}}
        />
         <br />
        <Button
          onClick={() => {
          //  readFile();
          handleUpload(1,file)
          }}
        >
          Process File
        </Button>
        <br />
        <input
          type="file"
          onChange={(e)=>{filePathset(e,2)}}
        />
         <br />
         <br />
        <Button
          onClick={() => {
          //  readFile();
          handleUpload(2,file2)
          }}
        >
          Process File
        </Button>
        <br />
        <br />
      
        <Button
          onClick={() => {
          let data=[]  
            for (var item in data1) {
            if(data1[item].ACCTDESC && data1[item].Amounts!=-0){
            let found= data2.find(element=>data1[item].ACCTDESC==element.ACCTDESC)
            if(found){
             data.push({
              BATCHNBR:'ABC',
              JOURNALID:'ABC',
              TRANSNBR:'ABC', 
              ACCTID:found.ACCTID,
              TRANSAMT:data1[item].Amounts,
              TRANSDESC:'Opening Balances',
              TRANSREF:'Opening Balances'
            })
            }else{
              data.push({
                BATCHNBR:'ABC',
                JOURNALID:'ABC',
                TRANSNBR:'ABC',
                ACCTID:`02${data1[item].ACCTID}`,
                TRANSAMT:data1[item].Amounts,
                TRANSDESC:'Opening Balances',
                TRANSREF:'Opening Balances'
              })
            }
            }
          }
          
          setfilterd(data)
        }}
        >
         Match Account
        </Button>
        <br />
        <br />
        <Button onClick={()=>{

          const ws = XLSX.utils.json_to_sheet(filtered)
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Journal_Headers");
          XLSX.utils.book_append_sheet(wb, ws, "Journal_Details");
          XLSX.utils.book_append_sheet(wb, ws, "Journal_Detail_Optional_Fields");
          XLSX.writeFile(wb,'./test.xlsx')
        }} >
          GL import
        </Button>
      </div>
    );
}

export default GL;