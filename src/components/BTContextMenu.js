import React, { useRef, useEffect } from 'react'

import '../css/btcontextmenu.css'

function BTContextMenu({mousex, mousey, event, hidecontextmenu}) {
    const menuref = useRef(null)

    useEffect(()=> menuref.current.focus() ,[])

    return (
        <div ref={menuref} tabindex="0" id="contextmenucontainer" onBlur={hidecontextmenu} onMouseLeave={()  => {console.log(menuref.current.focus); menuref.current.focus(); menuref.current.blur()}} style={{top: mousey, left: mousex}}>
            <div>hello</div>
        </div>
    )
}

export default BTContextMenu
