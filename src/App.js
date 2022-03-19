
import './App.css';

import { Tabs } from 'antd';
import GL from './GL';
import AR from './AR';
import AP from './AP';

const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}
function App() {
  return (
    <div className="App">
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
  );
}

export default App;
