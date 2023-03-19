import React from 'react'
import { GetServerSideProps } from 'next';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';
import axios from 'axios';

import DashboardLayout from '@components/layouts/DashboardLayout';
import InfoCard from '@components/InfoCard/InfoCard';
import env from '../API/ApiUrl';
import Head from 'next/head';


const index = ({ stats }) => {
  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>
      <DashboardLayout >
        <div className="container max-md:p-2 mx-auto grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-4 ">
          <InfoCard title='Clients' link='/clients' value={stats?.clients || '0'} Icon={<PeopleRoundedIcon className="text-green-400" />} bg='bg-green-300' />
          <InfoCard title='Classes' link='/classes' value={stats?.classes || '0'} Icon={<FitnessCenterRoundedIcon className="text-blue-400" />} bg='bg-blue-300' />
        </div>
      </DashboardLayout>
    </div>
  )
}

export default index


export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = context.req.headers.cookie;
    const accessToken = cookies.split(';').find((el: any) => el.trim().startsWith('IOsession='));
    if (!accessToken)
      throw new Error("No access token found")
    const clientsReq = axios.get(`${env.API_URL}/clients`, {
      headers: {
        "Accept-Encoding": "gzip,deflate,compress"
      }
    })
    const classesReq = axios.get(`${env.API_URL}/classes`, {
      headers: {
        "Accept-Encoding": "gzip,deflate,compress"
      }
    })
    const [clients, classes] = await Promise.all([clientsReq, classesReq])
    const stats = {
      clients: clients.data.length,
      classes: classes.data.length
    }
    return {
      props: {
        stats: stats
      }, // will be passed to the page component as props
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