import { Label } from '@/components/label'
import { Form } from 'antd'
import { useForm, useWatch } from 'antd/lib/form/Form'

const TestPage = () => {
  const [form] = useForm()
  const labels = useWatch('labels', form)
  return (
    <>
      <div className='mb-3'>
        <span>labels : </span>
        <span>{labels?.join(', ')}</span>
      </div>
      <Form form={form}>
        <Form.Item name='labels'>
          <Label className='w-52' />
        </Form.Item>
      </Form>
    </>
  )
}
export default TestPage
