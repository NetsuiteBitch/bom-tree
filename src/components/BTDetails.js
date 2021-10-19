import Tree from '@naisutech/react-tree'
import { useEffect, useState } from 'react'
import '../css/btdetails.css'
import { getformula, getformulaitems, getpackagingitemsdeets, getspicebagitems, getspicebags } from '../utils/netsuite'

function BTDetails({deets}) {

    const [topitem, settopitem] = useState(deets.id)
    const [packagingtreenode, setpackagingtreenode] = useState([{
        parentId: null,
        label: 'Packaging',
        id: deets.id,
        items: []
    }])
    const [packagingitems, setpackagingitems] = useState([])
    const [formulatreenode, setFormulaTreeNode] = useState([])
    const [formulaitemid, setFormulaItemid] = useState(null)
    const [spicebagmainnode, setSpiceBagMainNode] = useState([{ 
        label: 'Spice Bags', 
        id:  1000000000,
        parentId: null,
        items: []
    }])


    const [formulaspicebags, setformulaspicebags] = useState([])

    useEffect(() => {getformula(topitem).then(x => {console.log('responseformula',x); setFormulaTreeNode(x); setFormulaItemid(x[0].id)})}, [topitem])
    useEffect(() => { getpackagingitemsdeets(topitem).then(x => setpackagingitems(x)) }, [topitem])

    useEffect(() => {
        var currentformulaspicebags = formulaspicebags
        currentformulaspicebags.forEach((bag,i) => {

            getspicebagitems(bag.id).then(x => {
                currentformulaspicebags[i].items = currentformulaspicebags[i].items || []
                currentformulaspicebags[i].items  = x
            })

        })

        console.log(currentformulaspicebags)


        var currentspicebagmainnode = spicebagmainnode;
        currentspicebagmainnode = currentspicebagmainnode.concat(currentformulaspicebags);
        setSpiceBagMainNode(currentspicebagmainnode);

    }, [formulaspicebags])


    useEffect(() => {
        getspicebags(formulaitemid).then(x => {
            if(spicebagmainnode[0]){
                setformulaspicebags(x);
            }
        })

    }, [formulaitemid])



    useEffect(() => {getformulaitems(formulaitemid).then(x => {
        if(formulatreenode[0]){
            const currentformulanode = formulatreenode
            currentformulanode[0].items = x
            setFormulaTreeNode(currentformulanode)
        }
    })},[formulaitemid])


    useEffect(() => {
        const currentpackagingnode =  packagingtreenode
        currentpackagingnode[0].items = packagingitems
        setpackagingtreenode(currentpackagingnode)
    }, [packagingitems])

    console.log({deets})



    const leaf = ({data, selected, level}) => {

        return <div className={"leafdeets leaflevel"+level} style={{color: 'dodgerblue', textDecoration:"none"}}>
            <span className="leafspan"><i style={{color: 'dodgerblue'}} className="fa fa-circle-o"></i></span>
            <span>&nbsp;</span>
            <span className="itemid leafspan">{data.label}</span>
            <span className="itemname leafspan">{data.displayname}</span>
            <span className="itemquantity leafspan">{data.qty_adjusted}</span>
            <span className="itemunit leafspan">{data.units}</span>
            </div>

    }


    const node = ({data, isOpen,isRoot, selected, level}) => {

        return <div className={'node nodelevel'+ level} >
            <span className="nodeitem nodeicon"><i className={isOpen? "fa fa-angle-right selectedicon": 'fa fa-angle-right unselectedicon'} style={{color: 'dodgerblue', fontSize: '15pt', width: '20px', textAlign: 'center'}}></i></span>
            <span className="nodeitem nodeitemname">{data.label}</span>
            <span className="nodeitem nodeitemdescription">{data.description}</span>
            <span className="nodeitem nodeitemquantity">{data.qty_on_bom}</span>
            {data.qty_on_bom ? <span className="nodeitem nodeitemquantity">EA</span> : ''}
            </div>
    }



    if(deets.type != 'parentassembly'){
        return (<div id="itemdeetsbox">
            <h3>Only Parent Items Are Supported</h3>
                </div>)
    }else {


    return (
        <div id="itemdeetsbox">
            <h3 style={{textAlign: 'center'}} >{deets.label}</h3>
            {console.log({formulatreenode})}
            <Tree nodes={packagingtreenode}></Tree>
            <Tree nodes={formulatreenode}></Tree>
            <Tree nodes={spicebagmainnode}></Tree>
        </div>
    )
    }
}

export default BTDetails

