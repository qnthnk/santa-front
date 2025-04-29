import React from 'react'

const Blog = () => {
  return (
    <div className='containerRMC'>
      <div className='containerH'>
        <p className='heading'>Personalizado</p>
        <div className='containerMap' style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
          <h3 className='' style={{ textAlign: "center" }}>
            Reportes
          </h3>
          <h4>Se puede descargar la información en formato excel o pdf.
            <br />
            <strong>Versión Demo.<br />No se encuentra habilitada la descarga.</strong>
          </h4>
           
        </div>
      </div>
    </div>
  )
}

export default Blog
