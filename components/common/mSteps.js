import React from 'react';
import { Divider, Steps } from 'antd';
const MSteps = () => (
  <>
    <Steps
      progressDot
      current={1}
      size='small'
      direction="vertical"
      items={[
        {
          title: 'Finished',
          description: 'Sent an email!',
        },
        {
          title: 'Finished',
          description: 'Held a meeting at their premises',
        },
        {
          title: 'In Progress',
          description: 'Reviewing the proposals',
        },
        {
          title: 'Waiting',
          description: 'This is a description.',
        },
        {
          title: 'Waiting',
          description: 'This is a description.',
        },
      ]}
    />
  </>
);

export default MSteps;