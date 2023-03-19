import React, { useEffect } from 'react'

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { toast } from 'react-hot-toast'
import ReactPaginate from 'react-paginate'
import { useRouter } from 'next/router'
import axios from 'axios'
import useInput from '../../hooks/use-input'
import env from '../../API/ApiUrl'
import DeleteModal from '@components/Modals/DeleteModal'
import DashboardLayout from '@components/layouts/DashboardLayout'
import PageTitle from '@components/PageTitle/PageTitle'
import MainButton from '@components/MainButton/MainButton'
import ModalWrapper from '@components/wrappers/ModalWrapper'
import ModalInput from '@components/ModalInput/ModalInput'
import Table from '@components/Table/Table'
import LoadingOverlay from '@components/LoadingOverlay/LoadingOverlay'
import  Head  from 'next/head'


interface IClassProps {
  linkQuery: string
  page: string
  limit: string
}
axios.defaults.withCredentials = false
const index = ({ linkQuery, page, limit }: IClassProps) => {

  const router = useRouter();

  const [isOpen, setIsOpen] = React.useState(false);
  const [classes, setClasses] = React.useState([]);
  const [loading, setLoading] = React.useState(false)
  const [refetch, setRefetch] = React.useState<boolean>(false)
  const [totalLength, setTotalLength] = React.useState<number>(0)
  const [selectedClass, setSelectedClass] = React.useState<any>(null)

  const [updating, setUpdating] = React.useState<boolean>(false)

  const [deleting, setDeleting] = React.useState<boolean>(false)
  const [currentPage, setCurrentPage] = React.useState<number>(page ? parseInt(page) : 1);
  const [limitPerPage, setLimitPerPage] = React.useState<number>(limit ? parseInt(limit) : 10);
  const [query, setQuery] = React.useState<string>(linkQuery || '');

  useEffect(() => {
    const getClients = async () => {
      try {
        setLoading(true)
        const req = axios.get(`${env.API_URL}/classes${query ? `?${query}` : ''}`, {
          headers: {
            "Access-Control-Allow-Origin": "*"
          }
        });
        const totalLengthReq = axios.get(`${env.API_URL}/classes`, {
          headers: {
            "Access-Control-Allow-Origin": "*"
          }
        });
        const [data, totalLength] = await Promise.all([req, totalLengthReq])
        setClasses(data?.data)
        setTotalLength(totalLength?.data?.length)
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Something went wrong')
      }
      setLoading(false);
    }
    getClients();
  }, [refetch, query])


  useEffect(() => {
    let query = ''
    if (currentPage > 0)
      query += `?page=${currentPage}`
    if (limitPerPage > 0)
      query += `&limit=${limitPerPage}`
    const formattedQuery = new URLSearchParams(query).toString().replaceAll('+', '%20');
    setQuery(formattedQuery)

    if (formattedQuery)
      router.push(`/classes?${formattedQuery}`)
    else
      router.push(`/classes`)
  }, [currentPage, limitPerPage])

  const handlePageClick = (e: any) => {
    setCurrentPage(e.selected + 1)
  };



  const {
    value: enteredClassName,
    isValid: enteredClassNameIsValid,
    hasError: classNameHasError,
    onChangeHandler: onChangeClassNameHandler,
    setValueHandler: setClassNameValueHandler,
    onBlurHandler: onBlurClassNameHandler,
    resetInputHandler: resetClassNameInput
  } = useInput((value) => value.trim().length > 0);
  const {
    value: enteredCoachName,
    isValid: enteredCoachNameIsValid,
    hasError: coachNameHasError,
    onChangeHandler: onChangeCoachNameHandler,
    setValueHandler: setCoachNameValueHandler,
    onBlurHandler: onBlurCoachNameHandler,
    resetInputHandler: resetCoachNameInput
  } = useInput((value) => value.trim().length > 0);

  const {
    value: enteredTiming,
    isValid: enteredTimingIsValid,
    hasError: timingHasError,
    onChangeHandler: onChangeTimingHandler,
    setValueHandler: setTimingValueHandler,
    onBlurHandler: onBlurTimingHandler,
    resetInputHandler: resetTimingInput
  } = useInput((value) => value.trim().length > 0);
  const {
    value: enteredPrice,
    isValid: enteredPriceIsValid,
    hasError: priceHasError,
    onChangeHandler: onChangePriceHandler,
    setValueHandler: setPriceValueHandler,
    onBlurHandler: onBlurPriceHandler,
    resetInputHandler: resetPriceInput
  } = useInput((value) => value.trim().length > 0);

  const {
    value: enteredClassDescription,
    isValid: enteredClassDescriptionIsValid,
    hasError: classDescriptionHasError,
    onChangeHandler: onChangeClassDescriptionHandler,
    setValueHandler: setClassDescriptionValueHandler,
    onBlurHandler: onBlurClassDescriptionHandler,
    resetInputHandler: resetClassDescriptionInput
  } = useInput((value) => value.trim().length > 0);

  const {
    value: enteredCoachBrief,
    isValid: enteredCoachBriefIsValid,
    hasError: coachBriefHasError,
    onChangeHandler: onChangeCoachBriefHandler,
    setValueHandler: setCoachBriefValueHandler,
    onBlurHandler: onBlurCoachBriefHandler,
    resetInputHandler: resetCoachBriefInput
  } = useInput((value) => value.trim().length > 0);



  let formIsValid = false;
  if (
    enteredClassNameIsValid &&
    enteredCoachNameIsValid &&
    enteredTimingIsValid &&
    enteredPriceIsValid &&
    enteredClassDescriptionIsValid &&
    enteredCoachBriefIsValid
  )
    formIsValid = true;
  const resetFormHandler = () => {
    resetClassNameInput();
    resetCoachNameInput();
    resetTimingInput();
    resetPriceInput();
    resetClassDescriptionInput();
    resetCoachBriefInput();
  }
  const touchFormHandler = () => {
    onBlurClassNameHandler();
    onBlurCoachNameHandler();
    onBlurTimingHandler();
    onBlurPriceHandler();
    onBlurClassDescriptionHandler();
    onBlurCoachBriefHandler();
  }
  useEffect(() => {
    if (!isOpen && !updating)
      resetFormHandler();

  }, [isOpen, updating])

  const onChangeClassNameValidationHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(/^[0-9]*$/)) {
      onChangePriceHandler(e as any);
    } else {
      return;
    }
  }

  const viewButtonHandler = (id: string) => {
    router.push(`/classes/${id}`)
  }
  const updateButtonHandler = (id: string) => {
    setUpdating(true)
    setSelectedClass(id);
    const selectedClass = classes.find((el: any) => el.id === id)
    setClassNameValueHandler(selectedClass?.title || '')
    setClassDescriptionValueHandler(selectedClass?.description || '')
    setCoachNameValueHandler(selectedClass?.coach_name || '')
    setCoachBriefValueHandler(selectedClass?.coach_brief || '')
    setPriceValueHandler(`${selectedClass?.price}` || '')
    setTimingValueHandler(selectedClass?.timing || '')
  }

  const deleteButtonHandler = (id: string) => {
    setDeleting(true)
    setSelectedClass(id)
  }


  const addClassHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //touch form to show errors
    touchFormHandler();

    if (!formIsValid)
      return;

    //send data to server

    const notification = toast.loading('Adding Class...');
    try {
      setLoading(true);
      const req = axios.post(`${env.API_URL}/classes`, {
        title: enteredClassName,
        description: enteredClassDescription,
        coach_name: enteredCoachName,
        coach_brief: enteredCoachBrief,
        price: enteredPrice,
        timing: enteredTiming
      })
      const res = await req;
      toast.dismiss(notification);
      toast.success('Class Added Successfully');
      setIsOpen(false);
      setRefetch(prev => !prev);
      resetFormHandler();
    }
    catch (e) {
      toast.dismiss(notification);
      toast.error(e?.response?.data?.message || 'something went wrong');
    }
    setLoading(false);

  }

  const updateClassHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //touch form to show errors
    touchFormHandler();

    if (!formIsValid)
      return;

    //send data to server

    const notification = toast.loading('Updating Class...');
    try {
      setLoading(true);
      const req = axios.put(`${env.API_URL}/classes/${selectedClass}`, {
        title: enteredClassName,
        description: enteredClassDescription,
        coach_name: enteredCoachName,
        coach_brief: enteredCoachBrief,
        price: enteredPrice,
        timing: enteredTiming

      })
      const res = await req;
      toast.dismiss(notification);
      toast.success('Class Updated Successfully');
      setUpdating(false);
      setRefetch(prev => !prev);
      resetFormHandler();
    }
    catch (e) {
      toast.dismiss(notification);
      toast.error(e?.response?.data?.message || 'something went wrong');
    }
    setLoading(false);
  }

  const deleteClassHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const notification = toast.loading('Deleting Class...');
    setLoading(true);
    try {
      setDeleting(false);
      const req = axios.delete(`${env.API_URL}/classes/${selectedClass}`)
      await req;
      toast.dismiss(notification);
      toast.success('Class Deleted Successfully');
      setRefetch(prev => !prev);
    }
    catch (e) {
      toast.dismiss(notification);
      toast.error(e?.response?.data?.message || 'something went wrong');
    }
    setLoading(false);
  }
  return (
    <DashboardLayout>
      <Head>
        <title>Classes</title>
      </Head>
      {
        (loading && !isOpen && !updating) ?
          <LoadingOverlay isFullPage={false} />
          : (
            <>
              <div className="max-sm:px-4 flex flex-col gap-6  sm:flex-row sm:justify-between sm:items-center">
                <PageTitle title='Classes' total={totalLength} />
                <div className='flex flex-col sm:flex-row items-center gap-4'>
                  <FormControl className='w-48'>
                    <InputLabel id="pageLimit" className='-mt-1'>Displayed Per Page</InputLabel>
                    <Select
                      labelId="pageLimit"
                      id="limit"
                      value={limitPerPage}
                      label="Status"
                      onChange={(e) => setLimitPerPage(e.target.value as number)}
                    >
                      <MenuItem className='h-10' value={5} >5</MenuItem>
                      <MenuItem className='h-10' value={10} >10</MenuItem>
                      <MenuItem className='h-10' value={20} >20</MenuItem>
                      <MenuItem className='h-10' value={50} >50</MenuItem>
                      <MenuItem className='h-10' value={100} >100</MenuItem>
                    </Select>
                  </FormControl>
                  <MainButton bg='bg-black max-sm:w-fit'
                    rest={{
                      onClick: () => setIsOpen(true),
                      type: 'button'
                    }}
                  >
                    <span className='text-base'>Add Class</span>
                    <span className='ml-2 text-2xl'>+</span>
                  </MainButton>
                </div>
              </div>

              {
                (isOpen || updating) && (
                  <ModalWrapper title='Add Class'
                    closeHandler={
                      () => {
                        setIsOpen(false)
                        setUpdating(false)
                      }
                    }
                  >
                    <div className="px-2">
                      <div className='pt-2'>
                        <h2 className='text-2xl text-stone-600'>Class Data</h2>
                        <div className="grid md:grid-cols-2 gap-4 my-4">

                          <ModalInput
                            label='Class Name'
                            name='className'
                            variant='filled'
                            required={true}
                            value={enteredClassName}
                            onChange={onChangeClassNameHandler}
                            onBlur={onBlurClassNameHandler}
                            error={classNameHasError}
                            helperText={classNameHasError ? 'This field is required' : ''}
                          />
                          <ModalInput
                            label='Class Description'
                            name='classDescription'
                            variant='filled'
                            required={true}
                            value={enteredClassDescription}
                            onChange={onChangeClassDescriptionHandler}
                            onBlur={onBlurClassDescriptionHandler}
                            error={classDescriptionHasError}
                            helperText={classDescriptionHasError ? 'This field is required' : ''}
                          />
                          <ModalInput
                            label='Coach Name'
                            name='coachName'
                            variant='filled'
                            required={true}
                            value={enteredCoachName}
                            onChange={onChangeCoachNameHandler}
                            onBlur={onBlurCoachNameHandler}
                            error={coachNameHasError}
                            helperText={coachNameHasError ? 'This field is required' : ''}
                          />
                          <ModalInput label='Coach Brief'
                            name='coachBrief'
                            variant='filled'
                            required={true}
                            value={enteredCoachBrief}
                            onChange={onChangeCoachBriefHandler}
                            onBlur={onBlurCoachBriefHandler}
                            error={coachBriefHasError}
                            helperText={coachBriefHasError ? 'This field is required' : ''}
                          />

                          <ModalInput label='Timing'
                            name='Timing'
                            variant='filled'
                            required={true}
                            value={enteredTiming}
                            onChange={onChangeTimingHandler}
                            onBlur={onBlurTimingHandler}
                            error={timingHasError}
                            helperText={timingHasError ? 'This field is required' : ''}
                          />
                          <ModalInput label='Price'
                            name='price'
                            variant='filled'
                            required={true}
                            value={enteredPrice}
                            onChange={onChangeClassNameValidationHandler}
                            onBlur={onBlurPriceHandler}
                            error={priceHasError}
                            helperText={priceHasError ? 'This field is required' : ''}
                          />
                        </div>
                      </div>
                      <div className='flex justify-end items-center'>

                        <MainButton bg='bg-green-600 duration-300 hover:bg-green-500 hover:bg-opacity-80 hover:shadow-lg'
                          rest={{
                            onClick: (e: any) => isOpen ? addClassHandler(e as any) : updateClassHandler(e as any),
                            type: 'button',
                            disabled: loading
                          }}
                        >
                          <span className='text-base'>{isOpen ? 'Add' : 'Update'}</span>
                        </MainButton>
                      </div>
                    </div>

                  </ModalWrapper>
                )
              }

              <Table
                heads={[
                  { title: 'ID', key: 'id' },
                  { title: 'Class Name', key: 'title' },
                  { title: 'Class Description', key: 'description' },
                  { title: 'Coach Name', key: 'coach_name' },
                  { title: 'Coach Brief', key: 'coach_brief' },
                  { title: 'Timing', key: 'timing' },
                  { title: 'Price', key: 'price' },

                  { title: 'Actions', key: 'actions' },
                ]}
                items={classes}
                onClickUpdate={updateButtonHandler}
                onClickDelete={deleteButtonHandler}
                onClickView={viewButtonHandler}
                type="class"
              />

              {
                deleting && (
                  <DeleteModal
                    title='Delete Class'
                    closeHandler={() => setDeleting(false)}
                    deleteHandler={deleteClassHandler}
                  />
                )
              }

              <div className="">

                <ReactPaginate
                  breakLabel="..."
                  nextLabel={
                    <span className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
                      <span>
                        Next
                      </span>

                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                      </svg>
                    </span>
                  }
                  previousLabel={
                    <span className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                      </svg>

                      <span>
                        previous
                      </span>
                    </span>
                  }
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={2}
                  pageCount={Math.ceil(totalLength / limitPerPage)}
                  renderOnZeroPageCount={undefined}
                  initialPage={currentPage - 1}
                  containerClassName='flex items-center justify-center mt-6 w-full gap-1'

                  pageLinkClassName='px-2 py-1 text-sm text-gray-500 rounded-md hover:bg-gray-100 duration-150'

                  activeLinkClassName='px-2 py-1 text-sm text-blue-500 rounded-md hover:bg-blue-100/60 bg-blue-100/60'
                  nextClassName='flex flex-1 justify-end'
                  previousClassName='flex flex-1'

                // previousLinkClassName='text-white hover:text-gray-200 bg-red-500 h-8 w-8 rounded-md flex justify-center items-center duration-300 hover:bg-red-400 cursor-pointer'

                // nextLinkClassName='text-white hover:text-gray-200 bg-red-500 h-8 w-8 rounded-md flex justify-center items-center duration-300 hover:bg-red-400 cursor-pointer'
                />
              </div>
            </>

          )
      }
    </DashboardLayout>
  )
}

export default index



export async function getServerSideProps(context: any) {
  try {
    const cookies = context.req.headers.cookie;
    const accessToken = cookies.split(';').find((el: any) => el.trim().startsWith('IOsession='));
    if (!accessToken)
      throw new Error("No access token found")
    const { query } = context
    const formattedQuery = new URLSearchParams(query).toString().replaceAll('+', '%20')
    if (formattedQuery)
      return {
        props: {
          linkQuery: formattedQuery,
          page: query?.page || null,
          limit: query?.limit || null,
        },
      }
    return {
      props: {},
    }
  } catch (e) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
      props: {},
    };
  }
}