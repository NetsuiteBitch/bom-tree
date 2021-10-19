import Tree from '@naisutech/react-tree'
import { useEffect, useState } from 'react'
import '../css/btdetails.css'
import { packagingleaf, ingleaf } from './Leaves'
import { formulanode, spicenode } from './Nodes'
import { getformula, getformulaitems, getformulaweight, getpackagingitemsdeets, getspicebagitems, getspicebags } from '../utils/netsuite'


function BTDetails({ deets }) {

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
        id: 1000000000,
        parentId: null,
        items: []
    }])

    const [formulaweight, setFormulaWeight] = useState(null)
    const [formulaspicebags, setformulaspicebags] = useState([])
    const [newformulaweight, setNewFormulaWeight] = useState(1)
    const [formulascale, setFormulaScale] = useState(1)


    //change scale on change newformulaweight

    useEffect(() => {setFormulaScale(newformulaweight/formulaweight)}, [newformulaweight])

    //set formula weight
    useEffect(() => { getformulaweight(formulaitemid).then(x => { setFormulaWeight(x); setNewFormulaWeight(x) }) }, [formulaitemid])

    //get current formula for item
    useEffect(() => { getformula(topitem).then(x => { setFormulaTreeNode(x); setFormulaItemid(x[0].id) }) }, [topitem])

    //getpackaging deetails
    useEffect(() => { getpackagingitemsdeets(topitem).then(x => setpackagingitems(x)) }, [topitem])

    // add spice bag items to spice bag nodes
    useEffect(() => {
        var currentformulaspicebags = formulaspicebags
        currentformulaspicebags.forEach((bag, i) => {

            getspicebagitems(bag.id).then(x => {
                currentformulaspicebags[i].items = currentformulaspicebags[i].items || []
                currentformulaspicebags[i].items = x
            })

        })



        var currentspicebagmainnode = spicebagmainnode;
        currentspicebagmainnode = currentspicebagmainnode.concat(currentformulaspicebags);
        setSpiceBagMainNode(currentspicebagmainnode);

    }, [formulaspicebags])


    // get spice bag nodes
    useEffect(() => {
        getspicebags(formulaitemid).then(x => {
            if (spicebagmainnode[0]) {
                setformulaspicebags(x);
            }
        })

    }, [formulaitemid])


    //get formula items
    useEffect(() => {
        getformulaitems(formulaitemid).then(x => {
            if (formulatreenode[0]) {
                const currentformulanode = formulatreenode
                currentformulanode[0].items = x
                setFormulaTreeNode(currentformulanode)
            }
        })
    }, [formulaitemid])


    // add packaging items to nodes
    useEffect(() => {
        const currentpackagingnode = packagingtreenode
        currentpackagingnode[0].items = packagingitems
        setpackagingtreenode(currentpackagingnode)
    }, [packagingitems])







    if (deets.type != 'parentassembly') {
        return (<div id="itemdeetsbox">
            <h3>Only Parent Items Are Supported</h3>
        </div>)
    } else {


        return (
            <div style={{display:"flex"}}>
                <div id="itemdeetsbox">
                    <h3 style={{ textAlign: 'center' }} >{deets.label}-{deets.description}</h3>
                    <Tree theme={"light"} nodes={packagingtreenode} LeafRenderer={packagingleaf} ></Tree>
                    {console.log('rendered weight', formulaweight)}
                    <Tree theme={"light"} nodes={formulatreenode} LeafRenderer={(args) => {args["scale"] = formulascale; return ingleaf(args)}} NodeRenderer={(args) => { args["weight"] = formulaweight; args["scale"] = formulascale;return formulanode(args) }}></Tree>
                    <Tree theme={"light"} nodes={spicebagmainnode} LeafRenderer={(args) => {args["scale"] = formulascale; return ingleaf(args)}} NodeRenderer={(args) => { args["weight"] = formulaweight; args["scale"] = formulascale;return spicenode(args) }} ></Tree>
                </div>
                <div id="itemtoolbox">
                    <h3 style={{ textAlign: 'center' }} >Tools</h3>
                    <div>Adjust Formula Weight</div>
                    <input type="range" min="20" max="2000" defaultValue={formulaweight} step="1" name="adjust" onChange={(e) => setNewFormulaWeight(e.target.value)}/>
                    <div>{newformulaweight}</div>
                </div>
            </div>
        )
    }
}

export default BTDetails

