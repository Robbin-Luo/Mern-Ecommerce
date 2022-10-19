import React from 'react'
import {BsFillTelephoneFill} from 'react-icons/bs';
import {HiOutlineMail} from 'react-icons/hi';
import {CgCopyright} from 'react-icons/cg';
import './Footer.css';

const Footer = () => {
  return (
    <footer className='full-width footer'>
      <p>Address: F2/2727-284 FRANKSTON DANDENONG ROAD, DANDENONG SOUTH ,VIC 3175</p>
      <div>
        <div><BsFillTelephoneFill/> MOBILE 0438657369</div><div><HiOutlineMail />sales@abctradeoutlet.com.au</div>
      </div>
      <p className='copyright'><CgCopyright />ABC TRADE OUTLET. ALL Rights Reserved</p>
    </footer>
  )
}

export default Footer