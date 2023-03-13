export const Stash = 'hello world'

// import { Form, Input } from 'antd'

// export const FormList = ({ itemDetail, onChangeItemDetail }: any) => {
//   const { name, type, locationMemo, priority, labels } = itemDetail.data

//   return (
//     <>
//       <Form.Item label='물품명' name='name'>
//         <input
//           className='w-56 h-8 pl-2 border-solid border-darkGray border-1 bg-bkg rounded-md'
//           defaultValue={name}
//           onChange={onChangeItemDetail('editItemName')}
//         />
//       </Form.Item>
//       <Form.Item label='분류' name='type'>
//         <input
//           className='w-56 h-8 pl-2 border-solid border-darkGray border-1 bg-bkg rounded-md'
//           defaultValue={type}
//           onChange={onChangeItemDetail('editType')}
//         />
//       </Form.Item>
//       <Form.Item label='사진' name='picture'>
//         <Input placeholder='picture' />
//       </Form.Item>
//       <Form.Item label='상세 위치' name='description'>
//         <input
//           className='w-56 h-8 pl-2 border-solid border-darkGray border-1 bg-bkg rounded-md'
//           defaultValue={locationMemo}
//           onChange={onChangeItemDetail('editLocationMemo')}
//         />
//       </Form.Item>
//       <Form.Item label='중요도' name='priority'>
//         <input
//           className='w-56 h-8 pl-2 border-solid border-darkGray border-1 bg-bkg rounded-md'
//           defaultValue={priority}
//           onChange={onChangeItemDetail('editPriority')}
//         />
//       </Form.Item>
//       <Form.Item label='라벨' name='label'>
//         <input
//           className='w-56 h-8 pl-2 border-solid border-darkGray border-1 bg-bkg rounded-md'
//           defaultValue={labels.map((label: any) => label.name).join(', ')}
//           onChange={onChangeItemDetail('editLabels')}
//         />
//       </Form.Item>
//     </>
//   )
// }
