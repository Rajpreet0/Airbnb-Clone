"use client";
import { Toaster } from 'react-hot-toast'


// It needs a wrapper because it expects a parent Client Component
const ToasterProvider = () => {
  return (
    <Toaster/>
  )
}

export default ToasterProvider