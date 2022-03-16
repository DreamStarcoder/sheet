
import './App.css';

import ExcelToJson from './ExcelToJson';
import { Tabs } from 'antd';
import GL from './GL';

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
    <TabPane tab="AP Portion" key="2">
      Content of Tab Pane 2
    </TabPane>
    <TabPane tab="AR Portion" key="3">
      Content of Tab Pane 3
    </TabPane>
  </Tabs>
     
    </div>
  );
}

export default App;
