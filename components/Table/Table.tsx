import Image from 'next/image'
import React from 'react'
import TableHead from './TableHead'
import TableItem from './TableItem'
import formatDate from '../../utils/formatDate'
import ImagesSlider from '@components/ImagesSlider/ImagesSlider'
import ShowDataModal from '@components/Modals/ShowDataModal'
import ShowOrderedData from '@components/Modals/ShowOrderedData'
import EliteStatusBox from '@components/StatusBox/EliteStatusBox'

interface ITableProps {
  heads: {
    title: string
    key: string
  }[]
  items: any[]
  type?: string
  onClickUpdate?: (id: string) => void
  onClickDelete?: (id: string) => void
  onClickView?: (id: string) => void
}

interface IActionButtons {
  viewHandler?: () => void
  updateHandler?: () => void
  deleteHandler?: () => void
}



const Table = ({ heads, items, onClickUpdate, onClickDelete, onClickView, type }: ITableProps) => {
  const returnedTableItem = React.useCallback(
    (key: string, value: any, type?: string) => {
      let data: any = value || 'N/A';
      switch (key) {
        case 'createdAt':
          data = formatDate(value)
          break;
        case 'coach_brief':
          data = <TableItem category='description' >
            {value}
          </TableItem>
          break;
        default:
          break;
      }
      return data;
    },
    [items]
  )


  const Buttons = ({ updateHandler, deleteHandler, viewHandler }: IActionButtons) => {
    return (
      <td className="px-4 py-4 text-sm whitespace-nowrap">
        <div className="flex items-center gap-x-6">
          <button onClick={viewHandler} aria-label='view' type='button' className="px-4 animate-pulse text-gray-500  transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-200 rounded-md p-2">
            View
          </button>
          <button onClick={updateHandler} aria-label='edit' type='button' className="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>
          <button
            onClick={deleteHandler}
            aria-label='delete' type='button' className="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>

        </div>
      </td>
    )
  }

  return (
    <section className="container px-4 mx-auto">
      <div className="flex flex-col mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {
                      heads.slice(0, heads.length - 1).map((head) => (
                        <TableHead key={head.key} title={head.title} />
                      ))
                    }
                    
                    <th scope="col" className="relative py-3.5 px-4">
                      <span className="sr-only">Edit</span>
                    </th>


                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  {
                    items.map((item,i) => (
                      <tr key={item.id || Date.now() + i}>
                        {
                          heads.map((head, i) => (
                            i !== heads.length - 1 ? <TableItem key={i + Date.now()} category={head.key}>
                              {returnedTableItem(head.key, item[head.key], type)}
                            </TableItem> :
                              <Buttons
                                updateHandler={() => onClickUpdate(item.id)}
                                deleteHandler={() => onClickDelete(item.id)}
                                viewHandler={() => onClickView(item.id)}
                                key={i + Date.now()}
                              />
                          ))
                        }
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>


    </section>
  )
}

export default Table