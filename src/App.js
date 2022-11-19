
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Divider, message, Tabs } from 'antd';
import GL from './GL';
import AR from './AR';
import AP from './AP';
import Login from './Login';
import { useEffect, useState } from 'react';
import moment from 'moment';
import PayRoll from './PayRoll';
const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

function App() {
  let [login,setLogin]=useState(false)
  let data=localStorage.getItem("license-expiry")
  useEffect(()=>{
    if(data){
      let currentdate=moment().format('YYYY-MM-DD')
     if(moment(JSON.parse(data).data.expire_status,'YYYY-MM-DD').isSame(currentdate)){
       message.error('license Expired')
       setLogin(false)
     }
    }
  })
  return (
    <div className="App">
  
     {
      login &&  <div>
      <div className='header'>
      <div className='logos'>
      <img src={process.env.PUBLIC_URL+'\\logo.png'} className="logo" alt="AGS LOGO"  />
      <img src={process.env.PUBLIC_URL+'\\tblogo.png'} className="tb-logo" alt="AGS LOGO"  />
      </div>  
      <div className='license'>
   
      <p className='token'>Expiry Date {JSON.parse(data).data.expire_date}</p>
      <p className='token'>License Code {JSON.parse(data).data.code}</p>
      <Button type='primary' onClick={()=>{
        var axios = require('axios');
        var payload = JSON.stringify({
          "used": false
        });
        console.log(JSON.parse(data))
        var config = {
          method: 'put',
          url: 'https://activatewm.com/v1/license/update?_id='+
          JSON.parse(data).data.uid
          ,
          headers: { 
            'Content-Type': 'application/json'
          },
          data : payload
        };
        
        axios(config)
        .then(function (response) {
          localStorage.removeItem('license-expiry')
          setLogin(false)
        })
        .catch(function (error) {
          
        });
        
      
      }}>Logout</Button>
      </div> 
      </div>
      <Divider/>
       <Tabs tabPosition='left' defaultActiveKey="1" onChange={callback}>
      <TabPane tab="GL Trial Balance" key="1">
      <GL/>
      </TabPane>
      <TabPane tab="AR Trail Balance" key="2">
       <AR />
      </TabPane>
      <TabPane tab="AP Trial Balance" key="3">
        <AP />
      </TabPane>
      <TabPane tab="Payroll" key="4">
        <PayRoll />
      </TabPane>
    </Tabs>
    
    </div>
     }
     {
      !login &&   <Login login={setLogin}/>
     }
      <img  src={process.env.PUBLIC_URL+'\\partner.png'} className="partner-logo" alt="AGS LOGO"  />
     
    </div>
    
  );
}

export default App;
