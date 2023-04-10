import { Select } from 'antd';
const options = [
    {
        value:'all',
        label:'All'
    },
    {
        value:'pending for approval',
        label:'Awaiting appoval'
    },
    {
        value:'pending for delivery',
        label:'Awaiting delivery'
    },
    {
        value:'delivered',
        label:'Fully delivered'
    }
];

const handleChange = (value) => {
};
const App = () => (
  <Select
    // mode="tags"
    style={{
      width: '100%',
    }}
    placeholder="Select status"
    onChange={handleChange}
    options={options}
  />
);
export default App;