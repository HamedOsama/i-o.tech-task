import axios from "axios";
import { useRouter } from "next/router";
import env from "../../../API/ApiUrl";
import formatDate from "../../../utils/formatDate";
import Line from "@components/Line/Line";
import Button from "@components/Button/Button";
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import DashboardLayout from "@components/layouts/DashboardLayout";
import  Head  from 'next/head'

const index = ({ client }) => {
  const router = useRouter();
  return (
    <DashboardLayout>
      <Head>
        <title>Client {client.id}</title>
      </Head>
      <Button
        type="button"
        ariaLabel="Back to all clients"
        style="text-gray-600 hover:bg-gray-200 border border-gray-500 py-3 px-3 my-4 mx-8 gap-3"
        onClick={() => router.push("/clients")}
      >
        <KeyboardBackspaceRoundedIcon className="text-xl" />
        Back to all clients
      </Button>

      <Line />
      <div className="mx-auto max-w-6xl w-full my-10 px-4 ">
        <div className="flex flex-row items-center justify-between pb-4 mb-4 border-b border-zinc-300">
          <div>
            <p className="text-2xl sm:text-4xl font-bold text-gray-700">#{client.id}</p>
            <h2 className="text-xl sm:text-2xl font-black my-2 text-red-600">
              {
                client.full_name
              }
            </h2>
            <p className="text-base text-gray-700">
              <span>Joined At: </span>
              {client?.createdAt}
            </p>
            <p className="text-base text-gray-700">
              <span>Image: </span>
              {client?.avatar}
            </p>

          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-gray-50 min-h-[40vh]">
          <div className="w-full bg-white shadow-lg rounded-lg px-6 py-8">
            <p className="text-2xl sm:text-3xl font-bold mb-8">Client Details</p>
            <div className="flex flex-col items-center justify-center bg-gray-50 min-h-[40vh]">
              <div className="w-11/12 sm:w-3/4 lg:w-2/3 bg-white shadow-lg rounded-lg px-6 py-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Full Name:
                  <span className="text-gray-500 text-base">{" "}{client?.full_name}</span>
                </h2>
                <p className="sm:text-lg font-medium mb-2">Mobile Number:
                  <span className="text-gray-500 text-base">{" "}{client?.mobile_number}</span>
                </p>
                <p className="sm:text-lg font-medium mb-2">Address:
                  <span className="text-gray-500 text-base">{" "}{client?.address}</span>
                </p>
                <p className="sm:text-lg font-medium mb-2">Subscription Plan:
                  <span className="text-gray-500 text-base">{" "}{client?.subscription_plan}</span>
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default index;

export const getServerSideProps = async (context: any) => {
  const cookies = context.req.headers.cookie;
  const accessToken = cookies.split(';').find((el: any) => el.trim().startsWith('IOsession='));
  if (!accessToken)
    throw new Error("No access token found")
  const { clientId } = context.query
  if (!clientId) {
    return {
      notFound: true,
    }
  }
  try {
    const req = await axios.get(`${env.API_URL}/clients/${clientId}`, {
      headers: {
        Cookie: context.req.headers.cookie,
        "Accept-Encoding": "gzip,deflate,compress"
      }
    });
    const client = req.data;
    return {
      props: {
        client,
      },
    };
  }
  catch (e) {
    console.log(e);
    return {
      notFound: true,
    }
  }

};