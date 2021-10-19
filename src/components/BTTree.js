
import Tree from '@naisutech/react-tree'
import {testass, testitems} from '../testdata'
import React, { useEffect, useState } from 'react'
import BTContextMenu from './BTContextMenu'

import '../css/bttree.css'
import { getitemdeets, getnodes } from '../utils/netsuite'
import { getNodeText } from '@testing-library/dom'

function BTTree({setCurrentItemDetails}) {

    const [nodesquery, setNodesQuery] = useState([])
    const [itemsquery, setItemsQuery] = useState([])
    const [nodes, setNodes] = useState([])
    const [showingnodes, setShowingNodes] = useState([])

    const [searchterm, setSearchTerm] = useState('')

    const [mousex, setmousex] = useState(0)
    const [mousey, setmousey] = useState(0)
    const [showingContextMenu, setshowingContextMenu] = useState(false)
    const [contextMenuEvent, setcontexMenuEvent] = useState(null)
    const [contextmenudata, setcontexmenudata] = useState(null)




    useEffect(() => getnodes().then(x => {setNodesQuery(x)}), [])
    useEffect(() => getitemdeets().then(x => {setItemsQuery(x)}), [nodesquery])
    useEffect(() => {setNodes(nodesquery.map(x => {var o = x; o.items = itemsquery.filter((item) => item.parentId === x.id); return o}))}, [itemsquery])
    useEffect(() => {setShowingNodes(nodes.filter(x => {return x.label.includes(searchterm) || x.description?.includes(searchterm) || x.parentId }))},[nodes, searchterm])

    // useEffect(() => {setNodes(nodesquery.map(x => {var o = x; o.items = testitems.filter((item) => item.parentId === x.id); return o})); setshowingdata(nodes)}, [])



    const gotogoogle = () => window.location.href = 'https://www.google.com'


    const leaf = ({data, selected, level}) => {

        return <div className={"leafdeets leaflevel"+level} onDoubleClick={gotogoogle} style={{color: 'dodgerblue', textDecoration:"none"}}>
            <span className="leafspan"><i style={{color: 'dodgerblue'}} className="fa fa-circle-o"></i></span>
            <span>&nbsp;</span>
            <span className="itemid leafspan">{data.label}</span>
            <span className="itemname leafspan">{data.displayname}</span>
            <span className="itemquantity leafspan">{data.qty_adjusted}</span>
            <span className="itemunit leafspan">{data.units}</span>
            </div>

    }

    const generatecontextmenu = (e, data) =>{
        e.preventDefault()
        setmousex(e.pageX)
        setmousey(e.pageY)
        setcontexmenudata(data)
        setshowingContextMenu(true)
        setcontexMenuEvent(e)
    }

    const node = ({data, isOpen,isRoot, selected, level}) => {

        return <div className={'node nodelevel'+ level} onContextMenu={(e) => generatecontextmenu(e, data)}>
            <span className="nodeitem nodeicon"><i className={isOpen? "fa fa-angle-right selectedicon": 'fa fa-angle-right unselectedicon'} style={{color: 'dodgerblue', fontSize: '15pt', width: '20px', textAlign: 'center'}}></i></span>
            <span className="nodeitem nodeitemname">{data.label}</span>
            <span className="nodeitem nodeitemdescription">{data.description}</span>
            <span className="nodeitem nodeitemquantity">{data.qty_on_bom}</span>
            {data.qty_on_bom ? <span className="nodeitem nodeitemquantity">EA</span> : ''}
            </div>
    }






    return (

        <div className="treecontainer">

            {showingContextMenu && <BTContextMenu 
            mousex={mousex}
             mousey={mousey} 
             event={contextMenuEvent} 
             data={contextmenudata} 
             hidecontextmenu={() => setshowingContextMenu(false)}
             setCurrentItemDetails={setCurrentItemDetails}
             />}

            <div>
                <input className="searchbar" placeholder="Please enter at least 3 characters to search" onChange={(e) => setSearchTerm(e.target.value)} type="text" />
            </div>

            {searchterm.length > 3  && <Tree
                theme='light'

                size='full'
                LeafRenderer={leaf}
                nodes={showingnodes}  
                NodeRenderer={(node)}
                animations={true}
             >
            </Tree>}
            {/* {searchterm.length > 3 && showingdata?.length == 0 ? <div>No Results</div>:''} */}
        </div>
    )
}

export default BTTree
