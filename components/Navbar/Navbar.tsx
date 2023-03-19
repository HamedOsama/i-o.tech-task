import Link from 'next/link'
import React from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';

interface IProps {
  sidebarHandler: React.Dispatch<React.SetStateAction<boolean>>
  isOpen: boolean
};

const Navbar = ({ sidebarHandler,isOpen }: IProps) => {
  const handleSidebar = () => {
    sidebarHandler(prev => !prev);
  }
  return (
    <nav className='h-16 px-8 flex justify-between items-center bg-main'>
      <Link href="/">
        <Image
          src="/images/logo.png"
          alt="logo"
          width={100}
          height={50}
          className='cursor-pointer'
        />
      </Link>
      <div 
      className='p-2 flex items-center rounded-[50%] active:bg-white active:bg-opacity-20 cursor-pointer' 
      onClick={handleSidebar}
      >
        {isOpen ? 
          <CloseIcon className='text-white text-3xl' />
        :<MenuIcon className='text-white text-3xl' />
        }
      </div>
    </nav>
  )
}

export default Navbar