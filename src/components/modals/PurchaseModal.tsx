import { httpClient, PurchaseItemRQ } from '@/apis'
import { PriorityProgressBar } from '@/components/progress'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Button,
  Col,
  DatePicker,
  Form,
  Grid,
  Image,
  Input,
  InputNumber,
  InputRef,
  message,
  Modal,
  Row,
} from 'antd'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'

type Props = {
  itemNo: number
  hideModal: () => void
}
const PurchaseModal = ({ itemNo, hideModal }: Props) => {
  const inputRef = useRef<InputRef | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const queryClient = useQueryClient()
  const [form] = Form.useForm<PurchaseItemRQ>()

  const breakpoint = Grid.useBreakpoint()

  const getItemQuery = useQuery(['items', itemNo], () => httpClient.items.getItem(itemNo))

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  if (!getItemQuery.data?.data) {
    return <></>
  }

  const { photoUrl, name, priority } = getItemQuery.data.data

  const handleOk = () => {
    form.submit()
  }

  const onFinish = async (values: any) => {
    setConfirmLoading(true)

    try {
      // 신규 추가
      await httpClient.items.purchaseItem(itemNo, {
        mall: values.mall.trim(),
        date: values.date.toISOString(),
        price: values.price,
        count: values.count,
      })

      hideModal()
      message.success('저장되었습니다.')
      queryClient.invalidateQueries({ queryKey: ['items'] })
    } catch (e) {
      console.error(e)
    } finally {
      setConfirmLoading(false)
    }
  }

  return (
    <Modal
      open={true}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={hideModal}
      width={breakpoint.md ? 700 : 400}
      footer={null}
      closable={false}
      bodyStyle={{
        padding: '16px 20px',
      }}
      centered
    >
      <div className='flex items-center'>
        <div
          className='w-[300px] text-center'
          style={{
            display: breakpoint.md ? 'block' : 'none',
          }}
        >
          <Image
            className='h-auto max-w-full max-h-[300px]'
            src={photoUrl || ''}
            fallback='data:image/png;base64,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'
            preview={
              photoUrl
                ? {
                    mask: <>크게 보기</>,
                  }
                : false
            }
          />
        </div>
        <div className='flex-1 ml-2'>
          <div className='flex items-center mb-4 ml-6 text-3xl font-bold'>
            <div className='w-5'>
              <PriorityProgressBar priority={priority} />
            </div>
            <h1 className='flex-1 ml-3'>{name}</h1>
          </div>
          <Form
            form={form}
            name='basic'
            className='mt-3'
            labelCol={{ span: 6 }}
            onFinish={onFinish}
            autoComplete='off'
            initialValues={{
              date: dayjs(),
              count: 1,
              unitPrice: 0,
            }}
            colon={false}
            requiredMark='optional'
          >
            <Form.Item
              label='구매처'
              name='mall'
              className='mb-3'
              rules={[
                { required: true, message: '${label}를 입력해 주세요.' },
                { type: 'string', whitespace: true, message: '구매처를 입력해 주세요.' },
                {
                  validator: async (_rule, value) => {
                    value?.trim()
                  },
                },
              ]}
            >
              <Input ref={inputRef} className='w-32' />
            </Form.Item>
            <Form.Item
              label='구매일'
              name='date'
              className='mb-3'
              rules={[{ required: true, message: '${label}을 입력해 주세요.' }]}
            >
              <DatePicker
                className='w-32'
                disabledDate={(current) => {
                  return current && current > dayjs()
                }}
              />
            </Form.Item>
            <Row className='mb-2'>
              <Col span={16}>
                <Form.Item
                  label='금액'
                  name='price'
                  labelCol={{ span: 9 }}
                  className='mb-3'
                  rules={[{ required: true, message: '${label}을 입력해 주세요.' }]}
                >
                  <InputNumber<number>
                    className='w-32'
                    formatter={(value) =>
                      value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                    }
                    parser={(value) => (value ? parseInt(value.replace(/\$\s?|(,*)/g, '')) : 0)}
                    controls={false}
                    // addonAfter={<>원</>}
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label='수량'
                  name='count'
                  labelCol={{ span: 12 }}
                  className='mb-3'
                  rules={[{ required: true, message: '${label}을 입력해 주세요.' }]}
                >
                  <InputNumber<number>
                    className='w-full'
                    formatter={(value) =>
                      value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                    }
                    parser={(value) => (value ? parseInt(value.replace(/\$\s?|(,*)/g, '')) : 0)}
                    min={1}
                    max={999}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Button htmlType='submit' block type='primary'>
              구매하기
            </Button>
          </Form>
        </div>
      </div>
    </Modal>
  )
}

export default PurchaseModal
