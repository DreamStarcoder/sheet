
import './App.css';

import { Button, Divider, Tabs } from 'antd';
import GL from './GL';
import AR from './AR';
import AP from './AP';
import Login from './Login';
import { useEffect, useState } from 'react';

const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}

function App() {
  let [login,setLogin]=useState(false)
  let data=localStorage.getItem("license-expiry")
  useEffect(()=>{
    
    console.log(data)
  },[])
  return (
    <div className="App">
  
     {
      login &&  <div>
      <div className='header'>
      <div className='license'>
      <p>Expiry Date {JSON.parse(data).data.expire_date}</p>
      <p>license Code {JSON.parse(data).data.code}</p>
      <Button type='primary' onClick={()=>{
        localStorage.removeItem('license-expiry')
        setLogin(false)
      }}>Logout</Button>
      <Button type='primary'>Refresh license</Button>
      </div>  
      <div className='logos'>
      <img src={process.env.PUBLIC_URL+'\\partner.png'} className="partner-logo" alt="AGS LOGO"  />
      <img src={process.env.PUBLIC_URL+'\\tblogo.png'} className="tb-logo" alt="AGS LOGO"  />
     
      </div>
     
      </div>
      <Divider/>
       <Tabs tabPosition='left' defaultActiveKey="1" onChange={callback}>
      <TabPane tab="GL Portion" key="1">
      <GL/>
      </TabPane>
      <TabPane tab="AR Portion" key="2">
       <AR />
      </TabPane>
      <TabPane tab="AP Portion" key="3">
        <AP />
      </TabPane>
    </Tabs>
    </div>
     }
     {
      !login &&   <Login login={setLogin}/>
     }
     
    </div>
    
  );
}

export default App;
