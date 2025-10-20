import React from 'react'

const AppLoader = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  )
}

export default AppLoader;