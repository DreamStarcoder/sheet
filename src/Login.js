import React, { useEffect, useState } from 'react'
import './Login.css';
import { message } from 'antd';
import { Zoom } from 'react-reveal';
import axios from 'axios';
let data=localStorage.getItem("license-expiry")
const Login = (props) => {

  let [code,setCode]=useState("")
  
  useEffect(()=>{
    
   if(data){
    props.login(true)
   }
  },[])
  let verify=(code)=>{
    var data=new FormData();
    data.append('request',
    JSON.stringify({
      "method":"check_license",
      "data":{
          "license_code":`${code}`
      }}))
      axios.post(`https://activatewm.com/api`,
      data
  ).then(response=>{
    if(response.status==200){
      let status=response.data.status
     // setLoading(false)
      if(status!='fail'){   
         if(response.data.data.expire_status==0){
          message.error("Expired: License code Checked") 
         } 
         else{
          message.success("Successful: License code Checked") 

          localStorage.setItem('license-expiry',JSON.stringify(response.data))
           props.login(true)            
         }
      }
      else{
       message.error(response.data.message)        
      }}
  }).catch(err=>{
    console.log(err)
  }) 

  }
  return (
    <div>
      <div className="login_container">
       
         <Zoom>
         <div className="login_form">
             <img src={process.env.PUBLIC_URL+'\\logo.png'} className="login_img" alt="AGS LOGO"  width={400} height={200}/>
             <form>
             <h1>LOGIN</h1>
             <label className="Label">Verification Code *</label> <br />
             <input className="login_input_field" maxLength={8} placeholder="Verification Code*" required
             onChange={(e)=>{
               setCode(e.target.value)
             }}
             /><br/>
             <input  className='login_submit_btn' value={"Submit"} type={"button"} onClick={(data)=>{
                if(code<8){
                 message.warn("please enter complete Code")
                }else{
                 verify(code)
                }
             }}></input> 
             </form>
         </div>
 </Zoom>        
        
       
      </div>
      
    </div>
  )
}

export default Login
