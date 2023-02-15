import { Label } from '@/components/label'
import { PriorityProgressBar } from '@/components/progress'
import { Form, InputNumber } from 'antd'
import { useForm, useWatch } from 'antd/lib/form/Form'
import { useState } from 'react'

const TestPage = () => {
  const [form] = useForm()
  const labels = useWatch('labels', form)
  const [priority, setPriority] = useState(0)
  return (
    <>
      <div>
        <div className='mb-3'>
          <span>labels : </span>
          <span>{labels?.join(', ')}</span>
        </div>
        <Form form={form}>
          <Form.Item name='labels'>
            <Label className='w-52' />
          </Form.Item>
        </Form>
      </div>
      <div className='w-52'>
        <InputNumber onChange={(value) => setPriority(value || 0)} defaultValue={0} />
        <PriorityProgressBar priority={priority} strokeWidth={4} />
      </div>
    </>
  )
}
export default TestPage
