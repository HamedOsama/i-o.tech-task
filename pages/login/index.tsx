import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-hot-toast';


import LoginLayout from '../../components/layouts/LoginLayout';
import FormWrapper from '../../components/wrappers/FormWrapper';
import Input from '../../components/Input/Input';
import useInput from '../../hooks/use-input';
import LoadingOverlay from '@components/LoadingOverlay/LoadingOverlay';

axios.defaults.withCredentials = true;
const index = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailHasError,
    onChangeHandler: onChangeEmailHandler,
    onBlurHandler: onBlurEmailHandler,
    resetInputHandler: resetEmailInput
  } = useInput((value) => !!value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/));
  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordHasError,
    onChangeHandler: onChangePasswordHandler,
    onBlurHandler: onBlurPasswordHandler,
    resetInputHandler: resetPasswordInput
  } = useInput((value) => value.trim().length >= 8);

  let formIsValid = false;
  if (enteredEmailIsValid && enteredPasswordIsValid)
    formIsValid = true;
  const login = async () => {
    try {
      setLoading(true);
      const email = enteredEmail;
      const password = enteredPassword;
      const req = await axios.post(`/api/login`, {
        Headers: {
          "Accept": "*/*",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
        email,
        password
      })

      toast.success('Logged in successfully');

      router.push('/')
    } catch (e) {
      toast.error('Email or password is incorrect');
      throw new Error('Email or password is incorrect')
    }
  }


  const SubmitLoginHandler = async (e: any) => {
    try {
      // prevent browser default
      e.preventDefault();
      //touch all inputs
      onBlurEmailHandler();
      onBlurPasswordHandler();
      if (!formIsValid)
        return;
      await login();
      resetEmailInput();
      resetPasswordInput();
    } catch (e) {
      console.log(e)
    }
    setLoading(false);
  }
  return (
    <LoginLayout >
      {loading && <LoadingOverlay isFullPage={true} />}
      <FormWrapper login={true}>
        <form className='mt-8' onSubmit={SubmitLoginHandler}>
          <Input
            label='Email Address'
            type='text'
            name='email'
            placeholder='e.x. example@gmail.com'
            onChange={onChangeEmailHandler}
            onBlur={onBlurEmailHandler}
            value={enteredEmail}
            error={emailHasError ? 'Entered Email is not valid' : null}
          />


          <Input
            label='Password'
            type='password'
            name='password'
            placeholder='Your Password'
            onChange={onChangePasswordHandler}
            onBlur={onBlurPasswordHandler}
            value={enteredPassword}
            error={passwordHasError ? 'Password must be at least 8 characters' : null}
          />
          <div className="flex flex-col justify-end">
            <p>
              email : <span className='focus:text-blue-500 hover:text-blue-500 hover:underline'>test@iotech.com</span>
            </p>
            <p className="text-sm text-gray-400 ">
              password : iotech1234
            </p>
          </div>


          <div className="mt-6">
            <button
              disabled={!formIsValid || loading}
              type='submit'
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50 disabled:bg-blue-400">
              Sign in
            </button>
          </div>

        </form>
      </FormWrapper>
    </LoginLayout>

  )
}

export default index


export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = context.req.headers.cookie;
    const accessToken = cookies.split(';').find((el: any) => el.trim().startsWith('IOsession='));
    if (accessToken)
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
        props: {},
      };
    return {
      props: {}, // will be passed to the page component as props
    }
  } catch (e) {
    return {
      props: {}, // will be passed to the page component as props
    }

  }
}