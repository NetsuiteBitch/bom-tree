import React, { useRef, useEffect } from 'react'

import '../css/btcontextmenu.css'

function BTContextMenu({mousex, mousey, event, hidecontextmenu, data, setCurrentItemDetails}) {
    const menuref = useRef(null)
    console.log({data})
    useEffect(()=> menuref.current.focus() ,[])



    return (
        <div onBlur={hidecontextmenu} ref={menuref} tabindex="0" id="contextmenucontainer"  onMouseLeave={()  => {console.log(menuref.current.focus); menuref.current.focus(); menuref.current.blur()}} style={{top: mousey, left: mousex}}>
            <div onClick={(e) => {setCurrentItemDetails(data); hidecontextmenu()}} className="contextmenuitem">View Details</div>
        </div>
    )
}

export default BTContextMenu
