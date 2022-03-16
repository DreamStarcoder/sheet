import React, { useState } from "react";
import "./App.css";
import * as XLSX from "xlsx";
import { Button,Steps } from 'antd';
import 'antd/dist/antd.css';
import { UploadOutlined } from '@ant-design/icons';
const { Step } = Steps;
let GL=()=>  {

let [file3,setfile3] = useState('')
let [file4,setfile4] = useState('')

let [data4,setData4] = useState([])
let [filtered,setfilterd] = useState([])

      
let  filePathset=(e,step)=> {
    e.stopPropagation();
    e.preventDefault();
    var f = e.target.files[0]
   if(step==3){
     setfile3(f)
    }else if(step==4){
     setfile4(f)
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
        if(step==3){
          console.log(step3(dataParse))
        }else{
          console.log(step4(dataParse))
        }
    };
    reader.readAsBinaryString(f)
}


let step3=(csv)=> {
    //return result; //JavaScript object
    let processed=[]
    let check=false
    let customer=''
    csv.map(element=>{
      if(check){
        if(element.length==1){
          if(element[0].length>0 && !element[0].includes('Generated On')){
            customer=element[0]
          }
        }else{
            if(!element[0] && element[1]){
             processed.push({
               IDCUST:customer,
               IDINVC:element[1],
               DATEINVC:(element[3].getMonth()+1)+'-'+(element[3].getDate()+1)+'-'+element[3].getFullYear(),
               AMTDIST:element[5]
              })
            }

        }
      }
      if(element.length>3 && element[1]===" Source"){
        console.log(element)
        check=true
      } 
    })
   setData3(processed)
    return processed; //JSON
  } 
let step4=(csv)=> {
    //return result; //JavaScript object
    let processed=[]
    let check=false

    csv.forEach((element,index) => {
        if(index!==0){
          processed.push({
            IDCUST:element[0],
            NAMECUST:element[3],
          })
        }
    })
    setData4(processed)
    return processed; //JSON
  }    
  

    return (
      <div className="">
        <input
          type="file"
          onChange={(e)=>{filePathset(e,3)}}
        />
        <Button
          onClick={() => {
          //  readFile();
          handleUpload(3,file3)
          }}
        >
          Process Ar File
        </Button>
        <input
          type="file"
          onChange={(e)=>{filePathset(e,4)}}
        />
        <Button
          onClick={() => {
          //  readFile();
          handleUpload(4,file4)
          }}
        >
          Process Ar-customer File
        </Button>
        <Button
          onClick={() => {
          let data=[]  
            for (var item in data3) {
            let found= data4.find(element=>data3[item].IDCUST==element.NAMECUST)
            if(found){
             data.push({
              REQUESTID:"",
                IDCUST:found.IDCUST,
                TEXTTRX:1,
                IDTRX:'',
                VALUE:"",
                AMTDIST:data3[item].AMTDIST,
                DATEINVC:data3[item].DATEINVC,
                ACCTFMTTD:"",
                IDCUSTSHPT:"",
                PONUMBER:""
            })
            }else{
              data.push({
                REQUESTID:"",
                IDCUST:data3[item].IDCUST,
                TEXTTRX:1,
                IDTRX:'',
                VALUE:"",
                AMTDIST:data3[item].AMTDIST,
                DATEINVC:data3[item].DATEINVC,
                ACCTFMTTD:"",
                IDCUSTSHPT:"",
                PONUMBER:""
              })
            }
            
          }
          setfilterd2(data)
        }}
        >
         Match Account
        </Button>
        <Button onClick={()=>{

const ws = XLSX.utils.json_to_sheet(filtered2)
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "sheet 1");

XLSX.writeFile(wb,'./test.xlsx')
}} >
AR import
</Button>
      </div>
    );
}

export default GL;