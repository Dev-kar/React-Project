import React from 'react'

const Footer = () => {
  const today = new Date()
  return (
    <footer className='foot'>
        <h3>Copyright {today.getFullYear()} </h3>
    </footer>
  )
}

export default Footer