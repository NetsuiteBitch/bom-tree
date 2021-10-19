


export const spicenode = ({data, isOpen,isRoot, selected, level, scale}) => {


    var totalweight = Math.round(data.items.map(x => x.qty_adjusted).reduce((x,y) => x + y,0)*100)/100


    return <div className={'node nodelevel'+ level}>
        <span className="nodeitem nodeicon"><i className={isOpen? "fa fa-angle-right selectedicon": 'fa fa-angle-right unselectedicon'} style={{color: 'dodgerblue', fontSize: '15pt', width: '20px', textAlign: 'center'}}></i></span>
        <span className="nodeitem nodeitemname">{data.label}</span>
        {data.quantity && <span className="nodeitem nodeitemquantity">{Math.round(data.quantity, 2)}</span>}
        {data.quantity && <span className="nodeitem nodeitemquantity">EA</span>}
        {data.quantity && <span className="nodeitem totalweight">BAG WEIGHT:&nbsp;{totalweight}</span>}
        {data.quantity && scale != 1 && scale != Infinity && <span style={{color: "dodgerblue"}}  className="nodeitem newweight">&nbsp;{Math.round(totalweight * scale * 10)/10} </span>}
        {data.quantity &&  <span style={{marginLeft: "10px"}} className="nodeitem" >&nbsp;LBS</span>}
        </div>
}



export const formulanode = (props) => {

    const {data, isOpen,isRoot, selected, level, weight, scale} = props



    return <div className={'node nodelevel'+ level}>
        <span className="nodeitem nodeicon"><i className={isOpen? "fa fa-angle-right selectedicon": 'fa fa-angle-right unselectedicon'} style={{color: 'dodgerblue', fontSize: '15pt', width: '20px', textAlign: 'center'}}></i></span>
        <span className="nodeitem nodeitemname">{data.label}</span>
        <span className="nodeitem totalweight">FORMULA WEIGHT:&nbsp;{weight}&nbsp;</span>
        {(scale != Infinity && scale != 1)  && <span style={{color: 'dodgerblue'}} className="nodeitem newweight">{" "}{Math.round(weight * scale)}</span>}
        <span style={{marginLeft: "10px"}} className="nodeitem">LBS</span>
        </div>
}