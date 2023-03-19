import axios from "axios";
import { useRouter } from "next/router";
import env from "../../../API/ApiUrl";
import formatDate from "../../../utils/formatDate";
import Line from "@components/Line/Line";
import Button from "@components/Button/Button";
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import DashboardLayout from "@components/layouts/DashboardLayout";
import  Head  from 'next/head'

const index = ({ selectedClass }) => {
  const router = useRouter();
  return (
    <DashboardLayout>
      <Head>
        <title>Class {selectedClass.id}</title>
      </Head>
      <Button
        type="button"
        ariaLabel="Back to all classes"
        style="text-gray-600 hover:bg-gray-200 border border-gray-500 py-3 px-3 my-4 mx-8 gap-3"
        onClick={() => router.push("/classes")}
      >
        <KeyboardBackspaceRoundedIcon className="text-xl" />
        Back to all classes
      </Button>

      <Line />
      <div className="mx-auto max-w-6xl w-full my-10 px-4 ">
        <div className="flex flex-row items-center justify-between pb-4 mb-4 border-b border-zinc-300">
          <div>
            <p className="text-2xl sm:text-4xl font-bold text-gray-700">#{selectedClass.id}</p>
            <h2 className="text-xl sm:text-2xl font-black my-2 text-red-600">
              {
                selectedClass.title
              }
            </h2>

          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-gray-50 min-h-[45vh]">
          <div className="w-full bg-white shadow-lg rounded-lg px-6 py-8">
            <p className="text-2xl sm:text-3xl font-bold mb-8">Class Details</p>
            <div className="flex flex-col items-center justify-center bg-gray-50 min-h-[45vh]">
              <div className="w-11/12 sm:w-3/4 lg:w-2/3 bg-white shadow-lg rounded-lg px-6 py-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Title:
                  <span className="text-gray-500 text-base">{" "}{selectedClass?.title}</span>
                </h2>
                <p className="sm:text-lg font-medium mb-2">Description:
                  <span className="text-gray-500 text-base">{" "}{selectedClass?.description}</span>
                </p>
                <p className="sm:text-lg font-medium mb-2">Coach Name:
                  <span className="text-gray-500 text-base">{" "}{selectedClass?.coach_name}</span>
                </p>
                <p className="sm:text-lg font-medium mb-2">Coach Brief:
                  <span className="text-gray-500 text-base">{" "}{selectedClass?.coach_brief}</span>
                </p>
                <p className="sm:text-lg font-medium mb-2">Timing:
                  <span className="text-gray-500 text-base">{" "}{selectedClass?.timing}</span>
                </p>
                <p className="sm:text-lg font-medium mb-2">price:
                  <span className="text-gray-500 text-base">{" "}{selectedClass?.price}</span>
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
  const { classId } = context.query
  if (!classId) {
    return {
      notFound: true,
    }
  }
  try {
    const req = await axios.get(`${env.API_URL}/classes/${classId}`, {
      headers: {
        Cookie: context.req.headers.cookie,
        "Accept-Encoding": "gzip,deflate,compress"
      }
    });
    const selectedClass = req.data;
    return {
      props: {
        selectedClass
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