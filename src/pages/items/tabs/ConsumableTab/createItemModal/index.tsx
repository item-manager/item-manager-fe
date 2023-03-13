export const Stash = 'hello world'

// import { httpClient } from '@/apis'
// import { useQuery } from '@tanstack/react-query'
// import { Button, Form, Modal, Input, Select, Slider, Row, Col, InputNumber } from 'antd'
// import { useEffect, useState } from 'react'

// const CreateItemModal = ({ hideModal }: any) => {
//   const [form] = Form.useForm()
//   const [inputValue, setInputValue] = useState(0)
//   const { TextArea } = Input

//   const handleOk = () => {
//     form.submit()
//   }

//   const onFinish = () => {
//     alert('testing')
//   }

//   const onChange = (newValue: any) => {
//     setInputValue(newValue)
//   }

//   return (
//     <>
//       <Modal
//         title='물품 생성하기'
//         open={true}
//         onOk={handleOk}
//         onCancel={hideModal}
//         width={400}
//         okText={'생성'}
//         cancelText={'닫기'}
//         closable={false}
//       >
//         <Form
//           form={form}
//           name='basic'
//           className='mt-3'
//           labelCol={{ span: 6 }}
//           wrapperCol={{ span: 18 }}
//           style={{ maxWidth: 300 }}
//           onFinish={onFinish}
//           autoComplete='off'
//         >
//           <Button htmlType='submit' hidden />
//           <Form.Item label='물품명' name='name'>
//             <Input size='middle' placeholder='물품명으로 검색' className='w-62' allowClear />
//           </Form.Item>

//           <Form.Item label='분류' name='type'>
//             <Input size='middle' placeholder='물품명으로 검색' className='w-62' allowClear />
//           </Form.Item>

//           <Form.Item label='보관장소' name='locationNo'>
//             <Select placeholder='물품명으로 검색' className='w-62' allowClear>
//               <Select.Option value='priority+'>1</Select.Option>
//               <Select.Option value='priority-'>2</Select.Option>
//               <Select.Option value='quantity+'>3</Select.Option>
//               <Select.Option value='quantity-'>4</Select.Option>
//               <Select.Option value='latest_purchase_date+'>5</Select.Option>
//               <Select.Option value='latest_purchase_date-'>6</Select.Option>
//               <Select.Option value='latest_consume_date+'>7</Select.Option>
//               <Select.Option value='latest_consume_date-'>8</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item label='상세위치' name='locationMemo'>
//             <TextArea placeholder='물품명으로 검색' rows={4} className='w-62 h-20' allowClear />
//           </Form.Item>

//           <Form.Item label='사진' name='picture'>
//             <Input size='middle' placeholder='물품명으로 검색' className='w-62' allowClear />
//           </Form.Item>

//           <Form.Item label='중요도' name='priority'>
//             <Row>
//               <Col span={12}>
//                 <Slider
//                   min={0}
//                   max={6}
//                   onChange={onChange}
//                   value={typeof inputValue === 'number' ? inputValue : 0}
//                 />
//               </Col>
//               <Col span={4}>
//                 <InputNumber
//                   min={0}
//                   max={6}
//                   style={{ margin: '0 16px' }}
//                   value={inputValue}
//                   onChange={onChange}
//                 />
//               </Col>
//             </Row>
//           </Form.Item>

//           <Form.Item label='라벨' name='labels'>
//             <Input size='middle' placeholder='물품명으로 검색' className='w-62' allowClear />
//             <span className='text-xs text-main'>*스페이스바를 눌러서 라벨을 만들어 보세요!</span>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </>
//   )
// }
// export default CreateItemModal
