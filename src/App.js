import { useState, useEffect } from 'react';
import './App.css';
import BTDetails from './components/BTDetails';
import BTTree from './components/BTTree';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

function App() {
    const [currentitemdetails, setCurrentItemDetails] = useState(null)
    const [tabIndex, setTabIndex] = useState(0)

    useEffect(() => {
        if(currentitemdetails){
            setTabIndex(1)
        }

    }, [currentitemdetails])



    return (
        <div className="App">
            <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
                <TabList>
                    <Tab>Find Bom</Tab>
                    <Tab>Item Details</Tab>
                </TabList>
                <TabPanel>
                    <BTTree grow={false} className="mytree" setCurrentItemDetails={setCurrentItemDetails} />
                </TabPanel>
                <TabPanel>
                    {currentitemdetails && <BTDetails deets={currentitemdetails} />}
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default App;
