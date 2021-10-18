
import Tree from '@naisutech/react-tree'
import {testass, testitems} from '../testdata'
import React, { useEffect, useState } from 'react'
import BTContextMenu from './BTContextMenu'

import '../css/bttree.css'
import { getnodes } from '../utils/netsuite'

function BTTree() {

    const [nodes, setNodes] = useState([])
    getnodes().then(x => setNodes(x))
    const data = nodes.map(x => {var o = x; o.items = testitems.filter((item) => item.parentId === x.id); return o})
    const [mousex, setmousex] = useState(0)
    const [mousey, setmousey] = useState(0)
    const [showingContextMenu, setshowingContextMenu] = useState(false)
    const [contextMenuEvent, setcontexMenuEvent] = useState(null)


    const [showingdata, setshowingdata] = useState(data)
    const [searchterm, setsearchterm] = useState('')



    useEffect(() => (searchterm && setshowingdata(data.filter(x => JSON.stringify(x).toLowerCase().includes(searchterm.toLowerCase())))),[searchterm])



    const gotogoogle = () => window.location.href = 'https://www.google.com'


    const leaf = ({data, selected, level}) => {

        return <div className={"leafdeets leaflevel"+level} onDoubleClick={gotogoogle} style={{color: 'dodgerblue', textDecoration:"none"}}>
            <span className="leafspan"><i style={{color: 'dodgerblue'}} className="fa fa-circle-o"></i></span>
            <span>&nbsp;</span>
            <span className="itemid leafspan">{data.label}</span>
            {/* <span className="pipe spanleaf">&nbsp;|&nbsp;</span> */}
            <span className="itemname leafspan">{data.displayname}</span>
            {/* <span className="pipe spanleaf">&nbsp;|&nbsp;</span> */}
            <span className="itemquantity leafspan">{data.qty_adjusted}</span>
            <span className="itemunit leafspan">{data.units}</span>
            </div>

    }

    const generatecontextmenu = e =>{
        e.preventDefault()
        setmousex(e.pageX)
        setmousey(e.pageY)
        setshowingContextMenu(true)
        setcontexMenuEvent(e)
    }

    const node = ({data, isOpen,isRoot, selected, level}) => {

        return <div className={'node nodelevel'+ level} onContextMenu={generatecontextmenu}>
            <span className="nodeitem nodeicon"><i className={isOpen? "fa fa-angle-right selectedicon": 'fa fa-angle-right unselectedicon'} style={{color: 'dodgerblue', fontSize: '15pt', width: '20px', textAlign: 'center'}}></i></span>
            <span className="nodeitem nodeitemname">{data.label}</span>
            <span className="nodeitem nodeitemdescription">{data.description}</span>
            <span className="nodeitem nodeitemquantity">{data.qty_on_bom}</span>
            {data.qty_on_bom ? <span className="nodeitem nodeitemquantity">EA</span> : ''}
            </div>
    }






    return (

        <div className="treecontainer">

            {showingContextMenu && <BTContextMenu mousex={mousex}  mousey={mousey} event={contextMenuEvent} hidecontextmenu={() => setshowingContextMenu(false)}/>}

            <div>
                <input className="searchbar" placeholder="Please enter at least 3 characters to search" onChange={(e) => setsearchterm(e.target.value)} type="text" />
            </div>

            {showingdata && searchterm?.length > 3 && showingdata?.length > 0 && <Tree
                theme='light'

                size='full'
                LeafRenderer={leaf}
                nodes={data}  
                NodeRenderer={(node)}
                animations={true}
             >
            </Tree>}
            {searchterm.length > 3 && showingdata?.length == 0 ? <div>No Results</div>:''}
        </div>
    )
}

export default BTTree
