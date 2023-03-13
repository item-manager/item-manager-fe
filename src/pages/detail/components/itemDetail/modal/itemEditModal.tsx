export const Stash = 'hello world'

// import { Button, Form, Modal } from 'antd'
// import { ChangeEvent, useState } from 'react'
// import { FormList } from './itemEditFormList'
// import { useParams } from 'react-router-dom'
// import { useMutation } from '@tanstack/react-query'
// import { httpClient } from '@/apis'
// import axios from 'axios'

// interface ItemEditProps {
//   hideModal: () => void
//   // itemDetail: {
//   //   name?: string
//   //   type?: 'CONSUMABLE' | 'EQUIPMENT'
//   //   locationNo?: number
//   //   locationMemo?: string
//   //   photo?: File
//   //   priority?: number
//   // }
//   itemDetail?: any
// }

// const ItemEditModal = ({ hideModal, itemDetail }: ItemEditProps) => {
//   const [form] = Form.useForm()

//   const { itemNo } = useParams()

//   // const mutation = useMutation({
//   //   // mutationKey: 'itemEdit',
//   //   mutationFn: httpClient.items.patchItem(itemNo),
//   // })

//   const [newDetail, setNewDetail] = useState({
//     editItemName: '',
//     editType: 'CONSUMABLE',
//     editLocationNo: 9,
//     editLocationMemo: '',
//     editPhoto: [],
//     editPriority: 0,
//     editLabels: [],
//   })

//   const onChangeItemDetail = (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
//     setNewDetail({
//       ...newDetail,
//       [name]: event.target.value,
//     })
//     console.log('newDetail:', event.target.value)
//   }

//   const handleOk = () => {
//     form.submit()
//   }

//   const onFinish = async () => {
//     alert('edit')
//     const { editItemName, editType, editLocationMemo, editPriority, editLabels } = newDetail
//     const { name, type, locationNo, locationMemo, priority, labels } = itemDetail.data
//     console.log('itemDetail:', itemDetail?.data)
//     console.log('itemNo:', itemNo)

//     // await httpClient.items.patchItem(Number(itemNo), {
//     //   name: name || editItemName,
//     //   type: type || editType,
//     //   locationNo: Number(itemNo),
//     //   locationMemo: locationMemo || editLocationMemo,
//     //   priority: priority || editPriority,
//     //   labels: labels || editLabels,
//     // })

//     // await httpClient.items.patchItem(Number(itemNo), {
//     //   name: '테스트1',
//     //   type: 'CONSUMABLE',
//     //   locationNo: 9,
//     //   locationMemo: '테스트1',
//     //   photo: '',
//     //   priority: 1,
//     //   labels: '내꺼',
//     // })

//     // await httpClient.items.patchItem(Number(itemNo), { ...newDetail })

//     // fetch(`http://ycrpark.iptime.org:8080/items/${itemNo}`, {
//     //   method: 'PATCH',
//     //   body: new URLSearchParams({
//     //     name: '테스트1',
//     //     type: 'CONSUMABLE',
//     //     locationNo: '9',
//     //   }),
//     // })
//     //   .then((response) => response.json())
//     //   .then((data) => console.log('data:', data))

//     const formData = new FormData()
//     formData.append('name', name)
//     formData.append('type', type)
//     formData.append('locationNo', locationNo)
//     formData.append('_method', 'PATCH')

//     // axios
//     //   .post(`http://ycrpark.iptime.org:8080/items/${itemNo}`, formData, {
//     //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     //   })
//     //   .then((res) => console.log('res:', res))

//     const userData: any = {}
//     formData.forEach((value: any, key: any) => {
//       userData[key] = value
//     })
//     axios.patch

//     hideModal()

//     // await httpClient.items.patchItem(Number(itemNo), { ...newDetail })
//   }

//   return (
//     <>
//       <Modal
//         title='정보 수정하기'
//         open={true}
//         onOk={handleOk}
//         onCancel={hideModal}
//         width={400}
//         okText={'수정'}
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
//           <FormList itemDetail={itemDetail} onChangeItemDetail={onChangeItemDetail} />
//           <Button htmlType='submit' hidden />
//         </Form>
//       </Modal>
//     </>
//   )
// }
// export default ItemEditModal
